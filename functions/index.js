const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors')({
    origin: true
});
const _ = require("lodash");

const serviceAccount = require("./bolsometro-82ae5-firebase-adminsdk-doqhw-37152c4b3c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bolsometro-82ae5.firebaseio.com"
});

exports.vote = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const db = admin.firestore();
        let data = JSON.parse(request.body);

        db.collection('votes').add(data).then(ref => {
            return response.send({ id: ref.id });
        }).catch(e => {
            return response.status(500).send(e);
        })
    })
});

exports.votes = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const db = admin.firestore();
        db
            .collection('votes')
            .orderBy('date')
            .get()
            .then(snap => {
                let data = {};
                let docs = [];
                snap.docs.forEach(doc => {
                    docs.push(doc.data())
                })
                data.length = snap.size;
                data.docs = _.countBy(docs, 'date');
                return response.send(data);
            }).catch(e => {
                return response.status(500).send(e);
            })
    })
});
