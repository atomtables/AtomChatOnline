import React, {useEffect, useRef, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {auth, db} from './firebase/firebase';
import Page from "./components/Page.jsx";
import {useUser} from "./contexts/UserContext.jsx";
import Button from "./components/Button.jsx";
import TextInput from "./components/TextInput.jsx";
import m from './assets/message.png';
import create_chat from './assets/create_chat.png';
import {addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import Message from "./components/Message.jsx";

export default function Home() {
    const {user, setUser} = useUser();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const [openChats, setOpenChats] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const scroll = useRef();
    const navigate = useNavigate();

    async function handleSearch(e) {
        e.preventDefault()
        try {
            const q = query(
                collection(db, 'userdata')
            )
            const querySnapshot = await onSnapshot(q, (QuerySnapshot) => {
                const fetchedMessages = [];
                QuerySnapshot.forEach((doc) => {
                    fetchedMessages.push({...doc.data(), id: doc.id});
                });
                for (let i = 0; i < fetchedMessages.length; i++) {
                    if (fetchedMessages[i].firstName.includes(message) || fetchedMessages[i].lastName.includes(message)) {
                        console.log(fetchedMessages[i])
                    }
                }
                setSearchResults(fetchedMessages);
                console.log(fetchedMessages)
            });
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
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
                    for (let i = 0; i < sortedMessages.length; i++) {
                        sortedMessages[i].is_user = sortedMessages[i].user === u.uid;
                    }
                    setMessages(sortedMessages);
                });
                return () => unsubscribe;
            } else {
                setUser(null)
            }
        });
    }, [])

    async function getCollection(u) {
        const uid = u.uid;
        const userdata = collection(db, 'userdata')
        const userdoc = doc(userdata, uid)
        const chatdata = collection(userdoc, 'open_chats')
        const chatsnap = await getDocs(chatdata);
        let openchats = []
        chatsnap.forEach((d) => {
            const usersnap = getUsersnap(d, userdata).data()
            openchats.push({firstName: usersnap.get("firstName"), lastName: usersnap.get("lastName"), id: d.id});
        });
        setOpenChats(openchats);
        console.log(openchats)
    }

    async function getUsersnap(d, userdata) {
        const userdoc = doc(userdata, d.data().user)
        return await getDoc(userdoc)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                getCollection(u).then(r => void (r)).catch(e => void (e));
            } else {
                setUser(null)
            }
        });
    }, [])

    useEffect(() => {
        if (messages !== []) {
            setTimeout(() => scroll.current.scrollIntoView({behavior: "smooth"}), 100)
        }
    }, [messages])

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
        scroll.current.scrollIntoView({behavior: "smooth"});
    }

    return (
        <Page>
            <div className={"flex"}>
                <div className={"w-96"}>
                    <div className={"m-5 p-3 rounded-2xl bg-blue-950"}>
                        <img src={create_chat} alt={"Create Chat"} className={"object-cover h-[1.5rem] inline mr-2"}/>
                        Create Chat
                    </div>
                    <div className={"p-3 bg-blue-950"}>
                        {
                            openChats.map((chat) => (
                                <div key={chat.id} className={"p-5bg-blue-950"}>
                                    {chat.firstName} {chat.lastName} {chat.id}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={"w-full"}>
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
                </div>
            </div>
        </Page>
    )
}