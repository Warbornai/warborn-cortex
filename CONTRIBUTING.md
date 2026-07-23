# Contributing Guidelines

Thank you for contributing to Warborn Technologies!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Warbornai/<REPO_NAME>.git
   cd <REPO_NAME>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```

## Branch Naming Conventions

Follow standard branch prefixes:
- `feature/<short-description>` for new features
- `fix/<short-description>` for bug fixes
- `docs/<short-description>` for documentation updates
- `chore/<short-description>` for maintenance and tool setup

## Commit Conventions

We follow the Conventional Commits specification (`<type>(<scope>): <description>`):
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style and formatting updates
- `refactor:` Code restructuring without behavioral changes
- `test:` Adding or updating tests
- `chore:` Maintenance and build updates

## Pull Request Process

1. Create a descriptive PR title using Conventional Commits.
2. Link any related issues in the PR description.
3. Ensure all CI status checks pass.
4. Receive approval from at least one core maintainer before merging.

## Code Style & Standards

- Formatting is automatically enforced via Prettier.
- ESLint checks must pass with zero errors.
- Ensure proper TypeScript types across all exports.
