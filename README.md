# SwapFlow – Modular Next.js dApp with ZeroDev + Dynamic Smart Wallets

## Overview

**SwapFlow** is a modern, gasless token swap dApp built with Next.js, React, and TypeScript. It leverages [Dynamic](https://docs.dynamic.xyz/) and [ZeroDev](https://zerodev.app/) for seamless smart wallet integration, enabling users to swap tokens with sponsored (gasless) transactions. The codebase is fully modular, with all major UI and logic split into reusable components for maintainability and scalability.

---

## Table of Contents

- [Features](#features)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How the Modularization Works](#how-the-modularization-works)
- [ZeroDev + Dynamic Integration](#zerodev--dynamic-integration)
- [Customization & Extending](#customization--extending)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Gasless Swaps:** All swaps are sponsored via ZeroDev paymaster, so users pay no gas.
- **Smart Wallets:** Users interact with a smart account (kernel account) via Dynamic + ZeroDev.
- **Modern UI:** Built with shadcn/ui, TailwindCSS, and best UX practices.
- **Modular Components:** All swap logic is split into reusable, testable components.
- **Transaction History:** Users see a real-time history of their swaps.
- **Balances & Copyable Address:** Users can view balances and easily copy their smart account address.
- **Network Agnostic:** Easily add more EVM networks supported by Dynamic/ZeroDev.

---

## Architecture & Folder Structure

```
/app
  /swap
    page.tsx           # Main swap page, orchestrates state and components
    /allowance         # (Optional) Allowance test page
  /payments            # (Optional) Payments page
  layout.tsx           # App layout with Providers and Header
  page.tsx             # Landing page

/components
  /swap
    AccountInfo.tsx    # Smart account address + copy button
    TokenBalances.tsx  # Token balances card
    SwapForm.tsx       # Swap form (from/to, amounts, swap button)
    SwapLogs.tsx       # Swap progress logs
    SwapHistory.tsx    # Transaction history card
  /ui                  # Reusable UI primitives (button, card, input, etc.)
  Providers.tsx        # Dynamic, Wagmi, and Query providers
  Header.tsx           # App header with DynamicWidget

/abi                   # Contract ABIs
/lib                   # Utility functions

/types                 # (Recommended) Shared TypeScript types (see below)
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **Yarn** or **pnpm** (or npm)

### Installation

```bash
git clone https://github.com/yourusername/swapflow.git
cd swapflow
yarn install
# or: pnpm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_env_id
ZERODEV_RPC=your_zerodev_bundler_rpc_url
PRIVATE_KEY=your_server_side_private_key
NEXT_PUBLIC_MOCK_USDC=0x... # Mock USDC token address
NEXT_PUBLIC_MOCK_PEPE=0x... # Mock PEPE token address
NEXT_PUBLIC_MOCK_SWAP=0x... # Mock swap contract address
```

**Note:**

- `PRIVATE_KEY` is only used for server-side actions (if any). Never expose it in the frontend.
- The mock token/contract addresses are for demo/testing.

## How the Modularization Works

### Swap Page (`/app/swap/page.tsx`)

- **State Management:** All swap state (tokens, amounts, logs, history) is managed in the main page.
- **Component Orchestration:** The page imports and uses modular components for each UI/logic section.

### Modular Components (`/components/swap/`)

- **AccountInfo:** Shows the smart account address and a copy-to-clipboard button.
- **TokenBalances:** Displays token balances for the connected account, with a refresh button.
- **SwapForm:** Handles the swap UI (from/to tokens, amounts, swap button, direction button).
- **SwapLogs:** Shows real-time logs/progress of the current swap.
- **SwapHistory:** Displays a list of past swaps with status, amount, and Etherscan links.

**All components use named exports and receive their data/handlers via props.**  
**All types are defined in each component or (recommended) in `/types/swap.ts` for sharing.**

---

## ZeroDev + Dynamic Integration

- **Providers:** `components/Providers.tsx` wraps the app with Dynamic, Wagmi, and Query providers.
- **Smart Wallets:** Users connect via Dynamic, and if using ZeroDev, get a smart account (kernel account) with gas sponsorship.
- **Frontend-Only:** All user-initiated smart wallet actions (approve, swap) are handled client-side using the kernel client from the connector.
- **Network Support:** Easily add more EVM networks in `Providers.tsx` and your Dynamic/ZeroDev dashboards.
