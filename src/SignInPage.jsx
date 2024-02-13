import React, {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './functions/firebase';
import {NavLink, useNavigate} from 'react-router-dom'
import Page from "./components/Page.jsx";
import {useUser} from "./contexts/UserContext.jsx";
import emailIcon from "./assets/email.png"
import passwordIcon from "./assets/password.png"
import TextInput from "./components/TextInput.jsx";
import Button from "./components/Button.jsx";
import CenteredPage from "./components/CenteredPage.jsx";

export default function SignInPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {user, setUser} = useUser();

    const onLogin = (e) => {
        console.log("Login attempted")
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/")
                console.log(user);
            })
            .catch((error) => {
                // display all errors to user
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // display specific error to user
                if (errorCode === 'auth/invalid-email') {
                    alert('Invalid email address.');
                } else if (errorCode === 'auth/missing-password') {
                    alert('User disabled.');
                } else if (errorCode === 'auth/user-disabled') {
                    alert('User disabled.');
                } else if (errorCode === 'auth/user-not-found') {
                    alert('User not found.');
                } else if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
            });
    }

    if (user != null) {
        navigate("/")
    }

    return (
        <Page>
            <CenteredPage>
                <div>
                    <h1 className={"text-3xl text-center font-bold"}>Sign In via Email</h1>
                    <form>
                        <TextInput icon={emailIcon} textInputHandler={(e) => setEmail(e.target.value)} type={"email"}
                                   name={"emailAddress1"} placeholder={"Email Address"} value={email}/>
                        <TextInput icon={passwordIcon} textInputHandler={(e) => setPassword(e.target.value)}
                                   type={"password"} name={"password1"} placeholder={"Password"} value={password}/>
                        <div className={"flex justify-between"}>
                            <Button onClick={onLogin} name="Sign In" className={"basis-3/4"}/>
                            <Button onClick={() => navigate("/signup")} name="Or Sign Up" className={"basis-1/4"}/>
                        </div>
                    </form>
                </div>
            </CenteredPage>
        </Page>
    )
}