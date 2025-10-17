import { useState, useEffect } from 'react';
import { Wallet, Link as LinkIcon, Package as PackageIcon } from 'lucide-react';
import { useWeb3 } from './hooks/useWeb3';
import { AddProduct } from './components/AddProduct';
import { UpdateProduct } from './components/UpdateProduct';
import { ProductList } from './components/ProductList';
import { Product } from './types/web3';

function App() {
  const { account, contract, isConnected, connectWallet, loadContract } = useWeb3();
  const [contractAddress, setContractAddress] = useState(import.meta.env.VITE_CONTRACT_ADDRESS || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleLoadContract = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    try {
      setError('');
      await loadContract(contractAddress);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to load contract');
    }
  };

  const fetchProducts = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const allProducts = await contract.methods.getAllProducts().call();

      const formattedProducts = allProducts.map((p: any) => ({
        id: Number(p.id),
        name: p.name,
        state: Number(p.state),
        manufacturer: p.manufacturer,
        packer: p.packer,
        shipper: p.shipper,
        retailer: p.retailer,
        timestamp: Number(p.timestamp)
      }));

      setProducts(formattedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchProducts();
    }
  }, [contract]);

  useEffect(() => {
    const autoLoadContract = async () => {
      if (isConnected && !contract && contractAddress && import.meta.env.VITE_CONTRACT_ADDRESS) {
        try {
          await loadContract(contractAddress);
          await fetchProducts();
        } catch (err: any) {
          console.error('Auto-load contract failed:', err);
        }
      }
    };
    autoLoadContract();
  }, [isConnected, contract, contractAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <PackageIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Supply Chain Tracker</h1>
                  <p className="text-gray-600">Blockchain-powered transparent tracking</p>
                </div>
              </div>

              {!isConnected ? (
                <button
                  onClick={handleConnect}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              ) : (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Wallet className="w-4 h-4" />
                    Connected
                  </div>
                  <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                </div>
              )}
            </div>

            {isConnected && !contract && (
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Load Smart Contract</h2>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e: { target: { value: any; }; }) => setContractAddress(e.target.value)}
                    placeholder="Enter contract address (0x...)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleLoadContract}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Load Contract
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </header>

        {contract && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddProduct
                contract={contract}
                account={account}
                onProductAdded={fetchProducts}
              />
              <UpdateProduct
                contract={contract}
                account={account}
                products={products}
                onProductUpdated={fetchProducts}
              />
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </div>
        )}

        {!isConnected && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Supply Chain Tracker</h2>
            <p className="text-gray-600 mb-6">
              Connect your MetaMask wallet to start tracking products on the blockchain
            </p>
            <button
              onClick={handleConnect}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
