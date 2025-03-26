interface ExactInputSingleParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  amountIn: BigInt;
  amountOutMinimum: BigInt;
  sqrtPriceLimitX96: BigInt;
}

interface ExactOutputSingleParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  amountOut: BigInt;
  amountInMaximum: BigInt;
  sqrtPriceLimitX96: BigInt;
}

export { ExactInputSingleParams, ExactOutputSingleParams };
