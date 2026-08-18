import React from 'react'
import WinGo from './WinGo'
import WalletCard from '@/components/shared/WalletCard'

export default function page() {
  return (
    <div className='text-white m-5'>
      <WalletCard />
       <WinGo />
    </div>
  )
}
