import React, { FC, ReactNode } from 'react'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  )
}

export default MainLayout
