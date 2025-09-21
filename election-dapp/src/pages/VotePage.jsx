import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWallet } from '../WalletContext';
import { ethers } from 'ethers';
import '../styles/VotePage.css'


const VotePage = () => {

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

  const [searchParams] = useSearchParams();
  const electionId = searchParams.get("electionId");
  const { signer } = useWallet();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchElection = async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const details = await contract.getElection(electionId);

      setElection({
        eId: details.eId.toString(),
        eName: details.eName,
        startTime: Number(details.st),
        endTime: Number(details.et),
        candidates: details.candidates.map(c => ({
          candidateName: c.candidateName,   // ✅ fixed key
          voteCount: Number(c.voteCount),   // ✅ fixed key
        })),
      });
    } catch (err) {
      console.error("Error fetching election:", err);
    }
  };

  const vote = async (index) => {
    try {
      setLoading(true);
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contractInstance.vote(electionId, index);
      await tx.wait();
      alert("Vote successful!");
      fetchElection(); // refresh data
    } catch (error) {
      console.error("Error in voting:", error);
      alert("Vote failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElection();
  }, [signer, electionId]);

  if (!election) return <p>Loading election...</p>;


  const now = Math.floor(Date.now() / 1000);
  const canVote = now >= election.startTime && now <= election.endTime;

  return (
    <div className="vote-page">
  <h2>{election.eName}</h2>
  <p>Election ID: {election.eId}</p>

  <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#0a3d62" }}>
    Candidates
  </h3>

  <ul>
    {election.candidates.map((cand, ind) => (
      <li key={ind}>
        <div className="candidate-header">
          <div className="candidate-icon">{cand.candidateName.charAt(0)}</div>
          <div className="candidate-name">{cand.candidateName}</div>
        </div>

        <div className="candidate-details">
          <p className="candidate-description">
            Votes: <span className="vote-count">{cand.voteCount}</span>
          </p>
          {canVote && (
            <div className="vote-action">
              <button onClick={() => vote(ind)} disabled={loading}>
                {loading ? "Voting..." : "Vote"}
              </button>
            </div>
          )}
        </div>
      </li>
    ))}
  </ul>

  {!canVote && (
    <div className="status">
      Voting not available now.
    </div>
  )}
</div>

  );
};

export default VotePage;