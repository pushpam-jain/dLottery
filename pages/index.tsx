import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import { PropagateLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import Header from "../Components/Header";
import Login from "../Components/Login";
import CountdownTimer from "../Components/CountdownTimer";
import { currency } from "../constants";
import AdminControls from "../Components/AdminControls";

const Home: NextPage = () => {
  //   return <h1>Hello, Next.js!</h1>;
  const address = useAddress(); // working
  //   console.log(address);

  const [quantity, setQuantity] = useState<number>(1);
  const [userTickets, setUserTickets] = useState(0);

  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  );
  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  );
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  );
  const { data: expiration } = useContractRead(contract, "expiration");

  const { data: winnings } = useContractRead(
    contract,
    "getWinningsForAddress",
    [address]
  );
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    "lastWinnerAmount"
  );
  const { data: isLotteryOperator } = useContractRead(
    contract,
    "lotteryOperator"
  );
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your Tickets...");

    try {
      const data = await BuyTickets({
        args: [],
        overrides: {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      });

      toast.success("Tickets purchased successfully!", {
        id: notification,
      });
      console.info("Contract call success!", data);
    } catch (err) {
      toast.error("Whoops Something went wrong!", {
        id: notification,
      });
      console.log("contract call failure", err);
    }
  };

  const { data: tickets } = useContractRead(contract, "getTickets");

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  const { mutateAsync: WithdrawWinnings } = useContractWrite(
    contract,
    "WithdrawWinnings"
  );

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdraw Winnings...");

    try {
      const data = await WithdrawWinnings({
        args: [],
        overrides: {},
      });
      toast.success("Winnings Withdrawn Sucessfully!", { id: notification });
    } catch (err) {
      toast.error("Whoops something went Wrong!", { id: notification });
    }
  };
  if (isLoading)
    return (
      <div className="bg-[#292828] h-screen flex flex-col items-center justify-center ">
        <div className="flex items-center space-x-5 mb-10">
          <img
            className="rounded-full h-20 w-20"
            src="/Assets/gambling.png"
            alt="dLottery"
          />
          <h1 className="text-lg text-white font-bold ">Loading dLottery</h1>
        </div>
        <PropagateLoader color="white" size={30} />
      </div>
    );

  if (!address) return <Login />;

  return (
    <div className="bg-[#292828] min-h-screen flex flex-col">
      <Head>
        <title>dLottery</title>
      </Head>
      <Header />
      <Marquee
        className="bg-[#0f0f0f] border-emerald-300/20 border p-5 mb-5"
        gradient={false}
        speed={120}
      >
        <div className="flex space-x-2 mx-10 ">
          <h4 className="text-white font-bold">
            Previous Winner:{"  "}
            {lastWinner?.toString()}
          </h4>
          <h4 className="text-white font-bold">
            Previous Winnings:{" "}
            {lastWinnerAmount &&
              ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
            {currency}
          </h4>
        </div>
      </Marquee>

      {isLotteryOperator === address && (
        <div className="flex justify-center mt-5">
          <AdminControls />
        </div>
      )}

      {winnings > 0 && (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
          <button
            onClick={onWithdrawWinnings}
            className=" p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
          >
            <p className="font-bold">
              Congratulations!!! You have won the Lottery!
            </p>
            <p className="mt-3">
              Total Winnings :{ethers.utils.formatEther(winnings.toString())}{" "}
              {currency}
            </p>
            <br />
            <p className="font-semibold">Click here to Withdraw</p>
          </button>
        </div>
      )}

      {/* The next draw box */}
      <div className="space-y-5 mt-10 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
        <div className="stats-container ">
          <h1 className="text-5xl text-white mb-5 font-semibold text-center">
            Next Lucky Draw
          </h1>
          <div className="flex justify-between p-2 space-x-2">
            <div className="stats">
              <h2 className="text-sm">Total Pool</h2>
              <p className="text-xl">
                {currentWinningReward &&
                  ethers.utils.formatEther(
                    currentWinningReward.toString()
                  )}{" "}
                {currency}
              </p>
            </div>
            <div className="stats">
              <h2 className="text-sm">Tickets Remaining</h2>
              <p className="text-xl">{remainingTickets?.toNumber()}</p>
            </div>
          </div>

          {/* Countdown container */}
          <div className="mt-5 mb-3">
            <CountdownTimer />
          </div>
        </div>

        <div className="stats-container space-y-2">
          <div className="stats-container">
            <div className="flex justify-between items-center text-white pb-2">
              <h2> Price per ticket </h2>
              <p>
                {ticketPrice &&
                  ethers.utils.formatEther(ticketPrice.toString())}{" "}
                {currency}{" "}
              </p>
            </div>
            <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4 rounded-md">
              <p>TICKETS</p>
              <input
                className="flex w-full bg-transparent text-center outline-none"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 mt-5">
              <div className="flex items-cenetr justify-between text-emerald-300 text-xs italic font-semibold">
                <p>Total Costs of Tickets</p>
                <p>
                  {ticketPrice &&
                    Number(ethers.utils.formatEther(ticketPrice.toString())) *
                      quantity}
                  {""}
                  {currency}
                </p>
              </div>

              <div className="flex items-cenetr justify-between text-emerald-300 text-xs italic">
                <p>Service fees</p>
                <p>
                  {" "}
                  {ticketCommission &&
                    ethers.utils.formatEther(ticketCommission.toString())}{" "}
                  {currency}
                </p>
              </div>
            </div>

            <button
              disabled={
                expiration?.toString() < Date.now().toString() ||
                remainingTickets?.toNumber() === 0
              }
              onClick={handleClick}
              className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl font-semibold
          disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-500 disabled:cursor-not-allowed
          "
            >
              Buy {quantity} ticket(s) for{" "}
              {ticketPrice &&
                Number(ethers.utils.formatEther(ticketPrice.toString())) *
                  quantity}{" "}
              {currency}{" "}
            </button>
          </div>

          {userTickets > 0 && (
            <div className="stats">
              <p className="text-lg mb-2">
                You have {userTickets} Tickets in this draw{" "}
              </p>

              <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                {Array(userTickets)
                  .fill("")
                  .map((_, index) => (
                    <p
                      key={index}
                      className="text-emerald-300 h-16 w-10 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                    >
                      {index + 1}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
