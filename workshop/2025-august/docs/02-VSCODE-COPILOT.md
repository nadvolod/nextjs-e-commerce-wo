# Module 2: VSCode & GitHub Copilot Setup

## Overview

This module guides you through setting up a powerful AI-assisted development environment using VSCode and GitHub Copilot. You'll learn to install, configure, and leverage these tools to enhance your productivity when building e-commerce applications.

## Learning Objectives

By the end of this module, you'll be able to:

- Install and configure VSCode with essential extensions
- Set up and authenticate GitHub Copilot
- Install and run the workshop e-commerce application
- Troubleshoot common development environment issues
- Use key GitHub Copilot features effectively
- Configure project-specific AI assistance with `.copilot-instructions.md`

## Prerequisites

- Completed Module 1 (GitHub Spark)
- GitHub account with Copilot access
- Node.js 20+ installed (Node.js 22+ recommended for best compatibility)
- Basic familiarity with command line

## Part 1: VSCode Installation and Setup

### Installing VSCode

## Part 2: GitHub Copilot Installation and Authentication

### Installing GitHub Copilot

1. **Install the Extension**

   - Open VSCode
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "GitHub Copilot"
   - Install both:
     - GitHub Copilot
     - GitHub Copilot Chat

2. **Authentication**

   ```bash
   # Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   # Type: "GitHub Copilot: Sign In"
   # Follow the authentication flow
   ```

3. **Verify Installation**
   - Check the status bar for Copilot icon
   - Open a new TypeScript file
   - Type a comment and see if Copilot suggests code

## Part 3: Web Application Setup

### Setting Up the E-commerce App

1. **Clone the Repository**

   ```bash
   # Clone the repo you created in Module 1 with GitHub Spark
   git clone [your-github-spark-repo-url]
   cd [your-repo-name]
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

4. **Verify Setup**
   - Open the URL printed in the terminal by the dev server (for Vite, typically http://localhost:5173 unless overridden)
   - Navigate through the e-commerce app
   - Check that all features work

### Exercise: Troubleshooting Development Issues

When setting up the e-commerce application, you might encounter various errors. This exercise will help you practice using GitHub Copilot to diagnose and fix common development issues.

**Your Task:**

1. **Run the application** and observe any errors that occur
2. **If you encounter errors:**

   - Copy the complete error message from the terminal or browser console
   - Open GitHub Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
   - Make sure you are in **Agent mode** so Copilot can execute commands
   - Select your best AI model (Claude Sonnet 4+ or GPT 4+ recommended)
   - Tell Copilot: "Fix this error:" and paste the error message
   - Follow Copilot's suggested solutions

3. **Common scenarios you might encounter:**

   - Dependency installation issues (rollup/native module errors)
   - Port conflicts
   - Module import/export errors
   - Missing environment files

4. **Document your experience:**
   - What error(s) did you encounter?
   - How did Copilot help you solve them?
   - What commands or code changes were needed?

<details>
<summary><strong>📋 Solution Guide</strong> (Click to expand)</summary>

### How to Use Copilot for Each Common Issue

#### Issue 1: Rollup Native Module Error

When you encounter this error during `npm install` or `npm run dev`:

```bash
Error: Cannot find module @rollup/rollup-darwin-arm64. npm has a bug related to
optional dependencies (https://github.com/npm/cli/issues/4828). Please try npm i
again after removing both package-lock.json and node_modules directory.
```

**Use Copilot to solve it:**

1. **Copy the complete error message** (including all stack traces)
2. **Open Copilot Chat** and enable **Agent mode**
3. **Ask Copilot:**
   ```
   Fix this error:
   [paste your complete error message here]
   ```
4. **Let Copilot analyze** and suggest the solution (it will likely recommend cleaning dependencies)
5. **Follow Copilot's commands** exactly as suggested
6. **Ask follow-up questions** if the fix doesn't work: "The error persists, what else should I try?"

#### Issue 2: Module Import/Export Errors

When browser console shows errors like:

```text
Header.tsx:7 Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/@phosphor-icons_react.js?v=0aeb0506' does not provide an export named 'LogOut'
```

**Use Copilot to solve it:**

1. **Copy the browser console error**
2. **In Copilot Chat, ask:**

   ```
   There's a console error with this icon import:
   [paste your error here]

   Please fix the import and show me the correct icon name to use.
   ```

3. **Let Copilot identify** the correct Phosphor icon names
4. **Ask Copilot to make the changes** for you, or follow its suggested replacements
5. **Verify the fix** by refreshing the browser

#### Issue 3: Port Already in Use

When you see:

```bash
Error: listen EADDRINUSE: address already in use :::5173
```

**Use Copilot to solve it:**

1. **Copy the port conflict error**
2. **Ask Copilot:**

   ```
   This port is already in use:
   [paste your error]

   Please help me either kill the process or use a different port.
   ```

3. **Let Copilot provide the terminal commands** to resolve the conflict
4. **Execute the commands** Copilot suggests
5. **Ask for alternatives** if needed: "What if I want to use a different port instead?"

### Key Copilot Troubleshooting Principles

1. **Always use Agent mode** - This lets Copilot execute commands and edit files
2. **Paste complete error messages** - Never truncate or summarize errors
3. **Ask for explanations** - "Why did this happen?" helps you learn
4. **Request step-by-step solutions** - "Walk me through fixing this"
5. **Let Copilot do the work** - Don't try to solve it yourself first
6. **Verify each step** - Ask "Did that work?" before moving to the next step

### Sample Copilot Prompts for Troubleshooting

```
"Fix this npm error: [paste error]"

"This React component has an import error: [paste error] - please fix the imports"

"The dev server won't start: [paste error] - help me resolve this"

"I'm getting a TypeScript error: [paste error] - what's wrong and how do I fix it?"

"This dependency seems to be missing: [paste error] - please install and configure it"
```

</details>

## Part 4: Essential GitHub Copilot Features

### 1. Code Completion

Copilot provides intelligent code suggestions as you type:

```typescript
// Type a comment to guide Copilot
// Create a function to calculate cart total with tax and shipping

// Copilot will suggest:
function calculateCartTotal(
  items: CartItem[],
  taxRate: number,
  shipping: number
): number {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  return subtotal + tax + shipping;
}
```

### 2. Copilot Chat

Use Copilot Chat for complex questions and refactoring:

```bash
# Open Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
# Ask questions like:
"How can I implement error handling for this API call?"
"Refactor this component to use TypeScript generics"
"Write unit tests for this shopping cart function"
```

### 3. Inline Chat

Quick questions and modifications:

```typescript
// Select code and press Ctrl+I / Cmd+I
// Ask: "Add proper error handling to this function"
// Ask: "Make this component responsive with Tailwind"
```

### 4. Code Explanations

```bash
# Select code and ask:
"/explain this React component"
"/explain the purpose of this hook"
```

### 5. Generate Documentation

```typescript
// Select a function and ask:
"/doc add JSDoc comments to this function";
```

## Part 5: Creating and Configuring .copilot-instructions.md

### Understanding Copilot Instructions

The `.copilot-instructions.md` file provides context to GitHub Copilot about your project. While Copilot doesn't automatically read this file, you can reference it to give consistent context.

### Creating the Instructions File

Create a `.copilot-instructions.md` file in your project root:

```markdown
# GitHub Copilot Instructions for E-commerce Workshop

## Project Context

This is a Next.js e-commerce application for the workshop. Focus on modern development practices, testing strategies, and AI-assisted development.

## Technology Stack

- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Testing: Playwright (E2E), Jest (Unit)
- State Management: React Context

## Code Standards

- Use functional components with hooks
- Implement proper TypeScript typing
- Follow mobile-first responsive design
- Include comprehensive error handling
- Write testable, maintainable code

## E-commerce Patterns

- Products: id, name, price, inventory, category
- Shopping cart with persistence
- User authentication and sessions
- Payment integration patterns
- Order management flows
```

### How to Use Copilot Instructions

1. **Reference in Chat**

   ```bash
   "Follow the guidelines in .copilot-instructions.md when generating this component"
   ```

2. **Include in Comments**

   ```typescript
   // Follow project standards from .copilot-instructions.md
   // Create a product component with TypeScript and Tailwind
   ```

3. **Paste Content When Needed**
   - Copy relevant sections when starting new files
   - Reference specific patterns in chat conversations

## Exercise: Hands-on Setup

### Task 1: Environment Setup (15 minutes)

1. Install VSCode and required extensions
2. Set up GitHub Copilot authentication
3. Configure workspace settings
4. Verify Copilot is working with a simple test

### Task 2: Application Setup (20 minutes)

1. Clone your GitHub Spark repository
2. Install dependencies and configure environment
3. Start the development server
4. Explore the generated e-commerce application
5. Document any issues encountered

## Best Practices for AI-Assisted Development

### 1. Provide Clear Context

- Write descriptive comments before coding
- Reference your project's patterns and standards
- Be specific about requirements and constraints

### 2. Validate AI Suggestions

- Review generated code for correctness
- Test functionality thoroughly
- Ensure code follows your project standards

### 3. Use Copilot as a Collaborator

- Ask questions about unfamiliar code
- Request explanations for complex logic
- Get suggestions for alternative approaches

### 4. Maintain Code Quality

- Don't accept suggestions blindly
- Refactor AI-generated code when needed
- Ensure consistent style across your codebase

## What's Next?

Now that you have a properly configured development environment with GitHub Copilot, you're ready to dive into comprehensive testing strategies. The next module will cover end-to-end testing with Playwright and modern testing practices.

---

**Continue to:** [03-TESTS.md](./03-TESTS.md)
