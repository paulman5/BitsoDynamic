install:
sudo apt update
116 sudo apt install python3 python3-pip -y
117 pip3 install fastapi uvicorn

uvicorn webhook_server_simple:app --host 0.0.0.0 --port 8080

# Voice Wallet Control

to set up web hook we use script.

## Built With

- **Next.js**: A popular React framework for building fast, server-side rendered applications.
- **wagmi**: React hooks for Ethereum.
- **viem**: Ethereum interface for developers.
- **rainbowkit**: A toolkit for building wallet connection UIs.
- **shadcn-ui** and **acterenity ui**: Component libraries for modern UI elements.

## Getting Started

### Prerequisites

1. **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/web3-ui-starter-pack.git
   cd web3-ui-starter-pack
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   #or
   yarn
   ```

3. **Set up environment variables**:

   - Create a `.env.local` file in the root of your project.
   - Add the following variables:
     ```bash
     NEXT_PUBLIC_CONTRACT_ADDRESS=<Your_Contract_Address>
     NEXT_PUBLIC_ALCHEMY_API_KEY=<Your_Alchemy_API_Key>
     NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=<Your_RainbowKit_Project_ID>
     ```

4. **Add ABI files**:
   - Place the ABI of your smart contract in the `abi` folder.

### Running the App

Start the development server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage

This starter pack provides a basic setup for connecting to Ethereum blockchain networks. Customize it according to your project's requirements by modifying components and adding new features.

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License.

## ZeroDev + Dynamic Smart Wallet Integration

This project supports [ZeroDev](https://zerodev.app/) smart wallets via [Dynamic](https://docs.dynamic.xyz/smart-wallets/smart-wallet-providers/zerodev).

### Setup

1. **Create a ZeroDev account** and project at https://dashboard.zerodev.app/. Copy your ZeroDev project ID and configure your network (e.g., Base Sepolia or Sepolia).
2. **Enable ZeroDev in Dynamic**: In your Dynamic dashboard, enable the same network and paste your ZeroDev project ID in the Account Abstraction section.
3. **Set up environment variables** in `.env.local`:

   ```bash
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=<Your_Dynamic_Environment_ID>
   ZERODEV_RPC=<Your_ZeroDev_Bundler_RPC_URL>
   PRIVATE_KEY=<Your_Private_Key_For_Server_Side_Account>
   ```

   - `ZERODEV_RPC` can be found in your ZeroDev project dashboard under "Bundler RPC".
   - `PRIVATE_KEY` is used for server-side operations (never expose this in the frontend).

4. **Install dependencies** (already included):

   ```bash
   yarn add @dynamic-labs/ethereum-aa
   ```

5. **ZeroDev connector is enabled** in `components/Providers.tsx`:

   ```ts
   import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa"
   // ...
   walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
   ```

6. **Gas sponsorship**: Set up gas policies in the ZeroDev dashboard to sponsor user transactions as needed.

For more details, see the [Dynamic ZeroDev documentation](https://docs.dynamic.xyz/smart-wallets/smart-wallet-providers/zerodev).
