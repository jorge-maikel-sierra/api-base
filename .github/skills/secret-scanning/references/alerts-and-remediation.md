# Alerts and Remediation Reference

Detailed reference for secret scanning alert types, validity checks, remediation workflows, and API access.

## Alert Types

### User Alerts

Generated when secret scanning detects a supported secret in the repository.

- Displayed in the repository **Security** tab
- Created for provider patterns, non-provider patterns, custom patterns, and AI-detected secrets
- Scanning covers entire Git history on all branches

### Push Protection Alerts

Generated when a contributor bypasses push protection to push a secret.

- Displayed in the Security tab (filter: `bypassed: true`)
- Record the bypass reason chosen by the contributor
- Include the commit and file where the secret was pushed

**Bypass reasons and their alert behavior:**

| Bypass Reason | Alert Status |
|---|---|
| It's used in tests | Closed (resolved as "used in tests") |
| It's a false positive | Closed (resolved as "false positive") |
| I'll fix it later | Open |

### Partner Alerts

Generated when GitHub detects a leaked secret matching a partner's pattern.

- Sent directly to the service provider (e.g., AWS, Stripe, GitHub)
- **Not** displayed in the repository Security tab
- Provider may automatically revoke the credential
- No action required by the repository owner

## Alert Lists

### Default Alerts List

The primary view showing alerts for:
- Supported provider patterns (e.g., GitHub PATs, AWS keys, Stripe keys)
- Custom patterns defined at repo/org/enterprise level

### Generic Alerts List

Separate view (toggle from default list) showing:
- Non-provider patterns (private keys, connection strings)
- AI-detected generic secrets (passwords)

**Limitations:**
- Maximum 5,000 alerts per repository (open + closed)
- Only first 5 detected locations shown for non-provider patterns
- Only first detected location shown for AI-detected secrets
- Not shown in security overview summary views

## Validity Checks

Validity checks verify whether a detected secret is still active.

### Validation Statuses

| Status | Meaning | Priority |
|---|---|---|
| `Active` | Secret is confirmed to be valid and exploitable | 🔴 Immediate |
| `Inactive` | Secret has been revoked or expired | 🟡 Lower priority |
| `Unknown` | GitHub cannot determine validity | 🟠 Investigate |

## Remediation Workflow

### Step-by-Step Remediation

1. **Receive alert** — via Security tab, email notification, or webhook
2. **Assess severity** — check validity status (active = urgent)
3. **Rotate the credential** — revoke the old credential and generate a new one
4. **Update references** — update all code/config that used the old credential
5. **Investigate impact** — check logs for unauthorized use during the exposure window
6. **Close the alert** — mark as resolved with appropriate reason
7. **Optionally clean Git history** — remove from commit history (time-intensive)

### Removing Secrets from Git History

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove a specific file from all history
git filter-repo --path secrets.env --invert-paths

# Force push the cleaned history
git push --force --all
```

> **Note:** Rewriting history is disruptive — it invalidates existing clones and open PRs.
