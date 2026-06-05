# Architecture

## Overview

The project uses a layered In-Memory architecture with no external database or persistence layer. All data is stored in JavaScript collections during the application lifecycle.

## Layers

- **models/** — Plain data classes representing domain entities: `Student`, `Teacher`, `Grade`, `Attendance`, `Homework`.
- **storage/** — A single generic `InMemoryRepository` class that provides CRUD operations backed by a `Map`.
- **services/** — Business logic layer. Each service receives its repository and optional dependencies via constructor injection (Dependency Inversion Principle).
- **utils/** — Utility functions, primarily for generating test data sets.

## Design Patterns

- **Strategy** (`gradingStrategies.js`): Encapsulates different grading algorithms. A strategy is injected into `GradingService` and can be replaced at runtime without modifying service code.
- **Observer** (`NotificationObserver.js`): Implements a publish-subscribe mechanism. Services call `notify()` after state-changing operations. Consumers register via `subscribe()`.

## SOLID Compliance

- **Single Responsibility**: Each class has one reason to change.
- **Open/Closed**: New grading strategies can be added without modifying `GradingService`.
- **Liskov Substitution**: Strategy implementations are interchangeable.
- **Interface Segregation**: Services expose only the methods relevant to their domain.
- **Dependency Inversion**: Services depend on injected abstractions, not on concrete repository or strategy classes.
