import Header from "../blocks/Header.jsx";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../functions/firebase.js";
import {useUser} from "../contexts/UserContext.jsx";

export default function Page({children}) {
    const { user, setUser } = useUser();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            }
        });
    }, [])

    return (
        <>
            <Header user={user}/>
            <div className={"h-[calc(100%-50px)]"}>
                <div className={"w-full mx-auto h-full"}>
                    {children}
                </div>
            </div>
        </>
    )
}