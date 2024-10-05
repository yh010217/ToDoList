import React,{useState} from "react";
import axios from "axios";

const NicknameSignUp = React.memo(({nickname,setNickname,setNicknameAble}) => {


    const [nicknameValid, setNicknameValid] = useState(false);
    const [nicknameDupCheck, setNicknameDupCheck] = useState('unknown');


    const nicknameCheck = function () {

        if (nicknameValid) {
            axios.post('/api/sign-up/nickname-check', {
                nickname: nickname
            }).then(res => {
                if (res.status === 200) {
                    if (res.data === 'able') {
                        setNicknameDupCheck('able')
                        setNicknameAble(true);
                    } else {
                        setNicknameDupCheck('disable');
                        setNicknameAble(false);
                    }
                }
            })
        }
    }


    const validateNickname = (input) => {

        const nicknamePattern = /^[a-zA-Z0-9가-힣]{4,12}$/;
        if (nicknamePattern.test(input)) {
            setNicknameValid(true);
        } else {
            setNicknameValid(false);
        }
    }

    const handleChange = (e) => {
        const input = e.target.value;
        setNickname(input);
        setNicknameDupCheck('unknown');
        validateNickname(input);
        setNicknameAble(false);
    }

    return (
        <li className={'signup-content'}>
            <div className={'signup-content-row'}>
                <div className={'signup-content-label'}>닉네임</div>
                <div className={'signup-content-input'}>
                    <input name={'nickname'} type="text" className={'custom-input'}
                           onChange={handleChange}
                           maxLength={12} placeholder={'영문, 숫자, 한글, 4-12자'}/>
                </div>
                <button className={'input-check'}
                        onClick={nicknameCheck} type={"button"}>중복 확인
                </button>
            </div>
            <div className={'signup-content-valid'}>
                <span className={!nicknameValid ? 'valid-fail' :
                    (nicknameDupCheck === 'able') ? 'valid-success' : 'valid-fail'}>
                    {!nicknameValid ? '닉네임 형식을 맞춰주세요' :
                        (nicknameDupCheck === 'able') ? '사용 가능한 닉네임' :
                            (nicknameDupCheck === 'disable') ? '중복된 닉네임이 있습니다' : '중복 확인을 진행해주세요'}
                </span>
            </div>
        </li>
    )
});
export default NicknameSignUp;