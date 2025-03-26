import { SeiAgentKit } from "../../index";
import { get_erc20_balance } from "../sei-erc20";
import { Address } from "viem";
import { getBalance } from "../../utils";
import { Transport, Chain, WalletClient, RpcSchema } from "viem";
import { Account } from "viem";
import { ExactInputSingleParams, ExactOutputSingleParams } from "../../types";
import { Abi } from "viem";
// import { isAddress } from "ethers";
// import { ExactInputSingleParams, ExactOutputSingleParams } from "./types";
// import { JsonRpcProvider } from "ethers";
// import { Wallet } from "ethers";
// import { Contract } from "ethers";
// import * as dotenv from "dotenv";

const DRAGONSWAP_SWAP_ROUTER_02_ADDRESS: Address =
  "0x11DA6463D6Cb5a03411Dbf5ab6f6bc3997Ac7428";
const DRAGONSWAP_FACTORY_ADDRESS: Address =
  "0x179D9a5592Bc77050796F7be28058c51cA575df4";

const exactInputSingleAbi: Abi = [
  {
    type: "function",
    name: "exactInputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [
      {
        name: "amountOut",
        type: "uint256",
      },
    ],
  },
];
/**
 * Swap an exact input amount of an input token for as much output as possible.
 * Single hop, meaning only one pool is used for the swap.
 * @param agent SeiAgentKit instance
 * @param tokenIn Input token contract address
 * @param tokenOut Output token contract address
 * @param amountIn

 */
export async function exactInputSingle(
  agent: SeiAgentKit,
  tokenInAddress: Address,
  tokenOutAddress: Address,
  amountIn: bigint
) {
  const recipient = agent.wallet_address;
  if (
    !agent.walletClient.chain ||
    !agent.walletClient.account ||
    !agent.walletClient.transport
  ) {
    const errorMsg = "Wallet client not initialized properly";
    console.error(`Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const walletClient: WalletClient<Transport, Chain, Account> =
    agent.walletClient as WalletClient<Transport, Chain, Account>;

  // Make sure you have enough balance of the input token
  const balanceIn = await getBalance(agent, tokenInAddress);
  if (balanceIn <= amountIn) {
    throw new Error(`Insufficient balance of ${tokenInAddress}`);
  }

  // Approve the router to spend the input token
  const hashApprove = await walletClient.writeContract({
    address: tokenInAddress,
    abi: [
      "function approve(address spender, uint256 amount) public returns (bool)",
    ],
    functionName: "approve",
    args: [DRAGONSWAP_SWAP_ROUTER_02_ADDRESS, amountIn],
  });

  // Swap the input token for the output token
  const exactInputSingleParams: ExactInputSingleParams = {
    tokenIn: tokenInAddress,
    tokenOut: tokenOutAddress,
    fee: 3000, // TOOD figure out fee
    amountIn: amountIn,
    amountOutMinimum: 0n,
    recipient: recipient,
    sqrtPriceLimitX96: 0n,
  };

  const hashSwap = await walletClient.writeContract({
    address: DRAGONSWAP_SWAP_ROUTER_02_ADDRESS,
    abi: exactInputSingleAbi,
    functionName: "exactInputSingle",
    args: [exactInputSingleParams],
  });
}
