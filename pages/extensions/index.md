---
title: "Extension System"
description: "Create custom extensions with hook scripts for pre-bump, post-bump validation, and automation. Extend sley with Python, Bash, or Node.js"
head:
  - - meta
    - name: keywords
      content: sley, extensions, hooks, pre-bump, post-bump, custom scripts, automation, extensibility, plugin development
---

# {{ $frontmatter.title }}

Extensions are executable scripts that run at specific hook points during version management operations. They receive JSON input on stdin and return JSON output on stdout.

::: tip Start with Plugins
Most users only need [built-in plugins](/plugins/). Extensions are for advanced customization when plugins don't meet your needs - such as custom team workflows, external tool integration, or prototyping new features before they become plugins.
:::

## Getting Started

There are three ways to work with extensions:

1. **Install existing extensions** - Use pre-built extensions from the community (most common)
2. **Configure extensions** - Enable/disable and customize installed extensions
3. **Create custom extensions** - Build your own automation scripts (advanced)

Most users start by [installing available extensions](#available-extensions) below.

## Available Extensions

sley provides reference implementations you can install and use immediately:

| Extension                                    | Language                            | Hook                                     | Description                            |
| -------------------------------------------- | ----------------------------------- | ---------------------------------------- | -------------------------------------- |
| [Commit Validator](./commit-validator)       | <Badge type="info" text="Python" /> | <Badge type="danger" text="pre-bump" />  | Validates conventional commit format   |
| [Docker Tag Sync](./docker-tag-sync)         | <Badge type="info" text="Bash" />   | <Badge type="danger" text="post-bump" /> | Tags and pushes Docker images          |
| [GitHub Version Sync](./github-version-sync) | <Badge type="info" text="Bash" />   | <Badge type="danger" text="pre-bump" />  | Syncs version to latest GitHub release |

**Ready to try one?** See [Installing Extensions](#installing-extensions) below.

Browse the [contrib/extensions/](https://github.com/indaco/sley/tree/main/contrib/extensions) directory for more examples in Python, Node.js, and Bash.

## When to Use Extensions vs Plugins

### Use Built-in Plugins When...

- **Performance matters** - Plugins execute in <1ms with native Go performance
- **Feature is widely applicable** - Common versioning needs across many projects
- **Deep integration needed** - Requires tight coupling with bump logic or validation
- **Built-in reliability required** - No external dependencies or installation steps
- **Examples**: Git tagging, conventional commit parsing, version validation, file syncing

### Use Extensions When...

- **Custom to your workflow** - Organization-specific automation or processes
- **Requires external tools** - Need to call AWS CLI, curl, deployment scripts, etc.
- **Prototyping new features** - Testing ideas before proposing as built-in plugins
- **Language-specific needs** - Python/Node.js/Ruby tooling integration
- **Examples**: Custom notification systems, deployment triggers, proprietary tool integration

See the [Plugin vs Extension Comparison Table](/plugins/#plugin-vs-extension-comparison) for detailed feature differences.

---

## Using Extensions

### Installing Extensions

Extensions can be installed from remote repositories or local paths.

#### From Remote Repository

Install directly from any Git repository:

```bash
# Install from repository root
sley extension install --url github.com/user/my-extension

# Install from subdirectory in repository
sley extension install --url github.com/user/repo/path/to/extension
```

**Real-world examples** using sley's built-in extensions:

```bash
# Install commit-validator from sley repository subdirectory
sley extension install --url github.com/indaco/sley/contrib/extensions/commit-validator

# Install docker-tag-sync from sley repository subdirectory
sley extension install --url github.com/indaco/sley/contrib/extensions/docker-tag-sync
```

Supported URL formats:

- Full URLs: `https://git-host.com/user/repo` or `https://git-host.com/user/repo/sub/dir`
- Shorthand: `git-host.com/user/repo` or `git-host.com/user/repo/sub/dir`

Works with any Git hosting service: GitHub, GitLab, Bitbucket, self-hosted GitLab/Gitea/Forgejo, GitHub Enterprise, and more.

::: tip Subdirectory Support
You can install extensions from any subdirectory in a repository. This is perfect for monorepos that contain multiple extensions or projects with extensions in a specific folder structure.
:::

#### From Local Path

Install from a local directory:

```bash
# Install from local path
sley extension install --path /path/to/my-extension

# Install from relative path
sley extension install --path ./contrib/extensions/my-extension
```

::: warning Path vs URL

- Use `--path` for local filesystem directories only
- Use `--url` for remote Git repositories (any Git hosting service)
- These flags are mutually exclusive - you cannot use both
- Passing a URL to `--path` will result in an error
  :::

#### Installation Process

Both methods copy the extension to `~/.sley-extensions/my-extension/` and add it to `.sley.yaml`:

```yaml
# .sley.yaml
extensions:
  - name: docker-tag-sync
    path: /Users/username/.sley-extensions/docker-tag-sync
    enabled: true
```

### Managing Extensions

```bash
# List installed extensions
sley extension list

# Temporarily turn off an extension (keeps config and files)
sley extension disable --name docker-tag-sync

# Re-enable it later
sley extension enable --name docker-tag-sync

# Remove the extension entry from .sley.yaml
sley extension uninstall --name docker-tag-sync

# Also delete the extension directory from disk
sley extension uninstall --name docker-tag-sync --delete-folder
```

::: tip disable vs uninstall
**`disable`** toggles `enabled: false` in `.sley.yaml` - the extension stays registered and can be re-enabled at any time. **`uninstall`** removes the extension entry from the config entirely.
:::

### Running Extensions

Extensions run automatically during bump commands. Once installed, you'll see them execute:

```bash
$ sley bump patch
Running pre-bump extensions...
  ✓ commit-validator (0.05s)
Bumping version: 1.2.3 → 1.2.4
Running post-bump extensions...
  ✓ docker-tag-sync (0.12s)

Successfully bumped to 1.2.4
```

#### Execution Flow

Extensions execute at specific points during bump operations:

```bash
sley bump patch
# 1. Pre-bump extensions run (can modify .version)
# 2. Pre-bump plugin validations run
# 3. Version bumped
# 4. Post-bump plugin actions run
# 5. Post-bump extensions run
```

::: tip Extensions Run First
Pre-bump extensions execute **before** plugin validations. This allows extensions to set up state (e.g., fetch a version from an external source and update `.version`) before plugins like `dependency-check` validate consistency. After pre-bump extensions complete, sley re-reads the `.version` file to pick up any changes.

See the complete [Execution Order diagram](/plugins/#execution-order) on the Plugins page.
:::

#### Skipping Extensions

Skip extensions during a bump with `--skip-hooks`:

```bash
sley bump patch --skip-hooks
```

#### Checking Installed Extensions

To see which extensions are active:

```bash
$ sley extension list
commit-validator (enabled)  - Validates conventional commit format
docker-tag-sync (enabled)   - Tags and pushes Docker images
custom-notifier (disabled)  - Sends Slack notifications
```

### Configuration Reference

Extensions are configured in `.sley.yaml`:

```yaml
# .sley.yaml
extensions:
  # Remote extension
  - name: commit-validator
    path: /Users/username/.sley-extensions/commit-validator
    enabled: true

  # Local development extension
  - name: custom-notifier
    path: ./scripts/custom-notifier
    enabled: false

  # Extension with custom configuration
  - name: github-version-sync
    path: /Users/username/.sley-extensions/github-version-sync
    enabled: true
    config:
      repo: indaco/sley
      strip-prefix: v

  # Another extension
  - name: docker-tag-sync
    path: /Users/username/.sley-extensions/docker-tag-sync
    enabled: true
```

Configuration options:

- `name`: Extension identifier (required)
- `path`: Absolute or relative path to extension directory (required)
- `enabled`: Whether extension runs during bumps (default: `true`)
- `config`: Extension-specific key-value settings passed to the hook script (optional)

### Troubleshooting

| Issue               | Solution                                                         |
| ------------------- | ---------------------------------------------------------------- |
| Extension not found | Check `sley extension list` and verify path in `.sley.yaml`      |
| Not executing       | Verify `enabled: true`, script is executable, has proper shebang |
| Permission denied   | Run `chmod +x hook.sh` on the extension's entry script           |
| Timeout errors      | Optimize script (30s timeout) or split into smaller tasks        |
| Invalid JSON output | Test manually: `echo '{"hook":"post-bump"}' \| ./hook.sh`        |
| Extension fails     | Check extension logs (stderr), verify dependencies installed     |

#### Error Propagation

If an extension fails (`success: false` in JSON output), the bump operation is aborted and subsequent extensions are not executed. This prevents cascading failures.

---

## Creating Extensions

For users who want to build custom extensions to automate organization-specific workflows.

### Extension Concepts

#### Hook Points

Extensions run at specific lifecycle points:

| Hook        | When                  | Use Cases                                                       |
| ----------- | --------------------- | --------------------------------------------------------------- |
| `pre-bump`  | Before version bump   | Validate preconditions, run linters/tests, check dependencies   |
| `post-bump` | After successful bump | Update files, create tags, send notifications, deploy artifacts |

::: tip Future Hook Points
Additional hook points (`pre-release`, `validate`) are planned for future releases. Currently, sley supports `pre-bump` and `post-bump` hooks.
:::

#### Hook Execution Order

When you run `sley bump`, hooks execute in this sequence:

1. **Pre-bump extensions** run first (can modify `.version`)
2. **Plugin validations** run (release-gate, version-validator, etc.)
3. **Version bumped** (.version file updated)
4. **Plugin post-actions** run (dependency-check sync, changelog, tags)
5. **Post-bump extensions** run last (notifications, deployments)

See the [complete execution flow diagram](/plugins/#execution-order) for details.

#### Input Context

All hooks receive JSON on stdin with context about the bump operation:

```json
{
  "hook": "post-bump",
  "version": "1.2.3",
  "previous_version": "1.2.2",
  "bump_type": "patch",
  "prerelease": "alpha",
  "metadata": "build123",
  "project_root": "/path/to/project",
  "module_dir": "./services/api",
  "module_name": "api",
  "config": {
    "repo": "indaco/sley",
    "strip-prefix": "v"
  }
}
```

::: info Monorepo Context
`module_dir` and `module_name` are included when running in a monorepo workspace. For single-project repositories, these fields are omitted.
:::

::: info Extension Configuration
The `config` field contains extension-specific settings from the `.sley.yaml` file. If no `config` is defined for the extension, this field is omitted from the JSON input.
:::

### Your First Extension

#### Directory Structure

Create a directory with these files:

```text
my-extension/
  extension.yaml    # Manifest (required)
  hook.sh           # Entry point script
  README.md         # Documentation (recommended)
```

#### Extension Manifest

Define your extension in `extension.yaml`:

```yaml
# extension.yaml
name: my-extension
version: 1.0.0
description: Brief description of what this extension does
author: Your Name
repository: https://github.com/username/my-extension
entry: hook.sh
hooks:
  - pre-bump
  - post-bump
```

Manifest fields:

- `name`: Extension identifier (required)
- `version`: Extension version (required)
- `description`: Human-readable description (required)
- `author`: Extension author (recommended)
- `repository`: Source code URL (recommended)
- `entry`: Script filename to execute (required)
- `hooks`: List of hook points this extension supports (required)

#### Hook Script Example

Create an executable script at the path specified in `entry`:

```bash
#!/bin/sh

# Read JSON input from stdin
read -r input

# Parse fields using grep/jq/python (choose based on your needs)
version=$(echo "$input" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
bump_type=$(echo "$input" | grep -o '"bump_type":"[^"]*"' | cut -d'"' -f4)

# Your custom logic here
echo "Processing version $version (bump: $bump_type)" >&2

# Perform actual work
# Example: Send notification, update external system, etc.

# Return success JSON on stdout
echo '{"success": true, "message": "Extension executed successfully"}'
exit 0
```

**Important**:

- Make the script executable: `chmod +x hook.sh`
- Include proper shebang (`#!/bin/sh`, `#!/usr/bin/env python3`, etc.)
- Use stderr for logging, stdout only for JSON response
- Exit with code 0 for success, non-zero for failure

See `contrib/extensions/` in the sley repository for complete examples in Python, Node.js, and Bash.

### Implementation Details

#### JSON Output Format

Extensions must return JSON on stdout:

**Success response:**

```json
{
  "success": true,
  "message": "Optional status message",
  "data": {
    "key": "Optional data to return"
  }
}
```

**Failure response:**

```json
{
  "success": false,
  "message": "Extension failed: reason for failure"
}
```

When `success: false`, the bump operation aborts immediately.

#### Multi-Language Examples

**Python:**

```python
#!/usr/bin/env python3
import sys
import json

# Read input
input_data = json.loads(sys.stdin.read())

version = input_data.get("version")
hook = input_data.get("hook")

# Your logic here
print(f"Processing {hook} for version {version}", file=sys.stderr)

# Return result
result = {
    "success": True,
    "message": f"Extension processed {version}"
}
print(json.dumps(result))
sys.exit(0)
```

**Node.js:**

```javascript
#!/usr/bin/env node
const input = JSON.parse(require("fs").readFileSync(0, "utf-8"));

console.error(`Processing ${input.hook} for ${input.version}`);

// Your logic here

const result = {
  success: true,
  message: `Extension processed ${input.version}`,
};

console.log(JSON.stringify(result));
process.exit(0);
```

Browse [contrib/extensions/](https://github.com/indaco/sley/tree/main/contrib/extensions) for production-ready examples.

#### Error Handling

Handle errors gracefully and return meaningful messages:

```bash
#!/bin/sh

read -r input

# Validate input
if [ -z "$input" ]; then
    echo '{"success": false, "message": "No input received"}'
    exit 1
fi

# Parse version
version=$(echo "$input" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)

if [ -z "$version" ]; then
    echo '{"success": false, "message": "Version field missing from input"}'
    exit 1
fi

# Perform work with error checking
if ! some_command "$version"; then
    echo '{"success": false, "message": "Command failed: some_command"}' >&2
    exit 1
fi

echo '{"success": true, "message": "Extension completed"}'
exit 0
```

### Best Practices

1. **Keep extensions focused** - One extension should do one thing well
2. **Validate input** - Check for required fields before processing
3. **Handle errors gracefully** - Return meaningful error messages in JSON
4. **Test with different inputs** - Verify behavior across hook types and version formats
5. **Use stderr for logging** - Reserve stdout exclusively for JSON output
6. **Make scripts executable** - Use `chmod +x` and include proper shebang
7. **Document dependencies** - List required tools in README (e.g., jq, curl, python3)
8. **Set exit codes** - Exit 0 for success, non-zero for failure
9. **Respect timeouts** - Extensions have a 30-second execution limit
10. **Test manually** - Use `echo '{"hook":"post-bump","version":"1.0.0"}' | ./hook.sh` to verify output

### Security Considerations

Be mindful of security when creating and installing extensions:

- **Extensions run with your user permissions** - Only install from trusted sources
- **30-second execution timeout** - Prevents hanging processes
- **1MB output limit** - Prevents memory exhaustion
- **Process isolation** - Each extension runs as a separate process
- **No network restrictions** - Extensions can make network calls (be cautious)
- **File system access** - Extensions can read/write files with your permissions

**When installing extensions:**

- Review extension code before installation
- Prefer well-maintained extensions with clear documentation
- Check the repository's commit history and community
- Use local paths during development, URLs for trusted sources

---

## See Also

- [Plugin System](/plugins/) - Built-in plugins vs extensions comparison
- [Commit Validator Extension](/extensions/commit-validator) - Validate conventional commits
- [Docker Tag Sync Extension](/extensions/docker-tag-sync) - Tag Docker images with versions
- [GitHub Version Sync Extension](/extensions/github-version-sync) - Sync version to latest GitHub release
- [CI/CD Integration](/guide/ci-cd) - Use extensions in automation pipelines
- [.sley.yaml Reference](/reference/sley-yaml) - Extension configuration reference
- [Troubleshooting](/guide/troubleshooting/) - Common extension issues
