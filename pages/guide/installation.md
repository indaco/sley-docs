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

## Choose Your Method

| If you...                           | Use...                | Requires                                             |
| ----------------------------------- | --------------------- | ---------------------------------------------------- |
| Use macOS/Linux with Homebrew       | Homebrew              | [Homebrew](https://brew.sh/)                         |
| Want latest version system-wide     | `go install` (global) | [Go](https://go.dev/) 1.25+                          |
| Need local project-specific install | `go install` (tool)   | [Go](https://go.dev/) 1.25+                          |
| Use asdf version manager            | asdf plugin           | [asdf](https://asdf-vm.com/)                         |
| Don't have Go installed             | Prebuilt binary       | —                                                    |
| Want to contribute or customize     | Build from source     | [Go](https://go.dev/), [just](https://just.systems/) |

### Homebrew (macOS/Linux)

```bash
brew install indaco/tap/sley
```

### Install via `go install` (global)

```bash
go install github.com/indaco/sley/cmd/sley@latest
```

### Install via `go install` (tool)

With Go 1.24 or greater installed, you can install `sley` locally in your project by running:

```bash
go get -tool github.com/indaco/sley/cmd/sley@latest
```

Once installed, use it with:

```bash
go tool sley
```

### asdf

Install using the [asdf](https://asdf-vm.com/) version manager:

```bash
asdf plugin add sley https://github.com/indaco/asdf-sley.git
asdf install sley latest
```

### Prebuilt binaries

Download the pre-compiled binaries from the [releases page](https://github.com/indaco/sley/releases) and place the binary in your system's PATH.

### Clone and build manually

```bash
git clone https://github.com/indaco/sley.git
cd sley
just install
```

## Verify Installation

```bash
sley --version
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
