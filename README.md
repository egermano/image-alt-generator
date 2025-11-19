# Image Alt Generator Monorepo

A monorepo for the image alt generator project using pnpm workspaces.

## Project Structure

```text
├── apps/
│   └── web/          # Main web application (React + Vite)
├── packages/         # Shared packages (future use)
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

## Getting Started

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies for all workspaces
pnpm install

# Step 4: Start the development server
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start the web app development server
- `pnpm build` - Build the web app for production
- `pnpm lint` - Run linting across all packages
- `pnpm clean` - Clean all node_modules and build artifacts

## Technologies

This project is built with:

- **Web App**: Vite + React + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Package Manager**: pnpm workspaces
- **Monorepo Structure**: Apps and packages organization

## Workspace Commands

Run commands in specific workspaces:

```sh
# Run dev server for web app
pnpm --filter @image-alt-generator/web dev

# Build web app
pnpm --filter @image-alt-generator/web build

# Install dependencies in web app
pnpm --filter @image-alt-generator/web add <package-name>
```
