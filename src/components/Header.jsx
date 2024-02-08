import {NavLink, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useUser} from '../contexts/UserContext.jsx';
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db} from "../firebase/firebase.js";
import {collection, doc, getDoc} from "firebase/firestore";

export default function Header() {
    const navigate = useNavigate();
    const {user, setUser} = useUser();
    let [name, setName] = useState(null);


    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (user && !name) {
                getCollection(u).then(r => void(r)).catch(e => void(e))
            }
        });
    }, [getCollection])

    async function getCollection(u) {
        const uid = u.uid;
        const userdata = collection(db, 'userdata')
        const userdoc = doc(userdata, uid)
        const usersnap = await getDoc(userdoc);
        if (usersnap.exists()) {
            setName(`${usersnap.data().firstName} ${usersnap.data().lastName}`);
        }
    }

    function onSignOut() {
        signOut(auth)
            .then(() => {
                setUser(null)
                navigate("/login")
            }).catch((error) => {
        });
    }

    let content;
    if (user != null) {
        content = (
            <div className={"flex"}>
                <button className={"a pointer-events-none"}>{name ? name : user.email}: </button>
                <button className={"pl-2 cursor-pointer text-red-200"} onClick={onSignOut}>Logout</button>
            </div>
        )
    } else {
        content = (
            <div className={"flex space-evenly space-x-3"}>
                <div className={""}><NavLink to="/login">Login</NavLink></div>
                <div className={""}><NavLink to={'/signup'}>Sign Up</NavLink></div>
            </div>
        )
    }
    return (
        <>
            <div className={"bg-gradient-to-r from-green-950 to-cyan-950 p-5 flex justify-between"}>
                <div className={"text-2xl"}>AtomChat Online</div>
                {content}
            </div>
        </>
    )
}