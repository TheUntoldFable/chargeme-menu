'use client';

import { PropsWithChildren } from 'react';

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="
    flex
    flex-1
    flex-col
    items-center
    max-h-screen
    max-w-mobile
    bg-cover
    bg-default
    bg-no-repeat
    mx-auto"
    >
      {children}
    </div>
  );
};

export default Wrapper;
