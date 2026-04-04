---
title: "Troubleshooting: Git & Tag Issues"
description: "Solutions for git and tag errors including tag already exists, not a git repository, push failures, GPG signing, and tag create --all issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, git, tags, errors, tag manager, GPG signing, push, tag create --all
---

# {{ $frontmatter.title }}

This page covers common issues related to git operations and tag management.

## `tag create --all` stops after the first module

**Cause**: Historical bug. Fixed in current release.

**Fix**: Upgrade to the latest version of sley.

## Duplicate tag skipped during `tag create --all`

**Behavior**: When a tag already exists for a module, sley logs an info message and continues to the next module. This is not a fatal error.

**Fix**: No action needed. To re-create a tag, delete it first:

```bash
git tag -d adapters/redis/v0.1.0
# If pushed to remote:
git push origin :refs/tags/adapters/redis/v0.1.0
```

## Partial failure: some modules tagged, some not

**Cause**: One or more modules failed during `tag create --all`. Sley reports a summary error: `X of Y module(s) failed tag creation`.

**Fix**: Re-run `sley tag create --all`. Existing tags are skipped automatically; only the missing ones are created.

## `Error: tag v1.2.3 already exists`

**Cause**: The `tag-manager` plugin prevents creating duplicate tags.

**Fix**:

```bash
# Delete the existing tag if created by mistake
git tag -d v1.2.3
# If pushed to remote:
git push origin :refs/tags/v1.2.3

# Or bump to a new version
sley bump patch  # Creates v1.2.4 instead
```

To disable auto-tagging:

```yaml
plugins:
  tag-manager:
    auto-create: false
```

## `Error: failed to create tag: not a git repository`

**Cause**: Using tag-manager outside a git repository.

**Fix**:

```bash
git init
git add .
git commit -m "Initial commit"
```

Or disable the plugin:

```yaml
plugins:
  tag-manager:
    enabled: false
```

## `Error: failed to push tag: no remote configured`

**Cause**: Tag manager is configured with `push: true` but no remote exists.

**Fix**:

```bash
# Add a remote
git remote add origin https://github.com/username/repo.git

# Or disable auto-push
plugins:
  tag-manager:
    push: false
```

## `Error: gpg: signing failed: No secret key`

**Cause**: Tag manager configured with `sign: true` but no GPG key is set up.

**Fix**:

```bash
# Generate a key and configure git
gpg --full-generate-key
git config user.signingkey YOUR_KEY_ID
```

Or disable signing:

```yaml
plugins:
  tag-manager:
    sign: false
```

## `Error: authentication failed` (when pushing tags)

**Cause**: Git credentials not configured or expired.

**Fix**:

```bash
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:username/repo.git

# Or use a personal access token
git remote set-url origin https://TOKEN@github.com/username/repo.git
```

## `Error: tag message required but not provided`

**Cause**: Tag manager configured with `annotate: true` but no `message-template` set.

**Fix**:

```yaml
plugins:
  tag-manager:
    enabled: true
    annotate: true
    message-template: "Release {version}"
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Tag Manager](/plugins/tag-manager) - Tag manager configuration
- [CI/CD Issues](./ci-cd) - CI/CD-specific git issues
