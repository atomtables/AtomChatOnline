import { db } from "../firebase/firebase.js";
import {useState, useEffect} from "react";
import {collection, doc, getDoc} from "firebase/firestore";

export default function Message({ uid, message, timestamp }) {
    const [name, setName] = useState("");

    async function getCollection(uid) {
        const userdata = collection(db, 'userdata')
        const userdoc = doc(userdata, uid)
        const usersnap = await getDoc(userdoc);
        if (usersnap.exists()) {
            setName(`${usersnap.data().firstName} ${usersnap.data().lastName}`);
        }
    }

    useEffect(() => {
        getCollection(uid).then(r => void(r)).catch(e => void(e));
    })

    return (
        <div className={"bg-amber-950 p-2 rounded-xl text-white m-2"}>
            {name}: {new Date(timestamp).toLocaleTimeString()}: {message}
        </div>
    )
}