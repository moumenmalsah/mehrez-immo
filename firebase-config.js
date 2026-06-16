const firebaseConfig = {
  apiKey: "AIzaSyCGEdQcBTsqe0dNPB7A_nYPiE5vjCXR-Ps",
  authDomain: "mehrez-immo.firebaseapp.com",
  projectId: "mehrez-immo",
  storageBucket: "mehrez-immo.firebasestorage.app",
  messagingSenderId: "28168441864",
  appId: "1:28168441864:web:dfbf134722d910e86901bd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
