# AGENTS.md: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

* **Primary Goal:** An AI-powered SQL assistant Grafana app plugin that helps users write queries, analyze data, and gain observability insights using LLM technology. The plugin provides a conversational interface for interacting with databases through natural language.
* **Business Domain:** Observability and Database Analytics - Bridging the gap between complex SQL querying and intuitive natural language interaction for monitoring and data analysis workflows.

## 2. Core Technologies & Stack

* **Languages:** TypeScript (primary), JavaScript, CSS
* **Frontend Framework:** React 18.2.0 with functional components and hooks
* **Plugin Platform:** Grafana App Plugin (requires Grafana >=10.4.0)
* **AI/LLM Integration:** 
  - `@grafana/llm` (v0.22.1) for LLM functionality
  - `@modelcontextprotocol/sdk` (v1.17.5) for Model Context Protocol
* **Database:** PostgreSQL (primary target for SQL operations)
* **Styling:** Tailwind CSS with Grafana theme integration
* **Build System:** Webpack 5 with TypeScript compilation
* **Testing:** Jest for unit tests, Playwright for E2E testing
* **Package Manager:** npm (v11.5.1, Node.js >=22 required)
* **Development Environment:** Docker Compose with Grafana + PostgreSQL

## 3. Architectural Patterns

* **Overall Architecture:** Grafana App Plugin with chat-based AI interface - follows the Grafana plugin architecture pattern with React components, MCP tool integration, and database connectivity.
* **Directory Structure Philosophy:**
    * `/src`: Contains all primary TypeScript/React source code
    * `/src/components`: Reusable React components organized by feature (App, AppConfig, Chat)
    * `/src/pages`: Top-level page components (Home)
    * `/src/tools`: MCP tools and database interaction utilities
    * `/src/theme`: Grafana theme integration utilities
    * `/src/hooks`: Custom React hooks
    * `/src/utils`: Utility functions
    * `/tests`: E2E tests using Playwright
    * `/.config`: Scaffolded configuration files (DO NOT EDIT)
    * `/provisioning`: Grafana provisioning configuration
    * `/dist`: Build output (generated)
* **Component Organization:** Feature-based component organization with clear separation of concerns. Chat components handle LLM interaction, tools handle database operations, and theme components manage Grafana integration.

## 4. Coding Conventions & Style Guide

* **Formatting:** 
  - Follows Grafana's ESLint configuration (`@grafana/eslint-config`)
  - Uses Prettier for code formatting
  - 2-space indentation standard
  - Semicolons required, single quotes preferred
* **Naming Conventions:**
  - Components: PascalCase (`ChatMessage`, `PostgreSQLQueryTool`)
  - Files: camelCase for components (`ChatMessage.tsx`), kebab-case for configs (`docker-compose.yaml`)
  - Variables/functions: camelCase (`executeQuery`, `isValidQuery`)
  - Constants: SCREAMING_SNAKE_CASE (`OPENAI_API_KEY`)
  - CSS classes: Tailwind utilities + semantic naming (`chat-message-user`, `grafana-panel`)
* **API Design:**
  - **Style:** Functional React components with hooks, TypeScript interfaces for type safety
  - **Abstraction:** Clear separation between UI components, business logic (tools), and API integrations
  - **Extensibility:** Tool-based architecture allows easy addition of new database connectors and LLM capabilities
  - **Trade-offs:** Prioritizes developer ergonomics and type safety over raw performance
* **Common Patterns & Idioms:**
  - **React Patterns:** Functional components with hooks, Suspense for lazy loading, custom hooks for business logic
  - **TypeScript Usage:** Strong typing with interfaces, generics for reusable components, strict null checks
  - **Async Operations:** Async/await pattern, RxJS for Grafana data source integration
  - **State Management:** React state and context, no external state management library
  - **Component Composition:** HOC pattern for theme provider, render props for flexible components
* **Error Handling:** 
  - Uses TypeScript for compile-time error prevention
  - Try-catch blocks for async operations with user-friendly error messages
  - Query validation for SQL safety (prevents DROP, DELETE, TRUNCATE, ALTER operations)
  - Grafana's notification system for user feedback

## 5. Key Files & Entrypoints

* **Main Entrypoint:** `src/module.tsx` - Plugin registration and lazy loading setup
* **Primary Page:** `src/pages/Home.tsx` - Main chat interface with MCP client provider
* **Plugin Configuration:** `src/plugin.json` - Plugin metadata and navigation setup
* **Build Configuration:** `webpack.config.ts` - Webpack configuration extending Grafana defaults
* **Development Environment:** `docker-compose.yaml` - Local Grafana + PostgreSQL setup
* **Package Configuration:** `package.json` - Dependencies, scripts, and Node.js requirements

## 6. Development & Testing Workflow

* **Local Development Environment:**
  - **Prerequisites:** Node.js >=22, npm, Docker & Docker Compose
  - **Setup Process:**
    1. `npm install` - Install dependencies
    2. `npm run dev` - Start development build with file watching
    3. `npm run server` - Start Grafana + PostgreSQL in Docker
    4. Access at `http://localhost:3000` (admin/admin)
* **Task Configuration:**
  - **Build Commands:** 
    - `npm run dev` - Development build with watching
    - `npm run build` - Production build
    - `npm run typecheck` - TypeScript type checking
  - **Code Quality:**
    - `npm run lint` - ESLint checking
    - `npm run lint:fix` - Auto-fix linting issues
  - **Testing:**
    - `npm run test` - Jest unit tests with watch mode
    - `npm run test:ci` - CI-friendly test run
    - `npm run e2e` - Playwright E2E tests (requires running server)
* **Testing:** 
  - Unit tests use Jest with React Testing Library
  - E2E tests use Playwright against running Grafana instance
  - Tests should be placed in `/tests` directory
  - Component tests should use data-testid attributes from `src/components/testIds.ts`
* **CI/CD Process:** 
  - GitHub Actions on push/PR to main/master
  - Runs linting, type checking, unit tests, and E2E tests
  - Tests against multiple Grafana versions
  - Automatic plugin signing for releases

## 7. Specific Instructions for AI Collaboration

* **Theme Integration:** 
  - **Always use Grafana's theme system** - The project uses `GrafanaThemeProvider` component that syncs Grafana themes with CSS custom properties
  - **Use semantic Tailwind classes** instead of hardcoded colors:
    - Backgrounds: `bg-background`, `bg-secondary`, `bg-surface`, `bg-canvas`, `bg-elevated`
    - Text: `text-primary`, `text-secondary`, `text-disabled`, `text-link`
    - Borders: `border-weak`, `border-medium`, `border-strong`
    - Status: `text-success`, `text-warning`, `text-error`, `text-info`
  - **CSS Custom Properties**: All theme values exposed as `--grafana-*` variables for direct CSS usage
* **Grafana UI Components:** Prefer `@grafana/ui` components over custom implementations. Only create custom components when Grafana UI doesn't provide the needed functionality.
* **MCP Tool Development:** When adding new database tools, follow the pattern in `src/tools/postgresQueryTool.ts` - include proper validation, error handling, and TypeScript types.
* **Security:** 
  - Never allow dangerous SQL operations (DROP, DELETE, TRUNCATE, ALTER)
  - Always validate SQL queries before execution
  - Use environment variables for sensitive configuration
  - Follow Grafana's security guidelines for plugins
* **Dependencies:** 
  - Use `npm install <package>` to add dependencies
  - Ensure compatibility with Grafana's React version (18.2.0)
  - Update `package.json` and commit `package-lock.json`
  - Consider bundle size impact for plugin performance
* **Configuration Files:** 
  - Files in `.config/` are scaffolded by `@grafana/create-plugin` - DO NOT EDIT directly
  - Use extension patterns documented in Grafana's plugin tools
  - Override configurations in root-level files (e.g., `tsconfig.json` extends `.config/tsconfig.json`)
* **Commit Messages:** 
  - Use conventional commit format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
  - Include scope when relevant: `feat(chat): add message history`
  - Keep commits focused and atomic
* **Plugin Compliance:**
  - Follow Grafana's plugin publishing guidelines
  - Ensure plugin works in both development and signed modes
  - Test against multiple Grafana versions as defined in CI
  - Use proper plugin metadata in `plugin.json`
