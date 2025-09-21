import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ConnectWallet from './pages/ConnectWallet.jsx'
import ElectionList from './pages/ElectionList.jsx'
import VotePage from './pages/VotePage.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom' 
import { WalletProvider } from './WalletContext.jsx'

function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectWallet />} />
        <Route path="/elections" element={<ElectionList />} />
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
