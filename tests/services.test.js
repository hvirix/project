const GradingService = require('../src/services/GradingService');
const AttendanceService = require('../src/services/AttendanceService');
const { StandardGradingStrategy, CreditModuleGradingStrategy } = require('../src/services/gradingStrategies');
const InMemoryRepository = require('../src/storage/InMemoryRepository');
const NotificationObserver = require('../src/services/NotificationObserver');

describe('Services logic', () => {
  let gradingService, attendanceService, repo, observer;

  beforeEach(() => {
    repo = new InMemoryRepository();
    observer = new NotificationObserver();
    gradingService = new GradingService(repo, new StandardGradingStrategy(), observer);
    attendanceService = new AttendanceService(repo);
  });

  describe('AttendanceService', () => {
    const studentIds = ['s1', 's2', 's3', 's4', 's5'];
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Testing multiple attendance combinations
    studentIds.forEach(studentId => {
      it.each(days)(`should mark attendance day %s for student ${studentId}`, (day) => {
        const isPresent = day % 2 === 0;
        attendanceService.markAttendance(`a_${studentId}_${day}`, studentId, isPresent);
        const stats = attendanceService.getAttendanceStats(studentId);
        expect(stats.total).toBeGreaterThan(0);
      });
    });

    it('should return 100 rate if no records', () => {
      const stats = attendanceService.getAttendanceStats('unknown');
      expect(stats.attendanceRate).toBe(100);
    });
  });

  describe('GradingService & Strategies', () => {
    it('should add grade and notify observer', () => {
      const mockCallback = jest.fn();
      observer.subscribe(mockCallback);
      gradingService.addGrade('g1', 's1', 't1', 'Math', 10);
      expect(mockCallback).toHaveBeenCalled();
      
      observer.unsubscribe(mockCallback);
      gradingService.addGrade('g2', 's1', 't1', 'Math', 12);
      expect(mockCallback).toHaveBeenCalledTimes(1); // not called again
    });

    const standardGradesCombinations = [
      [[10, 10, 10], 10],
      [[1, 12], 7],
      [[8, 9, 10], 9],
      [[], 0],
      [null, 0]
    ];

    it.each(standardGradesCombinations)('Standard strategy with grades %j should return %s', (vals, expected) => {
      const strategy = new StandardGradingStrategy();
      const grades = vals ? vals.map(v => ({ value: v })) : vals;
      expect(strategy.calculateFinalGrade(grades)).toBe(expected);
    });

    it.each(standardGradesCombinations)('Credit Module strategy with grades %j should return %s', (vals, expected) => {
      const strategy = new CreditModuleGradingStrategy();
      const grades = vals ? vals.map(v => ({ value: v })) : vals;
      expect(strategy.calculateFinalGrade(grades)).toBe(expected);
    });

    it('should calculate final grade for student', () => {
      gradingService.addGrade('g1', 's1', 't1', 'Math', 10);
      gradingService.addGrade('g2', 's1', 't1', 'Math', 12);
      expect(gradingService.calculateFinalGrade('s1', 'Math')).toBe(11);
    });

    it('should throw error if no strategy', () => {
      gradingService.setGradingStrategy(null);
      expect(() => gradingService.calculateFinalGrade('s1')).toThrow();
    });
  });
});
