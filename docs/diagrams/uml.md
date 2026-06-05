# UML Diagrams — Electronic Journal

## Use Case Diagram

```
+--------------------------------------------+
|           Electronic Journal System        |
|                                            |
|  [Teacher]                                 |
|     |-- Add Grade                          |
|     |-- Add Homework                       |
|     |-- Mark Attendance                    |
|     |-- View Class Report                  |
|     |-- View Student Progress              |
|                                            |
|  [Student]                                 |
|     |-- View Own Grades                    |
|     |-- View Homework                      |
|     |-- View Attendance Stats              |
+--------------------------------------------+
```

## Domain Model

```
Student
  - id: string
  - name: string
  - group: string

Teacher
  - id: string
  - name: string
  - subject: string

Grade
  - id: string
  - studentId: string
  - teacherId: string
  - subject: string
  - value: number (1-12 or 0-100)
  - date: Date

Attendance
  - id: string
  - studentId: string
  - date: Date
  - isPresent: boolean
  - reason: string | null

Homework
  - id: string
  - teacherId: string
  - subject: string
  - description: string
  - dueDate: Date
```

## Class Diagram

```
+---------------------------+
|      InMemoryRepository   |
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
         | uses
         |
+------------------+      uses Strategy      +---------------------------+
|  GradingService  |------>------------------->| <<interface>> IGrading    |
+------------------+                           | Strategy                  |
| - gradeRepo      |                           +---------------------------+
| - strategy       |                           | + calculateFinalGrade()   |
| - observer       |                           +---------------------------+
+------------------+                              ^          ^
| + addGrade()     |              StandardGrading-+          +-CreditModule
| + getGrades()    |              Strategy                    GradingStrategy
| + calcFinal()    |
+------------------+
         |
         | notifies
         v
+---------------------------+
|  NotificationObserver     |  <<Observer Pattern>>
+---------------------------+
| - subscribers: []         |
+---------------------------+
| + subscribe(callback)     |
| + unsubscribe(callback)   |
| + notify(event)           |
+---------------------------+

+--------------------+         +--------------------+
| AttendanceService  |         |  HomeworkService   |
+--------------------+         +--------------------+
| - attendanceRepo   |         | - homeworkRepo     |
+--------------------+         | - observer         |
| + markAttendance() |         +--------------------+
| + getStats()       |         | + addHomework()    |
+--------------------+         | + getBySubject()   |
                               | + getOverdue()     |
                               +--------------------+
```
