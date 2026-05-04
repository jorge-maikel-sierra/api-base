# Dependabot PR Comment Commands

Interact with Dependabot PRs using `@dependabot` comments.

> **Note:** As of January 2026, merge/close/reopen commands have been deprecated.
> Use GitHub's native UI, CLI (`gh pr merge`), or auto-merge instead.

## Available Commands

| Command | Effect |
|---|---|
| `@dependabot rebase` | Rebase the PR against the target branch |
| `@dependabot recreate` | Recreate the PR from scratch (discards manual changes) |
| `@dependabot ignore this dependency` | Close the PR and stop updating this dependency |
| `@dependabot ignore this major version` | Ignore the current major version |
| `@dependabot ignore this minor version` | Ignore the current minor version |
| `@dependabot ignore this patch version` | Ignore the current patch version |

## For Grouped PRs

| Command | Effect |
|---|---|
| `@dependabot ignore DEPENDENCY_NAME` | Ignore a specific dependency in the group |
| `@dependabot unignore DEPENDENCY_NAME` | Clear ignores and re-add to update |
| `@dependabot unignore *` | Clear all ignores for all dependencies in the group |
| `@dependabot show DEPENDENCY_NAME ignore conditions` | Display current ignores |

## Notes

- Commands only work on Dependabot-generated PRs
- The `@dependabot` user must have write access to the repository
- Commands are processed asynchronously (may take a few minutes)
