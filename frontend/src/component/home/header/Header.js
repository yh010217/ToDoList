import '../../../css/Header.css'
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useContext, useEffect, useState} from "react";
import LogoutButton from "./logout/LogoutButton";
import {getAuthHeader} from "../../../utils/auth";
import {HeaderContext} from "../../../context/HeaderContext";

const headerFunction = async (setLoginNickname) => {
    const auth = await getAuthHeader();
    if (auth && auth.startsWith("Bearer ")) {
        const token = auth.split(' ')[1];
        const decodedToken = jwtDecode(token);

        setLoginNickname(decodedToken.nickname);

    } else {
        setLoginNickname('');
    }
}

export default function Header() {

    const {headerUpdate,setHeaderUpdate} = useContext(HeaderContext);

    const navigate = useNavigate();  // 페이지 이동을 위해 사용

    const [loginNickname, setLoginNickname] = useState('');
    const [loginList, setLoginList] = useState('none');

    useEffect(() => {
        headerFunction(setLoginNickname);
    }, [headerUpdate]);

    const userClick = function () {
        if (loginNickname !== '') {
            if (loginList === 'none') {
                setLoginList('block');
            } else {
                setLoginList('none');
            }
        } else {
            navigate('/login');
        }
    }

    return (
        <div className={"header-div"}>
            <Link to="/" className={"header-title"}>wooli.st</Link>
            <button className={'header-user-div'} onClick={userClick}>
                {loginNickname !== '' ? loginNickname : '로그인'}
            </button>
            <ul className={'header-login-list'}
                style={{display: loginList}}>
                <li>
                    <Link to={'/my-page'}>마이페이지</Link>
                </li>
                <li>
                    <Link to={'/setting'}>환경설정</Link>
                </li>
                <li>
                    <LogoutButton setHeaderUpdate={setHeaderUpdate} headerUpdate={headerUpdate}
                                  setLoginList={setLoginList}>로그아웃</LogoutButton>
                </li>
            </ul>
        </div>
    )
}