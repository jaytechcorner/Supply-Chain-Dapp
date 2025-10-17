import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Product, ProductState, stateNames } from '../types/web3';

interface UpdateProductProps {
  contract: any;
  account: string;
  products: Product[];
  onProductUpdated: () => void;
}

export const UpdateProduct = ({ contract, account, products, onProductUpdated }: UpdateProductProps) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getNextAction = (state: number) => {
    switch (state) {
      case ProductState.Created:
        return { action: 'Pack', method: 'packProduct', nextState: 'Packed' };
      case ProductState.Packed:
        return { action: 'Ship', method: 'shipProduct', nextState: 'Shipped' };
      case ProductState.Shipped:
        return { action: 'Deliver', method: 'deliverProduct', nextState: 'Delivered' };
      default:
        return null;
    }
  };

  const handleUpdateState = async () => {
    setError('');
    setSuccess('');

    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product) {
      setError('Product not found');
      return;
    }

    const nextAction = getNextAction(product.state);
    if (!nextAction) {
      setError('Product is already delivered');
      return;
    }

    try {
      setLoading(true);
      await contract.methods[nextAction.method](selectedProductId).send({ from: account });
      setSuccess(`Product ${nextAction.action.toLowerCase()}ed successfully!`);
      setSelectedProductId('');
      onProductUpdated();
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product state');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
  const nextAction = selectedProduct ? getNextAction(selectedProduct.state) : null;
  const canUpdate = selectedProduct && selectedProduct.state !== ProductState.Delivered;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <RefreshCw className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Update Product State</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <select
            id="productSelect"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a product...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                #{product.id} - {product.name} ({stateNames[product.state]})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Current Status</h3>
            <p className="text-sm text-gray-600">
              State: <span className="font-semibold">{stateNames[selectedProduct.state]}</span>
            </p>
            {nextAction && (
              <p className="text-sm text-green-600 mt-1">
                Next Action: {nextAction.action} → {nextAction.nextState}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          onClick={handleUpdateState}
          disabled={loading || !canUpdate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : nextAction ? `${nextAction.action} Product` : 'Select Product'}
        </button>
      </div>
    </div>
  );
};
