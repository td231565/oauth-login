import firebase from 'firebase/app'
import 'firebase/auth'

// Initila Firebase App
var firebaseConfig = {
  apiKey: "AIzaSyDgtQrrN7yCYTFfUF8J2AWZTcj5UPvTyAI",
  authDomain: "auth-login-bd7cf.firebaseapp.com",
  projectId: "auth-login-bd7cf",
  storageBucket: "auth-login-bd7cf.appspot.com",
  messagingSenderId: "1051077604250",
  appId: "1:1051077604250:web:28fccac52c22eaf54a0023",
  measurementId: "G-BXGNZG45JG"
}
firebase.initializeApp(firebaseConfig)

export default firebase