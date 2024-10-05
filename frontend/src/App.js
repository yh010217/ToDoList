import {useState} from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Header from "./component/Header";
import Home from "./component/Home";
import ToDoList from "./component/toDoList/ToDoList";
import SignUp from "./component/signUp/SignUp";
import LogIn from "./component/LogIn";
import {getAuthHeader} from "./utils/auth";


function App() {
    const [stateToken, setStateToken] = useState(localStorage.getItem('auth') || '');

    return (
        <BrowserRouter>
            <Header stateToken={stateToken} setStateToken={setStateToken}/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/login" element={<LogIn setStateToken={setStateToken}/>}></Route>
                <Route path="/signup" element={<SignUp/>}></Route>
                <Route path="to-do-list/:year/:month/:date" element={<ToDoList stateToken={stateToken} setStateToken={setStateToken}/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
