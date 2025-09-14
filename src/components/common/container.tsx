"use client"

import Header from "@/components/common/header"
import Wrapper from "@/components/common/wrapper"

import BottomNavigation from "@/components/common/navigation"
import { PropsWithChildren } from "react"

interface ContainerProps {
    title: string
}

const Container = ({ children }: PropsWithChildren<ContainerProps>) => {
    return (
        <Wrapper className='bg-darkBg'>
            <Header />
            <div className='h-full max-h-screen w-full flex-1'>{children}</div>
            <BottomNavigation />
        </Wrapper>
    )
}

export default Container
