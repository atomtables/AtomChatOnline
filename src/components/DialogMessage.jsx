import {Fragment, useEffect, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import Button from "./Button.jsx";
import TextInput from "./TextInput.jsx";
import EmailIcon from "../assets/email.png";
import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {auth, db} from "../functions/firebase.js";
import {useUser} from "../contexts/UserContext.jsx";
import {onAuthStateChanged} from "firebase/auth";

export default function DialogMessage({onResponded}) {
    const {user, setUser} = useUser();

    const [open, setOpen] = useState(true)
    let changeOccured = false
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const cancelButtonRef = useRef(null)

    useEffect(() => {
        if (!open) {
            onResponded(changeOccured)
        }
    })

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
            } else {
                setUser(null)
            }
        });
    }, [])

    async function getCollection(uid) {
        let success = false
        console.log("Read was made")
        console.log("Write was made")
        const userdata = collection(db, 'userdata')
        const userdocs = await getDocs(userdata)
        const signedinuserdoc = doc(userdata, uid)
        userdocs.forEach(d => {
            changeOccured = true
            if (d.data().email === email) {
                const altuserdoc = doc(userdata, d.id)
                let chat = collection(signedinuserdoc, 'open_chats')
                setDoc(doc(chat, d.id), {
                    user: d.id
                })
                chat = collection(altuserdoc, 'open_chats')
                setDoc(doc(chat, uid), {
                    user: uid
                })
                success = true
            }
        });
        if (success) {
            console.log("Success")
            return true
        }
        else {
            setError("User not found. Please ensure the user exists or that you typed in a valid email address.")
            console.log("User not found")
            return false
        }
    }

    function onAddFriend() {
        if (email.trim() === "") {
            setError("Email cannot be empty")
            return
        }
        setError("")
        getCollection(user.uid).then(r => {
            if (r) setOpen(false)
        }).catch(e => alert(e));
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-gray-800 text-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3"
                                                          className="font-semibold leading-6 text-gray-100">
                                                Add Friend
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-400">
                                                    Please add the email address of the person you want to add as a
                                                    friend.
                                                </p>
                                            </div>
                                            <TextInput
                                                placeholder={"Email Address"}
                                                icon={EmailIcon}
                                                name={"email"}
                                                type={"email"}
                                                value={email}
                                                textInputHandler={(e) => setEmail(e.target.value)}
                                            />
                                            <div>
                                                <p className="text-sm text-red-400">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <Button name={"Add Friend"} onClick={onAddFriend}/>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
