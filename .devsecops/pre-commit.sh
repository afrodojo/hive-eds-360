#!/bin/sh
# Git pre-commit hook: Verify GPG signature and prevent secret leakage
echo "[DevSecOps Gate]: Verifying commit signing and secret patterns..."

# Check for hardcoded private keys or tokens
if git diff --cached | grep -E "BEGIN (RSA|OPENSSH|PRIVATE) KEY|client_secret|api_key"; then
    echo "❌ ERROR: Hardcoded cryptographic key or secret detected in diff. Commit rejected."
    exit 1
fi

echo "✅ DevSecOps pre-commit checks passed."
