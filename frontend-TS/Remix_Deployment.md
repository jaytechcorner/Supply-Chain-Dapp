# Deploy Smart Contract Using Remix IDE

This guide will help you deploy the SupplyChain smart contract using Remix IDE.

## Step 1: Set Up Ganache

1. Download and install Ganache from https://trufflesuite.com/ganache/
2. Open Ganache and create a new workspace (or use Quickstart)
3. Note the RPC Server URL (typically `HTTP://127.0.0.1:7545`)
4. Keep Ganache running in the background

## Step 2: Configure MetaMask

1. Open MetaMask browser extension
2. Click on the network dropdown at the top
3. Click "Add Network" or "Add a network manually"
4. Enter these details:
   - **Network Name**: Ganache Local
   - **RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
5. Click "Save"

6. Import a Ganache account into MetaMask:
   - In Ganache, click the key icon next to any account to reveal the private key
   - Copy the private key
   - In MetaMask, click the account icon → "Import Account"
   - Paste the private key and click "Import"

## Step 3: Open Remix IDE

1. Go to https://remix.ethereum.org/
2. You'll see the Remix IDE interface

## Step 4: Create the Smart Contract

1. In the File Explorer (left sidebar), click the "contracts" folder
2. Click the "Create New File" icon
3. Name it `SupplyChain.sol`
4. Copy the entire contract code from `contracts/SupplyChain.sol` and paste it into Remix

## Step 5: Compile the Contract

1. Click on the "Solidity Compiler" icon in the left sidebar (looks like an "S")
2. Select compiler version `0.8.0` or higher (the contract uses ^0.8.0)
3. Click "Compile SupplyChain.sol"
4. You should see a green checkmark if compilation is successful

## Step 6: Deploy the Contract

1. Click on the "Deploy & Run Transactions" icon (below the compiler icon)
2. In the "ENVIRONMENT" dropdown, select **"Injected Provider - MetaMask"**
3. MetaMask will pop up asking to connect - click "Connect"
4. Make sure your imported Ganache account is selected in MetaMask
5. In the "CONTRACT" dropdown, select "SupplyChain"
6. Click the orange "Deploy" button
7. MetaMask will ask you to confirm the transaction - click "Confirm"
8. Wait a few seconds for the deployment to complete

## Step 7: Copy Contract Address

1. After successful deployment, you'll see the deployed contract under "Deployed Contracts" section
2. Click the copy icon next to the contract address
3. The address will look like: `0x1234567890abcdef...`

## Step 8: Update Your .env File

1. Open the `.env` file in your project root
2. Find the line `VITE_CONTRACT_ADDRESS=`
3. Paste your contract address after the equals sign:
   ```
   VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
   ```
4. Save the file

## Step 9: Test the Contract in Remix (Optional)

You can test the contract functions directly in Remix:

1. Expand your deployed contract in the "Deployed Contracts" section
2. You'll see all the contract functions
3. Try calling `addProduct` with a product name (e.g., "Test Product")
4. Confirm the transaction in MetaMask
5. Call `getAllProducts` to see your added product
6. Try `packProduct`, `shipProduct`, and `deliverProduct` with product ID 1

## Step 10: Run Your DApp

1. In your project terminal, run:
   ```bash
   npm run dev
   ```
2. Open your browser to the local URL (typically http://localhost:5173)
3. Click "Connect Wallet" to connect MetaMask
4. The contract should automatically load (if you set VITE_CONTRACT_ADDRESS)
5. Start adding and tracking products!

## Important Notes

- **Always keep Ganache running** while using the DApp
- If you restart Ganache, you'll need to redeploy the contract and update the contract address
- Make sure MetaMask is connected to the Ganache network (not Ethereum mainnet!)
- The account that deploys the contract automatically gets all roles (Manufacturer, Packer, Shipper, Retailer)

## Troubleshooting

### MetaMask shows "Nonce too high" error
- Go to MetaMask Settings → Advanced → Reset Account
- This clears the transaction history and fixes nonce issues

### Contract not deploying
- Make sure Ganache is running
- Check that MetaMask is connected to the Ganache network
- Verify you have enough ETH in your account (Ganache provides 100 ETH per account by default)

### DApp not connecting to contract
- Verify the contract address in `.env` is correct
- Make sure you saved the `.env` file
- Restart the dev server (npm run dev)
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## Testing the Supply Chain Flow

1. **Add a Product**: Enter "Laptop" and click "Add Product"
2. **Pack the Product**: Select the product and click "Pack Product"
3. **Ship the Product**: Select the product and click "Ship Product"
4. **Deliver the Product**: Select the product and click "Deliver Product"

Each step should update the product state, and you'll see the progress bar and timeline update in real-time!
