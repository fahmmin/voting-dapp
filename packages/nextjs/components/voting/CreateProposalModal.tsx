import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalCreated: () => void;
}

export const CreateProposalModal = ({ 
  isOpen, 
  onClose,
  onProposalCreated 
}: CreateProposalModalProps) => {
  const [description, setDescription] = useState("");
  
  const { writeAsync: createProposal, isLoading } = useScaffoldWriteContract({
    contractName: "SimpleVoting",
    functionName: "createProposal",
    args: [description],
    onSuccess: () => {
      onProposalCreated();
      handleClose();
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      await createProposal();
    }
  };
  
  const handleClose = () => {
    setDescription("");
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create New Proposal</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Proposal Description</span>
            </label>
            <textarea 
              className="textarea textarea-bordered h-24" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter proposal description"
              required
            />
          </div>
          <div className="modal-action">
            <button 
              type="button" 
              className="btn" 
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !description.trim()}
            >
              {isLoading ? "Creating..." : "Create Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};