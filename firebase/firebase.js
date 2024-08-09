// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

import firebaseConfig from "./config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);


/**
 * Auth
 */

const auth = getAuth(app);


const login = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      // SIGNED IN
      const user = userCredentials.user;
      console.log('User logged in:', user);

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error('Error logging in:', errorCode, errorMessage);
    })
}

//TODO: crear validacion mas segura
const signUp = (email,password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      // SIGNED UP
      const user = userCredentials.user;
      console.log('User signed up:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error('Error signing up:', errorCode, errorMessage);
    })
}

function logout() {
  signOut(auth).then(() => {
    console.log('User signed out');
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
}

//TODO:
// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is authenticated:', user);
    // User is signed in, enable upload functionality
    // enableUpload();
  } else {
    console.log('User is not authenticated');
    // User is signed out, disable upload functionality
    // disableUpload();
  }
});


/**
 * Storage
 */
const storage = getStorage(app);

const uploadFiles = (file) => {
  const storageRef = ref(storage, "uploads/" + file.name)

  uploadBytes(storageRef,file)
    .then((snapshot) => {
      console.log('Uploaded a file!', snapshot);

      getDownloadURL(snapshot.ref)
        .then((downloadUrl) => {
          console.log('File available at', downloadUrl);
        })
    })
    .catch((error) => {
      console.error('Upload failed', error);
    })

}


export default firebase = {
  auth: {
    login,
    signUp,
    logout
  },
  storage: {
    uploadFiles
  }
}
