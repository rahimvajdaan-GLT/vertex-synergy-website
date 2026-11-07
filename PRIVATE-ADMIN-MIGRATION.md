# PRIVATE ADMIN CONFIG MIGRATION — do not deploy until prerequisites are complete

This draft changes the login configuration lookup from `public_html/api/settings.php` to
`domains/vsyenergy.com/private/admin.php`, which lives outside the public webroot.

**No passwords, hashes or configuration contents should ever be posted in GitHub or chat.**

## Requirements on Hostinger before an authorized production release

1. Confirm the current admin login works and obtain a fresh off-webroot backup of
   `public_html/api/settings.php`, `public_html/api/data/`, and uploads.
2. Via Hostinger SSH (already enabled), make a private folder and **copy the working live hash**:

   ```bash
   cd ~/domains/vsyenergy.com
   umask 077
   mkdir -p private
   chmod 700 private
   cp public_html/api/settings.php private/admin.php
   chmod 600 private/admin.php
   php -l private/admin.php
   ```

   The path must be accessible to the PHP process, not only SSH. Confirm Hostinger PHP
   open_basedir restrictions permit loading this file; a CLI check alone does not prove
   the web PHP runtime can read it.
3. Test private file accessibility using a temporary **non-public** PHP diagnostic and
   promptly remove it; never expose the file contents or hash.
4. Review this PR, wait for validation and explicit owner release approval.
5. After a separate approved manual release to `production`, test admin login, logout,
   project forms, enquiry creation, and any authenticated routes.
6. Only **after** confirming private config works, remove `public_html/api/settings.php`
   from Hostinger and carefully plan removal of tracked `production/api/settings.php`
   from the Git repository. Do not delete it from the current production branch first:
   the manual release process preserves it until this migration is confirmed.
7. Rotate administrator credentials **again** after eliminating historical exposures.
   Git history containing old hashes/passwords remains a separate remediation task.

## Fail-closed behavior

If the new private config file is missing or not readable, login returns HTTP 503
with a generic message instead of silently falling back to the public, tracked
configuration. It deliberately does NOT reuse exposed credentials.

## Rollback

Restore the previously working API code using an approved production rollback and
the secure Hostinger backup, then investigate permissions. Never bypass branch
protection or commit passwords to fix availability.

This PR is only a staged code proposal. It DOES NOT modify Hostinger, current
working admin credentials or the live website.
