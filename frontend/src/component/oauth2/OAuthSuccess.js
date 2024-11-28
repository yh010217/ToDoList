import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function OAuthSuccess({setHeaderUpdate,headerUpdate}){

    const navigate = useNavigate();  // 페이지 이동을 위해 사용

    useEffect(()=>{
        const cookieToHeader = async () => {
            try {
                const res = await axios.post('/api/oauth/cookie-to-header');
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
        cookieToHeader();
    },[])
    return<>
    </>
}