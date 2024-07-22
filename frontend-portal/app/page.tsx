'use client'

import NavBar from '@/components/navbar'
import React from 'react'
import DashboardContent from './components/content/content'
import './dashboard.scss'

const Dashboard: React.FC<{}> = () => {
  return (
    <div className='dashboard'>
      <NavBar />
      <DashboardContent />
    </div>
  )
}

export default Dashboard