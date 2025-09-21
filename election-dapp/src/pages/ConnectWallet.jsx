import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../WalletContext';
import '../styles/ConnectWallet.css';

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { setAccount, setProvider, setSigner, setIsWalletConnected } = useWallet();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        setProvider(provider);
        setSigner(signer);
        setIsWalletConnected(true);
        setAccount(accounts[0]);

        navigate('/elections');
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask is not installed");
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-text">
          <h1>Welcome to BlockChain based Election</h1>
          <p>The ultimate decentralized election platform powered by blockchain.</p>
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
        <div className="hero-image">
          <img src="https://img.icons8.com/ios/500/blockchain.png" alt="Blockchain Illustration" />
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <h3>Decentralized</h3>
          <p>No single authority. Your vote is secure and transparent.</p>
        </div>
        <div className="feature-card">
          <h3>Transparent</h3>
          <p>Track elections and votes in real-time on the blockchain.</p>
        </div>
        <div className="feature-card">
          <h3>Secure</h3>
          <p>Powered by Ethereum blockchain ensuring trust and integrity.</p>
        </div>
      </section>
    </div>
  );
};

export default ConnectWallet;
