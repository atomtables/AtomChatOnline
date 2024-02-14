import Message from "../components/Message.jsx";
import TextInput from "../components/TextInput.jsx";
import Button from "../components/Button.jsx";
import React, {useEffect, useRef, useState} from "react";
import {addDoc, collection, doc, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import {auth, db, serverStamp} from "../functions/firebase.js";
import {useUser} from "../contexts/UserContext.jsx";
import {onAuthStateChanged} from "firebase/auth";
import m from "../assets/message.png";
import DialogMessage from "./DialogMessage.jsx";

export default function OpenChat({ chat }) {
    const {user, setUser, firstName, setFirstName, lastName, setLastName} = useUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const scroll = useRef();

    useEffect(() => {
        // alert("rerender occured")
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
                const messages = collection(db, "messages")
                const messagedoc = doc(messages, chat)
                const messagedata = collection(messagedoc, "messages")
                const q = query(
                    messagedata,
                    orderBy("timestamp", "desc"),
                    limit(50)
                );
                // `${usersnap.data().firstName} ${usersnap.data().lastName}`
                const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                    console.log("Read was made. Can be 50 messages on first load, but will be (usually) 1 after that.")
                    const fetchedMessages = [];
                    QuerySnapshot.forEach((doc) => {
                        fetchedMessages.push({...doc.data(), id: doc.id});
                    });
                    const sortedMessages = fetchedMessages.sort(
                        (a, b) => a.timestamp - b.timestamp
                    );
                    for (let i = 0; i < sortedMessages.length; i++) {
                        sortedMessages[i].is_user = sortedMessages[i].user === u.uid;
                    }
                    setMessages(sortedMessages);
                });
            } else {
                setUser(null)
            }
        });
    }, [])

    useEffect(() => {
        setTimeout(() => scroll.current.scrollIntoView({behavior: "smooth"}), 100)
    }, [messages])

    async function onSendMessage(e) {
        console.log("Write was made")
        e.preventDefault()

        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }

        const timestamp = Date.now();
        const m = {
            timestamp: serverStamp.now(),
            message: message,
            user: user.uid
        }
        await addDoc(collection(doc(collection(db, "messages"), chat), "messages"), m);
        setMessage("");
    }

    return (<>
        <ul id="messages" className="block list-none p-0 m-0 overflow-y-auto h-full">
            {messages?.map((message) => (
                <Message key={message.timestamp} uid={message.user} message={message.message}
                         timestamp={message.timestamp} isuser={message.is_user}/>
            ))}
            <div className={"mb-[80px]"}/>
            <span ref={scroll}></span>
        </ul>
        <form id="form"
              className={"flex align-middle justify-between fixed bottom-0 left-0 right-0 bg-gray-950"}>
            <TextInput
                name="messageInput"
                className="bg-dark color-dark"
                placeholder="Send a message..."
                type="text"
                value={message}
                textInputHandler={(e) => setMessage(e.target.value)}
                icon={m}
            />
            <div className={'w-16'}>
                <Button name={"send"} className={"h-min mr-5 my-5"} onClick={onSendMessage}/>
            </div>
        </form>
    </>)
}