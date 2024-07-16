'use client'

import React, { useEffect } from 'react'
import { Image } from 'react-bootstrap'
import './content.scss'
import ActiveCourses from '../active/active'
import Greeting from '../greeting/greeting'
import InactiveCourses from '../inactive/inactive'
import SuggestedTest from '../suggested/suggested'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { fetchAllCourses, selectActiveCourses, selectInactiveCourses, selectNextTest } from '@/utils/redux/slicers/dashboard.slicer'

const DashboardContent: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const nextTest = selector(selectNextTest);
    const hasActive = selector(selectActiveCourses).length > 0;
    const hasInactive = selector(selectInactiveCourses).length > 0;
    
    useEffect(() => {
        dispatch(fetchAllCourses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const getBanner = () => {
        const hour = new Date().getHours();
        if (4 < hour  && hour < 12) {
            return `/morning.png`
        } else if (11 < hour && hour < 19) {
            return `/afternoon.png`
        } else {
            return `/night.png`;
        }
    }
    return (
        <div className='dashboard-content'>
            <div className='dashboard-banner'>
                    <Image src={getBanner()} alt='banner'/>
            </div>
            <Greeting />
            {!hasActive && !hasInactive && 
                <div className='dashboard-no-content'>
                    <Image className='dashboard-no-content-image' src='/no-content 1.svg' alt='no-content' />
                    <div className='dashboard-no-content-text'>
                        You are not enrolled in any courses currently.
                    </div>
                </div>
            }
            {nextTest && <SuggestedTest />}
            {hasActive && <ActiveCourses />}
            {hasInactive && <InactiveCourses />}
        </div>
    )
}

export default DashboardContent