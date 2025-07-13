'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SUPPORTED_TOKENS, type TokenSymbol } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface TokenSelectorProps {
  /** Currently selected token */
  selectedToken: TokenSymbol;

  /** Callback when token is selected */
  onTokenSelect: (token: TokenSymbol) => void;

  /** Whether the selector is open */
  isOpen: boolean;

  /** Callback to toggle selector */
  onToggle: () => void;

  /** Optional class name */
  className?: string;
}

/**
 * Token selector component for choosing crypto tokens
 */
export const TokenSelector = ({
  className,
  isOpen,
  onToggle,
  onTokenSelect,
  selectedToken,
}: TokenSelectorProps) => {
  const selectedTokenInfo = SUPPORTED_TOKENS[selectedToken];

  return (
    <div className={cn('relative', className)}>
      <Button
        variant='outline'
        className='w-full justify-between bg-gray-900 border-gray-700 hover:bg-gray-800 text-white'
        onClick={onToggle}
      >
        <span className='font-medium'>{selectedTokenInfo.symbol}</span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className='absolute top-full mt-2 w-full min-w-[200px] z-50'
        >
          <Card className='bg-gray-900 border-gray-700 shadow-xl py-0'>
            <div className='p-1'>
              {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
                <Button
                  key={symbol}
                  variant='ghost'
                  className={cn(
                    'w-full justify-start text-left hover:bg-gray-800 text-white py-3',
                    selectedToken === symbol && 'bg-gray-800'
                  )}
                  onClick={() => {
                    onTokenSelect(symbol as TokenSymbol);
                    onToggle();
                  }}
                >
                  <div className='flex flex-col items-start'>
                    <div className='font-medium'>{token.symbol}</div>
                    <div className='text-xs text-gray-400'>{token.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
