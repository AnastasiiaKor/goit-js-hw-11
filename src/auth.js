import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
const authBtn = document.querySelector('.auth');
authBtn.addEventListener('click', onClick);
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyARNRNbYX7sZVx7e1EUAfDDynq2YzI-Mg0',
  authDomain: 'myproject-551520.firebaseapp.com',
  projectId: 'myproject-551520',
  storageBucket: 'myproject-551520.appspot.com',
  messagingSenderId: '460866384248',
  appId: '1:460866384248:web:6c5f416450cb9fe7c4188d',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
function onClick() {
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log(user);
      // ...
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
