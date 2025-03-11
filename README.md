# Cambrian - Plugin Development

Hello World

<div align="center">
  <pre>
  ███████╗███████╗██╗      █████╗  ██████╗ ███████╗███╗   ██╗████████╗    ██╗  ██╗██╗████████╗
  ██╔════╝██╔════╝██║     ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝    ██║ ██╔╝██║╚══██╔══╝
  ███████╗█████╗  ██║     ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║       █████╔╝ ██║   ██║   
  ╚════██║██╔══╝  ██║     ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║       ██╔═██╗ ██║   ██║   
  ███████║███████╗██║     ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║       ██║  ██╗██║   ██║   
  ╚══════╝╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝  ╚═╝╚═╝   ╚═╝   
  </pre>
  <h4>Plugin Development Template for Cambrian</h4>
</div>


<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <i>Developed with ❤️ by <b><a href="https://cambrian.dev">Cambrian</a></b></i>
</p>

## 🚀 Introduction

This repository is a starter kit for developers who want to build plugins for Cambrian. It provides a simplified workflow to create custom integrations for protocols and services on the SEI blockchain.

## 📋 Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- Basic understanding of TypeScript and blockchain concepts

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/cambrian-protocol/cambrian-plugin.git
   cd cambrian-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🛠️ Creating Your First Plugin

### 1. Use the Plugin Generator

Run the provided script to create a new plugin structure:

```bash
npm run create-your-plugin your-plugin-name
```

This will:
- Create a directory at `src/tools/your-plugin-name/`
- Generate an `index.ts` file that exports your plugin functions
- Create a template function file (`your-plugin-name.ts`)
- Update the main tools index to include your plugin

### 2. Plugin Structure

After running the generator, you'll have:

```
src/tools/your-plugin-name/
├── index.ts              # Exports all functions from your plugin
└── your-plugin-name.ts   # Implementation of your plugin functionality
```

### 3. Implement Your Plugin Logic

Edit the generated `your-plugin-name.ts` file to implement your specific functionality:

```typescript
import { SeiAgentKit } from "../../index";

/**
 * Performs some action with your protocol
 * @param agent SeiAgentKit instance
 * @param param1 Description of parameter
 * @returns Result data or transaction hash
 */
export async function yourPluginName(
  agent: SeiAgentKit,
  param1: string  // Add any parameters your function needs
): Promise<any> {
  // Implement your logic here
  
  // Example: Connect to a protocol, make a transaction, etc.
  
  return { success: true, message: "Operation completed" };
}
```

### 4. Add Additional Functions (Optional)

If your plugin needs multiple functions, create new files for each major operation:

```bash
touch src/tools/your-plugin-name/anotherFunction.ts
```

Then implement the function and export it in your plugin's `index.ts`:

```typescript
// In index.ts
export * from "./your-plugin-name";
export * from "./anotherFunction";
```

## 📌 Best Practices

### Function Design

1. **Clear naming**: Use descriptive function names that indicate the action
2. **Input validation**: Always validate input parameters
3. **Error handling**: Implement proper error handling with informative messages
4. **Documentation**: Include JSDoc comments for all functions

### Code Example

```typescript
import { SeiAgentKit } from "../../index";

/**
 * Stakes tokens in the protocol
 * @param agent SeiAgentKit instance
 * @param amount Amount to stake (in full tokens, not micro)
 * @returns Transaction hash
 */
export async function stakeTokens(
  agent: SeiAgentKit,
  amount: number
): Promise<string> {
  // 1. Input validation
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new Error(`Invalid amount: ${amount}. Must be a positive number.`);
  }

  try {
    // 2. Your implementation
    // ...

    // 3. Return result
    return "tx_hash_here";
  } catch (error) {
    // 4. Error handling
    console.error(`Error in stakeTokens: ${error}`);
    throw error;
  }
}
```

## 🔄 Plugin Integration Flow

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│     Step 1    │     │     Step 2    │     │     Step 3    │
│  Run Plugin   │────▶│  Implement    │────▶│  Add More     │
│  Generator    │     │  Functions    │     │  Functions    │
└───────────────┘     └───────────────┘     └───────────────┘
                                                    │
                                                    ▼
                      ┌───────────────┐     ┌───────────────┐
                      │     Step 5    │     │     Step 4    │
                      │  Test your    │◀────│  Document     │
                      │    plugin     │     │  Your Plugin  │
                      └───────────────┘     └───────────────┘
```
## 📤 Submitting Your Plugin

Once you've completed and tested your plugin, submit it for inclusion in the Cambrian ecosystem:

1. **Create a fork** of the cambrian-plugin repository
2. **Push your changes** to your fork
3. **Submit a pull request** with a clear description of your plugin's functionality and use cases

Our team will review your submission and handle the integration process. We may reach out for clarification or suggest improvements before merging.

When submitting your pull request, please include:
- A brief description of what your plugin does
- Any dependencies it requires
- Example usage scenarios
- Testing results

## 🔗 Links

- [Cambrian](https://x.com/cambrian_ai)
- [SEI Blockchain](https://www.sei.io/)

---

<div align="center">
  <p>Building on SEI with Cambrian </p>
</div> 
