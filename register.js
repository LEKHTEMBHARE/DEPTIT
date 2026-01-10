import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const regForm = document.getElementById('regForm');

if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const btn = regForm.querySelector('button');

        if(password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        const originalText = btn.innerText;
        btn.innerText = "Creating Account...";
        btn.disabled = true;

        try {
            // 1. Authentication Create
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Save to Database (Firestore)
            // Note: Default role 'student' rahega. Admin banne ke liye Console me edit karna padega.
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                role: "student",  // <--- Yahan Default Student hai
                createdAt: new Date().toISOString(),
                bio: "",
                skills: "",
                photoURL: "" 
            });

            alert("Account Created Successfully! Redirecting to Login...");
            window.location.href = 'login.html';

        } catch (error) {
            console.error("Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                alert("This email is already registered. Please Login.");
            } else {
                alert("Error: " + error.message);
            }
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}