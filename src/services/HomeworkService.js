const Homework = require('../models/Homework');

class HomeworkService {
  constructor(homeworkRepository, notificationObserver) {
    this.homeworkRepository = homeworkRepository;
    this.notificationObserver = notificationObserver;
  }

  addHomework(id, teacherId, subject, description, dueDate) {
    if (!description || description.trim() === '') {
      throw new Error('Homework description cannot be empty');
    }
    if (!subject || subject.trim() === '') {
      throw new Error('Subject cannot be empty');
    }
    const hw = new Homework(id, teacherId, subject, description, dueDate);
    this.homeworkRepository.save(hw);

    if (this.notificationObserver) {
      this.notificationObserver.notify({
        type: 'NEW_HOMEWORK',
        teacherId,
        subject,
        description,
        dueDate
      });
    }

    return hw;
  }

  getHomeworkBySubject(subject) {
    return this.homeworkRepository.findBy(hw => hw.subject === subject);
  }

  getHomeworkByTeacher(teacherId) {
    return this.homeworkRepository.findBy(hw => hw.teacherId === teacherId);
  }

  getOverdueHomework() {
    const now = new Date();
    return this.homeworkRepository.findBy(hw => hw.dueDate && new Date(hw.dueDate) < now);
  }

  deleteHomework(id) {
    return this.homeworkRepository.deleteById(id);
  }
}

module.exports = HomeworkService;
