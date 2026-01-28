---
title: "Installation"
description: "Install sley via Homebrew, go install, asdf, prebuilt binaries, or build from source. Multiple installation methods for macOS, Linux, and Windows"
head:
  - - meta
    - name: keywords
      content: sley, installation, install, homebrew, go install, asdf, prebuilt binaries, setup, download
---

# {{ $frontmatter.title }}

## Prerequisites

- **Required**: [Git](https://git-scm.com/) (for auto-initialization and tag-manager plugin)
- **Recommended**: Familiarity with [semantic versioning](https://semver.org/)

## Installation Methods

Choose the method that best fits your workflow:

| If you...                           | Use...                | Requires                                             |
| ----------------------------------- | --------------------- | ---------------------------------------------------- |
| Use macOS/Linux with Homebrew       | Homebrew              | [Homebrew](https://brew.sh/)                         |
| Want latest version system-wide     | `go install` (global) | [Go](https://go.dev/) 1.25+                          |
| Need local project-specific install | `go install` (tool)   | [Go](https://go.dev/) 1.25+                          |
| Use asdf version manager            | asdf plugin           | [asdf](https://asdf-vm.com/)                         |
| Don't have Go installed             | Prebuilt binary       | -                                                    |
| Want to contribute or customize     | Build from source     | [Go](https://go.dev/), [just](https://just.systems/) |

### Homebrew (macOS/Linux)

```bash
brew install indaco/tap/sley
```

### Install via `go install` (global)

```bash
go install github.com/indaco/sley/cmd/sley@latest
```

::: tip
Ensure `$GOPATH/bin` or `$HOME/go/bin` is in your PATH:

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

:::

### Install via `go install` (tool)

Install `sley` locally in your project:

```bash
go get -tool github.com/indaco/sley/cmd/sley@latest
```

Run with:

```bash
go tool sley
```

### asdf

Install using the [asdf](https://asdf-vm.com/) version manager:

```bash
asdf plugin add sley https://github.com/indaco/asdf-sley.git
asdf install sley latest
asdf global sley latest
```

### Prebuilt Binaries

Download pre-compiled binaries from the [releases page](https://github.com/indaco/sley/releases), or use the automatic installer:

```bash
# Automatic platform detection (macOS/Linux)
curl -L https://github.com/indaco/sley/releases/latest/download/sley-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m) -o sley
chmod +x sley
sudo mv sley /usr/local/bin/
```

```powershell
# Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/indaco/sley/releases/latest/download/sley-windows-amd64.exe" -OutFile "sley.exe"
```

### Build from Source

```bash
git clone https://github.com/indaco/sley.git
cd sley
just install
```

## Verify Installation

```bash
sley --version
```

## Troubleshooting

### Command not found

**Issue:** `sley: command not found` after installation.

**Solution:** Add the installation directory to your PATH:

```bash
# For Homebrew
export PATH="/opt/homebrew/bin:$PATH"

# For go install
export PATH="$PATH:$(go env GOPATH)/bin"

# For manual binary
export PATH="/usr/local/bin:$PATH"
```

### Permission denied

**Issue:** `permission denied` when running sley.

**Solution:** Make the binary executable:

```bash
chmod +x sley
sudo mv sley /usr/local/bin/
```

### Version mismatch

**Issue:** `sley --version` shows old version after upgrade.

**Solution:** Clear shell cache and verify installation:

```bash
hash -r
which sley
```

### macOS Gatekeeper warning

**Issue:** "sley cannot be opened because the developer cannot be verified".

**Solution:** Remove quarantine attribute:

```bash
xattr -d com.apple.quarantine /usr/local/bin/sley
```

### go install fails

**Issue:** `go install` fails with "permission denied" or "cannot find module".

**Solution:** Verify Go installation and clean module cache:

```bash
go version  # Should be 1.25+
go clean -modcache
go install github.com/indaco/sley/cmd/sley@latest
```

## What's Next?

Choose your path based on your needs:

**Getting started?**

- [Quick Start](/guide/quick-start) - Try sley in 30 seconds
- [Usage Guide](/guide/usage) - Initialize your project and learn all commands
- [What is sley?](/guide/what-is-sley) - Understand the .version file approach

**Setting up configuration?**

- [Configuration](/config/) - Configure via CLI, env vars, or .sley.yaml
- [Plugin System](/plugins/) - Enable git tagging, changelogs, and more
- [.sley.yaml Reference](/reference/sley-yaml) - Complete configuration reference

**Need help?**

- [Troubleshooting](/guide/troubleshooting/) - Common issues and solutions
- [Environment Variables](/config/env-vars) - Configure via environment
