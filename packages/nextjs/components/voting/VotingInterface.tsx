"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CreateProposalModal } from "./CreateProposalModal";
import { ProposalCard } from "./ProposalCard";

export type Proposal = {
  id: number;
  description: string;
  yesVotes: number;
  noVotes: number;
  isActive: boolean;
  hasVoted: boolean;
};

export const VotingInterface = () => {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the number of proposals
  const { data: proposalCount } = useScaffoldReadContract({
    contractName: "SimpleVoting",
    functionName: "getProposalCount",
  });

  // Function to fetch all proposal details
  const fetchProposals = async () => {
    if (!proposalCount || !address) return;
    
    const count = Number(proposalCount);
    const newProposals: Proposal[] = [];
    
    for (let i = 0; i < count; i++) {
      const { data: proposalData } = useScaffoldReadContract({
        contractName: "SimpleVoting",
        functionName: "getProposal",
        args: [BigInt(i)],
      });
      
      const { data: hasVoted } = useScaffoldReadContract({
        contractName: "SimpleVoting",
        functionName: "hasAddressVoted",
        args: [address, BigInt(i)],
      });
      
      if (proposalData) {
        newProposals.push({
          id: i,
          description: proposalData[0],
          yesVotes: Number(proposalData[1]),
          noVotes: Number(proposalData[2]),
          isActive: proposalData[3],
          hasVoted: hasVoted || false,
        });
      }
    }
    
    setProposals(newProposals);
  };

  useEffect(() => {
    fetchProposals();
  }, [proposalCount, address]);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Active Proposals</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsModalOpen(true)}
        >
          Create Proposal
        </button>
      </div>
      
      {proposals.length === 0 ? (
        <div className="text-center py-8 text-lg text-base-content/70">
          No proposals found. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map(proposal => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal}
              onVoted={fetchProposals}
            />
          ))}
        </div>
      )}
      
      <CreateProposalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProposalCreated={fetchProposals}
      />
    </div>
  );
};