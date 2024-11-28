import {useNavigate} from "react-router-dom";
import axios from "axios";


export const get_naver_login_link = async function (){
    console.log('여기엔 오니?');
    const response_type = 'code';
    let client_id;
    let redirect_uri;
    let state = 'test';

    let login_link = '/login';
    await axios.get('/api/oauth/get-naver')
        .then(res =>{
            if(res.status === 200){
                client_id = res.data.client_id;
                //redirect_uri = res.data.redirect_uri;
                redirect_uri = 'http://localhost/oauth2/code/naver';
                login_link = 'https://nid.naver.com/oauth2.0/authorize?response_type='+response_type
                    +'&client_id='+client_id + '&redirect_uri='+redirect_uri + '&state=' + state;
            }
        }).catch(error =>{
        alert('오류가 발생했습니다');
    })
    return login_link;
}