'use client';

import { PropsWithChildren } from 'react';

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-mobile bg-cover bg-default flex flex-1 flex-col items-center bg-no-repeat mx-auto min-h-screen">
      {children}
    </div>
  );
};

export default Wrapper;
