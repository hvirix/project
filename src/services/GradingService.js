const Grade = require('../models/Grade');

class GradingService {
  constructor(gradeRepository, gradingStrategy, notificationObserver) {
    this.gradeRepository = gradeRepository;
    this.gradingStrategy = gradingStrategy;
    this.notificationObserver = notificationObserver;
  }

  setGradingStrategy(strategy) {
    this.gradingStrategy = strategy;
  }

  addGrade(id, studentId, teacherId, subject, value) {
    const grade = new Grade(id, studentId, teacherId, subject, value);
    this.gradeRepository.save(grade);
    
    if (this.notificationObserver) {
      this.notificationObserver.notify({
        type: 'NEW_GRADE',
        studentId,
        subject,
        value
      });
    }
    
    return grade;
  }

  getStudentGrades(studentId, subject = null) {
    let grades = this.gradeRepository.findBy(g => g.studentId === studentId);
    if (subject) {
      grades = grades.filter(g => g.subject === subject);
    }
    return grades;
  }

  calculateFinalGrade(studentId, subject = null) {
    const grades = this.getStudentGrades(studentId, subject);
    if (!this.gradingStrategy) {
      throw new Error('Grading strategy not set');
    }
    return this.gradingStrategy.calculateFinalGrade(grades);
  }
}

module.exports = GradingService;
