# Module 4: CI/CD Pipeline Implementation

## AI Prompt: Set Up GitHub Actions CI/CD with Automated Tests

```
Set up a GitHub Actions workflow for this Next.js e-commerce project with the following requirements:

- Use the latest Ubuntu runner
- Install Node.js (LTS) and cache dependencies
- Install Playwright and all required browsers
- Run all automated tests (Playwright E2E and API tests)
- Ensure tests run in headless mode and only on Chromium
- Do not display Playwright UI reports in the workflow
- Fail the workflow if any test fails
- Use dot or minimal reporter for test output
- Run tests in parallel
- Use `npm ci` for clean installs
- The workflow should trigger on push and pull_request
- If any step fails, the workflow must stop and report the error
- If tests fail, iterate on the workflow or test setup until all tests pass in CI
- After each run, analyze the output and only show errors or issues that need attention
- Keep iterating until the workflow is green and all tests pass

Please generate the complete `.github/workflows/ci.yml` file and update any project scripts if needed.
```
