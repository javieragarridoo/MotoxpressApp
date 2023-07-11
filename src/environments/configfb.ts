import { initializeApp } from '@angular/fire/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const fbconfig = {
    apiKey: "AIzaSyA7PmtrPkeInchUbx0xE2PLlFwhhq4MO6E",
    authDomain: "motoxpress654.firebaseapp.com",
    projectId: "motoxpress654",
    storageBucket: "motoxpress654.appspot.com",
    messagingSenderId: "515056791851",
    appId: "1:515056791851:web:a19d40e77f5120ece5d56e"
    };
firebase.initializeApp(fbconfig);

export default firebase.firestore();
