# VSY Energy: secure release and administrator configuration

## Current deployment model

- `main` holds React/Vite source; it must pass CI before merge.
- `production` contains built assets and Hostinger-deployed PHP files.
- Hostinger auto-deploys changes to `production`.
- **No build or release may be automatically pushed to `production`.**

## Before any release (manual, owner approval required)

1. **Rotate the site's administrator credentials** if any credentials, hashes or setup passwords have appeared in GitHub. The previous values must be regarded as compromised even if files are deleted from the latest revision.
2. In Hostinger, verify a safe backup of `public_html/api/settings.php`, `public_html/api/data/`, and `public_html/uploads/` **outside the webroot**. Backups themselves contain sensitive material and must never be committed to GitHub.
3. Confirm the live `api/settings.php` matches the current, working administrator login and that public web requests cannot download PHP source or configuration.
4. Use Actions > **Prepare manual Hostinger release PR** > Run workflow, from `main`. It creates a **draft PR targeting `production`**; it does not merge or deploy.
5. Review the build diff, especially authentication, the PHP API, media, forms, and routes. Take a fresh Hostinger backup.
6. Only the authorized website owner should merge the production PR. **Merging triggers Hostinger deployment**; confirm afterward that admin login and data still work.

### Important existing risk

This repository previously committed `public/api/settings.php` and deployment instructions with a temporary admin password. This proposal removes the tracked source configuration file and guards against its inclusion in built artifacts, but **it does not erase the sensitive values from Git history or from the existing production branch**. A separate carefully planned migration must move the secret to an untracked server-only location outside `public_html`, update the PHP login code to read it, rotate credentials, and clean historical exposures. Do not remove live production `api/settings.php` until a tested replacement is functioning.

### GitHub Actions permission note

If manual release creation fails with a permission error, repository Settings > Actions > General may need **Allow GitHub Actions to create and approve pull requests** enabled. Do not bypass branch protection or grant broad admin credentials to an agent.

### Security limitations and rollback

The automated release job intentionally **does not delete old production files** or touch configuration/data/uploads. This avoids destructive deployment but may retain obsolete compiled assets. Audit stale files separately. A PR review and GitHub ruleset provide an approval gate, not proof of application security. If a deployment fails, use Hostinger's verified backup and roll back the production branch, checking backend data integrity.
