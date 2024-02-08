import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignInPage from "./SignInPage.jsx";
import MainPage from "./MainPage.jsx";
import SignUpPage from "./SignUpPage.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/login" element={<SignInPage/>}/>
            </Routes>
        </Router>
    );
}