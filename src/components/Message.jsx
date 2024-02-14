import {db} from "../functions/firebase.js";
import {useEffect, useState} from "react";
import {collection, doc, getDoc, Timestamp} from "firebase/firestore";
import {useNames} from "../contexts/NamesContext.jsx";

export default function Message({uid, message, timestamp, isuser}) {
    const [name, setName] = useState("");
    const {names, setNames} = useNames();

    useEffect(() => {
        for (const name of names) {
            if (name.uid === uid) {
                setName(`${name.firstName} ${name.lastName}`);
                return;
            }
        }
        getCollection(uid).then(r => void (r)).catch(e => void (e));
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
        <>
            <div className={`bg-amber-950 p-2 rounded-xl w-max relative text-white m-2 ${isuser ? "ml-auto" : ""}`}>
                {`${name}: ${new Date(new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()).toLocaleTimeString()}: ${message}`}
            </div>
        </>
    )

}