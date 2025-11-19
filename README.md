# AI Alt Generator

Um gerador inteligente de alt text e descrições detalhadas para imagens, desenvolvido com AI da Azion. Este projeto utiliza uma arquitetura monorepo com pnpm workspaces para organização e escalabilidade.

## Project Structure

```text
├── apps/
│   ├── web/          # Aplicação web principal (React + Vite)
│   └── serverless/   # Função serverless para processamento com AI Inference
├── packages/         # Pacotes compartilhados (uso futuro)
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

## Getting Started

```sh
# Step 1: Clone the repository
git clone https://github.com/your-username/image-alt-generator.git

# Step 2: Navigate to the project directory
cd image-alt-generator

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

## Tecnologias

Este projeto foi desenvolvido com:

- **Aplicação Web**: Vite + React + TypeScript
- **Interface**: shadcn/ui + Tailwind CSS
- **Inteligência Artificial**: Azion AI Inference API
- **Serverless**: Azion Edge Functions
- **Gerenciador de Pacotes**: pnpm workspaces
- **Arquitetura**: Monorepo com múltiplas aplicações

## Funcionalidades

- 🖼️ **Upload de Imagens**: Drag & drop ou seleção manual
- 🤖 **AI Inference**: Processamento com modelos de visão computacional
- 📝 **Alt Text Inteligente**: Descrições concisas e precisas
- 📖 **Descrições Detalhadas**: Textos longos para acessibilidade
- 💻 **Snippet HTML**: Código pronto com syntax highlighting
- 📋 **Cópia Rápida**: Um clique para copiar qualquer resultado
- 🎨 **Interface Moderna**: Design responsivo e acessível

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

## Integração com Azion

Este projeto utiliza a plataforma Azion para processamento de AI Inference e hospedagem:

### AI Inference API

- **Modelo**: qwen-qwen25-vl-3b-instruct-awq
- **Capacidades**: Análise de imagens e geração de texto
- **Endpoint**: Edge Functions para processamento serverless

### Edge Functions

- **Localização**: `apps/serverless/alt-generator.js`
- **Funcionalidade**: Processa uploads e chama a API de AI
- **Performance**: Execução global na edge da Azion

### Configuração

Para configurar a integração com a Azion:

1. Configure suas credenciais da Azion
2. Deploy da Edge Function usando Azion CLI
3. Atualize o endpoint da API no frontend

Documentação: [Azion AI Inference](https://www.azion.com/pt-br/documentacao/produtos/ai/ai-inference/)
