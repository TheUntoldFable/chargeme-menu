"use client"

import Header from "@/components/common/header"
import Wrapper from "@/components/common/wrapper"

import BottomNavigation from "@/components/common/navigation"
import { PropsWithChildren } from "react"

interface ContainerProps {
    title?: string
    headerClassname?: string
    wrapperClassname?: string
}

// TODO: The structure is thrash, should refactor
const Container = ({ title, headerClassname, wrapperClassname, children }: PropsWithChildren<ContainerProps>) => {
    return (
        <Wrapper className={wrapperClassname}>
            <Header className={headerClassname} />
            {/*<h1 className='mb-6'>{title}</h1>*/}
            {children}
            <BottomNavigation />
        </Wrapper>
    )
}

export default Container
