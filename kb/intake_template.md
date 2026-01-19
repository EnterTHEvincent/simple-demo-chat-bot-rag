# Intake Template (Requirements → Plan)

Use this template to turn raw notes (call transcript, email, ticket) into a scoped, buildable plan.
If required info is missing, ask clarifying questions.

---

## 1) One-sentence summary
What are we building, for who, and why?

Example:
“Build an internal dashboard for sales reps to estimate a client’s projected balance over time, with clear assumptions and missing-data warnings.”

---

## 2) Users & workflow
- Primary users:
- When do they use it?
- What do they do before/after?

Example:
- Sales rep uses it during a call after collecting high-level financial inputs.
- Output is used to explain options and set expectations.
- After the call, data is saved to CRM or attached to a case record.

---

## 3) Inputs (data we need)
List what the tool needs to work.

- Required inputs:
- Optional inputs:
- Validation rules:
- Where does data come from? (manual form, CRM, spreadsheet)

Example:
- Required: filing status (or “unknown”), estimated debt amount, payment ability range
- Optional: timeline, penalty/interest assumptions, current plan status
- Validation: numeric ranges, required fields, missing data warnings

---

## 4) Outputs (what the tool produces)
- What should the UI show?
- What format is needed (table, summary, export)?
- Who consumes it?

Example outputs:
- Plain-English summary (2–4 bullets)
- A small table of scenarios
- “Assumptions used” section
- “Missing info” section

---

## 5) Constraints & non-goals
- Out of scope (explicit):
- Performance constraints:
- Compliance constraints:

Example:
- Out of scope: legal/tax advice; final determinations; storing sensitive identifiers in chat
- Constraints: fast UI response; no PII in logs; role-based access

---

## 6) Edge cases
- Missing fields
- Contradicting inputs
- Duplicate records
- “Unknown” options

Example:
- User doesn’t know debt amount → allow ranges
- Conflicting values → choose most recent and flag it
- Partial data → return best-effort with warnings

---

## 7) Security & privacy checklist
- Does this involve PII? If yes, what kinds?
- Where is PII stored?
- What is logged?
- Who can access outputs?

Rule:
If sensitive identifiers appear (SSN, DOB, address), redact and do not persist them.

---

## 8) Acceptance criteria (definition of done)
- [ ] Produces correct structured output for normal inputs
- [ ] Handles missing inputs with clear “what’s missing” prompts
- [ ] Refuses or redacts PII
- [ ] Sources / assumptions are visible
- [ ] Clear error handling (bad inputs, server errors)

---

## 9) Clarifying questions (ask these if missing)
- What is the primary decision this output supports?
- What inputs are available today vs future?
- Who is the audience (sales, ops, client)?
- Do we need auditability (who ran it, when, with what assumptions)?
- Any compliance requirements (PII handling, retention)?
