'use client'

import { useAppSelector } from "@/utils/redux/utils/hooks"
import { useRouter } from "next/navigation"
import { Image } from "react-bootstrap"
import { Bell } from "react-bootstrap-icons"

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
        <div className="navbar">
            <div className="navbar-left">
                <Image alt="logo"/>
                <div>
                    <div className="nav-item">
                        <a onClick={clickHome}>Home</a>
                    </div>
                    <div className="nav-item">
                        <a onClick={clickEvent}>Event</a>
                    </div>
                    <div className="nav-item">
                        <a onClick={clickTranscript}>Transcript</a>
                    </div>
                </div>
            </div>
            <div className="navbar-right">
                <a onClick={clickNotification}>
                    <Bell size={24}/>
                </a>
                <div className="profile">
                    <div className="name">name</div>
                    <div className="picture" style={{backgroundImage: `url(})`}}>Profile Pic</div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;