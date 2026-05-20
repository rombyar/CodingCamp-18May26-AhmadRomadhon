'use strict';

const $ = (id) => document.getElementById(id);

function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour >= 5  && hour < 11) return 'Good Morning';
  if (hour >= 11 && hour < 15) return 'Good Afternoon';
  if (hour >= 15 && hour < 18) return 'Good Evening';
  return 'Good Night';
}

function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, '0');
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');

  $('clock').textContent = `${h}:${m}:${s}`;

  const dayName  = DAYS[now.getDay()];
  const date     = now.getDate();
  const month    = MONTHS[now.getMonth()];
  const year     = now.getFullYear();
  $('date').textContent = `${dayName}, ${date} ${month} ${year}`;

  const greeting = getGreeting(now.getHours());
  const name     = loadLS('userName', '');
  $('greetingText').textContent = name
    ? `${greeting}, ${name}! 👋`
    : `${greeting}! 👋`;
}

function initName() {
  const saved = loadLS('userName', '');
  if (saved) {
    $('nameInputWrap').style.display = 'none';
    $('editNameBtn').style.display   = 'inline-flex';
  }
}

$('saveNameBtn').addEventListener('click', () => {
  const val = $('nameInput').value.trim();
  if (!val) return;
  saveLS('userName', val);
  $('nameInputWrap').style.display = 'none';
  $('editNameBtn').style.display   = 'inline-flex';
  updateClock();
});

$('nameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('saveNameBtn').click();
});

$('editNameBtn').addEventListener('click', () => {
  $('nameInput').value             = loadLS('userName', '');
  $('nameInputWrap').style.display = 'grid';
  $('editNameBtn').style.display   = 'none';
  $('nameInput').focus();
});

initName();
updateClock();
setInterval(updateClock, 1000);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = $('themeBtn');
  const icon = btn.querySelector('.theme-icon');
  const label = btn.querySelector('.theme-label');

  if (theme === 'dark') {
    icon.textContent = '☀️';
    label.textContent = 'Light Mode';
    btn.setAttribute('aria-pressed', 'true');
  } else {
    icon.textContent = '🌙';
    label.textContent = 'Dark Mode';
    btn.setAttribute('aria-pressed', 'false');
  }
}

let currentTheme = loadLS('theme', 'light');
applyTheme(currentTheme);

$('themeBtn').addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  saveLS('theme', currentTheme);
});

const TOTAL_SECONDS = 25 * 60;
let timerSeconds  = TOTAL_SECONDS;
let timerInterval = null;
let timerRunning  = false;

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimerUI() {
  $('timerDisplay').textContent = formatTime(timerSeconds);
  const pct = ((TOTAL_SECONDS - timerSeconds) / TOTAL_SECONDS) * 100;
  const progressBar = $('timerProgress');
  progressBar.style.width = `${pct}%`;
  progressBar.parentElement.setAttribute('aria-valuenow', Math.round(pct));
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  $('startBtn').disabled = true;
  $('pauseBtn').disabled = false;
  $('timerDisplay').setAttribute('aria-live', 'polite');

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerUI();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      $('startBtn').disabled = false;
      $('pauseBtn').disabled = true;
      $('timerDisplay').setAttribute('aria-live', 'off');
      alert('⏰ Time is up! Great focus session. Take a break!');
      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  $('startBtn').disabled = false;
  $('pauseBtn').disabled = true;
  $('timerDisplay').setAttribute('aria-live', 'off');
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  timerSeconds  = TOTAL_SECONDS;
  $('startBtn').disabled = false;
  $('pauseBtn').disabled = true;
  $('timerDisplay').setAttribute('aria-live', 'off');
  updateTimerUI();
}

$('startBtn').addEventListener('click', startTimer);
$('pauseBtn').addEventListener('click', pauseTimer);
$('resetBtn').addEventListener('click', resetTimer);

updateTimerUI();

let tasks = loadLS('tasks', []);

function saveTasks() { saveLS('tasks', tasks); }

function updateTaskCount() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  $('taskCount').textContent = total === 0
    ? '0 tasks'
    : `${done}/${total} done`;
}

function renderTasks() {
  const list = $('todoList');
  list.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `todo-item${task.done ? ' done' : ''}`;
    li.dataset.index = index;

    const cb = document.createElement('input');
    cb.type    = 'checkbox';
    cb.checked = task.done;
    cb.setAttribute('aria-label', `Mark "${task.text}" as done`);
    cb.addEventListener('change', () => toggleTask(index));

    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', `Edit task "${task.text}"`);
    editBtn.addEventListener('click', () => startEditTask(index, li, span));

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
    delBtn.addEventListener('click', () => deleteTask(index));

    actions.append(editBtn, delBtn);
    li.append(cb, span, actions);
    list.appendChild(li);
  });

  updateTaskCount();
}

function addTask() {
  const input = $('todoInput');
  const text  = input.value.trim();
  const errEl = $('todoError');

  if (!text) {
    errEl.textContent = 'Please enter a task.';
    input.focus();
    return;
  }

  const duplicate = tasks.some(
    t => t.text.toLowerCase() === text.toLowerCase()
  );
  if (duplicate) {
    errEl.textContent = `"${text}" already exists in your list.`;
    input.focus();
    return;
  }

  errEl.textContent = '';
  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function startEditTask(index, li, span) {
  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value     = tasks[index].text;
  editInput.maxLength = 100;
  li.replaceChild(editInput, span);
  editInput.focus();

  function saveEdit() {
    const newText = editInput.value.trim();
    const errEl   = $('todoError');

    if (!newText) {
      errEl.textContent = 'Task cannot be empty.';
      editInput.focus();
      return;
    }

    const duplicate = tasks.some(
      (t, i) => i !== index && t.text.toLowerCase() === newText.toLowerCase()
    );
    if (duplicate) {
      errEl.textContent = `"${newText}" already exists.`;
      editInput.focus();
      return;
    }

    errEl.textContent  = '';
    tasks[index].text  = newText;
    saveTasks();
    renderTasks();
  }

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEdit();
    if (e.key === 'Escape') renderTasks();
  });
  editInput.addEventListener('blur', saveEdit);
}

function clearDoneTasks() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

$('addTaskBtn').addEventListener('click', addTask);
$('todoInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
$('clearDoneBtn').addEventListener('click', clearDoneTasks);

$('todoInput').addEventListener('input', () => {
  $('todoError').textContent = '';
});

renderTasks();

let links = loadLS('quickLinks', [
  { name: 'GitHub',  url: 'https://github.com' },
  { name: 'Google',  url: 'https://google.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
]);

function saveLinks() { saveLS('quickLinks', links); }

function getFaviconUrl(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;
  } catch {
    return '';
  }
}

function renderLinks() {
  const container = $('linksList');
  container.innerHTML = '';

  links.forEach((link, index) => {
    const a = document.createElement('a');
    a.className = 'link-item';
    a.href      = link.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';

    const favicon = getFaviconUrl(link.url);
    if (favicon) {
      const img   = document.createElement('img');
      img.src     = favicon;
      img.alt     = '';
      img.className = 'link-favicon';
      img.onerror = () => { img.style.display = 'none'; };
      a.appendChild(img);
    }

    const nameSpan = document.createElement('span');
    nameSpan.textContent = link.name;
    a.appendChild(nameSpan);

    const delBtn = document.createElement('button');
    delBtn.className   = 'link-delete';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', `Delete link "${link.name}"`);
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteLink(index);
    });
    a.appendChild(delBtn);

    container.appendChild(a);
  });
}

function addLink() {
  const nameVal = $('linkName').value.trim();
  const urlVal  = $('linkUrl').value.trim();
  const errEl   = $('linkError');

  if (!nameVal || !urlVal) {
    errEl.textContent = 'Please fill in both name and URL.';
    return;
  }

  let fullUrl = urlVal;
  if (!/^https?:\/\//i.test(fullUrl)) {
    fullUrl = 'https://' + fullUrl;
  }

  try {
    new URL(fullUrl);
  } catch {
    errEl.textContent = 'Please enter a valid URL.';
    return;
  }

  errEl.textContent = '';
  links.push({ name: nameVal, url: fullUrl });
  saveLinks();
  renderLinks();
  $('linkName').value = '';
  $('linkUrl').value  = '';
  $('linkName').focus();
}

function deleteLink(index) {
  links.splice(index, 1);
  saveLinks();
  renderLinks();
}

$('addLinkBtn').addEventListener('click', addLink);
$('linkUrl').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

[$('linkName'), $('linkUrl')].forEach(el => {
  el.addEventListener('input', () => { $('linkError').textContent = ''; });
});

renderLinks();
