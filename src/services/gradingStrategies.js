// Strategy Pattern for Grading

class StandardGradingStrategy {
  // Simple 1-12 system (Ukraine)
  calculateFinalGrade(grades) {
    if (!grades || grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return Math.round(sum / grades.length);
  }
}

class CreditModuleGradingStrategy {
  // 100-point system, where each grade might be out of 100
  calculateFinalGrade(grades) {
    if (!grades || grades.length === 0) return 0;
    // Just simple average for now
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return Math.round(sum / grades.length);
  }
}

module.exports = {
  StandardGradingStrategy,
  CreditModuleGradingStrategy
};
