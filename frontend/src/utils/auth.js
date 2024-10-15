import {jwtDecode} from "jwt-decode";
import axios from "axios";

//이미 토큰에는 Bearer 가 붙어있는 상태

export const isTokenValid = (token) => {
    if (!token) return false;
    //Bearer 가 붙어있어도 잘 작동함
    let decodedToken;
    try {
        decodedToken = jwtDecode(token);
    }catch (error){
        console.log('jwt decode 중 에러 : ',error);
    }
    console.log('isTokenValid : ', decodedToken);
    return decodedToken.exp * 1000 > Date.now(); // 만료 시간 체크
}

export const getAuthHeader = async () => {
    const originalToken = localStorage.getItem('auth');
    if(originalToken && isTokenValid(originalToken)){
        return originalToken;
    }else{
        const token = await getNewToken();
        if (token && isTokenValid(token)) {
            localStorage.setItem('auth',token);
            return token;
        }else{
            return null;
        }
    }

}

/**
 * <pre>
 * 401 에러가 떴을 때 시도해보는 RefreshToken을 통한 토큰 재발급
 * return 값은 새로 발급된 AccessToken, null이라면 에러였던 것
 * 이거 할 때는 밑에 setStateToken같은거 다시 설정해줘야 함
 * </pre>
 * */
const getNewToken = async () => {
    try {
        const res = await axios.post('/api/login/reissue');
        if (res.status === 200) {
            console.log('---------getNewToken에서 받아는 오지?--------');
            console.log(res.headers['authorization']);
            console.log('---------대답--------');
            if (res.headers['authorization'] && res.headers['authorization'].startsWith('Bearer')) {
                return res.headers['authorization'];
            } else {
                throw new Error('new token fail');
            }
        } else {
            throw new Error('status not ok');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const tokenLogout = () => {
    localStorage.removeItem('auth');
    //리프레시 토큰이 있을 때는 서버에 axios 로 삭제해달라고 요청넣기
    axios.post('/api/logout')
        .then(res => {
            console.log(res);
        })
}


