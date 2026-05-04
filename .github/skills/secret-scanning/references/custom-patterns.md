# Custom Patterns Reference

Detailed reference for defining custom secret scanning patterns using regular expressions.

## Overview

Custom patterns extend secret scanning to detect organization-specific secrets not covered by default patterns.

## Pattern Definition

### Required Fields

| Field | Description |
|---|---|
| **Pattern name** | Human-readable name for the pattern |
| **Secret format** | Regular expression matching the secret |

### Regex Syntax

```
# API key with prefix
MYAPP_[A-Za-z0-9]{32}

# Connection string
Server=[\w.]+;Database=\w+;User Id=\w+;Password=[^;]+

# Internal token format
myorg-token-[a-f0-9]{64}

# JWT-like pattern
eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+
```

## Defining Patterns by Scope

### Repository Level

1. Repository Settings → Advanced Security → Custom patterns → **New pattern**
2. Enter pattern details and **Save and dry run**
3. Review results, then **Publish pattern**

### Organization Level

1. Organization Settings → Advanced Security → Global settings → Custom patterns
2. Enter pattern details, dry run against selected repos
3. **Publish pattern**

## Dry Run Process

Always test before publishing:
1. Click **Save and dry run**
2. Review up to 1,000 sample results
3. Identify false positives
4. Edit and re-run if needed
5. **Publish** only when false positive rate is acceptable

## Best Practices

1. **Always dry run** before publishing
2. Use **specific patterns** — overly broad patterns create noise
3. Add **before/after context** to reduce false positives
4. **Document patterns** — include what they detect and why
5. **Test with real examples** from your codebase
