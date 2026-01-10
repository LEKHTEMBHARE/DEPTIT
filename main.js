import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Get Values from HTML
            const roleSelect = document.getElementById('roleSelect');
            const email = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            const selectedRole = roleSelect.value;

            // 2. Validation
            if (!selectedRole) {
                alert("Please select a Login Type (Student/Faculty/Admin).");
                return;
            }

            try {
                // UI: Button ko loading state me dalo
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

                // 3. Firebase Login (Check Email & Password)
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 4. Role Verification (Check Database)
                // Hum database me check karenge ki is user ka asli role kya hai
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const actualRole = userData.role; // Database wala role

                    // 5. Compare Selected Role vs Actual Role
                    if (actualRole === selectedRole) {
                        // Success! Redirect to dashboard
                        // alert("Login Successful! Welcome " + userData.name);
                        
                        if(actualRole === 'student') window.location.href = 'student_dashboard.html';
                        else if(actualRole === 'faculty') window.location.href = 'faculty_dashboard.html';
                        else if(actualRole === 'admin') window.location.href = 'admin_users.html'; // Admin ka main page

                    } else {
                        // Error: Role Mismatch (Ex: Student trying to login as Admin)
                        alert(`Access Denied! Your account is registered as '${actualRole}', but you selected '${selectedRole}'.`);
                        await signOut(auth); // Logout immediately
                    }
                } else {
                    alert("User data not found in database! Contact Admin.");
                    await signOut(auth);
                }

            } catch (error) {
                console.error("Login Error:", error);
                
                // User friendly error messages
                if (error.code === 'auth/invalid-credential') {
                    alert("Invalid Email or Password.");
                } else if (error.code === 'auth/user-not-found') {
                    alert("No account found with this email.");
                } else {
                    alert("Login Failed: " + error.message);
                }
            } finally {
                // Reset Button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});