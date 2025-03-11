import { SeiAgentKit } from "../../index";
import { sei } from 'viem/chains';
import { Account, Address, erc20Abi, isAddress } from "viem";
import { getTokenDecimals, formatSei, getTokenAddressFromTicker } from "../../utils";

/**
 * Transfer SEI tokens or ERC-20 tokens
 * @param agent SeiAgentKit instance
 * @param amount Amount to transfer
 * @param recipient Recipient address
 * @param ticker Optional token ticker (if not provided, transfers native SEI)
 * @returns Promise with transaction result
 */
export async function erc20_transfer(
  agent: SeiAgentKit,
  amount: number,
  recipient: Address,
  ticker?: string,
): Promise<string> {
  if (amount <= 0) {
    const errorMsg = "Transfer amount must be greater than 0";
    console.error(`Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (!isAddress(recipient)) {
    const errorMsg = `Invalid recipient address: ${recipient}`;
    console.error(`Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (!agent.walletClient) {
    const errorMsg = "Wallet client is not initialized";
    console.error(`Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const account = agent.walletClient.account as Account;
    if (!account) {
      throw new Error("Wallet account is not initialized");
    }

    // Native token transfer case
    if (!ticker) {
      if (!agent.publicClient) {
        throw new Error("Public client is not initialized");
      }

      const formattedAmount = formatSei(amount, 18);
      if (!formattedAmount) {
        throw new Error("Failed to format amount");
      }

      const hash = await agent.walletClient.sendTransaction({
        account,
        chain: sei,
        to: recipient,
        value: formattedAmount,
      });

      if (!hash) {
        throw new Error("Transaction failed to send");
      }

      const transactionReceipt = await agent.publicClient.waitForTransactionReceipt({
        hash,
      });

      if (!transactionReceipt || transactionReceipt.status === "reverted") {
        const errorMsg = `Transaction failed: ${JSON.stringify(transactionReceipt)}`;
        console.error(`Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      return `Transferred ${amount} to ${recipient}.\nTransaction hash for the transfer: ${hash}, receipt: ${JSON.stringify(transactionReceipt)}`;
    }

    // ERC-20 token transfer case
    if (typeof ticker !== 'string' || ticker.trim() === '') {
      throw new Error("Valid ticker is required for token transfers");
    }

    const token_address = await getTokenAddressFromTicker(ticker.toUpperCase());
    if (!token_address) {
      const errorMsg = `No token found for ticker: ${ticker.toUpperCase()}`;
      console.error(`Error: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    const decimals = await getTokenDecimals(agent, token_address);
    if (decimals === null || decimals === undefined) {
      throw new Error(`Failed to retrieve token decimals for contract: ${token_address}`);
    }

    const formattedAmount = formatSei(amount, decimals);
    if (!formattedAmount) {
      throw new Error("Failed to format token amount");
    }

    const hash = await agent.walletClient.writeContract({
      account,
      chain: sei,
      address: token_address,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, formattedAmount],
    });

    if (!hash) {
      throw new Error("Token transfer transaction failed to send");
    }

    return `Transferred ${amount} ${ticker.toUpperCase()} to ${recipient}.\nTransaction hash for the transfer: ${hash}`;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error in erc20_transfer: ${errorMsg}`);
    throw error;
  }
}