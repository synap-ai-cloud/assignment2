import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VIMEvent } from '../../../CloudAssignment2/src/app/classes/vim-event'
import { isUndefined } from 'util';

admin.initializeApp();
const firestore = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const postEvent = functions.https.onCall( async (data, context) => {
    if(!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be signed in for this operation');
    }

    const event = data.event as VIMEvent;
    if (!event || isUndefined(event)) {
        throw new functions.https.HttpsError('invalid-argument', 'Event could not be parsed');
    } else {
        const uid = context.auth.uid;
        event.cc_id = uid;
        event.timestamp = Date.now();

        const docRef = firestore.collection('User-Data').doc(uid);
        const doc = await docRef.get();

        if (!doc.exists) {
            await docRef.set({});
        }

        const result = await docRef.collection('events').add(event);

        
        return result.id;
    }
});
