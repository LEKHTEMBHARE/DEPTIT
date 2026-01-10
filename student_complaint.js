import { auth, db } from './firebase-config.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;
let studentName = "Student";

// 1. Auth Check
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        // Fetch User Name for the complaint record
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if(userDoc.exists()) studentName = userDoc.data().name;
        
        loadHistory();
    } else {
        window.location.href = 'login.html';
    }
});

// 2. Submit Complaint
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('compSubject').value;
    const category = document.getElementById('compCategory').value;
    const desc = document.getElementById('compDesc').value;
    const btn = e.target.querySelector('button');

    btn.innerText = "Submitting...";
    btn.disabled = true;

    try {
        await addDoc(collection(db, "complaints"), {
            studentId: currentUser.uid,
            studentName: studentName,
            subject: subject,
            category: category,
            desc: desc,
            status: "pending", // Default status
            timestamp: new Date().toISOString()
        });

        alert("Complaint Submitted Successfully!");
        e.target.reset();

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        btn.innerText = "Submit Complaint";
        btn.disabled = false;
    }
});

// 3. Load History (Real-time Listener)
function loadHistory() {
    const list = document.getElementById('historyList');
    
    // Query: Sirf meri complaints dikhao, latest pehle
    const q = query(
        collection(db, "complaints"), 
        where("studentId", "==", currentUser.uid),
        orderBy("timestamp", "desc")
    );

    // onSnapshot se data real-time update hoga (agar faculty resolve karega to turant dikhega)
    onSnapshot(q, (snapshot) => {
        list.innerHTML = "";
        
        if (snapshot.empty) {
            list.innerHTML = "<p style='text-align:center; color:#94a3b8;'>No complaints found.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const date = new Date(data.timestamp).toLocaleDateString();
            
            const isResolved = data.status === 'Resolved';
            const statusClass = isResolved ? 'status-resolved' : 'status-pending';
            const statusIcon = isResolved ? '<i class="fas fa-check-circle"></i> Resolved' : '<i class="fas fa-clock"></i> Pending';

            const item = `
                <div class="history-item">
                    <div>
                        <div class="h-title">${data.subject} <span style="font-weight:400; color:#94a3b8; font-size:0.8rem;">(${data.category})</span></div>
                        <div class="h-meta">Submitted on: ${date}</div>
                        <div style="font-size:0.9rem; color:#475569; margin-top:5px;">"${data.desc}"</div>
                    </div>
                    <div class="status-badge ${statusClass}">
                        ${statusIcon}
                    </div>
                </div>
            `;
            list.innerHTML += item;
        });
    }, (error) => {
        console.error("Error loading history:", error);
        // Fallback agar Index error aaye
        list.innerHTML = "<p style='text-align:center; color:red;'>Error loading history (Check Console).</p>";
    });
}

// Logout
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};