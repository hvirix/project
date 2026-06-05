# 📓 Електронний журнал (Electronic Journal)

[![CI Pipeline](https://github.com/hvirix/project/actions/workflows/ci.yml/badge.svg)](https://github.com/hvirix/project/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hvirix_project&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hvirix_project)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=hvirix_project&metric=coverage)](https://sonarcloud.io/summary/new_code?id=hvirix_project)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=hvirix_project&metric=bugs)](https://sonarcloud.io/summary/new_code?id=hvirix_project)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=hvirix_project&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=hvirix_project)
![Tests](https://img.shields.io/badge/tests-253-brightgreen)
![Node.js](https://img.shields.io/badge/node-v18%2B-blue)

---

## 📌 Про проєкт

Система **електронного журналу** для навчального закладу (школа/університет). Ведення оцінок, домашніх завдань та відвідуваності студентів без використання зовнішніх баз даних (повністю In-Memory архітектура).

---

## 🏗️ Архітектура

Проєкт розподілено на чіткі шари згідно принципів SOLID:

src/
├── models/          # Сутності: Student, Teacher, Grade, Attendance, Homework
├── services/        # Бізнес-логіка (GradingService, AttendanceService, HomeworkService)
│   ├── NotificationObserver.js   # Патерн Observer
│   └── gradingStrategies.js      # Патерн Strategy
├── storage/         # InMemoryRepository (єдиний шар даних)
└── utils/           # Допоміжні утиліти (generateData.js для тестів)


---

## 🎨 GoF Патерни

### 🔄 Strategy (Стратегія)
`src/services/gradingStrategies.js` — Два алгоритми підрахунку підсумкового балу, які можна змінювати без зміни основного коду сервісу:
- **StandardGradingStrategy** — 12-бальна система
- **CreditModuleGradingStrategy** — 100-бальна кредитно-модульна система

### 👁️ Observer (Спостерігач)
`src/services/NotificationObserver.js` — Сповіщення підписників про події (нова оцінка, нове домашнє завдання).

---

## 🧪 Тестування

| Метрика       | Значення |
|---------------|----------|
| **Тестів** | ✅ 351    |
| **Statements**| ✅ 98.37% |
| **Functions** | ✅ 96.15% |
| **Lines** | ✅ 99.05% |
| **Branches** | ✅ 93.33% |

### Запуск тестів
```bash
npm install
npm test
Звіти генеруються автоматично у папці coverage/:

coverage/lcov-report/index.html — HTML-звіт для розробника (відкрийте у браузері)

coverage/lcov.info — LCOV звіт для SonarQube

coverage/junit.xml — JUnit XML звіт про результати тестів

coverage/cobertura-coverage.xml — XML звіт про покриття

🚀 CI/CD та DevOps
Пайплайн GitHub Actions (.github/workflows/ci.yml) при кожному коміті:

✅ Встановлює залежності

✅ Запускає 351 тест та генерує coverage звіти

✅ Зберігає HTML-звіт як CI Artifact (завантаження через GitHub Actions UI)

✅ Зберігає XML звіти (lcov.info, junit.xml, cobertura) як CI Artifact

✅ Відправляє результати в SonarCloud для перевірки Quality Gate

SonarQube Quality Gate
Coverage: >70% (фактично >93%)

Bugs: 0

Vulnerabilities: 0

Code Smells: рівень A

🤖 AI-Driven Setup
Репозиторій налаштовано для роботи з ШІ-агентами (Cursor, Copilot, Claude):

.cursorrules — Глобальні правила: заборона БД, обов'язковий TDD, In-Memory only

.cursor/rules/architecture.md — Правила архітектури та SOLID

.cursor/rules/testing_strategy.md — Правила генерації тестів (Jest, >70% coverage)

📁 Структура репозиторію
|-- src/
|   |-- models/           # Student, Teacher, Grade, Attendance, Homework
|   |-- services/         # GradingService, AttendanceService, HomeworkService
|   |                       NotificationObserver (Observer), gradingStrategies (Strategy)
|   |-- storage/          # InMemoryRepository
|   |-- utils/            # generateData.js
|-- tests/
|   |-- models.test.js    # Тести моделей (200+ параметризованих)
|   |-- storage.test.js   # Тести репозиторію (50+ edge cases)
|   |-- services.test.js  # Тести сервісів (60+ комбінацій)
|   |-- integration.test.js # Інтеграційні тести повного workflow
|-- docs/
|   |-- diagrams/         # UML: Use Case, Domain Model, Class Diagram
|-- .cursor/rules/        # AI Rules: architecture.md, testing_strategy.md
|-- .github/workflows/    # ci.yml (GitHub Actions CI/CD Pipeline)
|-- .cursorrules          # Глобальні правила для AI-агентів
|-- .gitignore
|-- Dockerfile            # Ізольований запуск тестів у контейнері
|-- jest.config.js        # Jest + Coverage + JUnit reporter
|-- sonar-project.properties # SonarCloud конфігурація
|-- README.md
🐳 Docker (ізольований запуск)
Bash
docker build -t electronic-journal .
docker run --rm electronic-journal
⚙️ Швидкий старт
Bash
git clone [https://github.com/hvirix/project.git](https://github.com/hvirix/project.git)
cd electronic-journal
npm install
npm test
# Відкрийте coverage/lcov-report/index.html у браузері для перегляду покриття