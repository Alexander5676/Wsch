import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  adjustStudentSkill,
  alfaCrmData,
  lessonsForStudent,
  lessonsForTeacher,
  pushReminderPlan,
  remainingLessons,
} from '../src/app.js';

describe('Alfa CRM portal data mapping', () => {
  it('calculates the remaining paid lessons for clients', () => {
    const [student] = alfaCrmData.students;

    assert.equal(remainingLessons(student), 7);
  });

  it('maps schedule items by student and teacher', () => {
    assert.equal(lessonsForStudent('st-1024').length, 2);
    assert.equal(lessonsForTeacher('t-11').length, 2);
  });

  it('lets teachers move skill scales up and down after lessons', () => {
    assert.equal(adjustStudentSkill('st-1024', 'grammar', 'up'), 71);
    assert.equal(adjustStudentSkill('st-1024', 'grammar', 'down'), 66);
  });

  it('creates mandatory push reminders for upcoming lessons', () => {
    const reminders = pushReminderPlan();

    assert.equal(reminders.length, 2);
    assert.match(reminders[0].title, /Урок:/);
    assert.match(reminders[0].body, /Аня Смирнова/);
  });
});
