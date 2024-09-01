// import { useMetamask } from "@thirdweb-dev/react"; // deprecated
import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
// import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";

const metamaskConfig = metamaskWallet();

function Login() {
  //   const connectWithMetamask = useMetamask(); // deprecated

  const connect = useConnect();

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="h-56 w-60 mb-0.5 rounded-full"
          src="/Assets/gambling.png"
          alt="dLottery"
        />
      </div>
      <h1 className="text-5xl text-white font-bold">dLottery</h1>
      <h2 className="text-2xl text-white folt-semibold">TRY OUT YOUR LUCK</h2>
      <h2 className="text-white">
        Get Started by logging in with your Metamask
      </h2>
      {/* <ConnectWallet /> */}
      <button
        onClick={async () => {
          const wallet = await connect(metamaskConfig);
          console.log("connected to ", wallet);
        }}
        className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold"
      >
        Log in with Metamask
      </button>
    </div>
  );
}

export default Login;
