import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Proposal } from "./VotingInterface";

interface ProposalCardProps {
  proposal: Proposal;
  onVoted: () => void;
}

export const ProposalCard = ({ proposal, onVoted }: ProposalCardProps) => {
  const { address } = useAccount();
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  
  const { writeAsync: voteYes } = useScaffoldWriteContract({
    contractName: "SimpleVoting",
    functionName: "vote",
    args: [proposal.id, true],
    onSuccess: onVoted,
  });
  
  const { writeAsync: voteNo } = useScaffoldWriteContract({
    contractName: "SimpleVoting",
    functionName: "vote",
    args: [proposal.id, false],
    onSuccess: onVoted,
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">{proposal.description}</h3>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Yes: {proposal.yesVotes}</span>
            <span>No: {proposal.noVotes}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${yesPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-right mt-1">
            Total votes: {totalVotes}
          </div>
        </div>
        
        <div className="card-actions justify-between mt-4">
          {!proposal.isActive ? (
            <div className="badge badge-warning">Closed</div>
          ) : proposal.hasVoted ? (
            <div className="badge badge-info">You voted</div>
          ) : (
            <>
              <button 
                className="btn btn-sm btn-success" 
                onClick={() => voteYes()}
                disabled={!proposal.isActive || proposal.hasVoted}
              >
                Vote Yes
              </button>
              <button 
                className="btn btn-sm btn-error" 
                onClick={() => voteNo()}
                disabled={!proposal.isActive || proposal.hasVoted}
              >
                Vote No
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
