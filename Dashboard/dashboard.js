// ===================== THEME TOGGLE =====================
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ascend-theme', theme);
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

const savedTheme = localStorage.getItem('ascend-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===================== MOBILE SIDEBAR =====================
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');
const menuBtn = document.getElementById('menuBtn');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar(){
  sidebar.classList.add('open');
  backdrop.classList.add('show');
}
function closeSidebar(){
  sidebar.classList.remove('open');
  backdrop.classList.remove('show');
}
menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);

// ===================== PAGE NAVIGATION =====================
// Only "dashboard" has a fully built page. Every other nav item routes to a
// generic placeholder panel with a contextual title + description, so the
// sidebar structure is fully wired up and ready for real pages to be added later.

const pageMeta = {
  'dashboard':      { title: 'Dashboard' },
  'resume':         { title: 'Resume Builder', desc: 'Upload your resume and let AI analyse it, score it, and suggest improvements against your target role.' },
  'career-target':  { title: 'Career Target', desc: 'Choose the job role and companies you are preparing for, so your entire plan personalises around it.' },
  'skill-gap':      { title: 'Skill Gap Analysis', desc: 'See exactly which skills you are missing for your target role, compared against real job descriptions.' },
  'study-plan':     { title: 'Weekly Study Plan', desc: 'Your AI-generated week-by-week preparation plan, updated automatically as you progress.' },
  'aptitude':       { title: 'Aptitude Practice', desc: 'Topic-wise quantitative, logical, and verbal aptitude questions with instant scoring.' },
  'technical':      { title: 'Technical Practice', desc: 'Core CS fundamentals, subject-wise technical questions for your target role.' },
  'coding':         { title: 'Coding Practice', desc: 'Hands-on coding problems with an online compiler and instant feedback.' },
  'sql':            { title: 'SQL Practice', desc: 'Query-writing practice questions covering joins, subqueries, window functions, and more.' },
  'mock-interview': { title: 'AI Mock Interview', desc: 'Take a technical or HR mock interview with an AI interviewer and get detailed feedback instantly.' },
  'gd-simulator':   { title: 'GD Simulator', desc: 'Practice group discussions with AI-simulated participants and get feedback on communication and confidence.' },
  'star-trainer':   { title: 'STAR Trainer', desc: 'Practice behavioral / HR questions using the STAR method, with AI scoring on structure and clarity.' },
  'analytics':      { title: 'Performance Analytics', desc: 'Deep-dive into your scores, trends, and weekly progress across every practice module.' },
  'ai-assistant':   { title: 'AI Career Assistant', desc: 'Chat with your AI career assistant for guidance, doubt-solving, and preparation tips anytime.' },
  'settings':       { title: 'Settings', desc: 'Manage your profile, notification preferences, and account settings.' },
};

const pageTitle = document.getElementById('pageTitle');
const pageDashboard = document.getElementById('page-dashboard');
const pageGeneric = document.getElementById('page-generic');
const emptyTitle = document.getElementById('emptyTitle');
const emptyDesc = document.getElementById('emptyDesc');
const navLinks = document.querySelectorAll('.nav-link');

function goToPage(pageId){
  const meta = pageMeta[pageId] || pageMeta['dashboard'];

  // Update topbar title
  pageTitle.textContent = meta.title;

  // Toggle active nav link
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Show the right panel
  if(pageId === 'dashboard'){
    pageDashboard.classList.add('active');
    pageGeneric.classList.remove('active');
  } else {
    pageDashboard.classList.remove('active');
    pageGeneric.classList.add('active');
    emptyTitle.textContent = meta.title;
    emptyDesc.textContent = meta.desc || 'This module is coming soon in the next build.';
  }

  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sidebar nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage(link.dataset.page);
  });
});

// Any element with data-goto (quick-launch cards, buttons, etc.)
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage(el.dataset.goto);
  });
});

// ===================== GREETING =====================
const greetingEl = document.getElementById('greeting');
function setGreeting(){
  const hour = new Date().getHours();
  let greeting = 'Good evening, Khushi';
  if(hour < 12) greeting = 'Good morning, Khushi';
  else if(hour < 17) greeting = 'Good afternoon, Khushi';
  greetingEl.textContent = greeting;
}
setGreeting();

// ===================== WEEKLY PLAN CHECKLIST =====================
const taskList = document.getElementById('taskList');
const planProgressFill = document.getElementById('planProgressFill');
const planProgressPill = document.getElementById('planProgressPill');

function updatePlanProgress(){
  const items = taskList.querySelectorAll('.task-item');
  const checked = taskList.querySelectorAll('input[type="checkbox"]:checked').length;
  const total = items.length;
  const pct = Math.round((checked / total) * 100);
  planProgressFill.style.width = pct + '%';
  planProgressPill.textContent = `${checked}/${total} done`;
}

taskList.addEventListener('change', (e) => {
  if(e.target.matches('input[type="checkbox"]')){
    const item = e.target.closest('.task-item');
    item.classList.toggle('done', e.target.checked);
    updatePlanProgress();
  }
});

// ===================== ANIMATE SECTION BARS ON LOAD =====================
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const width = bar.dataset.w;
    requestAnimationFrame(() => {
      setTimeout(() => { bar.style.width = width + '%'; }, 150);
    });
  });
});

// ===================== NOTIFICATION BELL (demo) =====================
const notifBtn = document.getElementById('notifBtn');
notifBtn.addEventListener('click', () => {
  notifBtn.classList.remove('has-dot');
});
