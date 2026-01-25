---
title: "Release Gate Plugin"
description: "Enforce quality gates before version bumps with clean worktree checks, branch constraints, and WIP commit detection for release safety"
head:
  - - meta
    - name: keywords
      content: sley, release gate, quality gates, validation, branch constraints, clean worktree, WIP detection, release safety
---

# {{ $frontmatter.title }}

The release gate plugin enforces quality gates before allowing version bumps. It validates conditions like clean git state, branch constraints, and commit hygiene to ensure releases meet quality standards.

<PluginMeta :enabled="false" type="gate" />

## Features

- Require clean git working tree (no uncommitted changes)
- Block releases from specific branches
- Restrict releases to allowed branches only
- Detect WIP (work in progress) commits in recent history
- Prevent releases with fixup/squash commits

## How It Works

The plugin runs validation checks **before** any version bump. If any gate fails, the bump is aborted and the version file remains unchanged.

Validation order:

1. Clean worktree check (if enabled)
2. Branch constraints (blocked branches, then allowed branches)
3. WIP commit detection (if enabled)

## Configuration

Enable and configure in `.sley.yaml`:

::: tip Complete Example
View the [release-gate.yaml example](https://github.com/indaco/sley/blob/main/docs/plugins/examples/release-gate.yaml) for all available options.
:::

```yaml
plugins:
  release-gate:
    enabled: true
    require-clean-worktree: true
    blocked-on-wip-commits: true
    require-ci-pass: false # Set to true to block bumps if CI is failing
    allowed-branches:
      - "main"
      - "release/*"
    blocked-branches:
      - "experimental/*"
```

### Configuration Options

| Option                   | Type     | Default | Description                                                     |
| ------------------------ | -------- | ------- | --------------------------------------------------------------- |
| `enabled`                | bool     | false   | Enable/disable the plugin                                       |
| `require-clean-worktree` | bool     | false   | Block bumps if git has uncommitted changes                      |
| `blocked-on-wip-commits` | bool     | false   | Block if recent commits contain WIP/fixup/squash                |
| `require-ci-pass`        | bool     | false   | Check CI status before allowing bumps                           |
| `allowed-branches`       | []string | []      | Branches where bumps are allowed (empty = all branches allowed) |
| `blocked-branches`       | []string | []      | Branches where bumps are never allowed (takes precedence)       |

### WIP Commit Detection

The plugin detects these patterns in recent commit messages:

- `WIP` (case-insensitive)
- `fixup!`
- `squash!`
- `DO NOT MERGE` (case-insensitive)
- `DNM`

## Branch Pattern Matching

Branch patterns support glob-style wildcards:

| Pattern        | Matches                               |
| -------------- | ------------------------------------- |
| `main`         | Exact match only                      |
| `release/*`    | `release/v1.0`, `release/production`  |
| `*/production` | `team-a/production`, `api/production` |

## Error Messages

| Condition          | Error Message                                                                        |
| ------------------ | ------------------------------------------------------------------------------------ |
| Dirty worktree     | `release-gate: uncommitted changes detected. Commit or stash changes before bumping` |
| WIP commit         | `release-gate: WIP commit detected in recent history: "...". Complete your work...`  |
| Branch not allowed | `release-gate: bumps not allowed from branch "...". Allowed branches: [...]`         |
| Branch blocked     | `release-gate: bumps not allowed from branch "..." (blocked branches: [...])`        |

## Integration with Other Plugins

The release gate runs **before** other validation plugins:

1. Release Gate (this plugin) - Quality gates
2. Version Validator - Version policy rules
3. Dependency Check - Consistency validation
4. Tag Manager - Tag availability

## Common errors

### `Error: release-gate: uncommitted changes detected`

**Cause:** Git working tree has uncommitted changes when `require-clean-worktree: true` is enabled.
**Solution:** Commit or stash your changes before bumping.

```bash
# Option 1: Commit changes
git add .
git commit -m "chore: prepare for version bump"
sley bump patch

# Option 2: Stash changes temporarily
git stash
sley bump patch
git stash pop
```

### `Error: release-gate: WIP commit detected in recent history`

**Cause:** Recent commits contain WIP markers (WIP, fixup!, squash!, DO NOT MERGE) when `blocked-on-wip-commits: true` is enabled.
**Solution:** Clean up WIP commits before releasing.

```bash
# View recent commits
git log --oneline -10

# Option 1: Rebase to squash/reword WIP commits
git rebase -i HEAD~5

# Option 2: Amend the last commit
git commit --amend -m "feat: complete feature implementation"

# Then retry the bump
sley bump minor
```

### `Error: release-gate: bumps not allowed from branch "feature/new-api"`

**Cause:** Current branch is not in the `allowed-branches` list.
**Solution:** Switch to an allowed branch or update configuration.

```bash
# Option 1: Switch to allowed branch
git checkout main
sley bump patch

# Option 2: Merge to main first
git checkout main
git merge feature/new-api
sley bump patch

# Option 3: Update .sley.yaml to allow current branch
plugins:
  release-gate:
    allowed-branches:
      - "main"
      - "feature/*"  # Add pattern
```

For more troubleshooting help, see the [Troubleshooting Guide](/guide/troubleshooting/).

## Troubleshooting

| Issue               | Solution                                      |
| ------------------- | --------------------------------------------- |
| Uncommitted changes | `git add -A && git commit` or `git stash`     |
| WIP commit detected | `git rebase -i HEAD~N` to squash/reword WIP   |
| Branch not allowed  | Switch to allowed branch: `git checkout main` |

## Emergency Bypass

To temporarily bypass release gates, set `enabled: false` in `.sley.yaml`. Re-enable after the emergency release.

## See Also

- [Version Validator](/plugins/version-validator) - Enforce version policy rules
- [Commit Validator Extension](/extensions/commit-validator) - Validate commit message format
- [CI/CD Integration](/guide/ci-cd) - Configure quality gates in pipelines
- [Tag Manager](/plugins/tag-manager) - Automatic git tag creation
- [.sley.yaml Reference](/reference/sley-yaml) - Plugin configuration
- [Troubleshooting](/guide/troubleshooting/) - Common release gate issues
