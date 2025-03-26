import { SeiAgentKit } from "../../index";
import { Address } from "viem";
import { getBalance } from "../../utils";
import { Transport, Chain, WalletClient, RpcSchema } from "viem";
import { Account } from "viem";
import { ExactInputSingleParams } from "../../types";
import { Abi } from "viem";

const DRAGONSWAP_SWAP_ROUTER_02_ADDRESS: Address =
  "0x11DA6463D6Cb5a03411Dbf5ab6f6bc3997Ac7428";

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
 * Note that (tokenIn, tokenOut, fee) uniquely identifies a pool.
 * @param agent SeiAgentKit instance
 * @param tokenIn Input token contract address
 * @param tokenOut Output token contract address
 * @param amountIn Amount of input token to swap
 * @param fee Fee in milli-bp (e.g. 100 = 0.01%)

 */
export async function exactInputSingle(
  agent: SeiAgentKit,
  tokenInAddress: Address,
  tokenOutAddress: Address,
  fee: number,
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
    fee: fee,
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
