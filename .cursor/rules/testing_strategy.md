# Testing Strategy Rules

- We use **Jest** as the testing framework.
- Coverage goal is **>70%** (aiming for 100% since everything is in-memory).
- Generate multiple test cases (parameterized tests) using `jest.each` to achieve at least 200 unit and integration tests across the project.
- Test coverage reports must include both HTML (for developer visual inspection) and LCOV/XML (for SonarQube integration).
- Ensure edge cases and invalid inputs are tested thoroughly.
