import { auth, db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

// 1. Auth Check
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        loadUserProfile(user.uid);
        loadNotices();
        loadPosts();
    } else {
        window.location.href = 'login.html';
    }
});

// 2. Load Profile
async function loadUserProfile(uid) {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
        const data = docSnap.data();
        const avatar = data.photoURL || `https://ui-avatars.com/api/?name=${data.name}`;
        
        document.getElementById('myName').innerText = data.name;
        document.getElementById('myBio').innerText = data.bio || "IT Engineering Student";
        document.getElementById('myAvatarSmall').src = avatar;
        document.getElementById('myAvatarBig').src = avatar;
    }
}

// 3. Load Notices (From Faculty)
async function loadNotices() {
    const board = document.getElementById('noticeBoard');
    const q = query(collection(db, "notices"), orderBy("date", "desc"), limit(3));
    
    try {
        const snap = await getDocs(q);
        board.innerHTML = "";
        
        if(snap.empty) {
            board.innerHTML = "<p style='font-size:0.85rem; color:#94a3b8;'>No recent notices.</p>";
            return;
        }

        snap.forEach(doc => {
            const n = doc.data();
            const date = new Date(n.date).toLocaleDateString();
            board.innerHTML += `
                <div class="notice-item">
                    <span class="notice-date">${date} • ${n.authorName}</span>
                    <p class="notice-text">${n.title}</p>
                </div>
            `;
        });
    } catch (e) {
        console.error("Notice Error:", e);
        board.innerHTML = "<p style='font-size:0.85rem; color:red;'>Sync Error</p>";
    }
}

// 4. Create Post Logic
const fileInput = document.getElementById('postImageInput');
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if(file) document.getElementById('fileNameDisplay').innerText = `Selected: ${file.name}`;
});

document.getElementById('btnPost').addEventListener('click', async () => {
    const content = document.getElementById('postContent').value;
    const file = fileInput.files[0];
    const btn = document.getElementById('btnPost');

    if(!content && !file) return alert("Write something to post!");

    btn.innerText = "Posting...";
    btn.disabled = true;

    try {
        let imageBase64 = null;
        if(file) {
            if(file.size > 500000) throw new Error("Image too big! Max 500KB.");
            imageBase64 = await convertToBase64(file);
        }

        await addDoc(collection(db, "posts"), {
            uid: currentUser.uid,
            author: document.getElementById('myName').innerText,
            avatar: document.getElementById('myAvatarSmall').src,
            content: content,
            image: imageBase64,
            timestamp: new Date().toISOString(),
            likes: 0
        });

        alert("Posted!");
        document.getElementById('postContent').value = "";
        fileInput.value = "";
        document.getElementById('fileNameDisplay').innerText = "";
        loadPosts(); // Refresh Feed

    } catch (error) {
        alert(error.message);
    } finally {
        btn.innerText = "Post";
        btn.disabled = false;
    }
});

// Helper: Image to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// 5. Load Feed Posts
async function loadPosts() {
    const feed = document.getElementById('postFeed');
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    try {
        const snap = await getDocs(q);
        feed.innerHTML = "";

        if(snap.empty) {
            feed.innerHTML = "<p style='text-align:center;'>No posts yet. Be the first!</p>";
            return;
        }

        snap.forEach(doc => {
            const p = doc.data();
            const timeAgo = new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const imgHtml = p.image ? `<img src="${p.image}" class="post-img">` : '';

            const html = `
                <div class="post-card">
                    <div class="post-header">
                        <img src="${p.avatar}" class="post-avatar">
                        <div class="post-author">
                            <h4>${p.author}</h4>
                            <span class="post-meta">Today at ${timeAgo}</span>
                        </div>
                    </div>
                    <div class="post-body">${p.content}</div>
                    ${imgHtml}
                    <div class="post-footer">
                        <button class="action-btn"><i class="far fa-heart"></i> Like</button>
                        <button class="action-btn"><i class="far fa-comment"></i> Comment</button>
                    </div>
                </div>
            `;
            feed.innerHTML += html;
        });
    } catch (e) {
        console.error("Feed Error:", e);
    }
}

window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};