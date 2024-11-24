import {Link, useNavigate} from "react-router-dom";
import '../css/login.css'
import axios from "axios";
import {useState, useContext, useEffect} from "react";
import {HeaderContext} from "../context/HeaderContext";
import {get_naver_login_link} from "../utils/oauth_link";

export default function LogIn() {

    const {headerUpdate, setHeaderUpdate} = useContext(HeaderContext);

    const navigate = useNavigate();  // 페이지 이동을 위해 사용

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
/*
    const [naverLink,setNaverLink] = useState('');
    useEffect(()=>{
        let naver_login_link;
        const getNaverLoginLink = async () =>{
            naver_login_link = await get_naver_login_link();
            setNaverLink(naver_login_link);
        }
        getNaverLoginLink();
    },[])*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/login",
                {
                    loginId: loginId,
                    password: password
                });
            if (res.status === 200) {
                if (res.headers['authorization'] !== null &&
                    res.headers['authorization'].startsWith('Bearer')) {
                    localStorage.setItem('auth', res.headers['authorization']);
                    setHeaderUpdate(!headerUpdate);
                    navigate('/');
                } else {
                    throw new Error('로그인 에러');
                }
            }
        } catch (error) {
            console.error("회원가입 실패 : ", error);
        }
    }

    const idChangeHandle = (e) => {
        setLoginId(e.target.value);
    }
    const pwdChangeHandle = (e) => {
        setPassword(e.target.value);
    }

    return (
        <div>
            <div className={'white-paper'}>

                <Link className={'out-white out-right'} to={"/signup"}>
                    회원가입 &gt;</Link>
                <div className={"signup-title"}>LOGIN</div>

                <div className={'login-contents'}>
                    <form onSubmit={handleSubmit}>
                        <ul>
                            <li className={'blank'}></li>
                            <li className={'login-content'}>
                                <div className={'login-content-row'}>
                                    <div className={'login-content-label'}>아이디</div>
                                    <div className={'login-content-input'}>
                                        <input name={'loginId'} type="text" className={'custom-input'}
                                               maxLength={16} onChange={idChangeHandle}
                                               placeholder={'영문(소), 숫자, 6-16자'}/>
                                    </div>

                                </div>
                            </li>
                            <li className={'blank'}></li>

                            <li className={'login-content'}>
                                <div className={'login-content-row'}>
                                    <div className={'login-content-label'}>비밀번호</div>
                                    <div className={'login-content-input'}>
                                        <input name={'loginId'} type="password"
                                               className={'custom-input'} onChange={pwdChangeHandle}
                                               placeholder={'6-20자, 대,소문자, 숫자 포함'}/>
                                    </div>

                                </div>
                            </li>

                            <li className={'blank'}></li>
                            <li>
                                <button className={'submit-button'} type="submit">로그인</button>
                            </li>
                        </ul>
                    </form>
                    <ul>
                        <li>
                            <a href={"/login/oauth2/naver"}>네이버 로그인</a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )
}