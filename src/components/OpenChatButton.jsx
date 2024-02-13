import React, {useEffect, useState} from "react";
import {collection, doc, getDoc} from "firebase/firestore";
import {db} from "../functions/firebase.js";
import {useNames} from "../contexts/NamesContext.jsx";

export default function OpenChatButton({ user, chat, selectedChat, setId }) {
    const [name, setName] = useState("");
    const {names, setNames} = useNames();

    useEffect(() => {
        for (const name of names) {
            if (name.uid === user) {
                setName(`${name.firstName} ${name.lastName}`);
                return;
            }
        }
        getCollection(user).then(r => void (r)).catch(e => void (e));
    }, [names])

    async function getCollection(uid) {
        console.log("Read was made")
        const userdata = collection(db, 'userdata')
        const userdoc = doc(userdata, uid)
        const usersnap = await getDoc(userdoc);
        if (usersnap.exists()) {
            setName(`${usersnap.data().firstName} ${usersnap.data().lastName}`);
            setNames([...names, {
                uid: uid,
                firstName: usersnap.data().firstName,
                lastName: usersnap.data().lastName
            }])
        }
    }

    return (
        <div className={`p-3 m-2 rounded-3xl ${selectedChat === chat ? "bg-blue-900" : "bg-blue-950"} cursor-pointer hover:bg-blue-800 transition-all ease-in-out duration-300`} onClick={() => setId(chat)}>
            {name}
        </div>
    )
}