const HomeworkService = require('../src/services/HomeworkService');
const InMemoryRepository = require('../src/storage/InMemoryRepository');
const NotificationObserver = require('../src/services/NotificationObserver');
const { generateStudents, generateGrades, generateAttendanceRecords } = require('../src/utils/generateData');

const GradingService = require('../src/services/GradingService');
const AttendanceService = require('../src/services/AttendanceService');
const { StandardGradingStrategy } = require('../src/services/gradingStrategies');

describe('HomeworkService', () => {
  let repo, observer, homeworkService;

  beforeEach(() => {
    repo = new InMemoryRepository();
    observer = new NotificationObserver();
    homeworkService = new HomeworkService(repo, observer);
  });

  const subjects = ['Math', 'Physics', 'History', 'Programming', 'English'];

  it.each(subjects)('should add homework for subject %s', (subject) => {
    const due = new Date(Date.now() + 86400000);
    const hw = homeworkService.addHomework(`hw_${subject}`, 't1', subject, `Study chapter on ${subject}`, due);
    expect(hw.subject).toBe(subject);
    expect(hw.description).toBeTruthy();
  });

  it('should notify observer on new homework', () => {
    const cb = jest.fn();
    observer.subscribe(cb);
    homeworkService.addHomework('hw1', 't1', 'Math', 'Solve exercises', new Date());
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: 'NEW_HOMEWORK' }));
  });

  it('should throw if description is empty', () => {
    expect(() => homeworkService.addHomework('hw1', 't1', 'Math', '', new Date())).toThrow();
  });

  it('should throw if description is whitespace only', () => {
    expect(() => homeworkService.addHomework('hw1', 't1', 'Math', '   ', new Date())).toThrow();
  });

  it('should throw if subject is empty', () => {
    expect(() => homeworkService.addHomework('hw1', 't1', '', 'Some task', new Date())).toThrow();
  });

  it('should get homework by subject', () => {
    homeworkService.addHomework('h1', 't1', 'Math', 'Task 1', new Date());
    homeworkService.addHomework('h2', 't1', 'Physics', 'Task 2', new Date());
    expect(homeworkService.getHomeworkBySubject('Math').length).toBe(1);
    expect(homeworkService.getHomeworkBySubject('Physics').length).toBe(1);
    expect(homeworkService.getHomeworkBySubject('History').length).toBe(0);
  });

  it('should get homework by teacher', () => {
    homeworkService.addHomework('h1', 't1', 'Math', 'Task 1', new Date());
    homeworkService.addHomework('h2', 't2', 'Physics', 'Task 2', new Date());
    expect(homeworkService.getHomeworkByTeacher('t1').length).toBe(1);
  });

  it('should get overdue homework', () => {
    const pastDate = new Date(Date.now() - 86400000);
    const futureDate = new Date(Date.now() + 86400000);
    homeworkService.addHomework('h1', 't1', 'Math', 'Old task', pastDate);
    homeworkService.addHomework('h2', 't1', 'Math', 'New task', futureDate);
    const overdue = homeworkService.getOverdueHomework();
    expect(overdue.length).toBe(1);
    expect(overdue[0].id).toBe('h1');
  });

  it('should delete homework', () => {
    homeworkService.addHomework('h1', 't1', 'Math', 'Task', new Date());
    homeworkService.deleteHomework('h1');
    expect(homeworkService.getHomeworkBySubject('Math').length).toBe(0);
  });
});

describe('Integration Tests: Full workflow via generated data', () => {
  let gradeRepo, attRepo, hwRepo, observer;
  let gradingService, attendanceService, homeworkService;

  beforeEach(() => {
    gradeRepo = new InMemoryRepository();
    attRepo = new InMemoryRepository();
    hwRepo = new InMemoryRepository();
    observer = new NotificationObserver();
    gradingService = new GradingService(gradeRepo, new StandardGradingStrategy(), observer);
    attendanceService = new AttendanceService(attRepo);
    homeworkService = new HomeworkService(hwRepo, observer);
  });

  it('should handle full student workflow: add grades, mark attendance, get stats', () => {
    const students = generateStudents(5);
    const notified = [];
    observer.subscribe(evt => notified.push(evt));

    students.forEach((s, i) => {
      gradingService.addGrade(`g${i}_a`, s.id, 't1', 'Math', 10);
      gradingService.addGrade(`g${i}_b`, s.id, 't1', 'Math', 8);
      attendanceService.markAttendance(`a${i}_1`, s.id, true);
      attendanceService.markAttendance(`a${i}_2`, s.id, false, 'Sick');
    });

    students.forEach(s => {
      const avg = gradingService.calculateFinalGrade(s.id, 'Math');
      expect(avg).toBe(9);
      const stats = attendanceService.getAttendanceStats(s.id);
      expect(stats.attendanceRate).toBe(50);
    });

    expect(notified.length).toBe(10); // 5 students × 2 grades each
  });

  it('should persist multiple homework tasks and allow retrieval by subject', () => {
    const tasks = [
      { id: 'h1', sub: 'Math', desc: 'Chapter 5 exercises' },
      { id: 'h2', sub: 'Math', desc: 'Chapter 6 exercises' },
      { id: 'h3', sub: 'Physics', desc: 'Mechanics problems' },
    ];
    tasks.forEach(t => homeworkService.addHomework(t.id, 't1', t.sub, t.desc, new Date()));
    expect(homeworkService.getHomeworkBySubject('Math').length).toBe(2);
    expect(homeworkService.getHomeworkBySubject('Physics').length).toBe(1);
  });

  it('should correctly use generated bulk grade data', () => {
    const grades = generateGrades(50);
    grades.forEach(g => gradingService.addGrade(g.id, g.studentId, g.teacherId, g.subject, g.value));
    const s0Grades = gradingService.getStudentGrades('student_0');
    expect(s0Grades.length).toBeGreaterThan(0);
  });

  it('should correctly use generated bulk attendance data', () => {
    const records = generateAttendanceRecords(30);
    records.forEach(r => attendanceService.markAttendance(r.id, r.studentId, r.isPresent, r.reason));
    const stats = attendanceService.getAttendanceStats('student_0');
    expect(stats.total).toBeGreaterThan(0);
  });

  it('observer can be unsubscribed and not receive further notifications', () => {
    const cb = jest.fn();
    observer.subscribe(cb);
    gradingService.addGrade('g1', 's1', 't1', 'Math', 9);
    observer.unsubscribe(cb);
    gradingService.addGrade('g2', 's1', 't1', 'Math', 11);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  const scenarioCombinations = [
    ['student_0', 'Math', [5, 7, 9], 7],
    ['student_1', 'Physics', [12, 12, 12], 12],
    ['student_2', 'History', [1, 1, 1], 1],
    ['student_3', 'English', [6, 8], 7],
    ['student_4', 'Programming', [10, 11, 12], 11],
  ];

  it.each(scenarioCombinations)(
    'Integration: %s in %s with grades %j should average to %s',
    (studentId, subject, gradeVals, expectedAvg) => {
      gradeVals.forEach((val, i) => {
        gradingService.addGrade(`g_${studentId}_${subject}_${i}`, studentId, 't1', subject, val);
      });
      expect(gradingService.calculateFinalGrade(studentId, subject)).toBe(expectedAvg);
    }
  );
});

// ---------------------------------------------------------------------------
// Parameterized boundary tests: grade values 1-12 for 5 subjects × 5 students
// These cover input validation boundaries and edge cases at scale.
// ---------------------------------------------------------------------------
describe('Boundary: grade value range tests per student and subject', () => {
  const gradeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const students = ['bnd_s1', 'bnd_s2', 'bnd_s3', 'bnd_s4', 'bnd_s5'];

  students.forEach(studentId => {
    it.each(gradeValues)(`GradingService: student ${studentId} should store grade value %s`, (val) => {
      const repo = new InMemoryRepository();
      const observer = new NotificationObserver();
      const service = new GradingService(repo, null, observer);
      service.addGrade(`g_${studentId}_${val}`, studentId, 't1', 'Math', val);
      const stored = service.getStudentGrades(studentId);
      expect(stored.length).toBe(1);
      expect(stored[0].value).toBe(val);
    });
  });
});

// ---------------------------------------------------------------------------
// Parameterized boundary tests: attendance rate calculation for 10 scenarios
// ---------------------------------------------------------------------------
describe('Boundary: attendance rate edge cases', () => {
  const attendanceScenarios = [
    ['edge_s1', [true],                                          100],
    ['edge_s2', [false],                                           0],
    ['edge_s3', [true, true, true, true, true],                  100],
    ['edge_s4', [false, false, false, false, false],               0],
    ['edge_s5', [true, false],                                    50],
    ['edge_s6', [true, true, false],                              67],
    ['edge_s7', [true, false, false],                             33],
    ['edge_s8', [true, true, true, false],                        75],
    ['edge_s9', [true, false, false, false],                      25],
    ['edge_s10',[true, true, false, false, false, false, false],  29],
  ];

  it.each(attendanceScenarios)(
    'student %s with pattern %j should have %s%% attendance',
    (studentId, pattern, expectedRate) => {
      const repo = new InMemoryRepository();
      const service = new AttendanceService(repo);
      pattern.forEach((isPresent, i) => {
        service.markAttendance(`att_${studentId}_${i}`, studentId, isPresent);
      });
      expect(service.getAttendanceStats(studentId).attendanceRate).toBe(expectedRate);
    }
  );
});
