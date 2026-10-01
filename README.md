# Veydran Vmail

Public Easter-egg site for `vmail.veydran.space`.

This version is deliberately static: there is no database, no account system, and no network request for login submissions. Login and puzzle form values are cleared locally and are never transmitted, stored, logged, or evaluated.

## Deployment

Publish the `main` branch from the repository root with GitHub Pages, then configure the custom domain as `vmail.veydran.space` and point the `vmail` DNS record at the GitHub Pages hostname shown by GitHub.

The impossible account-registration challenge and failed-login responses are theatrical only.
