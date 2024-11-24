import axios from "axios";
import {useSearchParams} from "react-router-dom";


export default function NaverLogin(){
    //?code=lFRh9W0k9LF5YLBc1A&state=test
    // console.log('여기엔 오겠지..');
    const [params] = useSearchParams();
    const naverCode = params.get("code");
    const naverState = params.get("state");

    const apiURI = '/api/login/oauth2/code/naver?code='+naverCode+'&state='+naverState;
    console.log('apiURI : ' + apiURI);
    axios.get(apiURI);
    return <div>네이버 로그인 진행중입니다</div>
}