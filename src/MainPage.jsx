import React, {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {auth, db} from './firebase/firebase';
import Page from "./components/Page.jsx";
import {useUser} from "./contexts/UserContext.jsx";
import Button from "./components/Button.jsx";
import TextInput from "./components/TextInput.jsx";
import m from './assets/message.png';
import {addDoc, collection, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import Message from "./components/Message.jsx";

export default function Home() {
    const {user, setUser} = useUser();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
            } else {
                setUser(null)
            }
        });
    }, [])

    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            orderBy("timestamp", "desc"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({...doc.data(), id: doc.id});
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.timestamp - b.timestamp
            );
            setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, []);

    async function onSendMessage(e) {
        e.preventDefault()

        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }

        const timestamp = Date.now();
        const m = {
            timestamp: timestamp,
            message: message,
            user: user.uid
        }
        await addDoc(collection(db, "messages"), m);
        setMessage("");
    }

    return (
        <Page>
            <ul id="messages" className="block list-none p-0 m-0">
                {messages?.map((message) => (
                    <Message key={message.timestamp} uid={message.user} message={message.message} timestamp={message.timestamp}/>
                ))}
            </ul>
            <form id="form" className={"flex align-middle justify-between fixed bottom-0 left-0 right-0"}>
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
                    <Button name={"send"} className={" h-min p-5 my-5"} onClick={onSendMessage}/>
                </div>
            </form>
        </Page>
    )
}