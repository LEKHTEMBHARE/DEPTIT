// js/auth.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = document.getElementById('role').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const docSnap = await getDoc(doc(db, "users", userCred.user.uid));

            if (docSnap.exists() && docSnap.data().role === role) {
                if(role === 'admin') window.location.href = 'admin_dashboard.html';
                if(role === 'faculty') window.location.href = 'faculty_dashboard.html';
                if(role === 'student') window.location.href = 'student_dashboard.html';
            } else {
                alert("Role Mismatch!");
                signOut(auth);
            }
        } catch (err) { alert("Error: " + err.message); }
    });
}

// Register Logic (Student)
const regForm = document.getElementById('regForm');
if(regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", cred.user.uid), {
                name: name, email: email, role: 'student', bio: '', photoURL: ''
            });
            alert("Account Created! Please Login.");
            window.location.href = 'login.html';
        } catch(err) { alert(err.message); }
    });
}

// Global Logout
window.logout = () => { signOut(auth).then(() => window.location.href = 'index.html'); };