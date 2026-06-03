const alfaCrmData = {
  syncedAt: '2026-06-03T12:30:00Z',
  students: [
    {
      id: 'st-1024',
      name: 'Аня Смирнова',
      age: 12,
      parent: 'Мария Смирнова',
      phone: '+7 900 000-00-24',
      course: 'Английский B1',
      paidLessons: 16,
      usedLessons: 9,
      balanceRub: 24500,
      teacherId: 't-11',
      skills: { speaking: 78, grammar: 66, vocabulary: 83, listening: 71 },
    },
    {
      id: 'st-2048',
      name: 'Илья Петров',
      age: 15,
      parent: 'Олег Петров',
      phone: '+7 900 000-00-48',
      course: 'Математика ОГЭ',
      paidLessons: 12,
      usedLessons: 4,
      balanceRub: 18800,
      teacherId: 't-18',
      skills: { algebra: 61, geometry: 54, logic: 72, homework: 88 },
    },
  ],
  teachers: [
    { id: 't-11', name: 'Екатерина Орлова', subject: 'Английский', rating: 4.9 },
    { id: 't-18', name: 'Дмитрий Волков', subject: 'Математика', rating: 4.8 },
  ],
  lessons: [
    {
      id: 'l-7001',
      studentId: 'st-1024',
      teacherId: 't-11',
      startsAt: '2026-06-04T15:00:00+03:00',
      topic: 'Speaking: travel plans',
      status: 'planned',
      room: 'Zoom / Board #14',
      homework: 'Подготовить 8 фраз о летних планах и загрузить аудиоответ.',
      material: 'Travel vocabulary cards.pdf',
      teacherComment: 'Аня уверенно использует новые слова, нужна практика времен.',
      voiceNote: 'voice-note-anya-travel.mp3',
      studentAttachment: 'audio-summer-plans.m4a',
      studentComment: 'Попросить разобрать Past Continuous на примерах.',
    },
    {
      id: 'l-6998',
      studentId: 'st-1024',
      teacherId: 't-11',
      startsAt: '2026-06-01T15:00:00+03:00',
      topic: 'Past Continuous',
      status: 'completed',
      room: 'Zoom / Board #14',
      homework: 'Workbook p. 42, ex. 3-5.',
      material: 'Grammar timeline.png',
      teacherComment: 'После урока подняла грамматику на 4 пункта.',
      voiceNote: 'voice-note-anya-grammar.mp3',
      skillDelta: { grammar: 4, speaking: 2 },
    },
    {
      id: 'l-8001',
      studentId: 'st-2048',
      teacherId: 't-18',
      startsAt: '2026-06-05T18:30:00+03:00',
      topic: 'Квадратные уравнения',
      status: 'planned',
      room: 'Online Board #08',
      homework: 'Решить вариант 12, задания 1-6.',
      material: 'OGE-equations.pdf',
      teacherComment: 'Сфокусироваться на проверке корней.',
      voiceNote: 'voice-note-ilya-equations.mp3',
    },
  ],
  supportRequests: [
    { id: 'req-1', from: 'Мария Смирнова', theme: 'Перенос урока', status: 'В работе', assignee: '❤ Служба заботы' },
    { id: 'req-2', from: 'Олег Петров', theme: 'Пополнение баланса', status: 'Ожидает оплаты', assignee: 'Администратор' },
  ],
  news: [
    { id: 'n-1', title: 'Летний интенсив стартует 10 июня', audience: 'Клиенты', publishedAt: '2026-06-02' },
    { id: 'n-2', title: 'Новый шаблон комментария после урока', audience: 'Педагоги', publishedAt: '2026-06-01' },
  ],
};

const skillLabels = {
  speaking: 'Говорение',
  grammar: 'Грамматика',
  vocabulary: 'Словарь',
  listening: 'Аудирование',
  algebra: 'Алгебра',
  geometry: 'Геометрия',
  logic: 'Логика',
  homework: 'Домашняя работа',
};

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

function getTeacher(id) {
  return alfaCrmData.teachers.find((teacher) => teacher.id === id);
}

function getStudent(id) {
  return alfaCrmData.students.find((student) => student.id === id);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function remainingLessons(student) {
  return Math.max(student.paidLessons - student.usedLessons, 0);
}

function lessonsForStudent(studentId) {
  return alfaCrmData.lessons.filter((lesson) => lesson.studentId === studentId);
}

function lessonsForTeacher(teacherId) {
  return alfaCrmData.lessons.filter((lesson) => lesson.teacherId === teacherId);
}

function nextLessons() {
  const now = new Date('2026-06-03T00:00:00Z');
  return alfaCrmData.lessons.filter((lesson) => new Date(lesson.startsAt) > now);
}

function pushReminderPlan() {
  return nextLessons().map((lesson) => {
    const student = getStudent(lesson.studentId);
    const teacher = getTeacher(lesson.teacherId);
    return {
      lessonId: lesson.id,
      title: `Урок: ${lesson.topic}`,
      body: `${student.name} и ${teacher.name}, ${formatDateTime(lesson.startsAt)}`,
    };
  });
}

function createCard(title, body, accent = '') {
  const template = document.querySelector('#cardTemplate');
  const card = template.content.firstElementChild.cloneNode(true);
  card.innerHTML = `<div class="card-title-row"><h2>${title}</h2>${accent}</div>${body}`;
  return card;
}

function renderCrmSync() {
  const syncList = document.querySelector('#crmSyncList');
  const items = [
    ['Ученики', alfaCrmData.students.length],
    ['Педагоги', alfaCrmData.teachers.length],
    ['Расписание', alfaCrmData.lessons.length],
    ['Балансы', alfaCrmData.students.length],
    ['Остатки уроков', alfaCrmData.students.length],
    ['Данные клиентов', alfaCrmData.students.length],
  ];
  syncList.innerHTML = items
    .map(([label, count]) => `<li><span>${label}</span><strong>${count}</strong></li>`)
    .join('');
}

let currentEditableStudentId = '';

function renderProgress(skills, editable = false, studentId = '') {
  currentEditableStudentId = studentId;
  return Object.entries(skills)
    .map(([key, value]) => `
      <div class="progress-row">
        <label>${skillLabels[key] ?? key}</label>
        <meter min="0" max="100" value="${value}"></meter>
        <strong>${value}%</strong>
        ${editable ? `<button class="mini-button" type="button" data-student-id="${currentEditableStudentId}" data-skill="${key}" data-direction="down">−</button><button class="mini-button" type="button" data-student-id="${currentEditableStudentId}" data-skill="${key}" data-direction="up">+</button>` : ''}
      </div>`)
    .join('');
}

function renderClientView() {
  const view = document.querySelector('#clientView');
  const student = alfaCrmData.students[0];
  const teacher = getTeacher(student.teacherId);
  const lessons = lessonsForStudent(student.id);
  const plannedLessons = lessons.filter((lesson) => lesson.status === 'planned');
  const completedLessons = lessons.filter((lesson) => lesson.status === 'completed');

  view.innerHTML = '';
  view.append(
    createCard(
      'Расписание и календарь занятий',
      `<div class="timeline">${plannedLessons
        .map((lesson) => `<div><strong>${formatDateTime(lesson.startsAt)}</strong><span>${lesson.topic} · ${teacher.name} · ${lesson.room}</span></div>`)
        .join('')}</div>`,
      '<span class="tag">Alfa CRM</span>',
    ),
    createCard(
      'Баланс и остаток оплаченных занятий',
      `<div class="balance-grid"><div><span>Баланс</span><strong>${currencyFormatter.format(student.balanceRub)}</strong></div><div><span>Осталось уроков</span><strong>${remainingLessons(student)}</strong></div><div><span>Оплачено</span><strong>${student.paidLessons}</strong></div></div>`,
      '<span class="tag success">Синхронизировано</span>',
    ),
    createCard(
      'Домашние задания, материалы и комментарии',
      lessons
        .map((lesson) => `<div class="lesson-note"><strong>${lesson.topic}</strong><p>ДЗ: ${lesson.homework}</p><p>Материал: ${lesson.material}</p><p>Комментарий педагога: ${lesson.teacherComment}</p><p>Голосовое: <button class="link-button" type="button">${lesson.voiceNote}</button></p></div>`)
        .join(''),
    ),
    createCard('Шкалы прогресса', renderProgress(student.skills)),
    createCard(
      'Чат «❤ Служба заботы»',
      `<div class="chat-card"><p><strong>❤ Служба заботы:</strong> Поможем с переносом, оплатой и организационными вопросами.</p><textarea aria-label="Сообщение в службу заботы" placeholder="Напишите сообщение"></textarea><button class="secondary-action" type="button">Отправить</button></div>`,
    ),
    createCard(
      'Новости школы',
      alfaCrmData.news.map((item) => `<article class="news-item"><time>${item.publishedAt}</time><strong>${item.title}</strong><span>${item.audience}</span></article>`).join(''),
    ),
    createCard(
      'Прикрепить ДЗ или комментарий к уроку',
      `<form class="attachment-form"><label>Урок<select>${lessons.map((lesson) => `<option>${lesson.topic}</option>`).join('')}</select></label><label>Комментарий<textarea>${plannedLessons[0]?.studentComment ?? ''}</textarea></label><label>Файл<input type="file" /></label><button class="primary-action" type="button">Сохранить для педагога</button></form>`,
    ),
    createCard(
      'История уроков',
      completedLessons.map((lesson) => `<div class="history-row"><span>${formatDateTime(lesson.startsAt)}</span><strong>${lesson.topic}</strong><em>${Object.entries(lesson.skillDelta ?? {}).map(([key, value]) => `${skillLabels[key]} +${value}`).join(', ')}</em></div>`).join(''),
    ),
  );
}

function renderTeacherView() {
  const view = document.querySelector('#teacherView');
  const teacher = alfaCrmData.teachers[0];
  const teacherLessons = lessonsForTeacher(teacher.id);
  const students = alfaCrmData.students.filter((student) => student.teacherId === teacher.id);

  view.innerHTML = '';
  view.append(
    createCard(
      `Расписание педагога: ${teacher.name}`,
      `<div class="timeline">${teacherLessons.map((lesson) => `<div><strong>${formatDateTime(lesson.startsAt)}</strong><span>${getStudent(lesson.studentId).name} · ${lesson.topic} · ${lesson.room}</span></div>`).join('')}</div>`,
    ),
    createCard(
      'Карточки учеников',
      students.map((student) => `<section class="student-card"><h3>${student.name}</h3><p>${student.course} · родитель: ${student.parent}</p><p>Остаток уроков: ${remainingLessons(student)} · баланс: ${currencyFormatter.format(student.balanceRub)}</p>${renderProgress(student.skills, true, student.id)}</section>`).join(''),
      '<span class="tag">Можно менять вверх/вниз после урока</span>',
    ),
    createCard(
      'Комментарий после урока',
      `<form class="stacked-form"><label>Ученик<select>${students.map((student) => `<option>${student.name}</option>`).join('')}</select></label><label>Комментарий<textarea>Цель следующего урока: закрепить времена и добавить устную практику.</textarea></label><button class="primary-action" type="button">Опубликовать клиенту</button></form>`,
    ),
    createCard(
      'Материалы, ДЗ и голосовые рекомендации',
      `<form class="stacked-form"><label>Материал<input value="Speaking-cards.pdf" /></label><label>Домашнее задание<textarea>Записать 1-минутный ответ и прикрепить в кабинет.</textarea></label><label>Голосовая рекомендация<input type="file" accept="audio/*" /></label><button class="primary-action" type="button">Прикрепить к уроку</button></form>`,
    ),
  );
}

function renderAdminView() {
  const view = document.querySelector('#adminView');
  view.innerHTML = '';
  view.append(
    createCard(
      'Карточки клиентов',
      alfaCrmData.students.map((student) => `<section class="client-card"><h3>${student.name}</h3><p>${student.parent} · ${student.phone}</p><p>${student.course} · педагог: ${getTeacher(student.teacherId).name}</p><p>Баланс: ${currencyFormatter.format(student.balanceRub)} · остаток: ${remainingLessons(student)}</p></section>`).join(''),
      '<span class="tag">Alfa CRM</span>',
    ),
    createCard(
      'Работа с обращениями',
      alfaCrmData.supportRequests.map((request) => `<div class="request-row"><strong>${request.theme}</strong><span>${request.from}</span><em>${request.status}</em><button class="mini-button" type="button">Открыть</button></div>`).join(''),
    ),
    createCard(
      'Публикация новостей',
      `<form class="stacked-form"><label>Заголовок<input value="Новый разговорный клуб по субботам" /></label><label>Аудитория<select><option>Клиенты</option><option>Педагоги</option><option>Все</option></select></label><button class="primary-action" type="button">Опубликовать</button></form>`,
    ),
    createCard(
      'Доступ к расписанию и комментариям',
      `<div class="admin-table">${alfaCrmData.lessons.map((lesson) => `<div><span>${formatDateTime(lesson.startsAt)}</span><strong>${getStudent(lesson.studentId).name}</strong><em>${lesson.teacherComment}</em></div>`).join('')}</div>`,
    ),
    createCard(
      'Обязательные push-уведомления',
      pushReminderPlan().map((push) => `<div class="push-row"><strong>${push.title}</strong><span>${push.body}</span></div>`).join(''),
      '<span class="tag warning">Требуется разрешение браузера</span>',
    ),
  );
}

function adjustStudentSkill(studentId, skill, direction) {
  const student = getStudent(studentId);
  if (!student || typeof student.skills[skill] !== 'number') {
    return null;
  }

  const delta = direction === 'up' ? 5 : -5;
  student.skills[skill] = Math.min(100, Math.max(0, student.skills[skill] + delta));
  return student.skills[skill];
}

function setRole(role) {
  document.querySelectorAll('.role-button').forEach((button) => {
    const isActive = button.dataset.role === role;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
  document.querySelectorAll('.role-view').forEach((view) => {
    view.classList.toggle('is-hidden', view.id !== `${role}View`);
  });
}

async function enablePushNotifications() {
  const status = document.querySelector('#pushStatus');
  if (!('Notification' in window)) {
    status.textContent = 'Браузер не поддерживает push';
    status.className = 'status-pill warning';
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    status.textContent = 'Push подключены';
    status.className = 'status-pill success';
    const [firstReminder] = pushReminderPlan();
    if (firstReminder) {
      new Notification(firstReminder.title, { body: firstReminder.body });
    }
    return;
  }

  status.textContent = 'Push не разрешены';
  status.className = 'status-pill warning';
}

function bindEvents() {
  document.querySelectorAll('.role-button').forEach((button) => {
    button.addEventListener('click', () => setRole(button.dataset.role));
  });
  document.querySelector('#pushButton').addEventListener('click', enablePushNotifications);
  document.querySelector('#teacherView').addEventListener('click', (event) => {
    const button = event.target.closest('[data-skill][data-direction][data-student-id]');
    if (!button) {
      return;
    }

    adjustStudentSkill(button.dataset.studentId, button.dataset.skill, button.dataset.direction);
    renderTeacherView();
    renderClientView();
  });
}

function initApp() {
  renderCrmSync();
  renderClientView();
  renderTeacherView();
  renderAdminView();
  bindEvents();
}

if (typeof document !== 'undefined') {
  initApp();
}

export {
  adjustStudentSkill,
  alfaCrmData,
  lessonsForStudent,
  lessonsForTeacher,
  pushReminderPlan,
  remainingLessons,
};
