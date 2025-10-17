import { useState, useEffect } from 'react';
import { CONTRACT_ABI } from '../utils/contractABI';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const Web3 = (await import('web3')).default;
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || '');
          setIsConnected(accounts.length > 0);
        });

        return accounts[0];
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  };

  const loadContract = async (address: string) => {
    if (!web3) {
      throw new Error('Web3 not initialized');
    }

    try {
      const contractInstance = new web3.eth.Contract(CONTRACT_ABI, address);
      setContract(contractInstance);
      setContractAddress(address);
      return contractInstance;
    } catch (error) {
      console.error('Error loading contract:', error);
      throw error;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const Web3 = (await import('web3')).default;
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();

        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    account,
    contract,
    web3,
    isConnected,
    contractAddress,
    connectWallet,
    loadContract
  };
};
