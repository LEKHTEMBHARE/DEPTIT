import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Auth Check
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadAllStudents();
    } else {
        window.location.href = 'login.html';
    }
});

let allStudentsData = []; // Store data locally for fast search

// 2. Fetch All Students
async function loadAllStudents() {
    const grid = document.getElementById('resultsGrid');
    
    try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const snap = await getDocs(q);
        
        allStudentsData = []; // Reset
        
        snap.forEach(doc => {
            // Hum khud ko list me nahi dikhayenge
            if(doc.id !== auth.currentUser.uid) {
                allStudentsData.push(doc.data());
            }
        });

        renderGrid(allStudentsData);

    } catch (error) {
        console.error(error);
        grid.innerHTML = "<p>Error loading data.</p>";
    }
}

// 3. Render Helper Function
function renderGrid(data) {
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = "";

    if (data.length === 0) {
        grid.innerHTML = "<p style='grid-column: span 3; text-align: center; color: #94a3b8;'>No students found.</p>";
        return;
    }

    data.forEach(user => {
        const avatar = user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`;
        const skills = user.skills || "Student";
        const bio = user.bio || "No bio added yet.";

        const html = `
            <div class="result-card">
                <img src="${avatar}" class="card-img">
                <h4 class="card-name">${user.name}</h4>
                <p class="card-bio" title="${bio}">${bio}</p>
                <span class="skill-badge">${skills}</span>
                <div style="margin-top: 15px;">
                    <button class="btn-view" onclick="alert('Viewing profile of: ${user.name}\\nEmail: ${user.email}')">View Profile</button>
                </div>
            </div>
        `;
        grid.innerHTML += html;
    });
}

// 4. Real-time Search Logic
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = allStudentsData.filter(user => {
        const name = user.name ? user.name.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const skills = user.skills ? user.skills.toLowerCase() : "";

        return name.includes(searchTerm) || email.includes(searchTerm) || skills.includes(searchTerm);
    });

    renderGrid(filtered);
});

// Logout
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};