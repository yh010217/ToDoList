import {Link} from "react-router-dom";


export default function OutWhite() {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth() + 1;
    const date = todayDate.getDate();
    return (<>
        <Link className={'out-white out-left'} to={"/to-do-list"}>
            &lt; 투두리스트로 이동</Link>
        <Link className={'out-white out-right'} to={"/time-table/" + year + "/" + month + "/" + date}>
            시간표로 이동 &gt;</Link>
    </>);
}