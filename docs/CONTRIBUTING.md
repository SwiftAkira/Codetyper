# Contributing to CodeTyper

First of all, thank you for considering contributing to CodeTyper! It's people like you that make CodeTyper such a great tool. We welcome contributions from everyone, regardless of your experience level with coding.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Workflow](#workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the [CodeTyper Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [project@example.com](mailto:project@example.com).

## Getting Started

### Issues

Before you start working on a contribution, please:

1. **Search for existing issues**: Check if someone else has already reported the problem or requested the feature.
2. **Create an issue**: If there isn't an existing issue, create one. This helps us track the work and keeps everyone informed.

### Types of Contributions

We welcome:

- **Bug fixes**: Have you found a bug? We'd love your help fixing it.
- **Feature additions**: New features that align with the project's goals.
- **Documentation improvements**: Better explanations, typo fixes, or example additions.
- **Performance improvements**: Optimizations to make CodeTyper faster or more efficient.
- **UI/UX enhancements**: Ideas to make the user experience better.

## Development Setup

### Local Development Environment

1. **Fork the repository**:
   Click the "Fork" button at the top right of the [repository page](https://github.com/yourusername/codetyper).

2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/codetyper.git
   cd codetyper
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/yourusername/codetyper.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Workflow

1. **Create a branch**:
   ```bash
   git checkout -b type/short-description
   ```
   Example: `fix/mp4-export-bug` or `feature/add-gif-export`

2. **Make your changes**:
   Write your code and add any necessary tests and documentation.

3. **Commit your changes**:
   ```bash
   git commit -m "Brief description of your changes"
   ```
   Please follow our [commit message conventions](#commit-message-conventions).

4. **Push to your fork**:
   ```bash
   git push -u origin your-branch-name
   ```

5. **Create a pull request**:
   Go to your fork on GitHub and click "New Pull Request".

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Pull Request Process

1. **Fill out the PR template**: This helps reviewers understand your changes.
2. **Link to related issues**: Add "Closes #123" or "Related to #123" in the PR description.
3. **Wait for a review**: Maintainers will review your PR and may request changes.
4. **Address feedback**: Make any requested changes and push updates to your branch.
5. **Merge**: Once approved, a maintainer will merge your PR.

### Commit Message Conventions

We follow a simplified version of the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
type: short description

Longer description if necessary
```

Types include:
- `fix:` for bug fixes
- `feat:` for new features
- `docs:` for documentation changes
- `style:` for formatting changes that don't affect code behavior
- `refactor:` for code changes that neither fix bugs nor add features
- `perf:` for performance improvements
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

## Coding Standards

### TypeScript Style Guide

We use TypeScript for its static typing benefits. Please follow these guidelines:

- Use explicit typing when function parameters or return values are not obvious
- Prefer interfaces over type aliases for object types
- Use optional parameters and properties where appropriate
- Use `const` for variables that don't change
- Use async/await instead of raw promises where possible

### CSS Style Guide

- Use TailwindCSS utility classes when possible
- For custom CSS, follow BEM (Block, Element, Modifier) naming convention
- Keep selectors as simple as possible
- Design for mobile-first, then add media queries for larger screens

## Testing

Currently, the project uses manual testing. When adding a new feature or fixing a bug, please:

1. Test your changes thoroughly
2. Verify your change works across different browsers
3. Check for responsive behavior on different screen sizes

## Documentation

Good documentation is crucial. Please update documentation when:

- Adding new features
- Changing existing functionality
- Fixing bugs that affected documented behavior

### Documentation Locations

- **In-code documentation**: Use JSDoc comments for functions and complex code segments
- **README.md**: Update for significant feature additions or changes
- **`/docs` directory**: For detailed documentation pages

## Community

Join our community channels:

- **GitHub Discussions**: For general questions and ideas
- **Discord**: For real-time chat (link coming soon)

---

Thank you for contributing to CodeTyper! Your efforts help make this project better for everyone. 