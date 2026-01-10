import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs, addDoc, orderBy, limit, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let facultyName = "Faculty";
let facultyId = null;

// 1. Check Login
onAuthStateChanged(auth, async (user) => {
    if (user) {
        facultyId = user.uid;
        // Load Profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if(userDoc.exists()) {
            const data = userDoc.data();
            facultyName = data.name;
            document.getElementById('profileName').innerText = facultyName;
            if(data.photoURL) document.getElementById('profileImg').src = data.photoURL;
        }

        loadStats();
        loadRecentNotices();
    } else {
        window.location.href = 'login.html';
    }
});

// 2. Load Stats
async function loadStats() {
    // Count Students
    const sSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
    document.getElementById('totalStudents').innerText = sSnap.size;

    // Count My Notices
    const nSnap = await getDocs(query(collection(db, "notices"), where("authorId", "==", facultyId)));
    document.getElementById('totalNotices').innerText = nSnap.size;

    // Mock Pending Complaints (Real app me database se aayega)
    document.getElementById('pendingComplaints').innerText = "2"; 
    document.getElementById('sidebarComplaintCount').innerText = "2";
}

// 3. Post Announcement
document.getElementById('announcementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value;
    const content = document.getElementById('noticeContent').value;
    const btn = e.target.querySelector('button[type="submit"]');

    btn.innerText = "Posting...";
    btn.disabled = true;

    try {
        await addDoc(collection(db, "notices"), {
            title: title,
            content: content,
            authorName: facultyName,
            authorId: facultyId,
            date: new Date().toISOString(),
            type: 'general'
        });
        alert("Notice Posted Successfully!");
        e.target.reset();
        loadRecentNotices(); // Refresh list
        loadStats(); // Refresh count
    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        btn.innerText = "Post Notice";
        btn.disabled = false;
    }
});

// 4. Load Recent Notices
async function loadRecentNotices() {
    const feed = document.getElementById('activityFeed');
    const q = query(collection(db, "notices"), where("authorId", "==", facultyId), orderBy("date", "desc"), limit(5));
    
    try {
        const snap = await getDocs(q);
        feed.innerHTML = "";
        
        if(snap.empty) {
            feed.innerHTML = "<p>No notices posted yet.</p>";
            return;
        }

        snap.forEach(doc => {
            const data = doc.data();
            const date = new Date(data.date).toLocaleDateString();
            
            feed.innerHTML += `
                <div class="feed-item">
                    <img src="${document.getElementById('profileImg').src}" class="feed-avatar">
                    <div style="width: 100%;">
                        <div style="display: flex; justify-content: space-between;">
                            <h4 style="margin: 0; color: #0f172a;">${data.title}</h4>
                            <span style="font-size: 0.8rem; color: #94a3b8;">${date}</span>
                        </div>
                        <p style="margin-top: 5px; color: #64748b; font-size: 0.95rem;">${data.content}</p>
                    </div>
                </div>
            `;
        });
    } catch(err) {
        // Index error aa sakta hai agar Firestore index nahi bana ho first time
        console.log("Firestore Index Error (First time creation needed):", err);
        feed.innerHTML = "<p><i>Note: Create index in Firestore console to view sorted posts.</i></p>";
    }
}

// Logout
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};