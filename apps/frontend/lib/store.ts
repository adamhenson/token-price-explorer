import { create } from 'zustand';
import type { TokenInfo, TokenSymbol } from './api';

interface SwapState {
  /** USD amount entered by user */
  usdAmount: number;

  /** Source token for swap */
  fromToken: TokenSymbol;

  /** Target token for swap */
  toToken: TokenSymbol;

  /** Loading state for API calls */
  isLoading: boolean;

  /** Token data with prices */
  tokens: Record<TokenSymbol, TokenInfo & { price: number }>;

  /** Error message if any */
  error: string | null;
}

interface SwapActions {
  /** Set USD amount */
  setUsdAmount: (amount: number) => void;

  /** Set source token */
  setFromToken: (token: TokenSymbol) => void;

  /** Set target token */
  setToToken: (token: TokenSymbol) => void;

  /** Swap from and to tokens */
  swapTokens: () => void;

  /** Set loading state */
  setLoading: (loading: boolean) => void;

  /** Set token data */
  setTokens: (tokens: Record<TokenSymbol, TokenInfo & { price: number }>) => void;

  /** Set error message */
  setError: (error: string | null) => void;
}

export interface SwapStore extends SwapState, SwapActions {}

export const useSwapStore = create<SwapStore>((set, get) => ({
  // Initial state
  usdAmount: 0,
  fromToken: 'USDC',
  toToken: 'ETH',
  isLoading: false,
  tokens: {} as Record<TokenSymbol, TokenInfo & { price: number }>,
  error: null,

  // Actions
  setUsdAmount: (amount: number) => set({ usdAmount: amount }),

  setFromToken: (token: TokenSymbol) => {
    const { toToken } = get();
    if (token === toToken) {
      // If selecting the same token as target, swap them
      set({ fromToken: token, toToken: get().fromToken });
    } else {
      set({ fromToken: token });
    }
  },

  setToToken: (token: TokenSymbol) => {
    const { fromToken } = get();
    if (token === fromToken) {
      // If selecting the same token as source, swap them
      set({ toToken: token, fromToken: get().toToken });
    } else {
      set({ toToken: token });
    }
  },

  swapTokens: () => {
    const { fromToken, toToken } = get();
    set({ fromToken: toToken, toToken: fromToken });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setTokens: (tokens: Record<TokenSymbol, TokenInfo & { price: number }>) => set({ tokens }),

  setError: (error: string | null) => set({ error }),
}));

/**
 * Hook to get calculated token amounts based on USD input
 */
export const useTokenAmounts = () => {
  const { usdAmount, fromToken, toToken, tokens } = useSwapStore();

  const fromTokenData = tokens[fromToken];
  const toTokenData = tokens[toToken];

  const fromAmount = fromTokenData?.price ? usdAmount / fromTokenData.price : 0;
  const toAmount = toTokenData?.price ? usdAmount / toTokenData.price : 0;

  return {
    fromAmount,
    toAmount,
    fromTokenData,
    toTokenData,
  };
};
