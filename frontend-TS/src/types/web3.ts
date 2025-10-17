export interface Product {
  id: number;
  name: string;
  state: number;
  manufacturer: string;
  packer: string;
  shipper: string;
  retailer: string;
  timestamp: number;
}

export enum ProductState {
  Created = 0,
  Packed = 1,
  Shipped = 2,
  Delivered = 3
}

export const stateNames = ['Created', 'Packed', 'Shipped', 'Delivered'];

export interface ContractABI {
  abi: any[];
  address: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
