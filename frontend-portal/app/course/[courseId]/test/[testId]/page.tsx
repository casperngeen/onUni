'use client'

import NavBar from "@/components/navbar";
import TestPageContent from "./components/content/content";
import './test.scss';
import { useAppSelector } from "@/utils/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TestPage: React.FC<{}> = () => {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem(`username`) === null) {
            router.replace(`/login`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        <div className='test-page'>
            <NavBar />
            <TestPageContent />
        </div>
    )
}

export default TestPage;