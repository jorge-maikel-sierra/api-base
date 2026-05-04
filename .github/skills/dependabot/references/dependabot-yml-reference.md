# Dependabot YAML Options Reference

Complete reference for all configuration options in `.github/dependabot.yml`.

## File Structure

```yaml
version: 2                    # Required, always 2

registries:                   # Optional: private registry access
  REGISTRY_NAME:
    type: "..."
    url: "..."

updates:                      # Required: list of ecosystem configurations
  - package-ecosystem: "..."  # Required
    directory: "/"            # Required (or directories)
    schedule:                 # Required
      interval: "..."
```

## Required Keys

### `package-ecosystem`

| Package Manager | YAML Value | Manifest Files |
|---|---|---|
| npm/pnpm/yarn | `npm` | `package.json`, lockfiles |
| pip/poetry/uv | `pip` | `requirements.txt`, `pyproject.toml` |
| Docker | `docker` | `Dockerfile` |
| GitHub Actions | `github-actions` | `.github/workflows/*.yml` |
| Go Modules | `gomod` | `go.mod` |
| Cargo (Rust) | `cargo` | `Cargo.toml` |
| Composer (PHP) | `composer` | `composer.json` |
| NuGet (.NET) | `nuget` | `*.csproj` |
| Maven | `maven` | `pom.xml` |
| Terraform | `terraform` | `*.tf` |

### `schedule`

```yaml
schedule:
  interval: "weekly"     # daily | weekly | monthly | cron
  day: "monday"          # weekly only
  time: "09:00"          # HH:MM UTC
  timezone: "America/Mexico_City"
```

## Grouping Options

```yaml
groups:
  GROUP_NAME:
    applies-to: "version-updates"   # or "security-updates"
    dependency-type: "development"  # or "production"
    patterns: ["jest*", "@testing*"]
    exclude-patterns: ["jest-circus"]
    update-types: ["minor", "patch"]
    group-by: "dependency-name"     # for cross-directory grouping
```

## Filtering Options

```yaml
ignore:
  - dependency-name: "lodash"
  - dependency-name: "express"
    versions: ["5.x"]

allow:
  - dependency-type: "production"
```

## PR Customization

```yaml
labels:
  - "dependencies"
  - "npm"

commit-message:
  prefix: "chore"
  prefix-development: "chore"
  include: "scope"

open-pull-requests-limit: 5   # default: 5 for version, 10 for security
                               # set to 0 to disable version updates

target-branch: "develop"

assignees: ["username"]

rebase-strategy: "auto"       # auto | disabled
```

## Private Registries

```yaml
registries:
  npm-private:
    type: npm-registry
    url: https://npm.example.com
    token: ${{secrets.NPM_TOKEN}}

updates:
  - package-ecosystem: "npm"
    registries:
      - npm-private
```
