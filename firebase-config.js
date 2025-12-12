// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_XTlI2QtXLBzSHYmNe5FjlS5C2yK-P_E",
    authDomain: "cloud-and-cards.firebaseapp.com",
    projectId: "cloud-and-cards",
    storageBucket: "cloud-and-cards.firebasestorage.app",
    messagingSenderId: "861719232710",
    appId: "1:861719232710:web:526b0c38ba59c654f497c7"
};

// Initialize Firebase
let db;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('Firebase initialized successfully');
        return true;
    } else {
        console.error('Firebase SDK not loaded');
        return false;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}
