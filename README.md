# 🎮 Web3 Extended Rock-Paper-Scissors (RPS-5)

A decentralized, EVM-compatible implementation of an extended 5-option Rock-Paper-Scissors game featuring **on-demand smart contract deployment** directly from the frontend.

Built on the Sepolia Testnet as an interactive Web3 role challenge.

---

## 🌟 Key Features

* **Extended Game Mechanics:** Expands classic Rock-Paper-Scissors into a 5-choice variant (Rock, Paper, Scissors, Lizard, Spock logic) to reduce ties and deepen strategy.
* **Automated Factory Deployment:** Automated, single-click game contract instantiation directly from the dApp UI upon game creation.
* **On-Chain Settlement:** Fully decentralized state resolution and winner verification via smart contract rules.
* **MetaMask Integration:** Seamless transaction signing, network detection, and account handling.

---

## 🛠️ Tech Stack

* **Smart Contracts:** Solidity (EVM)
* **Frontend:** React / TypeScript
* **Web3 Integration:** Ethers.js / Viem, MetaMask Provider
* **Network:** Sepolia Testnet

---

## 🚀 Live Demo & Prerequisites

### Prerequisites

1. **Web3 Wallet:** Install the [MetaMask Extension](https://metamask.io/) in your browser.
2. **Testnet Gas:** Switch your network to **Sepolia Testnet** and acquire testnet ETH via the [Sepolia Faucet](https://sepoliafaucet.com/).

### Play Live

👉 **[Launch DApp Live Demo](https://kleros-rps.vercel.app)**

---

## ⚙️ How It Works (Architecture Flow)

1. **Game Initialization:** Player selects moves/stakes and triggers game creation.
2. **Frontend Contract Deployment:** The frontend initializes a factory pattern or directly deploys a new instance of the game smart contract via the user's Web3 wallet in <1 minute.
3. **Opponent Challenge:** A unique game address or link is generated for the opponent to join and commit their move.
4. **State Resolution:** The contract automatically computes the winning logic on-chain upon receipt of both valid inputs.

---

## 💻 Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/mike-obas/kleros-rps.git

# Navigate into the project directory
cd kleros-rps

# Install dependencies
npm install

# Start the development server
npm run dev
