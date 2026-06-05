const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');
const Grade = require('../src/models/Grade');
const Attendance = require('../src/models/Attendance');
const Homework = require('../src/models/Homework');

describe('Student model', () => {
  const studentCases = [
    ['s1', 'Ivan',   'Group A'],
    ['s2', 'Maria',  'Group A'],
    ['s3', 'Olena',  'Group B'],
    ['s4', 'Petro',  'Group B'],
    ['s5', 'Anna',   'Group C'],
    ['s6', 'Dmytro', 'Group C'],
    ['s7', 'Oksana', 'Group D'],
    ['s8', 'Mykola', 'Group D'],
    ['s9', 'Iryna',  'Group A'],
    ['s10', 'Serhiy', 'Group B'],
  ];

  it.each(studentCases)('should create Student id=%s name=%s group=%s', (id, name, group) => {
    const student = new Student(id, name, group);
    expect(student.id).toBe(id);
    expect(student.name).toBe(name);
    expect(student.group).toBe(group);
  });
});

describe('Teacher model', () => {
  const teacherCases = [
    ['t1', 'Ivan Kovalenko',    'Math'],
    ['t2', 'Maria Shevchenko',  'Physics'],
    ['t3', 'Olena Bondarenko',  'History'],
    ['t4', 'Petro Savchenko',   'Programming'],
    ['t5', 'Anna Kravchenko',   'English'],
    ['t6', 'Dmytro Lysenko',    'Biology'],
    ['t7', 'Oksana Moroz',      'Chemistry'],
    ['t8', 'Mykola Bondar',     'Geography'],
    ['t9', 'Iryna Tkach',       'Math'],
    ['t10', 'Serhiy Sydorenko', 'Physics'],
  ];

  it.each(teacherCases)('should create Teacher id=%s name=%s subject=%s', (id, name, subject) => {
    const teacher = new Teacher(id, name, subject);
    expect(teacher.id).toBe(id);
    expect(teacher.name).toBe(name);
    expect(teacher.subject).toBe(subject);
  });
});

describe('Grade model', () => {
  const gradeCases = [
    ['g1', 's1', 't1', 'Math',        1],
    ['g2', 's2', 't2', 'Physics',     3],
    ['g3', 's3', 't3', 'History',     5],
    ['g4', 's4', 't4', 'Programming', 7],
    ['g5', 's5', 't5', 'English',     9],
    ['g6', 's6', 't1', 'Math',       10],
    ['g7', 's7', 't2', 'Physics',    11],
    ['g8', 's8', 't3', 'History',    12],
    ['g9', 's9', 't4', 'Programming', 6],
    ['g10','s10','t5', 'English',     4],
  ];

  it.each(gradeCases)('should create Grade id=%s studentId=%s value=%s', (id, studentId, teacherId, subject, value) => {
    const grade = new Grade(id, studentId, teacherId, subject, value);
    expect(grade.id).toBe(id);
    expect(grade.studentId).toBe(studentId);
    expect(grade.teacherId).toBe(teacherId);
    expect(grade.subject).toBe(subject);
    expect(grade.value).toBe(value);
  });

  it('should assign default Date when date not provided', () => {
    const grade = new Grade('g99', 's1', 't1', 'Math', 10);
    expect(grade.date).toBeInstanceOf(Date);
  });

  it('should accept a custom date', () => {
    const custom = new Date('2024-01-15');
    const grade = new Grade('g99', 's1', 't1', 'Math', 10, custom);
    expect(grade.date).toBe(custom);
  });
});

describe('Attendance model', () => {
  const attendanceCases = [
    ['a1', 's1', true,  null],
    ['a2', 's2', false, 'Sick'],
    ['a3', 's3', true,  null],
    ['a4', 's4', false, 'Family reason'],
    ['a5', 's5', true,  null],
  ];

  it.each(attendanceCases)('should create Attendance id=%s studentId=%s isPresent=%s', (id, studentId, isPresent, reason) => {
    const att = new Attendance(id, studentId, new Date(), isPresent, reason);
    expect(att.id).toBe(id);
    expect(att.studentId).toBe(studentId);
    expect(att.isPresent).toBe(isPresent);
    expect(att.reason).toBe(reason);
  });

  it('should assign new Date() when date argument is falsy', () => {
    const att = new Attendance('a99', 's1', null, true);
    expect(att.date).toBeInstanceOf(Date);
  });

  it('should set reason to null when not provided', () => {
    const att = new Attendance('a99', 's1', new Date(), true);
    expect(att.reason).toBeNull();
  });
});

describe('Homework model', () => {
  const subjects = ['Math', 'Physics', 'History', 'Programming', 'English', 'Biology', 'Chemistry'];

  it.each(subjects)('should create Homework for subject %s', (subject) => {
    const due = new Date('2024-06-01');
    const hw = new Homework(`hw_${subject}`, 't1', subject, `Study ${subject}`, due);
    expect(hw.subject).toBe(subject);
    expect(hw.description).toBe(`Study ${subject}`);
    expect(hw.dueDate).toBe(due);
    expect(hw.teacherId).toBe('t1');
  });
});
