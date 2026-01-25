---
title: "Contributing"
description: "Learn how to contribute to sley - development setup, commit conventions, pull request process, and community guidelines for contributors"
head:
  - - meta
    - name: keywords
      content: sley, contributing, contribute, development, pull request, open source, community, conventional commits
---

# {{ $frontmatter.title }}

Contributions are welcome! Here's how you can help improve sley.

::: tip Full Development Guide
For detailed development environment setup, including Devbox configuration, required tools, and Git hooks, see the [CONTRIBUTING.md](https://github.com/indaco/sley/blob/main/CONTRIBUTING.md) file in the main repository.
:::

## Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see [CONTRIBUTING.md](https://github.com/indaco/sley/blob/main/CONTRIBUTING.md))

```bash
git clone https://github.com/YOUR_USERNAME/sley.git
cd sley
```

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```text
type(scope): description
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Pull Requests

When submitting a pull request:

1. Ensure all checks pass (`just check`)
2. Add tests for new features
3. Update documentation if needed

The repository includes a [PR template](https://github.com/indaco/sley/blob/main/.github/PULL_REQUEST_TEMPLATE.md) that will guide you through the submission process.

## Reporting Issues

Use the appropriate issue template when reporting:

- [Bug Report](https://github.com/indaco/sley/issues/new?template=bug_report.yml) - Something isn't working as expected
- [Feature Request](https://github.com/indaco/sley/issues/new?template=feature_request.yml) - Suggest a new feature or enhancement
- [Question](https://github.com/indaco/sley/issues/new?template=question.yml) - Ask a question about sley

The templates will guide you through providing all the necessary information.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to make sley better!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, use the [Question template](https://github.com/indaco/sley/issues/new?template=question.yml) to open an issue.

Thank you for contributing to sley!
