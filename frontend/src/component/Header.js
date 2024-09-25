import '../css/Header.css'
import {Link} from "react-router-dom";

export default function Header(){
    return(
        <div className={"header-div"}>
            <Link to="/" className={"header-title"}>wooli.st</Link>
            <Link to="/login" className={"header-user-div"}>로그인</Link>
        </div>
    )
}