

export default function Logout({setStateToken,setLoginList}){
    const logout = function (){
        localStorage.removeItem('auth');
        setStateToken('');
        setLoginList('none');
        //리프레시 토큰이 있을 때는 서버에 axios 로 삭제해달라고 요청넣기
    }
    return(
        <button onClick={logout}>로그아웃</button>
    )
}

