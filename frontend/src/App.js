
import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./component/Header";
import Home from "./component/Home";
import ToDoList from "./component/toDoList/ToDoList";
import SignUp from "./component/signUp/SignUp";
import LogIn from "./component/LogIn";

function App() {
    const [user, setUser] = useState({});

    return (
            <BrowserRouter>
                <Header user={user} setUser={setUser}/>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/login" element={<LogIn/>}></Route>
                    <Route path="/signup" element={<SignUp/>}></Route>
                    <Route path="to-do-list/:year/:month/:date" element={<ToDoList/>}></Route>
                </Routes>
            </BrowserRouter>
    );
}

export default App;
