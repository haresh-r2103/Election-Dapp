// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    address public owner;
    uint256 public id = 1; // election ID counter

    struct CandidateStruct {
        string candidateName;
        uint256 voteCount;
    }

    struct ElectionStruct {
        uint256 eId;
        string eName;
        uint256 st;
        uint256 et;
        CandidateStruct[] eCandidates;
    }

    struct VoterStruct {
        address vAdd;
        bool hasVoted;
    }

    // Store elections and voters
    mapping(uint256 => ElectionStruct) public electionDetails;
    mapping(uint256 => mapping(address => VoterStruct)) public voterDetails;

    constructor() {
        owner = msg.sender;
    }

    // Create Election
    function createElection(
        string memory _ename,
        uint256 _st,
        uint256 _et,
        string[] memory candidateNames
    ) public {
        require(msg.sender == owner, "Only owner can create elections");
        require(_st < _et, "Invalid time range");

        ElectionStruct storage newElection = electionDetails[id];
        newElection.eId = id;
        newElection.eName = _ename;
        newElection.st = _st;
        newElection.et = _et;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            newElection.eCandidates.push(
                CandidateStruct({candidateName: candidateNames[i], voteCount: 0})
            );
        }

        id++; // increment election ID
    }

    // Vote function
    function vote(uint256 _electionId, uint256 _candidateIndex) public {
        ElectionStruct storage election = electionDetails[_electionId];
        require(
            block.timestamp >= election.st && block.timestamp <= election.et,
            "Election not active"
        );
        require(
            !voterDetails[_electionId][msg.sender].hasVoted,
            "You have already voted"
        );
        require(
            _candidateIndex < election.eCandidates.length,
            "Invalid candidate"
        );

        // Record the vote
        election.eCandidates[_candidateIndex].voteCount++;
        voterDetails[_electionId][msg.sender] = VoterStruct(msg.sender, true);
    }

    // Get candidates for frontend
    function getCandidates(uint256 _electionId)
        public
        view
        returns (CandidateStruct[] memory)
    {
        return electionDetails[_electionId].eCandidates;
    }

    // Get Election Details for frontend

    function getElection(uint256 _electionId)
    public
    view
    returns (
        uint256 eId,
        string memory eName,
        uint256 st,
        uint256 et,
        CandidateStruct[] memory candidates
    )
    {
        ElectionStruct storage e = electionDetails[_electionId];
        return (e.eId, e.eName, e.st, e.et, e.eCandidates);
    }

}
