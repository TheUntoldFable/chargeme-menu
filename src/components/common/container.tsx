'use client';

import Wrapper from '@/components/common/wrapper';
import Header from '@/components/common/header';

import BottomNavigation from '@/components/common/navigation';
import { PropsWithChildren } from 'react';

interface ContainerProps {
  title: string;
}

const Container = ({ title, children }: PropsWithChildren<ContainerProps>) => {
  return (
    <Wrapper>
      <Header classNames="mb-6" />
      <h1 className="mb-6">{title}</h1>
      {children}
      <BottomNavigation />
    </Wrapper>
  );
};

export default Container;
