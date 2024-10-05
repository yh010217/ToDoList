import axios from "axios";
import React,{useState} from "react";

const IdSignUp = React.memo(({loginId,setLoginId,setIdAble})=>{

    const [idValid, setIdValid] = useState(false);
    const [idDupCheck, setIdDupCheck] = useState('unknown');

    const idCheck = function () {

        if (idValid) {
            axios.post('/api/sign-up/id-check', {
                loginId: loginId
            }).then(res => {
                if (res.status === 200) {
                    if (res.data === 'able') {
                        setIdDupCheck('able');
                        setIdAble(true);
                    } else {
                        setIdDupCheck('disable');
                        setIdAble(false);
                    }
                }
            })
        }

    }
    const validateId = (input) => {

        const loginIdPattern = /^(?=.*[a-z])[a-z\d]{6,16}$/;
        if (loginIdPattern.test(input)) {
            setIdValid(true);
        } else {
            setIdValid(false);
        }
    }
    const handleChange = (e) => {
        const input = e.target.value;
        setLoginId(input);
        setIdDupCheck('unknown');
        validateId(input);
        setIdAble(false);
    }

    return (
        <li className={'signup-content'}>
            <div className={'signup-content-row'}>
                <div className={'signup-content-label'}>아이디</div>
                <div className={'signup-content-input'}>
                    <input name={'loginId'} value={loginId} type="text" className={'custom-input'} maxLength={16}
                           placeholder={'영문(소), 숫자, 6-16자'} onChange={handleChange}/>
                </div>
                <button className={'input-check'}
                        onClick={idCheck} type={"button"}>중복 확인
                </button>
            </div>
            <div className={'signup-content-valid'}>

                <span className={!idValid ? 'valid-fail' :
                    (idDupCheck === 'able')?'valid-success':'valid-fail'}>
                    {!idValid ? '아이디 형식을 맞춰주세요':
                        (idDupCheck ==='able')?'사용 가능한 아이디':
                            (idDupCheck === 'disable')?'중복된 아이디가 있습니다':'중복 확인을 진행해주세요'}
                </span>
            </div>
        </li>
    )
});

export default IdSignUp;