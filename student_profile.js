import { auth, db } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUserUid = null;
const avatarImg = document.getElementById('avatarPreview');
const fileInput = document.getElementById('fileInput');

// 1. Auth Check
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserUid = user.uid;
        loadProfile(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

// 2. Load Profile Data
async function loadProfile(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Set UI Texts
            document.getElementById('nameInput').value = data.name;
            document.getElementById('emailInput').value = data.email;
            document.getElementById('displayName').innerText = data.name;
            document.getElementById('displayEmail').innerText = data.email;
            document.getElementById('bioInput').value = data.bio || "";
            document.getElementById('skillsInput').value = data.skills || "";

            // Set Image
            if (data.photoURL) {
                avatarImg.src = data.photoURL;
            } else {
                avatarImg.src = `https://ui-avatars.com/api/?name=${data.name}`;
            }
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// 3. Image Preview Logic
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarImg.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// 4. Save Profile (Updates Database)
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Saving...";
    btn.disabled = true;

    const bio = document.getElementById('bioInput').value;
    const skills = document.getElementById('skillsInput').value;
    const file = fileInput.files[0];

    try {
        let photoBase64 = avatarImg.src; // Keep old image by default

        // If new file selected, convert to Base64
        if (file) {
            // Size Check (500KB Limit)
            if (file.size > 500000) {
                alert("Image too big! Please select image under 500KB.");
                btn.innerText = "Save Changes";
                btn.disabled = false;
                return;
            }
            photoBase64 = await convertToBase64(file);
        }

        // Update Firestore
        await updateDoc(doc(db, "users", currentUserUid), {
            bio: bio,
            skills: skills,
            photoURL: photoBase64
        });

        alert("Profile Updated Successfully!");

    } catch (error) {
        console.error(error);
        alert("Update Failed: " + error.message);
    } finally {
        btn.innerText = "Save Changes";
        btn.disabled = false;
    }
});

// Helper: Convert File to Base64 String
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Logout
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};