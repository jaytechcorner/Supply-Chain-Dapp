import { ArrowRight, Package, User } from 'lucide-react';
import { Product, stateNames } from '../types/web3';

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  const formatAddress = (address: string) => {
    if (address === '0x0000000000000000000000000000000000000000') {
      return 'N/A';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStateColor = (state: number) => {
    switch (state) {
      case 0:
        return 'bg-blue-100 text-blue-800';
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 3:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No products found. Add your first product to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Product Tracking
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-gray-400">#{product.id}</span>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last Updated: {formatTimestamp(product.timestamp)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(product.state)}`}>
                {stateNames[product.state]}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Manufacturer:</span>
                <span className="font-mono text-gray-800">{formatAddress(product.manufacturer)}</span>
              </div>

              {product.packer !== '0x0000000000000000000000000000000000000000' && (
                <>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-600">Packer:</span>
                    <span className="font-mono text-gray-800">{formatAddress(product.packer)}</span>
                  </div>
                </>
              )}

              {product.shipper !== '0x0000000000000000000000000000000000000000' && (
                <>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600">Shipper:</span>
                    <span className="font-mono text-gray-800">{formatAddress(product.shipper)}</span>
                  </div>
                </>
              )}

              {product.retailer !== '0x0000000000000000000000000000000000000000' && (
                <>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Retailer:</span>
                    <span className="font-mono text-gray-800">{formatAddress(product.retailer)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`h-2 rounded-full flex-1 ${
                        step <= product.state ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                    {step < 3 && <div className="w-2" />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Created</span>
                <span>Packed</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
