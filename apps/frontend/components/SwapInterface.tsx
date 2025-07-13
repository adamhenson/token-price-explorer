'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { type TokenSymbol, getAllTokensData } from '@/lib/api';
import { useSwapStore, useTokenAmounts } from '@/lib/store';
import { motion } from 'framer-motion';
import { ArrowUpDown, DollarSign, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TokenSelector } from './TokenSelector';

/**
 * Main swap interface component for crypto token swapping
 */
export const SwapInterface = () => {
  const [fromSelectorOpen, setFromSelectorOpen] = useState(false);
  const [toSelectorOpen, setToSelectorOpen] = useState(false);

  const {
    error,
    fromToken,
    isLoading,
    setError,
    setFromToken,
    setLoading,
    setTokens,
    setToToken,
    setUsdAmount,
    swapTokens,
    toToken,
    usdAmount,
  } = useSwapStore();

  const { fromAmount, fromTokenData, toAmount, toTokenData } = useTokenAmounts();

  // Load token data on component mount
  useEffect(() => {
    const loadTokenData = async () => {
      setLoading(true);
      setError(null);

      try {
        const tokensData = await getAllTokensData();
        const tokensMap = tokensData.reduce(
          (acc, token) => {
            acc[token.symbol as TokenSymbol] = token;
            return acc;
          },
          {} as Record<TokenSymbol, (typeof tokensData)[0]>
        );

        setTokens(tokensMap);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load token data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadTokenData();
  }, [setLoading, setError, setTokens]);

  const formatNumber = (num: number) => {
    if (num < 0.001) return '< 0.001';
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className='w-full max-w-md mx-auto flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
      </div>
    );
  }

  return (
    <div className='w-full max-w-md mx-auto space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <h1 className='text-3xl font-bold text-white mb-2'>Token Price Explorer</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <main
          className='bg-gray-900 border-gray-700 shadow-xl rounded-xl text-card-foreground flex flex-col gap-6'
          aria-label='Token swap interface'
        >
          <CardContent className='space-y-4 py-6'>
            {/* USD Input */}
            <div className='space-y-2'>
              <Label htmlFor='usd-amount' className='sr-only'>
                USD Amount to convert
              </Label>
              <div className='relative'>
                <DollarSign
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                <Input
                  id='usd-amount'
                  type='number'
                  placeholder='Enter USD amount'
                  value={usdAmount || ''}
                  onChange={(e) => setUsdAmount(Number(e.target.value))}
                  className='text-2xl font-bold pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  aria-describedby='usd-input-description'
                />
                <div id='usd-input-description' className='sr-only'>
                  Enter the USD amount you want to convert to crypto tokens
                </div>
              </div>
            </div>

            {/* From Token */}
            <fieldset className='space-y-2'>
              <legend className='sr-only'>Select first token to receive</legend>
              <div className='flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600'>
                <div className='flex-1 min-w-0'>
                  <TokenSelector
                    selectedToken={fromToken}
                    onTokenSelect={setFromToken}
                    isOpen={fromSelectorOpen}
                    onToggle={() => setFromSelectorOpen(!fromSelectorOpen)}
                    className='w-full max-w-[140px]'
                  />
                </div>
                <div className='text-right' aria-live='polite'>
                  <div
                    className='text-2xl font-bold text-white'
                    aria-label={`You will receive ${fromTokenData ? formatNumber(fromAmount) : 'calculating'} ${fromToken}`}
                  >
                    {fromTokenData ? formatNumber(fromAmount) : '---'}
                  </div>
                  <div
                    className='text-sm text-gray-400'
                    aria-label={`Price: ${fromTokenData ? formatCurrency(fromTokenData.price) : 'loading'} per token`}
                  >
                    {fromTokenData ? formatCurrency(fromTokenData.price) : '---'} per token
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Swap Button */}
            <div className='flex justify-center'>
              <Button
                onClick={swapTokens}
                variant='outline'
                size='sm'
                className='bg-gray-800 border-gray-600 hover:bg-gray-700 text-white'
                aria-label='Swap token positions'
                title='Swap the positions of the two tokens'
              >
                <ArrowUpDown className='h-4 w-4' aria-hidden='true' />
              </Button>
            </div>

            {/* To Token */}
            <fieldset className='space-y-2'>
              <legend className='sr-only'>Select second token to receive</legend>
              <div className='flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600'>
                <div className='flex-1 min-w-0'>
                  <TokenSelector
                    selectedToken={toToken}
                    onTokenSelect={setToToken}
                    isOpen={toSelectorOpen}
                    onToggle={() => setToSelectorOpen(!toSelectorOpen)}
                    className='w-full max-w-[140px]'
                  />
                </div>
                <div className='text-right' aria-live='polite'>
                  <div
                    className='text-2xl font-bold text-white'
                    aria-label={`You will receive ${toTokenData ? formatNumber(toAmount) : 'calculating'} ${toToken}`}
                  >
                    {toTokenData ? formatNumber(toAmount) : '---'}
                  </div>
                  <div
                    className='text-sm text-gray-400'
                    aria-label={`Price: ${toTokenData ? formatCurrency(toTokenData.price) : 'loading'} per token`}
                  >
                    {toTokenData ? formatCurrency(toTokenData.price) : '---'} per token
                  </div>
                </div>
              </div>
            </fieldset>
          </CardContent>
        </main>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'
        >
          <div
            className='text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-700'
            role='alert'
            aria-live='assertive'
          >
            {error}
          </div>
        </motion.div>
      )}
    </div>
  );
};
