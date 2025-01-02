import React, {useState} from "react";


const PWDSignUp = React.memo(({password, setPassword, setPwdAble}) => {

    const [isValid,setIsValid] = useState(false);
    const [isMatch,setIsMatch] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (input) => {
        // 정규 표현식: 6~20자, 대문자, 소문자, 숫자 포함
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;

        setIsValid(passwordPattern.test(input)); // 이러고 끝나면 handlePasswordChange 에서 제대로 동작 안할수도 있음
        return passwordPattern.test(input);
    };

    const handlePasswordChange = (e) => {
        const input = e.target.value;
        setPassword(input);
        const validCheck = validatePassword(input);
        // 그냥 set 으로만 하니까 렌더링시점까지 제대로 안되는 이슈 -> setPwdAble 이 제대로 동작 안할 때도 있음
        setIsMatch(input === confirmPassword);
        if(validCheck && (input === confirmPassword)) {
            setPwdAble(true);
        } else {
            setPwdAble(false);
        }
    };

    const handleConfirmChange = (e) => {
        const input = e.target.value;
        setConfirmPassword(input);
        setIsMatch(input === password);
        setPwdAble(isValid && (input === password));
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
                                <span className={isValid ? 'valid-success' : 'valid-fail'}>
                                    {isValid ? '적절한 비밀번호' : '6-20자, 대,소문자, 숫자 포함'}
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
                                <span className={isMatch && isValid ? 'valid-success' : 'valid-fail'}>
                                    {!isValid ? '비밀번호를 다시 확인하세요' :
                                        isMatch ? '비밀번호 확인 완료' : '비밀번호가 동일하지 않습니다.'}
                                </span>
                </div>
            </li>
        </>
    )
});
export default PWDSignUp;