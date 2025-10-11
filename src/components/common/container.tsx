"use client"

import Header from "@/components/common/header"
import Wrapper from "@/components/common/wrapper"

import { PropsWithChildren } from "react"
import BottomNavigation from "./navigation"

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
