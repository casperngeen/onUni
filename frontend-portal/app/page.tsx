'use client'

import NavBar from '@/components/navbar'
import React, { useEffect } from 'react'
import DashboardContent from './components/content/content'
import './dashboard.scss'
import { useRouter } from 'next/navigation'

const Dashboard: React.FC<{}> = () => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(`username`)) {
      router.push(`/login`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className='dashboard'>
      <NavBar />
      <DashboardContent />
    </div>
  )
}

export default Dashboard