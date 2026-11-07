#!/usr/bin/env python3
"""Compare aggregate npm audit severity counts without publishing advisory details."""
import json
import sys

def counts(path):
    with open(path, encoding="utf-8") as source:
        payload = json.load(source)
    if "error" in payload or "metadata" not in payload:
        raise RuntimeError("npm audit did not return usable security metadata")
    vulnerabilities = payload["metadata"].get("vulnerabilities", {})
    return {level: int(vulnerabilities.get(level, 0)) for level in ("critical", "high", "moderate", "low")}

before, after = counts(sys.argv[1]), counts(sys.argv[2])
print("Before:", before)
print("After: ", after)
for level in ("critical", "high"):
    if after[level] > before[level]:
        raise SystemExit("Security fix increased " + level + " advisories")
print("Security counts verified; unresolved vulnerabilities require separate review.")
