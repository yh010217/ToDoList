import {useState} from "react";
import axios from "axios";

export default function EmailSignUp() {

    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [emailDupCheck, setEmailDupCheck] = useState('unknown');


    const emailCheck = function () {

        if (emailValid) {
            axios.post('/api/sign-up/email-check', {
                email: email
            }).then(res => {
                if (res.status === 200) {
                    if (res.data === 'able') {
                        setEmailDupCheck('able')
                    } else {
                        setEmailDupCheck('disable');
                    }
                }
            })
        }
    }


    const validateEmail = (input) => {

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailPattern.test(input)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    }

    const handleChange = (e) => {
        const input = e.target.value;
        setEmail(input);
        setEmailDupCheck('unknown');
        validateEmail(input);
    }
    return (
        <li className={'signup-content'}>
            <div className={'signup-content-row'}>
                <div className={'signup-content-label'}>이메일</div>
                <div className={'signup-content-input'}>
                    <input name={'email'} type="text" className={'custom-input'}
                           onChange={handleChange}/>
                </div>
                <button className={'input-check'}
                        onClick={emailCheck}>중복 확인
                </button>
            </div>
            <div className={'signup-content-valid'}>
                
                <span className={!emailValid ? 'valid-fail' :
                    (emailDupCheck === 'able')?'valid-success':'valid-fail'}>
                    {!emailValid ? '이메일 형식을 맞춰주세요':
                        (emailDupCheck ==='able')?'사용 가능한 이메일':
                            (emailDupCheck === 'disable')?'중복된 이메일이 있습니다':'중복 확인을 진행해주세요'}
                </span>
            </div>
        </li>
    )
}