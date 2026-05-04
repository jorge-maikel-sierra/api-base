---
name: codeql
description: Comprehensive guide for setting up and configuring CodeQL code scanning via GitHub Actions workflows and the CodeQL CLI. This skill should be used when users need help with code scanning configuration, CodeQL workflow files, CodeQL CLI commands, SARIF output, security analysis setup, or troubleshooting CodeQL analysis.
---

# CodeQL Code Scanning

This skill provides procedural guidance for configuring and running CodeQL code scanning — both through GitHub Actions workflows and the standalone CodeQL CLI.

## When to Use This Skill

Use this skill when the request involves:

- Creating or customizing a `codeql.yml` GitHub Actions workflow
- Choosing between default setup and advanced setup for code scanning
- Configuring CodeQL language matrix, build modes, or query suites
- Running CodeQL CLI locally (`codeql database create`, `database analyze`, `github upload-results`)
- Understanding or interpreting SARIF output from CodeQL
- Troubleshooting CodeQL analysis failures
- Configuring dependency caching or custom query packs

## Supported Languages

| Language | Identifier |
|---|---|
| C/C++ | `c-cpp` |
| C# | `csharp` |
| Go | `go` |
| Java/Kotlin | `java-kotlin` |
| **JavaScript/TypeScript** | **`javascript-typescript`** |
| Python | `python` |
| Ruby | `ruby` |
| Rust | `rust` |

## Core Workflow — GitHub Actions

### Step 1: Choose Setup Type

- **Default setup** — Enable from repository Settings → Advanced Security → CodeQL analysis. Best for getting started quickly.
- **Advanced setup** — Create a `.github/workflows/codeql.yml` file for full control.

### Step 2: Configure Workflow Triggers

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '30 6 * * 1'  # Weekly Monday 6:30 UTC
```

### Step 3: Configure Permissions

```yaml
permissions:
  security-events: write   # Required to upload SARIF results
  contents: read            # Required to checkout code
  actions: read             # Required for private repos
```

### Step 4: Complete Workflow for Node.js

```yaml
name: "CodeQL Analysis"

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '30 6 * * 1'

permissions:
  security-events: write
  contents: read
  actions: read

jobs:
  analyze:
    name: Analyze (javascript-typescript)
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        include:
          - language: javascript-typescript
            build-mode: none

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4
        with:
          languages: ${{ matrix.language }}
          build-mode: ${{ matrix.build-mode }}
          queries: security-extended
          dependency-caching: true

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v4
        with:
          category: "/language:${{ matrix.language }}"
```

### Query Suite Options

- `security-extended` — default security queries plus additional coverage (**recommended**)
- `security-and-quality` — security plus code quality queries

### Build Modes

For JavaScript/TypeScript, always use `build-mode: none` (no compilation needed).

## Core Workflow — CodeQL CLI

### Install and Create Database

```bash
# Download CodeQL bundle from https://github.com/github/codeql-action/releases
export PATH="$HOME/codeql:$PATH"

# Create database
codeql database create codeql-db \
  --language=javascript-typescript \
  --source-root=src

# Analyze
codeql database analyze codeql-db \
  javascript-code-scanning.qls \
  --format=sarif-latest \
  --output=results.sarif

# Upload to GitHub
codeql github upload-results \
  --repository=owner/repo \
  --ref=refs/heads/main \
  --commit=<commit-sha> \
  --sarif=results.sarif
```

## Alert Management

### Severity Levels

- **Standard severity:** `Error`, `Warning`, `Note`
- **Security severity:** `Critical`, `High`, `Medium`, `Low` (from CVSS scores)

### Alert Triage

- Alerts appear as PR check annotations
- Check fails by default for `error`/`critical`/`high` severity
- Dismiss false positives with a documented reason

### Copilot Autofix

GitHub Copilot Autofix generates fix suggestions for CodeQL alerts in PRs — no Copilot subscription required.

## Troubleshooting

| Problem | Solution |
|---|---|
| `Resource not accessible` error | Add `security-events: write` and `contents: read` permissions |
| Workflow not triggering | Verify `on:` triggers match event and branch filters |
| SARIF upload fails | Ensure token has `security-events: write`; check 10 MB file size limit |
| Two CodeQL workflows | Disable default setup if using advanced setup |

## Reference Files

For detailed documentation, load the following reference files as needed:

- `references/workflow-configuration.md` — Full workflow trigger, runner, and configuration options
- `references/cli-commands.md` — Complete CodeQL CLI command reference
- `references/sarif-output.md` — SARIF v2.1.0 object model and upload limits
- `references/compiled-languages.md` — Build modes and autobuild behavior per language
- `references/troubleshooting.md` — Comprehensive error diagnosis and resolution
- `references/alert-management.md` — Alert severity, triage, and dismissal
