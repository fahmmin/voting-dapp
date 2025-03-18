"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Portal: NextPage = () => {
  const [candidateId, setCandidateId] = useState(0);
  
  const { address } = useAccount();
  console.log("address", address);

    const { data: LiveResults } = useScaffoldReadContract({
    contractName: "SimpleVoting",
    functionName: "getLiveResults",
  });

  const { data: vendorContractData } = useDeployedContractInfo("SimpleVoting");
  console.log("vendorContractData", vendorContractData);
  const { writeContractAsync: writeVendorAsync } = useScaffoldWriteContract("SimpleVoting");



  const { data: CandidateDetails } = useScaffoldReadContract({
    contractName: "SimpleVoting",
    functionName: "getCandidateDetails",
    args: [BigInt(0)],
  });

  return (
    <div>
      <h1>Portal</h1>
      <p>Candidate Details: {CandidateDetails}</p>
      <p>Live Results: {LiveResults}</p>
      // add a button to vote for a candidate based on the candidate id user can choose from  DROPDOWN
      <select onChange={(e) => setCandidateId(parseInt(e.target.value))}>
        <option value="0">Candidate 1</option>
        <option value="1">Candidate 2</option>
      </select>
      <button onClick={() => writeVendorAsync({ functionName: "vote", args: [BigInt(candidateId)] })}>Vote</button>
    </div>
  );
};

export default Portal;
