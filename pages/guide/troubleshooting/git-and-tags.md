---
title: "Troubleshooting: Git & Tag Issues"
description: "Solutions for git and tag errors including tag already exists, not a git repository, push failures, and GPG signing issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, git, tags, errors, tag manager, GPG signing, push
---

# {{ $frontmatter.title }}

This page covers common issues related to git operations and tag management.

## `Error: tag v1.2.3 already exists`

**Cause**: The `tag-manager` plugin prevents creating duplicate tags.

**Solutions**:

```bash
# Option 1: Delete the existing tag (if it was created by mistake)
git tag -d v1.2.3
# If pushed to remote:
git push origin :refs/tags/v1.2.3

# Option 2: Bump to a different version
sley bump patch  # Will create v1.2.4 instead

# Option 3: Disable auto-tagging temporarily
plugins:
  tag-manager:
    auto-create: false
```

## `Error: failed to create tag: not a git repository`

**Cause**: Trying to use tag-manager plugin outside a git repository.

**Solutions**:

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Or disable tag-manager
plugins:
  tag-manager:
    enabled: false
```

## `Error: failed to push tag: no remote configured`

**Cause**: Tag manager is configured with `push: true` but no remote exists.

**Solutions**:

```bash
# Option 1: Add a git remote
git remote add origin https://github.com/username/repo.git

# Option 2: Disable auto-push
plugins:
  tag-manager:
    push: false

# Option 3: Push manually later
sley tag create  # Create without pushing
git push origin v1.2.3  # Push when ready
```

## `Error: gpg: signing failed: No secret key`

**Cause**: Tag manager configured with `sign: true` but GPG key is not set up.

**Solutions**:

```bash
# Option 1: Configure GPG signing key
git config user.signingkey YOUR_KEY_ID

# Option 2: Disable GPG signing
plugins:
  tag-manager:
    sign: false

# Option 3: Generate a GPG key
gpg --full-generate-key
# Then configure git to use it
git config user.signingkey YOUR_KEY_ID
```

## `Error: authentication failed` (when pushing tags)

**Cause**: Git credentials not configured or expired.

**Solutions**:

```bash
# Option 1: Use SSH instead of HTTPS
git remote set-url origin git@github.com:username/repo.git

# Option 2: Configure credential helper
git config --global credential.helper store
# Then authenticate once

# Option 3: Use personal access token (GitHub)
git remote set-url origin https://TOKEN@github.com/username/repo.git
```

## `Error: tag message required but not provided`

**Cause**: Tag manager configured with `annotated: true` but no message template.

**Solutions**:

```yaml
# In .sley.yaml, configure tag message:
plugins:
  tag-manager:
    enabled: true
    annotated: true
    message: "Release {version}"
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Tag Manager](/plugins/tag-manager) - Tag manager configuration
- [CI/CD Issues](./ci-cd) - CI/CD-specific git issues
