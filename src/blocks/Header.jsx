import {NavLink, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import {useUser} from '../contexts/UserContext.jsx';
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db} from "../functions/firebase.js";
import {collection, doc, getDoc} from "firebase/firestore";
import {useNames} from "../contexts/NamesContext.jsx";

export default function Header() {
    const navigate = useNavigate();
    const {user, setUser, firstName, setFirstName, lastName, setLastName} = useUser();
    const {names, setNames} = useNames();

    async function getCollection(uid) {
        console.log("Read was made")
        const userdata = collection(db, 'userdata')
        const userdoc = doc(userdata, uid)
        const usersnap = await getDoc(userdoc);
        if (usersnap.exists()) {
            setFirstName(`${usersnap.data().firstName}`);
            setLastName(`${usersnap.data().lastName}`);
            setNames([...names, {
                uid: uid,
                firstName: usersnap.data().firstName,
                lastName: usersnap.data().lastName
            }])
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            for (const name of names) {
                if (name.uid === u.uid) {
                    setFirstName(`${name.firstName}`);
                    setLastName(`${name.lastName}`);
                    return;
                }
            }
            getCollection(u.uid).then(r => void (r)).catch(e => void (e));
        });
    }, [])

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
                <button
                    className={"a pointer-events-none"}>{firstName && lastName ? `${firstName} ${lastName}` : user.email}:
                </button>
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
            <div
                className={"bg-gradient-to-r from-green-950 to-cyan-950 p-2 flex justify-between border-gray-500 border-b-2"}>
                <div className={"text-2xl"}>AtomChat Online</div>
                {content}
            </div>
        </>
    )
}