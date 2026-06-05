const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');
const Grade = require('../src/models/Grade');
const Attendance = require('../src/models/Attendance');
const Homework = require('../src/models/Homework');

describe('Models Validation', () => {
  const ids = Array.from({length: 20}, (_, i) => `id_${i}`);
  const names = ['Ivan', 'Maria', 'Olena', 'Petro', 'Anna'];
  const subjects = ['Math', 'Physics', 'History', 'Programming', 'English'];

  describe.each(ids)('Student model with ID %s', (id) => {
    it.each(names)('should create student %s', (name) => {
      const student = new Student(id, name, 'Group A');
      expect(student.id).toBe(id);
      expect(student.name).toBe(name);
      expect(student.group).toBe('Group A');
    });
  });

  describe.each(ids)('Teacher model with ID %s', (id) => {
    it.each(names)('should create teacher %s', (name) => {
      const teacher = new Teacher(id, name, 'Math');
      expect(teacher.id).toBe(id);
      expect(teacher.name).toBe(name);
      expect(teacher.subject).toBe('Math');
    });
  });

  describe('Grade model variations', () => {
    const values = [1, 2, 5, 8, 10, 12, 100];
    it.each(values)('should create grade with value %s', (val) => {
      const grade = new Grade('g1', 's1', 't1', 'Math', val);
      expect(grade.value).toBe(val);
    });
  });

  describe('Attendance and Homework models', () => {
    it('should create attendance properly', () => {
      const att = new Attendance('a1', 's1', new Date(), true);
      expect(att.isPresent).toBe(true);
    });

    it('should create homework properly', () => {
      const hw = new Homework('h1', 't1', 'Math', 'Do exercises', new Date());
      expect(hw.description).toBe('Do exercises');
    });
  });
});
