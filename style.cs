/* --- Imports --- */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Poppins:wght@500;600;700&display=swap');

/* --- Variables --- */
:root {
    --primary-gradient: linear-gradient(135deg, #004e92 0%, #000428 100%);
    --accent-color: #00b4db;
    --text-dark: #1f2937;
    --text-light: #6b7280;
    --white: #ffffff;
    --glass-bg: rgba(255, 255, 255, 0.95);
    --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    --hover-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* --- Reset & Base --- */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
}

body {
    font-family: 'Open Sans', sans-serif;
    background-color: #f3f4f6;
    color: var(--text-dark);
    overflow-x: hidden;
}

h1, h2, h3, h4 {
    font-family: 'Poppins', sans-serif;
}

a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; }

/* --- Utility --- */
.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
}

.btn {
    padding: 12px 30px;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 78, 146, 0.3);
}

.btn-primary {
    background: var(--primary-gradient);
    color: var(--white);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 78, 146, 0.5);
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #000428;
    position: relative;
    display: inline-block;
}

.section-header {
    text-align: center;
    margin: 80px 0 50px;
}

.section-header .line {
    width: 60px;
    height: 4px;
    background: var(--accent-color);
    margin: 10px auto;
    border-radius: 2px;
}

/* --- Navbar --- */
.main-header {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    padding: 15px 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
    transition: 0.3s;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 10px;
}

/* --- Hero Section --- */
.hero-section {
    position: relative;
    height: 85vh;
    background: linear-gradient(rgba(0, 4, 40, 0.7), rgba(0, 78, 146, 0.7)), url('https://www.tgpcet.com/IdeaLab/assets/img/about.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed; /* Parallax effect */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--white);
    margin-top: 60px;
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
    line-height: 1.2;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

/* --- Stats Counter Section --- */
.stats-section {
    background: var(--white);
    padding: 60px 0;
    margin-top: -50px; /* Overlap hero */
    position: relative;
    z-index: 10;
    border-radius: 10px;
    box-shadow: var(--card-shadow);
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

.stat-item {
    text-align: center;
    padding: 20px;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #004e92;
    display: block;
}

.stat-label {
    font-size: 1rem;
    color: var(--text-light);
    font-weight: 600;
}

/* --- Cards (Achievements & Students) --- */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px;
}

.card {
    background: var(--white);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    transition: all 0.4s ease;
    position: relative;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: var(--hover-shadow);
}

.card-img-wrapper {
    overflow: hidden;
    height: 200px;
}

.card-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.card:hover .card-img-wrapper img {
    transform: scale(1.1);
}

.card-content {
    padding: 25px;
}

.card-content h3 {
    margin-bottom: 10px;
    color: var(--text-dark);
}

.card-content p {
    color: var(--text-light);
    font-size: 0.9rem;
}

/* Student Specific */
.student-card {
    text-align: center;
    padding: 30px;
    border-top: 4px solid #004e92;
}

.student-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 auto 15px;
    object-fit: cover;
    border: 3px solid var(--white);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.skill-tag {
    background: #e0f2fe;
    color: #004e92;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    display: inline-block;
    margin-top: 10px;
}

/* --- Footer --- */
footer {
    background: #000428;
    color: var(--white);
    padding: 50px 0 20px;
    margin-top: 100px;
    text-align: center;
}

.social-links a {
    color: var(--white);
    font-size: 1.5rem;
    margin: 0 15px;
    opacity: 0.7;
}

.social-links a:hover {
    opacity: 1;
    color: var(--accent-color);
}

/* --- Login Page Styling --- */
.login-body {
    background: linear-gradient(rgba(0, 4, 40, 0.8), rgba(0, 78, 146, 0.8)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
    background-size: cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    padding: 50px;
    border-radius: 20px;
    width: 100%;
    max-width: 450px;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
}

.form-control {
    background: #f0f2f5;
    border: none;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    width: 100%;
    font-size: 1rem;
}

.form-control:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px var(--accent-color);
    outline: none;
}