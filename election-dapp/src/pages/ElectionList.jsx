import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../WalletContext';
import ElectionForm from './ElectionForm';
import '../styles/ElectionList.css';

const ElectionList = () => {
  const { account, signer } = useWallet();
  const [elections, setElections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const navigate = useNavigate();

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

  const fetchElections = async () => {
    if (!signer) return;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const totElections = await contract.id();
    const electionsArray = [];

    for (let i = 1; i <= totElections; i++) {
      const e = await contract.getElection(i);
      const candidates = e.candidates.map(c => ({
        candidateName: c.candidateName,
        voteCount: Number(c.voteCount)
      }));
      const now = Math.floor(Date.now() / 1000);
      let winner = null;
      if (now > Number(e.et) && candidates.length) {
        winner = candidates.reduce((prev, curr) =>
          curr.voteCount > prev.voteCount ? curr : prev
        );
      }

      electionsArray.push({
        electionId: Number(e.eId),
        electionName: e.eName,
        startTime: Number(e.st),
        endTime: Number(e.et),
        displayStart: new Date(Number(e.st) * 1000).toLocaleString(),
        displayEnd: new Date(Number(e.et) * 1000).toLocaleString(),
        candidates,
        winner,
      });
    }
    setElections(electionsArray);
  };

  useEffect(() => { fetchElections(); }, [signer]);

  const getCurrentTime = () => Math.floor(Date.now() / 1000);

  return (
    <div className="election-list-page">
      <h2>Connected Account: {account}</h2>
      <button onClick={() => setShowForm(true)}>Create New Election</button>

      {showForm && (
        <ElectionForm
          closeForm={() => setShowForm(false)}
          onElectionCreated={fetchElections}
        />
      )}

      <h1>Elections</h1>
      <div className="election-list">
        {elections.map((election, idx) => {
          const now = getCurrentTime();
          const canVote = now >= election.startTime && now <= election.endTime;
          const notStarted = now < election.startTime;
          const finished = now > election.endTime;

          return (
            <div key={idx} className="election-card">
              <h3>{election.electionName}</h3>
              <p>ID: {election.electionId}</p>
              <p>Start: {election.displayStart}</p>
              <p>End: {election.displayEnd}</p>

              <button onClick={() => setSelectedElection(election)}>
                Details
              </button>

              {notStarted && <p>🟡 Not Started</p>}
              {canVote && (
                <button onClick={() => navigate(`/vote?electionId=${election.electionId}`)}>
                  Vote
                </button>
              )}
              {finished && (
                <p>
                  🏆 Winner: {election.winner ? `${election.winner.candidateName} (${election.winner.voteCount})` : "No votes"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for election details */}
      {selectedElection && (
        <div className="modal-overlay" onClick={() => setSelectedElection(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedElection.electionName} - Candidates</h2>
            <div className="candidate-list">
              {selectedElection.candidates.map((c, idx) => (
                <div key={idx} className="candidate-card">
                  {c.candidateName} - Votes: {c.voteCount}
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setSelectedElection(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionList;
