import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../WalletContext';
import '../styles/ElectionForm.css'

const ElectionForm = ({ closeForm, onElectionCreated }) => {
  const { signer } = useWallet();
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState('');

  const contractAddress = "0x63931d3560972a375108828986bfa7a81f2ea8f7";
  const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ename",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_st",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_et",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "candidateNames",
				"type": "string[]"
			}
		],
		"name": "createElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_electionId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_candidateIndex",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "electionDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "eId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "eName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "st",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "et",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_electionId",
				"type": "uint256"
			}
		],
		"name": "getCandidates",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "candidateName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					}
				],
				"internalType": "struct Election.CandidateStruct[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_electionId",
				"type": "uint256"
			}
		],
		"name": "getElection",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "eId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "eName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "st",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "et",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "candidateName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					}
				],
				"internalType": "struct Election.CandidateStruct[]",
				"name": "candidates",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voterDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "vAdd",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "hasVoted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // ✅ Convert datetime-local string → Unix timestamp (seconds)
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      // ✅ Convert comma-separated string into array
      const candidateArray = candidates.split(",").map(c => c.trim()).filter(c => c);

      const tx = await contract.createElection(
        electionName,
        startTimestamp,
        endTimestamp,
        candidateArray
      );

      await tx.wait(); // wait for transaction to confirm

      alert("Election created successfully!");
      onElectionCreated(); // refresh list
      closeForm(); // close modal
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Error: " + (error.message || "Something went wrong"));
    }
  };

  return (
    <div className="form-popup">
      <h2>Create New Election</h2>
      <form onSubmit={handleSubmit}>
        <label>Election Name:</label>
        <input type="text" value={electionName} onChange={e => setElectionName(e.target.value)} required />

        <label>Start Time:</label>
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />

        <label>End Time:</label>
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />

        <label>Candidates (comma separated):</label>
        <input type="text" value={candidates} onChange={e => setCandidates(e.target.value)} required />

        <button type="submit">Create Election</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
};

export default ElectionForm;
