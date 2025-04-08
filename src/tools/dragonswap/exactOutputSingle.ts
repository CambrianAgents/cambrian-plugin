import { SeiAgentKit } from "../../index";
import { Address } from "viem";
import { Transport, Chain, WalletClient, RpcSchema } from "viem";
import { Account } from "viem";
import { ExactOutputSingleParams } from "../../types";
import { Abi } from "viem";

const DRAGONSWAP_SWAP_ROUTER_02_ADDRESS: Address =
  "0x11DA6463D6Cb5a03411Dbf5ab6f6bc3997Ac7428";

const exactOutputSingleAbi: Abi = [
  {
    type: "function",
    name: "exactOutputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct Unknown",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountOut", type: "uint256" },
          { name: "amountInMaximum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [
      {
        name: "amountIn",
        type: "uint256",
      },
    ],
  },
];
const approveAbi: Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];

/**
 * Swap an exact output amount of an output token for as little input as possible.
 * Single hop, meaning only one pool is used for the swap.
 * Note that (tokenIn, tokenOut, fee) uniquely identifies a pool.
 * @param agent SeiAgentKit instance
 * @param tokenInAddress Input token contract address
 * @param tokenOutAddress Output token contract address
 * @param amountOut Amount of output token to receive
 * @param fee Fee in milli-bp (e.g. 100 = 0.01%)
 * @param amountInMaximum Maximum amount of input token to spend
 */
export async function exactOutputSingle(
  agent: SeiAgentKit,
  tokenInAddress: Address,
  tokenOutAddress: Address,
  amountOut: bigint,
  fee: number,
  amountInMaximum: bigint
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

  // Approve swap router to spend the input token
  const hashApprove = await walletClient.writeContract({
    address: tokenInAddress,
    abi: approveAbi,
    functionName: "approve",
    args: [DRAGONSWAP_SWAP_ROUTER_02_ADDRESS, amountInMaximum],
  });

  // Swap the input token for the output token
  const exactOutputSingleParams: ExactOutputSingleParams = {
    tokenIn: tokenInAddress,
    tokenOut: tokenOutAddress,
    fee: fee,
    amountOut: amountOut,
    amountInMaximum: amountInMaximum,
    recipient: recipient,
    sqrtPriceLimitX96: 0n,
  };

  const hashSwap = await walletClient.writeContract({
    address: DRAGONSWAP_SWAP_ROUTER_02_ADDRESS,
    abi: exactOutputSingleAbi,
    functionName: "exactOutputSingle",
    args: [exactOutputSingleParams],
  });

  return hashSwap;
}
