import React, { useEffect, useState } from "react";
import "./greeting.scss";
import { Image } from "react-bootstrap";

const Greeting: React.FC<{}> = () => {
    const [name, setName] = useState("");
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const username = localStorage.getItem(`username`);
        if (username) {
            setName(username);
        }

        const getGreeting = () => {
            if (4 < new Date().getHours() && new Date().getHours() < 12) {
                return `Good morning,`;
            } else if (
                11 < new Date().getHours() &&
                new Date().getHours() < 19
            ) {
                return `Good afternoon,`;
            } else {
                return `Good evening,`;
            }
        };

        setGreeting(getGreeting);
    }, []);

    return (
        <div className="greeting">
            <div className="greeting-container">
                <div className="greeting-photo-wrapper">
                    <Image
                        className="greeting-photo"
                        src="/profile.svg"
                        alt="profile"
                    />
                </div>
                <div className="greeting-text">
                    <div className="greeting-first-line">{greeting}</div>
                    <div className="greeting-second-line">{name}</div>
                </div>
            </div>
        </div>
    );
};

export default Greeting;
