import { auth, db } from './firebase-config.js';
import { collection, getDocs, updateDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Auth Check
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadComplaints();
    } else {
        window.location.href = 'login.html';
    }
});

let allComplaints = [];

// 2. Load Complaints from DB
async function loadComplaints() {
    const list = document.getElementById('complaintsList');
    
    try {
        const q = query(collection(db, "complaints"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        
        allComplaints = [];
        let pending = 0;

        snap.forEach(d => {
            const data = { id: d.id, ...d.data() };
            allComplaints.push(data);
            if(data.status === 'pending') pending++;
        });

        document.getElementById('pendingCount').innerText = pending;
        renderList(allComplaints);

    } catch (err) {
        console.error(err);
        // Fallback for no index error
        list.innerHTML = "<p style='text-align:center;'>No complaints found or Index missing.</p>";
    }
}

// 3. Render List
function renderList(data) {
    const list = document.getElementById('complaintsList');
    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#94a3b8;'>No complaints found.</p>";
        return;
    }

    data.forEach(c => {
        const isPending = c.status === 'pending';
        const cardClass = isPending ? 'pending' : 'resolved';
        const badgeClass = isPending ? 'bg-red' : 'bg-green';
        const btnHtml = isPending 
            ? `<button class="action-btn btn-resolve" onclick="markResolved('${c.id}')"><i class="fas fa-check"></i> Mark Resolved</button>`
            : `<button class="action-btn btn-done"><i class="fas fa-check-circle"></i> Resolved</button>`;

        const html = `
            <div class="complaint-card ${cardClass}">
                <div class="c-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="c-content">
                    <div class="c-header">
                        <div>
                            <div class="c-title">${c.subject}</div>
                            <div class="c-student">From: ${c.studentName || 'Student'}</div>
                        </div>
                        <span class="badge ${badgeClass}">${c.status}</span>
                    </div>
                    <div class="c-desc">"${c.desc}"</div>
                    ${btnHtml}
                </div>
            </div>
        `;
        list.innerHTML += html;
    });
}

// 4. Resolve Function (Window scope for HTML click)
window.markResolved = async (id) => {
    if(confirm("Mark this issue as resolved?")) {
        try {
            const ref = doc(db, "complaints", id);
            await updateDoc(ref, { status: "Resolved" });
            loadComplaints(); // Refresh UI
        } catch (e) {
            alert("Error: " + e.message);
        }
    }
};

// 5. Filter Logic
window.filterComplaints = (type) => {
    // Update Active Tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if(type === 'all') renderList(allComplaints);
    else renderList(allComplaints.filter(c => c.status.toLowerCase() === type));
};

// Logout
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};