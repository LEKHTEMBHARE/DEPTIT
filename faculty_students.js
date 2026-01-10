import { auth, db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Auth Check
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadStudents();
    } else {
        window.location.href = 'login.html';
    }
});

let allStudents = []; // Store for searching

// 2. Load Students
async function loadStudents() {
    const grid = document.getElementById('studentGrid');
    
    try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const snap = await getDocs(q);
        
        document.getElementById('studentCount').innerText = snap.size;
        allStudents = [];
        grid.innerHTML = "";

        if (snap.empty) {
            grid.innerHTML = "<p>No students found.</p>";
            return;
        }

        snap.forEach(doc => {
            const data = doc.data();
            allStudents.push(data);
            renderCard(data, grid);
        });

    } catch (error) {
        console.error(error);
        grid.innerHTML = "<p>Error loading data.</p>";
    }
}

// 3. Render Helper
function renderCard(data, container) {
    const avatar = data.photoURL || `https://ui-avatars.com/api/?name=${data.name}&background=random`;
    
    const html = `
        <div class="student-card">
            <img src="${avatar}" class="card-img">
            <h3 class="card-name">${data.name}</h3>
            <p class="card-email">${data.email}</p>
            <span class="status-badge">Active</span>
            
            <div class="card-actions">
                <button class="btn-mini btn-view" onclick="alert('Viewing Profile: ${data.name}')">View Profile</button>
                <a href="mailto:${data.email}" class="btn-mini btn-mail">
                    <i class="fas fa-envelope"></i>
                </a>
            </div>
        </div>
    `;
    container.innerHTML += html;
}

// 4. Search Logic
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const grid = document.getElementById('studentGrid');
    grid.innerHTML = "";
    
    const filtered = allStudents.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.email.toLowerCase().includes(term)
    );

    if(filtered.length === 0) {
        grid.innerHTML = "<p>No match found.</p>";
    } else {
        filtered.forEach(s => renderCard(s, grid));
    }
});

// Logout
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};