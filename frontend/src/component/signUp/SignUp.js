import '../../css/signUp.css'
import IdSignUp from "./IdSignUp";
import PWDSignUp from "./PWDSignUp";
import EmailSignUp from "./EmailSignUp";
import NicknameSignUp from "./NicknameSignUp";

export default function SignUp() {
    return (
        <div>
            <div className={"white-paper"}>
                <div className={"signup-title"}>Sign Up</div>

                <div className={'signup-contents'}>
                    <ul>

                        <IdSignUp/>

                        <PWDSignUp/>

                        <EmailSignUp/>

                        <NicknameSignUp/>

                    </ul>
                </div>

            </div>
        </div>
    )
}