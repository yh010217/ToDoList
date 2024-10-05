import '../../css/signUp.css'
import IdSignUp from "./IdSignUp";
import PWDSignUp from "./PWDSignUp";
import EmailSignUp from "./EmailSignUp";
import NicknameSignUp from "./NicknameSignUp";
import axios from "axios";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function SignUp() {

    const navigate = useNavigate();  // 페이지 이동을 위해 사용

    const [loginId,setLoginId] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [nickname,setNickname] = useState('');

    const [idAble,setIdAble] = useState(false);
    const [pwdAble, setPwdAble] = useState(false);
    const [emailAble, setEmailAble] = useState(false);
    const [nicknameAble, setNicknameAble] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();  // 폼의 기본 동작인 새로고침을 막음
        if(idAble && pwdAble && emailAble && nicknameAble) {
            try {
                const res = await axios.post("/api/sign-up/signup-check",
                    {loginId, password, email, nickname});
                if (res.status === 200) {
                    console.log(res.data)
                    if(res.data === 'duplicate'){
                        alert('중복 확인을 다시 진행해주세요.')
                        throw new Error('중복 확인을 다시 진행해주세요');
                    }else if(res.data==='complete'){
                        navigate('/login');
                    }else{
                        alert('서버 에러. 다시 한번 시도해 주세요.');
                        throw new Error(res.data);
                    }
                }
            } catch (error) {
                console.error("회원가입 실패 : ", error);
            }
        }else{
            alert('입력 정보를 확인해주세요');
        }
    };

    return (
        <div>
            <div className={"white-paper"}>

                <Link className={'out-white out-left'} to={"/login"}>
                    &lt; 로그인</Link>
                <div className={"signup-title"}>Sign Up</div>

                <div className={'signup-contents'}>
                    <form onSubmit={handleSubmit}>
                        <ul>

                            <IdSignUp loginId={loginId} setLoginId={setLoginId}
                            setIdAble={setIdAble}/>

                            <PWDSignUp password={password} setPassword={setPassword}
                            setPwdAble={setPwdAble}/>

                            <EmailSignUp email={email} setEmail={setEmail}
                            setEmailAble={setEmailAble}/>

                            <NicknameSignUp nickname={nickname} setNickname={setNickname}
                            setNicknameAble={setNicknameAble}/>

                            <button className={'submit-button'} type="submit">회원가입</button>
                        </ul>
                    </form>
                </div>

            </div>
        </div>
    )
}