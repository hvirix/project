const GradingService = require('../src/services/GradingService');
const AttendanceService = require('../src/services/AttendanceService');
const HomeworkService = require('../src/services/HomeworkService');
const { StandardGradingStrategy, CreditModuleGradingStrategy } = require('../src/services/gradingStrategies');
const InMemoryRepository = require('../src/storage/InMemoryRepository');
const NotificationObserver = require('../src/services/NotificationObserver');

// ---------------------------------------------------------------------------
// GradingStrategy unit tests
// ---------------------------------------------------------------------------
describe('StandardGradingStrategy', () => {
  const strategy = new StandardGradingStrategy();

  it('should return 0 for null grades', () => {
    expect(strategy.calculateFinalGrade(null)).toBe(0);
  });

  it('should return 0 for empty array', () => {
    expect(strategy.calculateFinalGrade([])).toBe(0);
  });

  it('should return 0 for undefined grades', () => {
    expect(strategy.calculateFinalGrade(undefined)).toBe(0);
  });

  const cases = [
    [[{ value: 10 }, { value: 10 }, { value: 10 }], 10],
    [[{ value: 1 }, { value: 12 }], 7],
    [[{ value: 8 }, { value: 9 }, { value: 10 }], 9],
    [[{ value: 12 }], 12],
    [[{ value: 1 }], 1],
    [[{ value: 6 }, { value: 7 }], 7],
    [[{ value: 5 }, { value: 5 }, { value: 6 }], 5],
  ];

  it.each(cases)('should calculate average for grades %j → %s', (grades, expected) => {
    expect(strategy.calculateFinalGrade(grades)).toBe(expected);
  });
});

describe('CreditModuleGradingStrategy', () => {
  const strategy = new CreditModuleGradingStrategy();

  it('should return 0 for null grades', () => {
    expect(strategy.calculateFinalGrade(null)).toBe(0);
  });

  it('should return 0 for empty array', () => {
    expect(strategy.calculateFinalGrade([])).toBe(0);
  });

  it('should return 0 for undefined grades', () => {
    expect(strategy.calculateFinalGrade(undefined)).toBe(0);
  });

  const cases = [
    [[{ value: 90 }, { value: 80 }], 85],
    [[{ value: 100 }, { value: 100 }], 100],
    [[{ value: 50 }, { value: 70 }, { value: 90 }], 70],
    [[{ value: 60 }], 60],
  ];

  it.each(cases)('should calculate average for grades %j → %s', (grades, expected) => {
    expect(strategy.calculateFinalGrade(grades)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// GradingService
// ---------------------------------------------------------------------------
describe('GradingService', () => {
  let gradeRepo, observer, service;

  beforeEach(() => {
    gradeRepo = new InMemoryRepository();
    observer = new NotificationObserver();
    service = new GradingService(gradeRepo, new StandardGradingStrategy(), observer);
  });

  it('should add a grade and return it', () => {
    const grade = service.addGrade('g1', 's1', 't1', 'Math', 10);
    expect(grade.value).toBe(10);
    expect(grade.subject).toBe('Math');
  });

  it('should notify observer when a grade is added', () => {
    const cb = jest.fn();
    observer.subscribe(cb);
    service.addGrade('g1', 's1', 't1', 'Math', 10);
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: 'NEW_GRADE', studentId: 's1' }));
  });

  it('should NOT throw when notificationObserver is absent', () => {
    const serviceNoObserver = new GradingService(gradeRepo, new StandardGradingStrategy(), null);
    expect(() => serviceNoObserver.addGrade('g1', 's1', 't1', 'Math', 10)).not.toThrow();
  });

  it('should not notify after observer is unsubscribed', () => {
    const cb = jest.fn();
    observer.subscribe(cb);
    service.addGrade('g1', 's1', 't1', 'Math', 10);
    observer.unsubscribe(cb);
    service.addGrade('g2', 's1', 't1', 'Math', 12);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should get all grades for a student', () => {
    service.addGrade('g1', 's1', 't1', 'Math', 10);
    service.addGrade('g2', 's1', 't1', 'Physics', 8);
    expect(service.getStudentGrades('s1').length).toBe(2);
  });

  it('should filter grades by subject', () => {
    service.addGrade('g1', 's1', 't1', 'Math', 10);
    service.addGrade('g2', 's1', 't1', 'Physics', 8);
    expect(service.getStudentGrades('s1', 'Math').length).toBe(1);
    expect(service.getStudentGrades('s1', 'Physics').length).toBe(1);
  });

  it('should return all grades when subject is null', () => {
    service.addGrade('g1', 's1', 't1', 'Math', 10);
    service.addGrade('g2', 's1', 't1', 'Physics', 8);
    expect(service.getStudentGrades('s1', null).length).toBe(2);
  });

  it('should calculate final grade correctly', () => {
    service.addGrade('g1', 's1', 't1', 'Math', 10);
    service.addGrade('g2', 's1', 't1', 'Math', 12);
    expect(service.calculateFinalGrade('s1', 'Math')).toBe(11);
  });

  it('should throw when strategy is not set', () => {
    service.setGradingStrategy(null);
    expect(() => service.calculateFinalGrade('s1')).toThrow('Grading strategy not set');
  });

  it('should switch strategy via setGradingStrategy', () => {
    service.addGrade('g1', 's1', 't1', 'Math', 80);
    service.setGradingStrategy(new CreditModuleGradingStrategy());
    expect(service.calculateFinalGrade('s1')).toBe(80);
  });
});

// ---------------------------------------------------------------------------
// AttendanceService
// ---------------------------------------------------------------------------
describe('AttendanceService', () => {
  let repo, service;

  beforeEach(() => {
    repo = new InMemoryRepository();
    service = new AttendanceService(repo);
  });

  it('should mark attendance as present', () => {
    const record = service.markAttendance('a1', 's1', true);
    expect(record.isPresent).toBe(true);
  });

  it('should mark attendance as absent with reason', () => {
    const record = service.markAttendance('a1', 's1', false, 'Sick');
    expect(record.isPresent).toBe(false);
    expect(record.reason).toBe('Sick');
  });

  it('should return 100% rate when no records exist', () => {
    const stats = service.getAttendanceStats('unknown');
    expect(stats.attendanceRate).toBe(100);
    expect(stats.total).toBe(0);
  });

  it('should calculate attendance rate correctly when records exist', () => {
    service.markAttendance('a1', 's1', true);
    service.markAttendance('a2', 's1', true);
    service.markAttendance('a3', 's1', false);
    service.markAttendance('a4', 's1', false);
    const stats = service.getAttendanceStats('s1');
    expect(stats.total).toBe(4);
    expect(stats.present).toBe(2);
    expect(stats.absent).toBe(2);
    expect(stats.attendanceRate).toBe(50);
  });

  it('should return 100% when all records are present', () => {
    service.markAttendance('a1', 's2', true);
    service.markAttendance('a2', 's2', true);
    const stats = service.getAttendanceStats('s2');
    expect(stats.attendanceRate).toBe(100);
  });

  it('should return 0% when all records are absent', () => {
    service.markAttendance('a1', 's3', false);
    service.markAttendance('a2', 's3', false);
    const stats = service.getAttendanceStats('s3');
    expect(stats.attendanceRate).toBe(0);
  });

  it('should only return records for the requested student', () => {
    service.markAttendance('a1', 's1', true);
    service.markAttendance('a2', 's2', false);
    const s1Records = service.getStudentAttendance('s1');
    expect(s1Records.length).toBe(1);
    expect(s1Records[0].studentId).toBe('s1');
  });

  const studentAttendanceCombinations = [
    ['s10', [true, true, false], 67],
    ['s11', [true, false, false], 33],
    ['s12', [true, true, true], 100],
    ['s13', [false, false, false], 0],
    ['s14', [true], 100],
  ];

  it.each(studentAttendanceCombinations)(
    'student %s with presence pattern %j should have rate %s%%',
    (studentId, presences, expectedRate) => {
      presences.forEach((isPresent, i) => {
        service.markAttendance(`a_${studentId}_${i}`, studentId, isPresent);
      });
      expect(service.getAttendanceStats(studentId).attendanceRate).toBe(expectedRate);
    }
  );
});

// ---------------------------------------------------------------------------
// NotificationObserver
// ---------------------------------------------------------------------------
describe('NotificationObserver', () => {
  let observer;

  beforeEach(() => {
    observer = new NotificationObserver();
  });

  it('should call all subscribers when notified', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    observer.subscribe(cb1);
    observer.subscribe(cb2);
    observer.notify({ type: 'TEST' });
    expect(cb1).toHaveBeenCalledWith({ type: 'TEST' });
    expect(cb2).toHaveBeenCalledWith({ type: 'TEST' });
  });

  it('should not call unsubscribed callback', () => {
    const cb = jest.fn();
    observer.subscribe(cb);
    observer.unsubscribe(cb);
    observer.notify({ type: 'TEST' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('should handle notify with no subscribers', () => {
    expect(() => observer.notify({ type: 'TEST' })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// HomeworkService
// ---------------------------------------------------------------------------
describe('HomeworkService', () => {
  let repo, observer, service;

  beforeEach(() => {
    repo = new InMemoryRepository();
    observer = new NotificationObserver();
    service = new HomeworkService(repo, observer);
  });

  it('should add homework and notify observer', () => {
    const cb = jest.fn();
    observer.subscribe(cb);
    service.addHomework('h1', 't1', 'Math', 'Task 1', new Date());
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: 'NEW_HOMEWORK' }));
  });

  it('should throw when description is empty', () => {
    expect(() => service.addHomework('h1', 't1', 'Math', '', new Date())).toThrow();
  });

  it('should throw when description is whitespace only', () => {
    expect(() => service.addHomework('h1', 't1', 'Math', '   ', new Date())).toThrow();
  });

  it('should throw when subject is empty', () => {
    expect(() => service.addHomework('h1', 't1', '', 'Task', new Date())).toThrow();
  });

  it('should retrieve homework by subject', () => {
    service.addHomework('h1', 't1', 'Math', 'Task A', new Date());
    service.addHomework('h2', 't1', 'Physics', 'Task B', new Date());
    expect(service.getHomeworkBySubject('Math').length).toBe(1);
    expect(service.getHomeworkBySubject('Biology').length).toBe(0);
  });

  it('should retrieve homework by teacher', () => {
    service.addHomework('h1', 't1', 'Math', 'Task A', new Date());
    service.addHomework('h2', 't2', 'Math', 'Task B', new Date());
    expect(service.getHomeworkByTeacher('t1').length).toBe(1);
  });

  it('should return overdue homework', () => {
    const past = new Date(Date.now() - 86400000);
    const future = new Date(Date.now() + 86400000);
    service.addHomework('h1', 't1', 'Math', 'Old task', past);
    service.addHomework('h2', 't1', 'Math', 'New task', future);
    expect(service.getOverdueHomework().length).toBe(1);
  });

  it('should delete homework', () => {
    service.addHomework('h1', 't1', 'Math', 'Task', new Date());
    service.deleteHomework('h1');
    expect(service.getHomeworkBySubject('Math').length).toBe(0);
  });

  it('should work without notificationObserver', () => {
    const serviceNoObserver = new HomeworkService(repo, null);
    expect(() => serviceNoObserver.addHomework('h1', 't1', 'Math', 'Task', new Date())).not.toThrow();
  });
});
