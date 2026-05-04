# Push Protection Reference

Detailed reference for GitHub push protection — preventing secrets from reaching repositories, bypass workflows, and delegated bypass configuration.

## How Push Protection Works

Push protection scans for secrets during the push process and blocks pushes containing detected secrets.

### What Gets Scanned

| Surface | Scanned |
|---|---|
| Command line pushes | ✅ |
| GitHub UI commits | ✅ |
| File uploads to repo | ✅ |
| REST API content creation requests | ✅ |

## Resolving Blocked Pushes — Command Line

### Remove Secret from Latest Commit

```bash
# Edit the file to remove the secret
git commit --amend --all
git push
```

### Remove Secret from Earlier Commits

```bash
git log
git rebase -i <EARLIEST-COMMIT>~1
# Change 'pick' to 'edit' for the offending commit(s)
git add .
git commit --amend
git rebase --continue
git push
```

### Bypass Push Protection

1. Visit the URL from the error message
2. Select a reason: "It's used in tests", "It's a false positive", or "I'll fix it later"
3. Click **Allow me to push this secret**
4. Re-push within **3 hours**

## Delegated Bypass

Gives organizations fine-grained control over who can bypass push protection.

### Enabling Delegated Bypass

1. Settings → Advanced Security → Push protection
2. Enable "Restrict who can bypass push protection"
3. Add users, teams, or roles to the bypass list

### Managing Bypass Requests

1. Navigate to repository Security tab → "Push protection bypass"
2. Review pending requests
3. **Approve** or **Deny**
