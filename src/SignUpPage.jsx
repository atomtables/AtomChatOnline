import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from './firebase/firebase.js';
import CenteredPage from "./components/CenteredPage.jsx";
import TextInput from "./components/TextInput.jsx";
import emailIcon from "./assets/email.png";
import passwordIcon from "./assets/password.png";
import Button from "./components/Button.jsx";
import Page from "./components/Page.jsx";
import {collection, doc, setDoc} from "firebase/firestore";

export default function SignUpPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    async function onCreate(e) {
        e.preventDefault()
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userdataref = collection(db, 'userdata');
                setDoc(doc(userdataref, user.uid), {
                    firstName: firstName,
                    lastName: lastName
                })
                console.log(user);
                navigate("/login")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <Page>
            <CenteredPage>
                <div>
                    <h1 className={"text-3xl text-center font-bold"}>Sign Up via Email</h1>
                    <form>
                        <TextInput icon={emailIcon} textInputHandler={(e) => setEmail(e.target.value)} type={"email"}
                                   name={"emailAddress1"} placeholder={"Email Address"} value={email}/>
                        <div className={"flex justify-between"}>
                            <TextInput icon={passwordIcon} textInputHandler={(e) => setPassword(e.target.value)}
                                       type={"password"} name={"password1"} placeholder={"Password"} value={password}/>
                            <TextInput icon={passwordIcon}
                                       textInputHandler={(e) => setPasswordConfirmation(e.target.value)}
                                       type={"password"} name={"password2"} placeholder={"Confirmation"}
                                       value={passwordConfirmation}/>
                        </div>
                        <div className={"flex justify-between"}>
                            <TextInput icon={passwordIcon} textInputHandler={(e) => setFirstName(e.target.value)}
                                       type={"text"} name={"firstName"} placeholder={"First Name"} value={firstName}/>
                            <TextInput icon={passwordIcon}
                                       textInputHandler={(e) => setLastName(e.target.value)}
                                       type={"text"} name={"lastName"} placeholder={"Last Name"}
                                       value={lastName}/>
                        </div>
                        <div className={"flex justify-between"}>
                            <Button onClick={onCreate} name="Sign Up" className={"basis-3/4"} bgColor={"amber-950"}/>
                            <Button onClick={() => navigate("/login")} name="Login" className={"basis-1/4"}/>
                        </div>
                    </form>
                </div>
            </CenteredPage>
        </Page>
    )
}