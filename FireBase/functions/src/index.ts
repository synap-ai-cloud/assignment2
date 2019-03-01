import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VIMEvent } from '../../../CloudAssignment2/src/app/classes/vim-event';
import { VM } from '../../../CloudAssignment2/src/app/classes/vm';
import { CollectionReference, UpdateData } from '@google-cloud/firestore';
import { EventType } from '../../../CloudAssignment2/src/app/enumerations/event-type.enum';
import { VMType } from '../../../CloudAssignment2/src/app/enumerations/vm-type.enum';

admin.initializeApp();
const firestore = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const postEvent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be signed in for this operation'
    );
  }

  const event = data.event as VIMEvent;

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

  const uid = context.auth.uid;
  event.cc_id = uid;

  // Ensure user doc exists
  const docRef = firestore.collection('User-Data').doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    await docRef.set({});
  }

  const vmRef = docRef.collection('vms');

  const success = await handleEvent(event, vmRef);

  if (!success) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Event could not be procesed'
    );
  }

  event.timestamp = Date.now();
  const result = await docRef.collection('events').add(event);
  return result.id;
});

async function handleEvent(event: VIMEvent, vmRef: CollectionReference): Promise<string | null> {
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
  return result.id;
}

async function deleteVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmId = getVMID(event);

  if (!vmId) {
    return null;
  }

  const doc = vmRef.doc(vmId);
  const result = await doc.delete();
  return result ? doc.id : null;
}

async function startVM(event: VIMEvent, vmRef: CollectionReference) {
  return updateVM(event, vmRef, { running: true });
}

async function stopVM(event: VIMEvent, vmRef: CollectionReference) {
  return updateVM(event, vmRef, { running: false });
}

async function upgradeVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmType = await getVMType(event, vmRef);

  if (!vmType || vmType >= VMType.UltraLarge) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Bad VM Type: ' + ((vmType) ? vmType.toString() : 'null')
    );
  }

  return updateVM(event, vmRef, { type: vmType + 1 });
}

async function downgradeVM(event: VIMEvent, vmRef: CollectionReference) {
  const vmType = await getVMType(event, vmRef);

  if (!vmType || vmType <= VMType.Basic) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Bad VM Type: ' + ((vmType) ? vmType.toString() : 'null')
    );
  }

  return updateVM(event, vmRef, { type: vmType - 1 });
}

function getVMID(event: VIMEvent) {
  const vmID = event.vm_id;
  if (vmID && typeof vmID === typeof '') {
    return vmID;
  } else {
    return null;
  }
}

async function getVMType(event: VIMEvent, vmRef: CollectionReference) {
  const vmId = getVMID(event);

  if (!vmId) {
    return null;
  }

  const doc = vmRef.doc(vmId);
  const snap = await doc.get();

  if (!snap.exists) {
    return null;
  }

  const vm = snap.data() as VM;

  return vm.type;
}

async function updateVM(
  event: VIMEvent,
  vmRef: CollectionReference,
  update: UpdateData
) {
  const vmId = getVMID(event);

  if (!vmId) {
    return null;
  }

  const doc = vmRef.doc(vmId);
  const result = await doc.update(update);
  return result ? doc.id : null;
}
