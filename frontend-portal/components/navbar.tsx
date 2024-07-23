'use client'

import { useRouter } from "next/navigation"
import { Dropdown, Image } from "react-bootstrap"
import '../utils/styles/components/navbar.scss';
import AuthRequest from "@/utils/request/auth.request";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/utils/redux/hooks";

const NavBar: React.FC<{}> = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()();
    const [name, setName] = useState('');

    useEffect(()=> {
        const username = localStorage.getItem(`username`);
        if (username) {
            setName(username);
        }
    }, [])

    const clickHome = () => {
        router.push('/');
    }

    const clickLogout = async () => {
        try {
            await AuthRequest.logout(dispatch);
        } catch (error) {
            console.error(error);
        }
        router.push(`/login`);
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
                    <div className="name">{name}</div>
                    <Dropdown>
                        <Dropdown.Toggle as="div" className="picture">
                            <Image src='/profile.svg' alt="profile-pic"/>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={clickLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default NavBar;