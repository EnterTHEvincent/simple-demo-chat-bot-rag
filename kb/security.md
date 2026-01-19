# Security & PII Rules (Internal Tools)

This document defines how the assistant and app should handle sensitive data.

---

## What counts as PII / Sensitive Data
Treat these as sensitive:
- SSN, DOB, address, phone number, email
- Tax balances, IRS notices, tax return details
- Bank account numbers, routing numbers, payment details
- Login credentials, API keys, tokens
- Any unique identifiers that can identify a person

If unsure: assume sensitive.

---

## Hard Rules
1) **Do not request SSNs or full DOBs in chat.**
2) **Never log PII** to console, server logs, analytics, or error trackers.
3) **Do not put PII in URLs** (query params or paths).
4) **Redact** sensitive strings when displaying or echoing user input.
5) **Least privilege**: only authorized users should access sensitive fields.
6) **Minimize retention**: store the minimum required data for the shortest time.

---

## Redaction Guidelines
- SSN: keep last 4 only: `***-**-1234`
- DOB: keep year only if needed: `****-**-**` or `YYYY`
- Account IDs: keep last 6 if necessary
- Emails: mask part: `v***@domain.com`

---

## What the assistant should do if user pastes PII
- Acknowledge and **warn not to share PII**
- **Redact it** in any response
- Ask for a safer identifier:
  - ticket ID
  - internal record ID
  - last 4 digits only (if policy allows)

Example response behavior:
“I noticed you included sensitive info. Please don’t paste SSNs here. If you share a ticket ID or the last 4 digits only, I can help.”

---

## Logging & Observability
Allowed logs:
- request IDs
- timestamps
- error codes (no payloads)
- sanitized summaries

Not allowed:
- raw message bodies that might contain PII
- screenshots or dumps of user inputs
