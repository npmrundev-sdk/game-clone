import Link from 'next/link'
import React from 'react'

export default function SportGame() {
  return (
   <div className='flex flex-col gap-2'>
        <h1  className='text-yellow-400 mt-5'>Sport:</h1>
        <Link href='/sport'>Win Go</Link>
        <Link href='/hgzy-game/k3'>K3</Link>
    </div>
  )
}
