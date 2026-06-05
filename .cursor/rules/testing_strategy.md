# Testing Strategy

## Framework

Jest is used as the primary testing framework. It provides built-in coverage reporting, mocking utilities, and parameterized test support.

## Coverage Requirements

- Minimum threshold: 70% across all metrics (branches, functions, lines, statements).
- Target: As close to 100% as possible, given the fully in-memory nature of the codebase.
- Coverage is enforced via `coverageThreshold` in `jest.config.js` and will cause the CI build to fail if not met.

## Test Organization

- `tests/models.test.js` — Unit tests for all model constructors and property assignments.
- `tests/storage.test.js` — Unit tests for `InMemoryRepository` including edge cases (missing id, delete, findBy).
- `tests/services.test.js` — Unit and integration tests for all services and GoF patterns.
- `tests/integration.test.js` — End-to-end workflow tests using generated bulk data.

## Parameterization

Use `jest.each` and `describe.each` to generate multiple test cases from data arrays. This keeps test files concise while achieving broad input coverage.

## Mocking

Use `jest.fn()` for observer callbacks and any injectable dependency that needs to be verified for call counts or arguments.

## Coverage Reports

Jest is configured to generate:
- `coverage/lcov-report/index.html` — HTML report for visual inspection.
- `coverage/lcov.info` — LCOV format for SonarQube integration.
- `coverage/junit.xml` — JUnit XML for test result tracking in CI.
- `coverage/cobertura-coverage.xml` — Cobertura XML for additional tooling support.
