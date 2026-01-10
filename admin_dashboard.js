import { auth, db } from './firebase-config.js';
import { collection, getDocs, query, where, limit, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Auth Check (Sirf Admin ko aane do)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Admin confirmed, load data
        loadDashboardStats();
    } else {
        window.location.href = 'login.html';
    }
});

// 2. Load Stats Function
async function loadDashboardStats() {
    try {
        const usersRef = collection(db, "users");

        // A. Count Students
        const qStudents = query(usersRef, where("role", "==", "student"));
        const snapStudents = await getDocs(qStudents);
        document.getElementById('studentCount').innerText = snapStudents.size;

        // B. Count Faculty
        const qFaculty = query(usersRef, where("role", "==", "faculty"));
        const snapFaculty = await getDocs(qFaculty);
        document.getElementById('facultyCount').innerText = snapFaculty.size;

        // C. Load Recent 5 Users
        // Note: Real app me hum 'createdAt' timestamp use karte hain sort karne ke liye.
        // Abhi hum bas random 5 dikha rahe hain.
        const qRecent = query(usersRef, limit(5));
        const snapRecent = await getDocs(qRecent);
        
        const tableBody = document.getElementById('recentUsersTable');
        tableBody.innerHTML = "";

        snapRecent.forEach(doc => {
            const user = doc.data();
            const badgeClass = user.role === 'student' ? 'badge-student' : 'badge-faculty';
            
            const row = `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${user.photoURL || 'https://ui-avatars.com/api/?name='+user.name}" style="width:30px; height:30px; border-radius:50%;">
                            <span style="font-weight:600;">${user.name}</span>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td><span class="role-badge ${badgeClass}">${user.role}</span></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

// 3. Logout Function
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        alert("Logout Error");
    });
};