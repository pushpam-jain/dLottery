import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/24/solid"; // importing react icons
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react"; //*
import { ethers } from "ethers";
import { currency } from "../constants";
import toast from "react-hot-toast"; //*

function AdminControls() {
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: totalCommission } = useContractRead(
    contract,
    "operatorTotalCommission"
  );
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract,
    "DrawWinnerTicket"
  );
  const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
  const { mutateAsync: restartDraw } = useContractWrite(
    contract,
    "restartDraw"
  );
  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract,
    "WithdrawCommission"
  );

  const { data: expiration } = useContractRead(contract, "expiration");
  const currDraw = new Date() < new Date(expiration * 1000);

  // to pick or select the winner
  const drawWinner = async () => {
    const notification = toast.loading("Picking a lucky Winner...");

    try {
      const data = await DrawWinnerTicket({ args: [] });

      toast.success("A Winner has been selected!", {
        id: notification,
      });
      console.info("Contract call Success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("Contract call failure", err);
    }
  };

  // to withdraw commission
  const onWithdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commission...");

    try {
      const data = await WithdrawCommission({ args: [] });

      toast.success("Your Commission has been withdrawn successfully!", {
        id: notification,
      });
      console.info("Contract call Success", data);
    } catch (err) {
      toast.error("Whoops! something went wrong!", {
        id: notification,
      });
      console.error("Contract call failure", err);
    }
  };

  // Start or Restart the Draw
  const onRestartDraw = async () => {
    const notification = toast.loading(
      currDraw ? "Restarting Draw..." : "Starting Draw..."
    );

    try {
      const data = await restartDraw({ args: [] });

      toast.success(
        currDraw
          ? "Draw Restarted Successfully!"
          : "Draw started successfully!",
        {
          id: notification,
        }
      );
      console.info("Contract call Success", data);
    } catch (err) {
      toast.error("Whoops! Something went wrong!", {
        id: notification,
      });
      console.error("Contract call failure", err);
    }
  };

  //Refund all
  const onRefundAll = async () => {
    const notification = toast.loading("Refunding all...");

    try {
      const data = await RefundAll({ args: [] });

      toast.success("All Refunded Successfully!", {
        id: notification,
      });
      console.info("Contract call Success!", data);
    } catch (err) {
      toast.error("Lottery not expired yet!", {
        id: notification,
      });
      console.error("Contract call failure!", err);
    }
  };

  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border bg-[#000000]">
      <h2 className="font-bold">Admin Controls</h2>
      <p className="mb-5">
        Total Commission to be withdrawn...
        {totalCommission &&
          ethers.utils.formatEther(totalCommission?.toString())}{" "}
        {currency}
      </p>

      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinner} className="admin-button">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={onWithdrawCommission} className="admin-button">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Commission
        </button>
        <button onClick={onRestartDraw} className="admin-button">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          {currDraw ? "Restart Draw" : "Start Draw"}
        </button>
        <button onClick={onRefundAll} className="admin-button">
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
}

export default AdminControls;
