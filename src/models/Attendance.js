class Attendance {
  constructor(id, studentId, date, isPresent, reason) {
    this.id = id;
    this.studentId = studentId;
    this.date = date || new Date();
    this.isPresent = isPresent;
    this.reason = reason || null;
  }
}

module.exports = Attendance;
