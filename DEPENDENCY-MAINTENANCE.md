# Non-forced npm security update workflow

Use GitHub Actions → **Prepare safe dependency maintenance PR** → **Run workflow** on `main`.

The workflow runs `npm audit fix --package-lock-only --ignore-scripts` without `--force`. It verifies the only changed file is `package-lock.json`, reinstalls dependencies without lifecycle scripts, checks critical and high advisory counts do not increase, runs lint and build and then proposes a **draft PR targeting main**. Nothing updates Hostinger or `production`.

A passing npm build does **not** establish runtime behavior, full dependency safety or that all existing vulnerabilities have been fixed. Some vulnerabilities require a major-version upgrade, replacement, or removal after manual review. No PR is opened if the lockfile does not change.

Avoid automatically merging the draft. If GitHub actions permissions block PR creation, check the workflow log; the updates will have been pushed to a review branch but not merged.
