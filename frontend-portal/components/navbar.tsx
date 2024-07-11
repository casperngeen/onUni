'use client'

import { useAppSelector } from "@/utils/redux/utils/hooks"
import { useRouter } from "next/navigation"
import { Image } from "react-bootstrap"
import '../utils/styles/components/navbar.scss';

const NavBar: React.FC<{}> = () => {
    const selector = useAppSelector();
    const router = useRouter();
    // need to get profile pic and name


    const clickHome = () => {
        router.push('/');
    }

    const clickEvent = () => {
        // do something
    }

    const clickTranscript = () => {
        // do something
    }
    
    const clickNotification = () => {
        // do something
    }
    
    return (
        <div className="uni-navbar">
            <div className="navbar-left">
                <a className='home' onClick={clickHome}>
                    <Image src='/header-logo.svg' alt="logo"/>
                </a>
            </div>
            <div className="navbar-right">
                <div className="profile">
                    <div className="name">name</div>
                    <div className="picture">
                        <Image src='/profile.svg' alt="profile-pic"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;