import {useContext, useState} from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Header from "./component/Header";
import Home from "./component/Home";
import ToDoList from "./component/toDoList/ToDoList";
import SignUp from "./component/signUp/SignUp";
import LogIn from "./component/LogIn";
import {getAuthHeader} from "./utils/auth";
import {HeaderContext} from "./context/HeaderContext";


function App() {

    const [headerUpdate, setHeaderUpdate] = useState(false);
    return (
        <HeaderContext.Provider value={{headerUpdate,setHeaderUpdate}}>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/login" element={<LogIn/>}></Route>
                    <Route path="/signup" element={<SignUp/>}></Route>
                    <Route path="to-do-list/:year/:month/:date" element={<ToDoList/>}></Route>
                </Routes>
            </BrowserRouter>
        </HeaderContext.Provider>
    );
}

export default App;
