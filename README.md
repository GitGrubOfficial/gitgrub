# gitgrub

## Vision Statement

GitGrub is a social recipe management platform that brings the power of version control to cooking. By applying software development principles to recipe creation and sharing, GitGrub enables cooks and enthusiasts to track recipe evolution, collaborate on improvements, and build upon each other's recipes. GitGrub makes recipe iteration visible, traceable, and social.

## Problem Statement

Current recipe management solutions face several limitations:

- No structured way to track recipe changes over time
- Difficulty collaborating on recipe improvements
- No clear lineage of how recipes evolve and branch into variants
- Limited ability to merge improvements back into original recipes
- Social sharing focuses on final products rather than the creative
  process

## Setup

### Prerequisites

- Docker
- Docker Compose

### Development Environment

GitGrub uses Docker for local development to ensure a consistent environment across all developer machines.

#### Initial Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:GitGrubOfficial/gitgrub.git
   cd gitgrub
   ```

2. Make the startup script executable:

   ```bash
   chmod +x start-dev.sh
   ```

3. Start the development environment:

   ```bash
   ./start-dev.sh
   ```

This will:

- Build the Docker container
- Start the development environment
- Connect you to an interactive shell inside the container

## Development Workflow

Once inside the container:

1. Install dependencies (first time only):

   ```bash
   ./install-dependencies.sh
   ```

2. Start the development servers:

   **Run in separate terminals**

   In the first terminal (already connected via start-dev.sh):

   ```bash
   # Start the frontend
   cd frontend
   npm run dev
   ```

   In a second terminal:

   ```bash
   # Connect to the running container
   docker exec -it gitgrub-dev bash
   
   # Start the backend
   cd backend
   npm run dev
   ```

3. Access the application:
   - Frontend (Vite): <http://localhost:5173>
   - Backend API: <http://localhost:3001>

### Run Tests

Integration tests currently exist for `backend`.

`cd backend`
`npm run test:integration`

### File Structure

All files in the project root are mounted bidirectionally into the container, allowing you to:

- Edit files using your preferred IDE on your local machine
- Run build commands inside the container
- See changes reflected in both environments in real time

## Viewing Mermaid UML Diagrams

We use Mermaid UML for diagramming. It should be visible in GitHub by default. There are a number of add-ons in JetBrains and VS Code that will let you visualize the charts in preview mode.

You can also make use of Mermaid's diagram editing tool: <https://mermaid.live/>

## How to Contribute

### Development Process

We follow a **Test-Driven Development (TDD)** approach. All contributions must include comprehensive tests, and pull requests without sufficient test coverage will not be accepted.

### Getting Started

1. Refer to [docs/backlog.md](./docs/backlog.md) for the complete development roadmap and project priorities.

2. Find available work:
   - Check the [GitHub Issues](https://github.com/GitGrubOfficial/gitgrub/issues) directly for outstanding work
   - Review the roadmap document where issues are linked as they're created
   - If you're interested in working on a roadmap item that doesn't have an issue yet, feel free to create one

3. Assign yourself to an available issue before starting work.

4. Use the naming convention `issue-##-description-of-issue` (e.g., `issue-42-user-authentication-setup`).

5. Write tests first, then implement functionality. Ensure all existing tests continue to pass.

6. When your work is complete, update [docs/backlog.md](./docs/backlog.md) to mark the corresponding task as completed (change `[ ]` to `[x]`) to keep the roadmap accurate.

7. Create a pull request when ready. Include a description of what was implemented and how it was tested.

### Requirements

- All new functionality must have corresponding unit and/or integration tests
- Code must pass all existing tests
- Follow the established coding conventions and patterns
- Update documentation if your changes affect user-facing functionality
- Keep the roadmap document current by marking completed tasks

Questions? Open a discussion issue or reach out to the maintainers.
