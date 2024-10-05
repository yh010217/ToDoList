import '../css/Header.css'
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";
import Logout from "./Logout";

export default function Header({stateToken, setStateToken}) {


    const navigate = useNavigate();  // 페이지 이동을 위해 사용

    const [loginNickname, setLoginNickname] = useState('');
    const [loginList,setLoginList] = useState('none');

    useEffect(() => {
        const auth = localStorage.getItem('auth');

        if (auth && auth.startsWith("Bearer ")) {
            const token = localStorage.getItem('auth').split(' ')[1];
            const decodedToken = jwtDecode(token);

            // 만료됐을때...?
            if (decodedToken.exp * 1000 < Date.now()) {
                //jwt 재발급 받는 로직
                //setStateToken(newToken); -> jwt 일관성 유지?
            } else {
                setLoginNickname(decodedToken.nickname);
            }
        } else {
            setLoginNickname('');
        }
    }, [stateToken]);

    const userClick = function () {
        if (loginNickname !== '') {
            if(loginList === 'none'){
                setLoginList('block');
            }else{
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
            style={{display : loginList}}>
                <li>
                    <Link to={'/my-page'}>마이페이지</Link>
                </li>
                <li>
                    <Link to={'/setting'}>환경설정</Link>
                </li>
                <li>
                    <Logout setStateToken={setStateToken}
                    setLoginList={setLoginList}>로그아웃</Logout>
                </li>
            </ul>
        </div>
    )
}