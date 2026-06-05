/**
 * Utility functions for generating deterministic test data for the Electronic Journal.
 * Used in tests to produce a large volume of parameterized inputs.
 * All values are derived deterministically from the index to ensure reproducibility.
 */

const firstNames = ['Ivan', 'Maria', 'Olena', 'Petro', 'Anna', 'Dmytro', 'Oksana', 'Mykola', 'Iryna', 'Serhiy'];
const lastNames = ['Kovalenko', 'Shevchenko', 'Bondarenko', 'Savchenko', 'Kravchenko', 'Lysenko', 'Moroz', 'Bondar', 'Tkach', 'Sydorenko'];
const subjects = ['Math', 'Physics', 'History', 'Programming', 'English', 'Biology', 'Chemistry', 'Geography'];
const groups = ['Group A', 'Group B', 'Group C', 'Group D'];

/**
 * Returns a deterministic grade value (1-12) based on an index.
 * @param {number} index
 * @returns {number}
 */
function gradeFromIndex(index) {
  return (index % 12) + 1;
}

/**
 * Generates an array of student-like objects for testing.
 * @param {number} count - Number of students to generate
 * @returns {{ id: string, name: string, group: string }[]}
 */
function generateStudents(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `student_${i}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    group: groups[i % groups.length]
  }));
}

/**
 * Generates an array of teacher-like objects for testing.
 * @param {number} count - Number of teachers to generate
 * @returns {{ id: string, name: string, subject: string }[]}
 */
function generateTeachers(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `teacher_${i}`,
    name: `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
    subject: subjects[i % subjects.length]
  }));
}

/**
 * Generates a list of grade-like objects for testing.
 * Grade values cycle deterministically through 1-12 based on the index.
 * @param {number} count
 * @returns {{ id: string, studentId: string, teacherId: string, subject: string, value: number }[]}
 */
function generateGrades(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `grade_${i}`,
    studentId: `student_${i % 10}`,
    teacherId: `teacher_${i % 5}`,
    subject: subjects[i % subjects.length],
    value: gradeFromIndex(i)
  }));
}

/**
 * Generates attendance records for testing.
 * @param {number} count
 * @returns {{ id: string, studentId: string, isPresent: boolean, reason: string|null }[]}
 */
function generateAttendanceRecords(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `att_${i}`,
    studentId: `student_${i % 10}`,
    isPresent: i % 3 !== 0,
    reason: i % 3 === 0 ? 'Sick' : null
  }));
}

module.exports = {
  generateStudents,
  generateTeachers,
  generateGrades,
  generateAttendanceRecords,
  gradeFromIndex,
  subjects,
  groups
};
