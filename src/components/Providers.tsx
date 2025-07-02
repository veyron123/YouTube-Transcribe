'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { TranscriptionProvider } from '@/context/TranscriptionContext';

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <TranscriptionProvider>{children}</TranscriptionProvider>
    </SessionProvider>
  );
};

export default Providers;