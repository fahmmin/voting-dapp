import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the Election contract using hardhat-deploy
 *
 * @param hre HardhatRuntimeEnvironment object
 */
const deployElection: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🚀 Deploying Election Contract...");

  const election = await deploy("SimpleVoting", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract
  const electionContract = await hre.ethers.getContractAt("SimpleVoting", election.address);
  
  // Log the contract address
  console.log("🏛️ Election Contract deployed at:", election.address);
  
  // Verify the contract on etherscan if on a supported network
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    try {
      console.log("📝 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: election.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("❌ Failed to verify contract:", error);
    }
  }

  console.log("\n✅ Election contract deployment completed!");
};

export default deployElection;

// Tags help when using the hardhat-deploy method
deployElection.tags = ["SimpleVoting", "All"];