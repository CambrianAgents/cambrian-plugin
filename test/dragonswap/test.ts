// import { exactInputSingle, exactOutputSingle } from "../../src/tools/dragonswap/index";
import { SeiAgentKit } from "../../src/index";

export default async function main(agent: SeiAgentKit) {
    // Requires initial balance of wsei + sei for gas.
    // might lose wsei/isei due to fees and slippage

    await agent.exactInputSingle(
        "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7", // WSEI tokenInAddress
        "0x5cf6826140c1c56ff49c808a1a75407cd1df9423", // ISEI tokenOutAddress
        500, // 0.05% fee 
        BigInt("1000000000000000"), // 0.01 token assuming 18 decimals amountIn
    )
    await agent.exactOutputSingle(
        "0x5cf6826140c1c56ff49c808a1a75407cd1df9423", // ISEI tokenInAddress
        "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7", // WSEI tokenOutAddress
        500, // 0.05% fee
        10_000_000_000_000_000_000n, // very large practically infinite amountInMaximum
        BigInt("1000000000000000"), // 0.01 token assuming 18 decimals amountOut
    )
}
