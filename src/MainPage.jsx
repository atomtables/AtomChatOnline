import React, {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from './functions/firebase';
import Page from "./templates/Page.jsx";
import {useUser} from "./contexts/UserContext.jsx";
import create_chat from './assets/create_chat.png';
import {collection, doc, getDocs} from "firebase/firestore";
import OpenChatButton from "./components/OpenChatButton.jsx";
import CenteredPage from "./templates/CenteredPage.jsx";
import OpenChat from "./blocks/OpenChat.jsx";
import combineAndHash from "./functions/hash.js";
import DialogMessage from "./blocks/DialogMessage.jsx";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const {user, setUser} = useUser();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const [openChats, setOpenChats] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [openChat, setOpenChat] = useState(false);
    const [display, setDisplay] = useState(false);
    const navigate = useNavigate();

    async function getCollection(u) {
        console.log("Read was made")
        const uid = u.uid;
        const userdata = collection(db, 'userdata')
        const userdoc = doc(userdata, uid)
        const chatdata = collection(userdoc, 'open_chats')

        getDocs(chatdata).then(async (chatsnap) => {
            let openchats = []
            for (let i = 0; i < chatsnap.docs.length; i++) {
                const chat = chatsnap.docs[i].data();
                openchats = [...openchats, {id: chatsnap.docs[i].id, user: chat.user, chat: await combineAndHash(uid, chat.user)}]
            }
            setOpenChats(openchats);
        });
    }

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
                getCollection(u).then(r => void (r)).catch(e => alert(e));
            } else {
                setUser(null)
                navigate('/login')
            }
        });
    }, [])

    function setdisplay(changeOccured) {
        setDisplay(false)
        if (changeOccured) getCollection(user).then(r => void (r)).catch(e => alert(e));
    }

    // noinspection JSValidateTypes
    return (
        <Page>
            {display ? <DialogMessage onResponded={setdisplay}/> : null}
            <div className={"flex align-middle justify-center flex-nowrap  h-full"}>
                <div className={"2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 border-gray-500 border-r-2 h-full"}>
                    <div className={"m-5 p-3 rounded-2xl bg-blue-950 hover:bg-blue-800 transition-all ease-in-out duration-300 cursor-pointer"} onClick={() => setDisplay(true)}>
                        <img src={create_chat} alt={"Create Chat"} className={"object-cover h-[1.5rem] inline mr-2"}/>
                        Create Chat
                    </div>
                    {
                        openChats.map((chat) => (
                            <OpenChatButton key={chat.id} user={chat.user} chat={chat.chat} setId={setOpenChat} selectedChat={openChat}/>
                        ))
                    }
                </div>
                <div className={"2xl:w-5/6 xl:w-4/5 lg:w-3/4 md:w-2/3 sm:w-1/2"}>
                    {openChat ? (<>
                        <OpenChat chat={openChat}/>
                    </>) : (<>
                        <CenteredPage>
                            <h1 className={"text-3xl font-bold text-center"}>Open a chat!</h1>
                            <div className={"text-lg text-center"}>or create a new one!</div>
                        </CenteredPage>
                    </>)}
                </div>
            </div>
        </Page>
    )
}