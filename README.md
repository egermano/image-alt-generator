# AI Alt Generator

Um gerador inteligente de alt text e descrições detalhadas para imagens, desenvolvido com AI da Azion. Este projeto utiliza uma arquitetura monorepo com pnpm workspaces para organização e escalabilidade.

**🌐 Live Demo:** <https://qkghz9yhhra.map.azionedge.net>

## Features

- 🖼️ **Image Upload**: Drag & drop or manual selection
- 🤖 **AI Inference**: Image analysis and text generation with VLM model
- 📝 **Alt Text**: Concise and accurate descriptions
- 📖 **Long Descriptions**: Long descriptions for accessibility
- 💻 **HTML Snippet**: Ready-to-use code with syntax highlighting

## Project Structure

```text
├── apps/
│   ├── web/          # Web application (React + Vite)
│   └── serverless/   # Serverless function for AI Inference processing
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

This project is built with:

- **Web App**: Vite + React + TypeScript
- **Interface**: shadcn/ui + Tailwind CSS
- **Serverless**: [Azion Functions](https://www.azion.com/en/products/functions/)
- **AI/LLM**: [Azion AI Inference](https://www.azion.com/en/products/ai-inference/)

## Integration with Azion

This project uses the Azion platform for AI Inference processing and hosting:

### AI Inference

- **Model**: qwen-qwen25-vl-3b-instruct-awq
- **Capabilities**: Image analysis and text generation with VLM model

### Serverless Functions

- **Location**: `apps/serverless/alt-generator.js`
- **Functionality**: Processes image uploads and calls AI Inference API
- **Performance**: Global execution on Azion edge

Documentation: [Azion AI Inference](https://www.azion.com/pt-br/documentacao/produtos/ai/ai-inference/)
