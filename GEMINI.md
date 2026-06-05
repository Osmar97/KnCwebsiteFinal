# Project Development Rules

## Core Principles

### 1. Prefer Iteration Over Reinvention
- Always look for existing code before creating new implementations.
- Extend existing patterns whenever possible.
- Do not introduce new architectural patterns unless absolutely necessary.
- Avoid creating duplicate functionality.

### 2. Keep Solutions Simple
- Prefer the simplest solution that satisfies the requirements.
- Avoid premature optimization.
- Avoid unnecessary abstractions.
- Reduce complexity whenever possible.

### 3. Scope Discipline
- Only modify code directly related to the requested task.
- Do not refactor unrelated areas without explicit instruction.
- Avoid drive-by changes.
- Focus on solving the actual problem.

### 4. Maintain Consistency
- Follow existing naming conventions.
- Follow existing folder structures.
- Follow existing coding patterns.
- Keep UI and UX consistent with the rest of the application.

### 5. Root Cause Analysis
- Do not patch symptoms.
- Identify and fix root causes whenever possible.
- Before implementing a fix, understand why the issue occurred.
- Avoid temporary workarounds unless explicitly requested.
- Document root causes when they are not immediately obvious.

---

# Development Workflow

## Before Making Changes

Always:

1. Understand the current implementation.
2. Search for related functionality.
3. Identify dependencies.
4. Assess impact on other features.
5. Determine whether existing code can be reused.
6. Understand the root cause before making changes.

## When Fixing Bugs

Follow this order:

1. Fix within existing implementation.
2. Improve existing implementation.
3. Refactor existing implementation.
4. Introduce a new pattern only as a last resort.

If a new implementation becomes necessary:

- Remove obsolete logic.
- Remove unused code.
- Avoid duplicate pathways.
- Fully retire the old implementation.

## Environment Awareness

Code must work correctly in:

- Development
- Testing
- Production

Additional requirements:

- Never hardcode environment-specific values.
- Use configuration and environment variables.
- Verify behavior across environments before considering work complete.

---

# Investigation Rules

## Evidence Before Assumptions

Before making changes:

- Verify assumptions with evidence.
- Read the relevant code before proposing solutions.
- Do not infer behavior from file names alone.
- Confirm implementation details from source code.
- Trace execution paths when debugging.
- Do not assume a bug's cause without verification.

Always gather evidence before proposing fixes.

---

# Server Management

## Development Server Rules

Before starting a server:

- Identify existing running instances.
- Stop previous related servers.
- Avoid duplicate running processes.
- Ensure correct environment configuration.

After code changes:

- Start a fresh server instance.
- Verify successful startup.
- Confirm application health before testing.
- Resolve startup errors before marking work complete.

---

# Code Organization

## File Size Limits

- Prefer files under 200 lines.
- Refactor files approaching 300 lines.
- Split large components into smaller reusable pieces.
- Separate business logic from UI logic.

## Avoid Duplication

Before creating:

- Components
- Hooks
- Services
- Utilities
- API functions
- Database queries
- Types
- Validation schemas

Always verify whether similar functionality already exists.

Apply DRY (Don't Repeat Yourself) principles.

## Clean Architecture

Separate concerns:

- UI Components
- Business Logic
- API Layer
- Data Access Layer
- Utilities
- Configuration

Avoid mixing responsibilities.

## Code Quality

- Keep the codebase clean and organized.
- Remove dead code when encountered.
- Remove commented-out code before completion.
- Remove temporary debugging code.
- Avoid unnecessary complexity.
- Prioritize readability over cleverness.
- Avoid writing one-off scripts unless explicitly required.
- Focus only on code relevant to the task.

---

# Change Size Policy

Prefer small, reviewable changes.

Avoid:

- Large unrelated refactors
- Massive file rewrites
- Mixing bug fixes with architectural changes

Each change should solve a single problem whenever practical.

---

# Delivery Principles

Prefer:

- Working solutions
- Incremental improvements
- Existing patterns

Avoid:

- Over-engineering
- Future-proofing without evidence
- Building for hypothetical requirements

Implement only what is currently required.

---

# Documentation Standards

## Documentation

- Update relevant documentation whenever behavior changes.
- Document non-obvious business logic.
- Document architectural decisions that may affect future development.
- Keep README and setup instructions current.
- Document required configuration changes.
- Document breaking changes.
- Document deployment considerations when applicable.

## Decision Records

When making significant architectural decisions:

- Record the reasoning.
- Document alternatives considered.
- Explain tradeoffs.
- Document known limitations.

Future contributors should understand why a decision was made.

---

# Dependency Management

## Dependencies

Before adding a dependency:

- Verify existing dependencies cannot solve the problem.
- Prefer native platform features.
- Avoid adding libraries for simple functionality.
- Evaluate maintenance implications.
- Evaluate bundle size impact.
- Evaluate security implications.

Always:

- Remove unused dependencies.
- Justify new dependencies.
- Prefer mature, well-maintained packages.

---

# Type Safety

## TypeScript Standards

- Avoid using `any`.
- Prefer strict typing.
- Reuse existing types whenever possible.
- Create shared types for commonly used structures.
- Resolve type errors instead of bypassing them.
- Avoid unnecessary type assertions.
- Prefer explicit types over inferred ambiguity.
- Keep API contracts strongly typed.

---

# Security Rules

## Environment Variables

- Never overwrite `.env` files without explicit approval.
- Never expose secrets in code.
- Never commit credentials.
- Never log secrets.
- Use environment variables for all sensitive values.

## Authentication & Authorization

Always:

- Validate user permissions.
- Verify ownership where applicable.
- Protect sensitive routes.
- Enforce authorization checks server-side.

Never rely solely on frontend validation.

## Input Validation

Validate:

- API requests
- Form inputs
- Query parameters
- Route parameters
- File uploads
- External integrations

Never trust client input.

## Data Protection

- Sanitize user-generated content.
- Prevent XSS vulnerabilities.
- Prevent injection attacks.
- Use secure defaults.
- Follow least-privilege principles.

---

# Database Rules

## Database Safety

Before modifying schema:

- Evaluate impact.
- Review existing relationships.
- Verify migration safety.
- Assess performance implications.

Never:

- Delete production data without approval.
- Perform destructive migrations without confirmation.
- Break backward compatibility unnecessarily.

## Migration Safety

Before creating migrations:

- Review existing schema dependencies.
- Verify rollback strategy.
- Ensure migrations are idempotent where possible.
- Avoid long-running locks.
- Validate migrations against realistic data volumes.

Never:

- Combine destructive schema changes with unrelated feature work.
- Drop columns or tables without explicit approval.
- Assume production data matches development data.

## Supabase Standards

- Always enable and preserve Row Level Security (RLS) on every table.
- Never disable RLS in production, even temporarily.
- Review RLS policy impact before making schema or policy changes.
- Ensure all queries respect authorization rules — no policy bypasses without explicit approval.
- Validate migrations against existing data before applying to production.
- Use Supabase Edge Functions for server-side logic that must not run on the client.
- Never expose the `service_role` key on the frontend; use `anon` key only.
- Use the `anon` key with proper RLS policies instead of disabling security for convenience.
- Prefer Supabase Auth for authentication flows; do not roll custom auth unless absolutely necessary.
- Use Supabase Storage buckets with appropriate access policies; never make sensitive buckets public.
- Always test RLS policies with both authenticated and unauthenticated roles before deploying.
- Prefer server-side Supabase client (with service role) only inside Edge Functions or trusted server environments.
- Use parameterized queries and Supabase SDK methods; avoid raw SQL string interpolation.
- Monitor and respect Supabase rate limits and connection pool limits.

## Query Performance

Prefer:

- Indexed lookups
- Explicit filtering
- Efficient joins
- Pagination

Avoid:

- Full table scans
- Duplicate queries
- Unbounded results
- N+1 query patterns

---

# Third-Party Integrations

## Integration Standards

- Always wrap third-party API calls in error boundaries with timeouts.
- Never expose third-party API keys on the client side.
- Document all integration points: what data flows in, what flows out, and failure modes.
- Assume third-party services can be unavailable; design for graceful degradation.
- Use environment variables for all integration credentials — never hardcode.
- Keep integration logic isolated in dedicated service modules; do not scatter API calls throughout the codebase.
- Log integration errors with enough context to debug without exposing sensitive payloads.
- When upgrading a third-party SDK or dependency, review breaking changes and test integration flows end-to-end.
- Prefer official SDKs over raw HTTP calls when available and well-maintained.

---

# Deployment & CI/CD Rules

## Deployment Standards

- Preview deployments must be reviewed and verified before merging to main.
- Never deploy breaking changes without a rollback strategy defined in advance.
- Environment variables must be verified in the target environment before deploying.
- Deployments to production require a final confirmation that staging or preview has been validated.
- Never use production credentials in development or staging environments.
- Keep deployment configurations (Vercel, CI pipelines) under version control.
- Document any manual steps required as part of a deployment (migrations, config changes, cache clears).
- After every production deployment, verify the application starts and critical flows work end-to-end.

---

# Client Project Isolation

## Multi-Client Standards

- No shared credentials, API keys, or configuration between separate client projects.
- Maintain clear project-level separation in repositories and deployment environments.
- Client data must never appear in another client's context, logs, or environment.
- Name environments, branches, and Supabase projects unambiguously per client.
- Do not reuse Supabase projects, storage buckets, or auth tenants across different clients.
- Treat each client project as fully isolated by default; shared infrastructure requires explicit approval and documentation.

---

# API Design

## REST Standards

Follow REST conventions.

Use:

- Correct HTTP methods
- Meaningful status codes
- Consistent response structures

## Error Responses

Use RFC 7807 Problem Details format whenever possible.

Example:

```json
{
  "type": "validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Email address is invalid"
}
```

## API Principles

- Maintain backward compatibility whenever possible.
- Version APIs when necessary.
- Keep endpoints predictable.
- Use consistent naming.
- Validate all incoming data.
- Return structured errors.

---

# Performance Rules

## General

- Avoid unnecessary re-renders.
- Avoid unnecessary API calls.
- Avoid unnecessary database queries.
- Avoid expensive operations in loops.
- Measure before optimizing.

## Frontend

Prefer:

- Lazy loading
- Code splitting
- Memoization when justified
- Optimized images
- Efficient state management

Avoid:

- Premature memoization
- Excessive state management
- Deep prop drilling

## Backend

Prefer:

- Efficient queries
- Caching where appropriate
- Pagination
- Batching operations

Avoid:

- N+1 queries
- Repeated expensive computations
- Fetching unnecessary data

## Performance Budgets

- Target Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90.
- All images must be optimized and served in modern formats (WebP or AVIF) unless there is a specific reason not to.
- No render-blocking resources without explicit justification.
- Measure Core Web Vitals (LCP, CLS, INP) on key pages before considering a release production-ready.

## Performance Validation

Before implementing performance optimizations:

- Identify the bottleneck.
- Measure current behavior.
- Define success criteria.
- Verify improvement after implementation.

Do not optimize based on assumptions.

---

# State Management

Prefer:

- Local state before global state
- Existing state patterns before introducing new ones
- Derived state instead of duplicated state

Avoid:

- Multiple sources of truth
- Unnecessary global stores
- State synchronization hacks

---

# Cost Awareness

- Prefer solutions that minimize infrastructure costs.
- Avoid unnecessary API calls, including to AI, third-party, or paid services.
- Avoid unnecessary database operations; batch reads and writes where practical.
- Consider bundle size impact on CDN and bandwidth costs.
- Consider hosting and execution costs (serverless invocations, Edge Function calls, storage egress) when proposing architectures.
- Prefer caching over repeated fetches for data that does not change frequently.
- Do not introduce paid services or higher-tier infrastructure without explicit approval.

---

# Observability

Changes affecting production systems should consider:

- Logging
- Metrics
- Monitoring
- Alerting
- Error tracking

New critical workflows should produce sufficient telemetry for troubleshooting.

If an issue cannot be diagnosed from available logs and monitoring, observability is insufficient.

---

# User Interface Standards

## Mobile-First Design

- Design and implement mobile layouts first; scale up to tablet and desktop.
- Never treat mobile as an afterthought or a scaled-down version of the desktop layout.
- Test all new UI on a real mobile viewport before considering it complete.

## UI Consistency

- Reuse existing UI components before creating new ones.
- Follow the design system.
- Maintain consistent spacing.
- Maintain consistent typography.
- Maintain consistent interactions.
- Preserve established user flows.

## Asset & Brand Consistency

- Logos, fonts, and color tokens must come from the project's design system or brand assets.
- Never hardcode hex values inline when a design token exists.
- No one-off color or typography decisions without design approval.
- Brand assets must be sourced from the designated asset folder, not recreated or approximated.

## Responsive Design

Ensure functionality works on:

- Mobile (design first)
- Tablet
- Desktop

## Accessibility

Always:

- Support keyboard navigation.
- Use semantic HTML.
- Provide form labels.
- Maintain sufficient contrast.
- Support screen readers where applicable.
- Include accessible error messaging.

---

# Error Handling

## General

Never silently ignore errors.

Always:

- Catch expected failures.
- Return meaningful messages.
- Log actionable details.
- Preserve debugging information.

## User Experience

Users should receive:

- Clear messages
- Helpful guidance
- Appropriate fallbacks

Never expose:

- Stack traces
- Internal implementation details
- Sensitive system information

---

# Logging Standards

## Logging Rules

Log:

- Errors
- Warnings
- Security events
- Important state changes

Avoid logging:

- Passwords
- Tokens
- Secrets
- Personal data

## Log Quality

Logs should answer:

- What happened?
- Where did it happen?
- Why did it happen?
- What should be investigated?

---

# Testing Standards

## Testing Requirements

Write tests for:

- Business logic
- API endpoints
- Critical workflows
- Authentication flows
- Permission systems
- Bug fixes

## Test Quality

Tests should:

- Verify behavior
- Cover edge cases
- Cover error conditions
- Be deterministic
- Be maintainable

Avoid:

- Fragile tests
- Overly coupled tests
- Excessive mocking

## Mocking Policy

Allowed:

- Unit tests
- Integration tests

Not allowed:

- Development environments
- Production environments

Never:

- Add fake production data
- Add stubbing patterns to production code
- Create dev-only fake business logic

---

# AI-Assisted Code Policy

## Standards for AI-Generated Code

- AI-generated code (from Claude, Lovable, Cursor, Copilot, or similar tools) must go through the same review and quality checklist as hand-written code.
- Never merge AI output directly without reviewing for correctness, security, and consistency with the existing codebase.
- AI-generated code does not exempt a task from the Completion Checklist.
- Be especially cautious with AI-generated RLS policies, authentication logic, and database migrations — review these manually before applying.
- If AI output introduces a new pattern or dependency not already in the project, treat it as a deliberate architectural decision and justify it explicitly.
- Remove any AI-generated placeholder comments, TODO stubs, or example values before committing.

---

# AI Agent Constraints

Never:

- Claim functionality was tested if it was not tested.
- Claim code compiles if compilation was not verified.
- Claim bugs are fixed without validation.
- Invent API responses.
- Invent database schemas.
- Invent file contents.
- Invent implementation details.

Always:

- Clearly distinguish facts from assumptions.
- State limitations when verification is not possible.
- Request additional information when required.

---

# Lovable-Specific Rules

Before creating:

- New tables
- New APIs
- New components
- New services
- New pages

Search the existing project for reusable implementations.

Prefer extending existing functionality over creating parallel systems.

Avoid creating duplicate user flows, duplicate schemas, duplicate APIs, or duplicate UI patterns.

---

# Feature Stability

## Protect Working Systems

- Avoid major architectural changes to stable features.
- Do not rewrite working code without clear justification.
- Preserve proven patterns unless explicitly instructed otherwise.
- Consider downstream effects before changing shared logic.

## Feature Rollout

For high-risk changes:

- Consider feature flags.
- Maintain backward compatibility.
- Avoid breaking user workflows.

---

# Validation Standards

## Mandatory Validation

Before declaring a task complete:

- Verify the requested functionality works end-to-end.
- Do not assume code correctness from successful compilation alone.
- Validate actual user workflows.
- Verify frontend behavior.
- Verify backend behavior.
- Verify database interactions.
- Verify API responses.
- Verify authentication and authorization flows when affected.
- Confirm expected behavior in Development, Testing, and Production environments where applicable.
- Test both successful and failure scenarios.
- Validate edge cases related to the change.
- Confirm that bug fixes prevent the original issue from recurring.
- Ensure no regressions have been introduced.
- Verify that all affected functionality continues to work as expected.
- Review logs and console output for unexpected warnings or errors.
- Do not mark work complete based solely on code changes, static analysis, or passing tests.
- Consider a task complete only after the implemented solution has been validated against the original requirements.

---

# Version Control Standards

## Git Hygiene

- Keep changes focused and atomic.
- Avoid unrelated modifications.
- Remove temporary code before completion.
- Remove obsolete code.
- Do not leave unnecessary TODOs.
- Keep commit scopes clear and logical.

---

# Completion Checklist

Before considering a task complete:

## Verification

- Requirements are satisfied.
- Root cause has been addressed.
- Existing functionality remains intact.
- Tests pass.
- Application builds successfully.
- No TypeScript errors exist.
- No linting errors exist.
- No console errors exist.
- No duplicated logic exists.
- No dead code exists.
- No security issues were introduced.
- No performance regressions were introduced.
- Documentation has been updated where needed.
- The application starts successfully.
- Lighthouse scores meet defined budgets (Performance ≥ 85, Accessibility ≥ 90).
- Mobile layout has been tested.
- All third-party integrations behave correctly in the target environment.
- RLS policies have been reviewed if any Supabase schema or data access changed.
- No unnecessary API calls, database operations, or paid service usage was introduced.

## Final Review Questions

- Can this be simpler?
- Can existing code be reused?
- Can duplication be removed?
- Is this consistent with the codebase?
- Is this production-ready?
- Have all side effects been considered?
- Has AI-generated code been reviewed manually?
- Does this introduce any unnecessary cost?

---

# AI Assistant Operating Rules

## Decision Making

- When requirements are unclear, ask for clarification instead of making assumptions.
- Prefer confidence over speed.
- Explicitly identify risks before implementing potentially destructive changes.
- Never perform destructive actions on data, infrastructure, or configuration without approval.
- If multiple implementation approaches exist, prefer the one most consistent with the existing codebase.

## Code Generation Rules

When generating code:

- Prioritize existing patterns.
- Prioritize maintainability.
- Prioritize readability.
- Prioritize simplicity.
- Prioritize security.
- Prioritize consistency.

Never:

- Invent architecture unnecessarily.
- Rewrite working systems without reason.
- Introduce new frameworks without justification.
- Create duplicate implementations.
- Modify unrelated code.

Always:

- Understand before changing.
- Minimize scope.
- Consider side effects.
- Keep the codebase clean.
- Think about impacted areas and dependencies.
- Leave the codebase better than you found it.
