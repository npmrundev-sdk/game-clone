import React from 'react'
import WalletCard from '@/components/shared/WalletCard'
import TrxWinGame from './TrxWinGame'

export default function page() {
  return (
    <div className='text-white m-5'>
      <WalletCard />
      <TrxWinGame />
    </div>
  )
}
