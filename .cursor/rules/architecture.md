# Architecture Rules

- The project relies entirely on **In-Memory** architecture.
- You must create a centralized repository layer (`src/storage`) that handles all CRUD operations on objects (Students, Teachers, Grades, etc.) using Arrays/Maps/Sets.
- Business logic must reside in the `src/services` layer.
- Use **GoF Patterns**: Implement `Strategy` for different logic variants (e.g. grading system), and `Observer` for event-driven logic (e.g. notifications on new grade).
- **SOLID Principles**: Strictly follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
