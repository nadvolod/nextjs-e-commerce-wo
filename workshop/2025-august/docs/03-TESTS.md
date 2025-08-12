# Module 3: Testing Strategies

## Modern E2E Testing Approach

End-to-end testing has evolved significantly with new tools, strategies, and AI integration. This module covers AI-supported E2E testing that ensure your e-commerce application works flawlessly from the user's perspective.

## Testing

In this module, you'll use GitHub Copilot to create automated tests for the e-commerce application. We'll focus on essential test coverage with minimal complexity.

### Exercise: Create Playwright Test Suite with AI

#### Step 1: Use the AI Prompt

1. Open GitHub Copilot Chat in VS Code
2. Use the prompt from [`../assets/ai-prompts/create-playwright-tests.md`](../assets/ai-prompts/create-playwright-tests.md). But minimize it to 1 API and 1 UI test! Otherwise this might take a long time!!
3. Let Copilot generate the complete test suite

#### Step 2: Review Generated Tests

Copilot should create:

- `tests/e2e/browser.spec.ts` - Critical user flows
- `tests/e2e/api.spec.ts` - Core API endpoint tests
- `playwright.config.ts` - Basic configuration
- Updated `package.json` with test scripts

### What do you think of these tests?

### Exercise🏋️‍♂️

Create an AI Prompt and guidelines that will fix these tests.
How would you update the prompt?

## Context Engineering

Context Engineering is the future of software engineering!

```text
Context engineering refers to the deliberate design, management, and optimization of the "context" fed into AI models (like large language models or recommendation systems) to improve their outputs, accuracy, or relevance. It's essentially about curating the right information to guide the AI's reasoning or generation process.
```

[Lesson 03 PR Example](https://github.com/nadvolod/nextjs-e-commerce-wo/pull/9)

### Key Testing Concepts

- **Critical Path Focus**: Test only the most important user journeys
- **AI-Assisted Creation**: Let Copilot handle boilerplate and configuration
- **Simple Assertions**: Verify key functionality without over-testing
- **Fast Feedback**: Keep tests quick and reliable

## What's Next?

Now that we have some tests in place, the next module (Module 4) will cover integrating these tests into a modern CI/CD pipeline. After that, Module 5 will wrap everything up with conclusions and next steps for applying what you learned in real projects.

---

**Continue to:** [04-CI-CD-PIPELINE.md](./04-CI-CD-PIPELINE.md)
