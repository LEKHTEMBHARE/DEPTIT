import { db, auth } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Global Variables
let allUsersData = []; // Isme hum saara data store karenge filter karne ke liye
const tableBody = document.getElementById('usersTableBody');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');

// 1. Auth Check (Security)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html'; // Agar login nahi hai to bhaga do
    } else {
        fetchUsers(); // Login hai to data lao
    }
});

// 2. Fetch Users from Database
async function fetchUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        
        allUsersData = []; // Reset array
        
        querySnapshot.forEach((doc) => {
            allUsersData.push({ id: doc.id, ...doc.data() });
        });

        renderTable(allUsersData); // Table banao

    } catch (error) {
        console.error("Error fetching users:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Error loading data!</td></tr>`;
    }
}

// 3. Render Table (HTML Banana)
function renderTable(users) {
    tableBody.innerHTML = ""; // Purana data saaf karo

    if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No users found.</td></tr>`;
        return;
    }

    users.forEach((user) => {
        // Badge Color Logic
        let badgeClass = 'badge-student';
        if (user.role === 'faculty') badgeClass = 'badge-faculty';
        if (user.role === 'admin') badgeClass = 'badge-admin';

        // Profile Image (Agar nahi hai to Name se banao)
        const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`;

        const row = `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${avatarUrl}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600; color: #0f172a;">${user.name}</div>
                            <div style="font-size: 0.8rem; color: #94a3b8;">ID: ${user.id.substr(0, 6)}...</div>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 500;">${user.email}</td>
                <td><span class="badge ${badgeClass}">${user.role}</span></td>
                <td>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-icon" style="background: #eff6ff; color: #2563eb;" onclick="alert('View Profile: ${user.name}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// 4. Search & Filter Logic
function filterData() {
    const searchText = searchInput.value.toLowerCase();
    const roleValue = roleFilter.value;

    const filtered = allUsersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText);
        const matchesRole = roleValue === 'all' || user.role === roleValue;
        return matchesSearch && matchesRole;
    });

    renderTable(filtered);
}

// Event Listeners for Search/Filter
if(searchInput) searchInput.addEventListener('keyup', filterData);
if(roleFilter) roleFilter.addEventListener('change', filterData);

// 5. Add New User Logic
const addUserForm = document.getElementById('addUserForm');
if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = addUserForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Creating...";
        btn.disabled = true;

        const name = document.getElementById('newUserName').value;
        const email = document.getElementById('newUserEmail').value;
        const password = document.getElementById('newUserPassword').value; // Just saving as hint
        const role = document.getElementById('newUserRole').value;

        try {
            // Note: Client side se hum doosra Auth account create nahi kar sakte bina logout huye.
            // Isliye hum Database me entry kar rahe hain. Real app me yeh Backend (Node.js) se hota hai.
            const fakeUid = "user_" + Date.now(); 

            await setDoc(doc(db, "users", fakeUid), {
                name: name,
                email: email,
                role: role,
                passwordHint: password, // Security risk in production, okay for college demo
                createdAt: new Date().toISOString()
            });

            alert("User Added Successfully!");
            window.closeModal(); // HTML wala function call kiya
            addUserForm.reset();
            fetchUsers(); // Table refresh

        } catch (error) {
            console.error(error);
            alert("Error adding user: " + error.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// 6. Delete User Logic (Window object me daala taaki HTML se call ho sake)
window.deleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user permanently?")) {
        try {
            await deleteDoc(doc(db, "users", id));
            alert("User Deleted!");
            fetchUsers(); // Refresh table
        } catch (error) {
            alert("Error deleting: " + error.message);
        }
    }
};

// 7. Logout Logic
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error(error);
    });
};

// Expose filter function to window button
window.filterUsers = filterData;