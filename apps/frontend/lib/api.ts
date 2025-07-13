import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';

export const FUNKIT_API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

export const SUPPORTED_TOKENS = {
  USDC: { symbol: 'USDC', chainId: '1', name: 'USD Coin' },
  USDT: { symbol: 'USDT', chainId: '137', name: 'Tether USD' },
  ETH: { symbol: 'ETH', chainId: '8453', name: 'Ethereum' },
  WBTC: { symbol: 'WBTC', chainId: '1', name: 'Wrapped Bitcoin' },
} as const;

export type TokenSymbol = keyof typeof SUPPORTED_TOKENS;

export interface TokenInfo {
  symbol: string;
  chainId: string;
  name: string;
  address?: string;
  decimals?: number;
}

export interface TokenPrice {
  priceInUsd: number;
  symbol: string;
  chainId: string;
}

/**
 * Fetches token information for a given symbol and chain
 */
export const getTokenInfo = async ({
  symbol,
  chainId,
}: {
  /** Token symbol to fetch */
  symbol: string;
  /** Chain ID where the token exists */
  chainId: string;
}): Promise<TokenInfo | null> => {
  try {
    const tokenInfo = await getAssetErc20ByChainAndSymbol({
      chainId,
      symbol,
      apiKey: FUNKIT_API_KEY,
    });

    return {
      symbol: tokenInfo.symbol,
      chainId: tokenInfo.chain,
      name: tokenInfo.name,
      address: tokenInfo.address,
      decimals: tokenInfo.decimals,
    };
  } catch (error) {
    console.error(`Error fetching token info for ${symbol}:`, error);
    return null;
  }
};

/**
 * Fetches the current price of a token in USD
 */
export const getTokenPrice = async ({
  address,
  chainId,
}: {
  /** Token contract address */
  address: string;
  /** Chain ID where the token exists */
  chainId: string;
}): Promise<number | null> => {
  try {
    const priceInfo = await getAssetPriceInfo({
      chainId,
      assetTokenAddress: address,
      apiKey: FUNKIT_API_KEY,
    });

    return priceInfo.unitPrice;
  } catch (error) {
    console.error(`Error fetching price for token ${address}:`, error);
    return null;
  }
};

/**
 * Fetches token information and price for all supported tokens
 */
export const getAllTokensData = async (): Promise<Array<TokenInfo & { price: number }>> => {
  const tokensData = await Promise.all(
    Object.values(SUPPORTED_TOKENS).map(async (token) => {
      const tokenInfo = await getTokenInfo({
        symbol: token.symbol,
        chainId: token.chainId,
      });

      if (!tokenInfo || !tokenInfo.address) {
        return null;
      }

      const price = await getTokenPrice({
        address: tokenInfo.address,
        chainId: token.chainId,
      });

      if (price === null) {
        return null;
      }

      return {
        ...tokenInfo,
        price,
      };
    })
  );

  return tokensData.filter((token): token is TokenInfo & { price: number } => token !== null);
};

/**
 * Calculates the equivalent amount of tokens for a given USD amount
 */
export const calculateTokenAmount = ({
  priceInUsd,
  usdAmount,
}: {
  /** Current price of the token in USD */
  priceInUsd: number;
  /** USD amount to convert */
  usdAmount: number;
}): number => {
  if (priceInUsd === 0) return 0;
  return usdAmount / priceInUsd;
};

/**
 * Calculates the USD value of a given token amount
 */
export const calculateUsdValue = ({
  amount,
  priceInUsd,
}: {
  /** Amount of tokens */
  amount: number;
  /** Current price of the token in USD */
  priceInUsd: number;
}): number => {
  return amount * priceInUsd;
};
