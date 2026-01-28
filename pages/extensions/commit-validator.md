---
title: "Commit Validator Extension"
description: "Validate git commits against conventional commit format before version bumps. Python extension with configurable allowed types and scope requirements"
head:
  - - meta
    - name: keywords
      content: sley, commit validator, conventional commits, validation, pre-bump hook, commit format, Python extension
---

# {{ $frontmatter.title }}

This extension validates that git commits follow the conventional commit format before version bumps. It ensures code quality and consistency in commit messages, especially useful with the `bump auto` command.

<ExtensionMeta hook="pre-bump" language="Python" version="1.0.0" repo="https://github.com/indaco/sley/tree/main/contrib/extensions/commit-validator" />

## Features

- Validates commits since last tag against conventional commit format
- Configurable allowed commit types
- Optional scope requirement
- Detailed error reporting for invalid commits
- Uses only Python standard library (no external dependencies)

## Requirements

- Python 3.6 or higher
- Git installed and available in PATH
- Initialized git repository with commits

## Installation

Install directly from the sley repository:

```bash
sley extension install --url github.com/indaco/sley/contrib/extensions/commit-validator
```

Or from a local clone:

```bash
sley extension install --path ./contrib/extensions/commit-validator
```

## Usage

Once installed and enabled, the extension runs automatically before version bumps:

```bash
sley bump patch
# Validates all commits since last tag before bumping
```

## Configuration

Add configuration to your `.sley.yaml`:

### Basic Configuration (Default)

Uses standard conventional commit types:

```yaml
extensions:
  - name: commit-validator
    enabled: true
    hooks:
      - pre-bump
```

Default allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Advanced Configuration

Customize allowed types and require scope:

```yaml
extensions:
  - name: commit-validator
    enabled: true
    hooks:
      - pre-bump
    config:
      allowed_types:
        - feat
        - fix
        - docs
        - chore
      require_scope: true # Require scope in all commits
```

### Configuration Options

| Option          | Type  | Default                       | Description                      |
| --------------- | ----- | ----------------------------- | -------------------------------- |
| `allowed_types` | array | All conventional commit types | List of allowed commit types     |
| `require_scope` | bool  | false                         | Require scope in commit messages |

## Conventional Commit Format

Valid commit message formats:

```text
type: description
type(scope): description
```

Examples:

```text
feat: add user authentication
fix(api): resolve null pointer exception
docs: update installation instructions
chore(deps): upgrade dependencies
```

### Commit Types

Standard conventional commit types:

| Type       | Description              |
| ---------- | ------------------------ |
| `feat`     | New feature              |
| `fix`      | Bug fix                  |
| `docs`     | Documentation changes    |
| `style`    | Code style changes       |
| `refactor` | Code refactoring         |
| `perf`     | Performance improvements |
| `test`     | Adding or updating tests |
| `build`    | Build system changes     |
| `ci`       | CI/CD changes            |
| `chore`    | Maintenance tasks        |
| `revert`   | Reverting changes        |

## Examples

### Strict Validation

Only allow feature and fix commits:

```yaml
config:
  allowed_types:
    - feat
    - fix
```

### Require Scopes

Enforce scoped commits:

```yaml
config:
  require_scope: true
```

Valid:

```text
feat(auth): add login endpoint
fix(ui): resolve button alignment
```

Invalid:

```text
feat: add login endpoint  # Missing scope
```

## Error Handling

The extension provides detailed error messages for invalid commits:

```text
Found 2 invalid commit(s):
  - Add new feature -> must match format 'type: description' or 'type(scope): description'
  - feat(users add endpoint -> must match format 'type: description' or 'type(scope): description'
```

## Validation Behavior

### Commits Checked

The extension validates commits between:

- Last git tag and HEAD (if tags exist)
- All commits (if no tags exist)

### Validation Skipped

No validation occurs when:

- No commits exist in the repository
- Repository is at the same commit as the last tag

### Validation Failure

The extension fails (blocks the bump) if:

- Any commit doesn't match conventional commit format
- Commit type is not in allowed types
- Scope is missing when required

## Integration with `bump auto`

This extension pairs well with the built-in `commit-parser` plugin:

```yaml
# .sley.yaml
plugins:
  commit-parser: true

extensions:
  - name: commit-validator
    enabled: true
    hooks:
      - pre-bump
    config:
      allowed_types:
        - feat
        - fix
        - docs
```

Workflow:

1. Commit validator ensures all commits are properly formatted
2. Commit parser analyzes commits to determine bump type
3. Version is bumped automatically based on commit types

## Troubleshooting

| Issue                            | Solution                                           |
| -------------------------------- | -------------------------------------------------- |
| "Failed to retrieve git commits" | Ensure you are in a git repository (`git status`)  |
| "No commits to validate"         | Normal when HEAD is at a tagged commit             |
| Commits not matching             | Check format: lowercase type, colon+space required |

## See Also

- [Commit Parser Plugin](/plugins/commit-parser) - Parse conventional commits for bump type
- [Extension System](/extensions/) - Creating custom extensions
- [Release Gate Plugin](/plugins/release-gate) - Pre-bump quality gates
- [CI/CD Integration](/guide/ci-cd) - Enforce commit format in pipelines
- [Usage Guide](/guide/usage#smart-bump-logic-bump-auto) - Using bump auto with validated commits
- [Troubleshooting](/guide/troubleshooting/) - Common validation issues
