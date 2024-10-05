import {jwtDecode} from "jwt-decode";

//이미 토큰에는 Bearer 가 붙어있는 상태

export const isTokenValid = (token) => {
    if (!token) return false;
    //Bearer 가 붙어있어도 잘 작동함
    const decodedToken = jwtDecode(token);
    console.log('isTokenValid : ',decodedToken);
    return decodedToken.exp * 1000 > Date.now(); // 만료 시간 체크
}

export const getAuthHeader = () => {
    const token = localStorage.getItem('auth');
    if (token && isTokenValid(token)) {
        return token;
    }
    return null;
}



