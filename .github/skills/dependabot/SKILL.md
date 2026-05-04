---
name: dependabot
description: >-
  Comprehensive guide for configuring and managing GitHub Dependabot. Use this skill when
  users ask about creating or optimizing dependabot.yml files, managing Dependabot pull requests,
  configuring dependency update strategies, setting up grouped updates, monorepo patterns,
  multi-ecosystem groups, security update configuration, auto-triage rules, or any GitHub
  Advanced Security (GHAS) supply chain security topic related to Dependabot.
---

# Dependabot Configuration & Management

## Overview

Dependabot is GitHub's built-in dependency management tool with three core capabilities:

1. **Dependabot Alerts** — Notify when dependencies have known vulnerabilities (CVEs)
2. **Dependabot Security Updates** — Auto-create PRs to fix vulnerable dependencies
3. **Dependabot Version Updates** — Auto-create PRs to keep dependencies current

All configuration lives in a **single file**: `.github/dependabot.yml` on the default branch.

## Configuration Workflow

### Step 1: Detect All Ecosystems

| Ecosystem | YAML Value | Manifest Files |
|---|---|---|
| npm/pnpm/yarn | `npm` | `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` |
| pip/pipenv/poetry/uv | `pip` | `requirements.txt`, `Pipfile`, `pyproject.toml`, `setup.py` |
| Docker | `docker` | `Dockerfile` |
| Docker Compose | `docker-compose` | `docker-compose.yml` |
| GitHub Actions | `github-actions` | `.github/workflows/*.yml` |
| Go modules | `gomod` | `go.mod` |
| Bundler (Ruby) | `bundler` | `Gemfile` |
| Cargo (Rust) | `cargo` | `Cargo.toml` |
| Composer (PHP) | `composer` | `composer.json` |
| NuGet (.NET) | `nuget` | `*.csproj`, `packages.config` |
| Maven (Java) | `maven` | `pom.xml` |
| Gradle (Java) | `gradle` | `build.gradle` |
| Terraform | `terraform` | `*.tf` |
| Helm | `helm` | `Chart.yaml` |
| Pre-commit | `pre-commit` | `.pre-commit-config.yaml` |

### Step 2: Minimum Configuration

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Step 3: Optimize with Grouping, Labels, and Scheduling

## Dependency Grouping

Reduce PR noise by grouping related dependencies into single PRs.

### By Dependency Type

```yaml
groups:
  dev-dependencies:
    dependency-type: "development"
    update-types: ["minor", "patch"]
  production-dependencies:
    dependency-type: "production"
    update-types: ["minor", "patch"]
```

### By Name Pattern

```yaml
groups:
  testing:
    patterns: ["jest*", "supertest*"]
  security:
    patterns: ["helmet*", "express-rate-limit*"]
```

### For Security Updates

```yaml
groups:
  security-patches:
    applies-to: security-updates
    patterns: ["*"]
    update-types: ["patch", "minor"]
```

## PR Customization

### Labels and Commit Messages

```yaml
labels:
  - "dependencies"
  - "npm"
commit-message:
  prefix: "chore"
  prefix-development: "chore"
  include: "scope"
```

### Target Branch

```yaml
target-branch: "develop"
```

## Schedule Optimization

```yaml
schedule:
  interval: "weekly"
  day: "monday"
  time: "09:00"
  timezone: "America/Mexico_City"
```

Supported intervals: `daily`, `weekly`, `monthly`

## Security Updates Configuration

### Disable Version Updates (Security Only)

```yaml
open-pull-requests-limit: 0  # disables version update PRs
```

### Group Security Updates

```yaml
groups:
  security-patches:
    applies-to: security-updates
    patterns: ["*"]
    update-types: ["patch", "minor"]
```

## Ignore and Allow Rules

### Ignore Specific Dependencies

```yaml
ignore:
  - dependency-name: "lodash"
  - dependency-name: "express"
    versions: ["5.x"]
```

### Allow Only Specific Types

```yaml
allow:
  - dependency-type: "production"
```

## PR Comment Commands

| Command | Effect |
|---|---|
| `@dependabot rebase` | Rebase the PR |
| `@dependabot recreate` | Recreate the PR from scratch |
| `@dependabot ignore this dependency` | Close and never update this dependency |
| `@dependabot ignore this major version` | Ignore this major version |
| `@dependabot ignore this minor version` | Ignore this minor version |
| `@dependabot ignore this patch version` | Ignore this patch version |

> Note: As of January 2026, merge/close/reopen commands have been deprecated. Use GitHub's native UI or `gh pr merge`.

## FAQ

**Does Dependabot support pnpm?**
Yes. Use `package-ecosystem: "npm"` — Dependabot detects `pnpm-lock.yaml` automatically.

**How do I reduce PR noise?**
Use `groups` to batch updates and consider `monthly` intervals for low-priority ecosystems.

## Resources

- `references/dependabot-yml-reference.md` — Complete YAML options reference
- `references/pr-commands.md` — Full PR comment commands reference
- `references/example-configs.md` — Real-world configuration examples
