import type { NextPage } from "next";
import { VotingInterface } from "~~/components/voting/VotingInterface";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-6">
            <span className="block text-4xl font-bold">Simple Voting dApp</span>
          </h1>
        </div>
        <div className="flex-grow bg-base-300 w-full px-8 py-12">
          {/* <VotingInterface /> */}
        </div>
      </div>
    </>
  );
};

export default Home;
