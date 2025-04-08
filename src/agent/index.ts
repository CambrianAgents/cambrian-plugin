import {
  WalletClient as ViemWalletClient,
  createPublicClient,
  http,
  PublicClient as ViemPublicClient,
  Address,
  createWalletClient,
} from "viem";
import { sei } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { get_erc20_balance, erc20_transfer } from '../tools';
import { exactInputSingle, exactOutputSingle } from '../tools/dragonswap';
import { Config } from '../types';

export class SeiAgentKit {
  public publicClient: ViemPublicClient;
  public walletClient: ViemWalletClient;
  public wallet_address: Address;
  public config: Config;

  constructor(
    private_key: string,
    configOrKey: Config | string | null,
  ) {
    this.publicClient = createPublicClient({
      chain: sei,
      transport: http()
    });
    const account = privateKeyToAccount(private_key as Address);
    this.wallet_address = account.address;
    this.walletClient = createWalletClient({
      account,
      chain: sei,
      transport: http()
    });

    // Handle both old and new patterns
    if (typeof configOrKey === "string" || configOrKey === null) {
      this.config = { OPENAI_API_KEY: configOrKey || "" };
    } else {
      this.config = configOrKey;
    }

  }

  async getERC20Balance(contract_address?: Address): Promise<string> {
    return get_erc20_balance(this, contract_address);
  }

  async ERC20Transfer(
    amount: number,
    recipient: Address,
    ticker?: string,
  ): Promise<string> {
    return erc20_transfer(this, amount, recipient, ticker);
  }

  async exactInputSingle(
    tokenInAddress: Address,
    tokenOutAddress: Address,
    fee: number,
    amountIn: bigint
  ): Promise<string> {
    return exactInputSingle(this, tokenInAddress, tokenOutAddress, fee, amountIn);
  }

  async exactOutputSingle(
    tokenInAddress: Address,
    tokenOutAddress: Address,
    fee: number,
    amountInMaximum: bigint,
    amountOut: bigint
  ): Promise<string> {
    return exactOutputSingle(this, tokenInAddress, tokenOutAddress, amountOut, fee, amountInMaximum);
  }
}