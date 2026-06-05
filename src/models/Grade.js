class Grade {
  constructor(id, studentId, teacherId, subject, value, date) {
    this.id = id;
    this.studentId = studentId;
    this.teacherId = teacherId;
    this.subject = subject;
    this.value = value;
    this.date = date || new Date();
  }
}

module.exports = Grade;
