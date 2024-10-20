/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions')
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Install latest dependency
/*
"firebase-functions": "^6.0.1"
*/
const admin = require('firebase-admin')

admin.initializeApp({ projectId: require('../initial.json').project_id })
const {
    onDocumentWritten,
    onDocumentCreated,
    onDocumentUpdated,
    onDocumentDeleted,
    Change,
    FirestoreEvent
} = require("firebase-functions/v2/firestore");



exports.mainHandler = onRequest((req, res) => {
    res.json({ msg: 'Hello World' })
});

/*
exports.createInitialState = onRequest(async (request, response) => {
    // Check if the request method is POST
    if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
    }

    try {
        // Extract data from the request body
        const { name, email, age } = request.body;

        // Validate the incoming data
        if (!name || !email || !age) {
            response.status(400).send("Missing required fields");
            return;
        }


    } catch (err) {
        response.status(500).send("Internal Server Error")
    }
})
*/


exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {

    const firestore = admin.firestore();
    const doc = firestore.collection('users').doc(`${user.uid}`)

    //console.log({ sendEmail: user.email })

    firestore.collection('users').count().get().then(counOrder => {
        const { count } = counOrder.data()
        console.log({ count })
        doc.get().then(entry => {
            if (!entry.exists) {
                doc.set({ role: 'Admin', email: user.email, order: count, name: 'Ghost', deleted: false }, { merge: true })
                firestore.collection('preferences').doc(`${user.uid}`).set({ notifications: true, sms: true }).then(() => {
                    console.log({ msg: 'Pref doc created' })
                })

                firestore.collection('indexes').doc(`${count}`).set({ uid: user.uid }).then(() => {
                    console.log({ msg: 'Index created' })
                })
            } else {
                console.log({ msg: 'Already handled by API' })
            }

        })
    })
});


exports.onUserCreated = onDocumentCreated("users/{docId}", (event) => {
    /* ... */
    //console.log({ event })
    console.log({ data: event.data.data() })
})
//exports.onDocumentCreatedWithAuthContext = 