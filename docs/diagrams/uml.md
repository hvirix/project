# UML Diagrams — Electronic Journal

## Use Case Diagram

```
+---------------------------------------------+
|          Electronic Journal System          |
|                                             |
|  Teacher                                    |
|    - Add Grade                              |
|    - Add Homework                           |
|    - Mark Attendance                        |
|    - View Class Report                      |
|    - View Student Progress                  |
|                                             |
|  Student                                    |
|    - View Own Grades                        |
|    - View Homework                          |
|    - View Attendance Statistics             |
+---------------------------------------------+
```

## Domain Model

```
Student
  id: string
  name: string
  group: string

Teacher
  id: string
  name: string
  subject: string

Grade
  id: string
  studentId: string
  teacherId: string
  subject: string
  value: number
  date: Date

Attendance
  id: string
  studentId: string
  date: Date
  isPresent: boolean
  reason: string | null

Homework
  id: string
  teacherId: string
  subject: string
  description: string
  dueDate: Date
```

## Class Diagram

```
+---------------------------+
|    InMemoryRepository     |
+---------------------------+
| - data: Map               |
+---------------------------+
| + save(item)              |
| + findById(id)            |
| + findAll()               |
| + deleteById(id)          |
| + findBy(predicate)       |
+---------------------------+
            ^
            | injected into
            |
+---------------------------+       uses Strategy        +-----------------------------+
|      GradingService       | --------------------------> |   GradingStrategy           |
+---------------------------+                             |   (interface / contract)    |
| - gradeRepository         |                             +-----------------------------+
| - gradingStrategy         |                             | + calculateFinalGrade()     |
| - notificationObserver    |                             +-----------------------------+
+---------------------------+                                  ^              ^
| + addGrade()              |              StandardGrading-----+              +-----CreditModule
| + getStudentGrades()      |              Strategy                            GradingStrategy
| + calculateFinalGrade()   |
| + setGradingStrategy()    |
+---------------------------+
            |
            | notifies
            v
+---------------------------+
|   NotificationObserver    |    Observer Pattern
+---------------------------+
| - subscribers: Function[] |
+---------------------------+
| + subscribe(callback)     |
| + unsubscribe(callback)   |
| + notify(event)           |
+---------------------------+

+---------------------------+       +---------------------------+
|    AttendanceService      |       |     HomeworkService       |
+---------------------------+       +---------------------------+
| - attendanceRepository    |       | - homeworkRepository      |
+---------------------------+       | - notificationObserver    |
| + markAttendance()        |       +---------------------------+
| + getStudentAttendance()  |       | + addHomework()           |
| + getAttendanceStats()    |       | + getHomeworkBySubject()  |
+---------------------------+       | + getHomeworkByTeacher()  |
                                    | + getOverdueHomework()    |
                                    | + deleteHomework()        |
                                    +---------------------------+
```
