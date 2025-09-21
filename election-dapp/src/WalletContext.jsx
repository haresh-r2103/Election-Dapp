import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
// Create context
const WalletContext = createContext();

// Provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  useEffect( () => {
    if(window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = provider.send("eth_accounts", []);
        if(accounts.length > 0) {
          const signer = provider.getSigner();
          setProvider(provider);
          setSigner(signer);
          setIsWalletConnected(true);
          setAccount(accounts[0]);
        }

        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
          if(accounts.length === 0) {
            setIsWalletConnected(false);
          } 
        });

      } catch (error) {
        console.error(error);
        
      }
    } else {
      alert("Metamask is not found")
    }
  }, [account])
  return (
    <WalletContext.Provider value={{
      account,
      setAccount,
      provider,
      setProvider,
      signer,
      setSigner,
      isWalletConnected,
      setIsWalletConnected
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context easily
export const useWallet = () => useContext(WalletContext);
