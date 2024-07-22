'use client'

import NavBar from "@/components/navbar";
import TestPageContent from "./components/content/content";
import './test.scss';

const TestPage: React.FC<{}> = () => {
    return (
        <div className='test-page'>
            <NavBar />
            <TestPageContent />
        </div>
    )
}

export default TestPage;