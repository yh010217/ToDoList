import {useState} from "react";



export default function PWDSignUp() {

    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isMatch, setIsMatch] = useState(true);

    const validatePassword = (input) => {
        // 정규 표현식: 6~20자, 대문자, 소문자, 숫자 포함
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;

        if (passwordPattern.test(input)) {
            setIsValid(true);
            console.log('잘 해줬군');
        } else {
            setIsValid(false);
            console.log('비밀번호는 6~20자 이내여야 하며, 대문자, 소문자, 숫자를 포함해야 합니다.');
        }
    };

    const handlePasswordChange = (e) => {
        const input = e.target.value;
        setPassword(input);
        validatePassword(input);
        setIsMatch(input === confirmPassword);
    };

    const handleConfirmChange = (e)=>{
        const input = e.target.value;
        setConfirmPassword(input);
        setIsMatch(input === password);
    }


    return (
        <>
            <li className={'signup-content'}>
                <div className={'signup-content-row'}>
                    <div className={'signup-content-label'}>비밀번호</div>
                    <div className={'signup-content-input'}>
                        <input name={'password'} type="password" onChange={handlePasswordChange}/>
                    </div>
                </div>
                <div className={'signup-content-valid'}>
                                <span className={isValid?'valid-success':'valid-fail'}>
                                    {isValid?'적절한 비밀번호':'6~20글자, 대문자, 소문자, 숫자 포함'}
                                </span>
                </div>
            </li>

            <li className={'signup-content'}>
                <div className={'signup-content-row'}>
                    <div className={'signup-content-label'}>비밀번호 확인</div>
                    <div className={'signup-content-input'}>
                        <input type="password" onChange={handleConfirmChange}/>
                    </div>
                </div>
                <div className={'signup-content-valid'}>
                                <span className={isMatch && isValid?'valid-success':'valid-fail'}>
                                    {!isValid? '비밀번호를 다시 확인하세요':
                                    isMatch?'비밀번호 확인 완료':'비밀번호가 동일하지 않습니다.'}
                                </span>
                </div>
            </li>
        </>
    )
}