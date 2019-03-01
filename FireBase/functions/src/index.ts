import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VIMEvent } from '../../../CloudAssignment2/src/app/classes/vim-event';
import { VM } from '../../../CloudAssignment2/src/app/classes/vm';
import { CollectionReference, UpdateData, DocumentReference } from '@google-cloud/firestore';
import { EventType } from '../../../CloudAssignment2/src/app/enumerations/event-type.enum';
import { VMType } from '../../../CloudAssignment2/src/app/enumerations/vm-type.enum';

admin.initializeApp();
const firestore = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const postEvent = functions.https.onCall(async (data, context) => {
  //Make sure request is from authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be signed in for this operation'
    );
  }

  const event = data.event as VIMEvent;

  //Ensure function has been passed an event at it has a vailid type
  if ( 
    !event ||
    !event.type ||
    event.type > EventType.Downgrade ||
    event.type < EventType.Create
  ) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Event could not be parsed'
    );
  }
  // attach uid from auth to event uid
  const uid = context.auth.uid;
  event.cc_id = uid;

  // Ensure user doc exists
  const docRef = firestore.collection('User-Data').doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    await docRef.set({});
  }

  const vmRef = docRef.collection('vms');

  // Process the event and get ref to affected doc
  const vmDoc = await handleEvent(event, vmRef);

  if (!vmDoc) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Event could not be procesed'
    );
  }

  //Ensure all event fields are filled in
  if(event.type !== EventType.Delete) {
    const vmSnap = await getVM(vmDoc.id, vmRef);
    if (!vmSnap) {
      throw new functions.https.HttpsError(
        'internal',
        'VM instance could not be found after write'
      );
    }
    event.vm_id = vmDoc.id;
    event.vm_type = vmSnap.type;
  }
  event.timestamp = Date.now();

  // write event
  const result = await docRef.collection('events').add(event);
  //return the id of the written event
  return result.id;
});

async function handleEvent(event: VIMEvent, vmRef: CollectionReference): Promise<DocumentReference | null> {
  switch (event.type) {
    case EventType.Create:
      return createVM(event, vmRef);
    case EventType.Delete:
      return deleteVM(event, vmRef);
    case EventType.Start:
      return startVM(event, vmRef);
    case EventType.Stop:
      return stopVM(event, vmRef);
    case EventType.Upgrade:
      return upgradeVM(event, vmRef);
    case EventType.Downgrade:
      return downgradeVM(event, vmRef);
    default:
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Bad Type'
      );
      
  }
}

async function createVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmType = event.vm_type;

  if (!vmType || vmType > VMType.UltraLarge || vmType < VMType.Basic) {
    return null;
  }

  const newVm: VM = { type: vmType, running: false };
  const result = await vmRef.add(newVm);
  return result;
}

async function deleteVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmId = getVMID(event);

  if (!vmId) {
    return null;
  }

  // prefill event before data is lost
  const vm = await getVM(vmId, vmRef);
  if (!vm) {
    return null;
  }
  event.vm_type = vm.type;

  const doc = vmRef.doc(vmId);
  const result = await doc.delete();
  return result ? doc : null;
}

async function startVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmID = getVMID(event);

  if (!vmID) {
    return null;
  }

  const vm = await getVM(vmID, vmRef);

  if (!vm || vm.running !== false) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Current VM: ' + ((vm) ? vm.toString() : 'null')
    );
  }

  return updateVM(vmID, vmRef, { running: true });
}

async function stopVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmID = getVMID(event);

  if (!vmID) {
    return null;
  }

  const vm = await getVM(vmID, vmRef);

  if (!vm || vm.running !== true) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Current VM: ' + ((vm) ? vm.toString() : 'null')
    );
  }
  return updateVM(vmID, vmRef, { running: false });
}

async function upgradeVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmID = getVMID(event);

  if (!vmID) {
    return null;
  }

  const vm = await getVM(vmID, vmRef);

  if (!vm || !vm.type || vm.type >= VMType.UltraLarge) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Current VM: ' + ((vm) ? vm.toString() : 'null')
    );
  }

  return updateVM(vmID, vmRef, { type: vm.type + 1 });
}

async function downgradeVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmID = getVMID(event);

  if (!vmID) {
    return null;
  }

  const vm = await getVM(vmID, vmRef);

  if (!vm || !vm.type || vm.type <= VMType.Basic) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Current VM: ' + ((vm) ? vm.toString() : 'null')
    );
  }

  return updateVM(vmID, vmRef, { type: vm.type - 1 });
}

function getVMID(event: VIMEvent) {
  const vmID = event.vm_id;
  if (vmID && typeof vmID === typeof '') {
    return vmID;
  } else {
    return null;
  }
}

async function getVM(vmId: string, vmRef: CollectionReference) {

  if (!vmId) {
    return null;
  }

  const doc = vmRef.doc(vmId);
  const snap = await doc.get();

  if (!snap.exists) {
    return null;
  }

  const vm = snap.data() as VM;

  return vm;
}

async function updateVM(
  vmId: string,
  vmRef: CollectionReference,
  update: UpdateData
) {

  const doc = vmRef.doc(vmId);
  const result = await doc.update(update);
  return result ? doc : null;
}
