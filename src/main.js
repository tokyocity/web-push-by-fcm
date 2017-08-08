'use strict';

import * as firebase from 'firebase';

const getFirebaseMessagingObject = () => {
    // Initialize Firebase
    const config = {
        apiKey            : 'AIzaSyB3F1s2VDupQXEMopVv9nvvNskBz5BfyME',
        authDomain        : 'web-push-by-fcm.firebaseapp.com',
        databaseURL       : 'https://web-push-by-fcm.firebaseio.com',
        projectId         : 'web-push-by-fcm',
        storageBucket     : 'web-push-by-fcm.appspot.com',
        messagingSenderId : '1084640982992'
    };

    firebase.initializeApp(config);

    return firebase.messaging();
};

const register = (messaging) => {
    if (!navigator.serviceWorker || !messaging) {
        return;
    }

    navigator.serviceWorker.register('./firebase-messaging-sw.js').then(() => {
        return navigator.serviceWorker.ready;
    }).catch((error) => {
        console.error(error);
    }).then((registration) => {
        messaging.useServiceWorker(registration);

        messaging.requestPermission().then(() => {
            console.log('Notification permission granted.');

            messaging.getToken().then((token) => {
                console.log(token);

                const options = {
                    method  : 'POST',
                    headers : new Headers({ 'Content-Type' : 'application/json' }),
                    body    : JSON.stringify({ token })
                };

                fetch('/api/webpush/register', options).then((res) => {
                    console.dir(res);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });

        }).catch((error) => {
            console.log('Unable to get permission to notify.', error);
        });
    });
};

register(getFirebaseMessagingObject());
