---
name: quanta-ui-safeguard
description: "Use when updating React/TypeScript UI in this app without changing the underlying auth logic, API contracts, or business behavior. Ideal for presentational-only changes to login screens and other pages where the existing flow must remain functional and validated."
model: GPT-4.1
---

# Quanta UI Safeguard

## When to Use
- The user wants a new design for a page while preserving the existing app behavior.
- The task is visual-only, especially for authentication, navigation, or form presentation.
- The user specifically says not to change the API, auth context, backend login flow, or existing behavior.
- The work needs a minimal-scope fix in a React/TypeScript codebase with real validation afterward.

## Goal
Keep the app functional while replacing only the presentation layer. Preserve real logic, contracts, and user flows, and validate the result with the project’s TypeScript and build checks.

## Core Operating Principles
- Do not create a new auth system.
- Do not rewrite or replace `useAuth()`, `login()`, `error`, `clearError()`, or the loading state.
- Do not change the login API contract or backend authentication.
- Do not introduce fake credentials, demo-only login flows, or seed data for login.
- Keep the change visual and local to the page/component being redesigned.
- Prefer targeted reads and minimal edits over broad refactors.

## Preferred Workflow
1. Inspect the target page and the existing auth hook usage.
2. Confirm what behavior is real and must remain untouched.
3. Replace only the presentation, layout, styling, and text of the page.
4. Remove outdated demo/quick-login UI if it exists, including related imports and unused elements.
5. Preserve the real form behavior: validation, auth errors, loading state, and navigation callbacks.
6. Validate with the project’s TS and build checks.

## Required Safety Rules
- Keep `onNavigateRegister` as the registration trigger.
- Keep `login(email.trim(), password)` exactly as the submit behavior.
- Keep authentication error display and loading state visible and functional.
- Keep the form responsive and accessible for mobile layouts.
- Avoid adding mock account buttons, tenant pickers, or any demo-login shortcuts.
- If code references old demo UI, remove the whole pattern rather than partially preserving it.

## Validation Checklist
Before considering the task complete:
- TypeScript validation passes.
- The app builds successfully.
- Login inputs still work with the real auth flow.
- Authentication errors still render properly.
- Register navigation still calls `onNavigateRegister()`.
- No demo-login UI remains on the login page.
- Imports are cleaned up and no unused quick-login/demo code remains.

## Example Prompts
- "Replace the login page visual design while preserving the actual auth logic."
- "Update the login page to the premium SaaS version without changing the existing authentication flow."
- "Remove demo login UI and keep the real email/password login and registration flow intact."
- "Redesign this page visually only; do not touch AuthContext or the backend login API."

## Related Customizations to Create Next
- A project instruction for minimal-scope UI-only changes.
- A React component review agent for preserving state and contracts.
- A validation prompt for frontend TypeScript and build checks.
