import axios from "axios";


export default function Logout({headerUpdate,setHeaderUpdate,setLoginList}){
    const logout = async function (){
        //리프레시 토큰이 있을 때는 서버에 axios 로 삭제해달라고 요청넣기
        await axios.post('/api/logout')
            .then(res => {
                console.log(res);
            })

        localStorage.removeItem('auth');
        setHeaderUpdate(!headerUpdate);
        setLoginList('none');
    }
    return(
        <button onClick={logout}>로그아웃</button>
    )
}

