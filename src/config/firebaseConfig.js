import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyALpORARkGb5VDS-7mOx6O0u6p3Z5uMBok',
    authDomain: 'doctor-7cc7e.firebaseapp.com',
    projectId: 'doctor-7cc7e',
    storageBucket: 'doctor-7cc7e.firebasestorage.app',
    messagingSenderId: '586055409973',
    appId: '1:586055409973:web:df1184d1cf389357f5ac7c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)
