# CMS QA failure and preview validation — 2026-10-26

Previous commit: 08d813fdb048d78a7168ff41418b934b3e008763.
Netlify deploy 6adf5b2427ccaa22b08ea827 completed successfully.
The failing check was GitHub Actions CMS QA run 40334451570, job 121612161995,
in the Hosted Cloud preview browser integration step, not the Netlify build
or the local CMS save integration.

The browser test embedded a quoted attribute selector inside another quoted
JavaScript expression. This produced SyntaxError: Private field '#portfolio'
must be declared in an enclosing class before navigation could be tested.
The current kinetic QA replaces the obsolete scroll scene assertions and keeps
an explicit desktop portfolio navigation regression check. Its selector is
serialized using JSON.stringify before inclusion in the browser expression.
No CMS schema or production permissions were relaxed to address this failure.

Validation: unit/integration tests (22), CMS route API checks (9), TypeScript,
ESLint and formatting. Local CMS browser and hosted preview results are stored
under docs/qa-cms and docs/qa-kinetic-preview respectively when completed.
