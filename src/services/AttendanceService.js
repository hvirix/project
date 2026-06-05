const Attendance = require('../models/Attendance');

class AttendanceService {
  constructor(attendanceRepository) {
    this.attendanceRepository = attendanceRepository;
  }

  markAttendance(id, studentId, isPresent, reason = null) {
    const attendance = new Attendance(id, studentId, new Date(), isPresent, reason);
    return this.attendanceRepository.save(attendance);
  }

  getStudentAttendance(studentId) {
    return this.attendanceRepository.findBy(a => a.studentId === studentId);
  }

  getAttendanceStats(studentId) {
    const records = this.getStudentAttendance(studentId);
    const total = records.length;
    const present = records.filter(a => a.isPresent).length;
    return {
      total,
      present,
      absent: total - present,
      attendanceRate: total === 0 ? 100 : Math.round((present / total) * 100)
    };
  }
}

module.exports = AttendanceService;
