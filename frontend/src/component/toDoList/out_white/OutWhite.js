import {Link} from "react-router-dom";


export default function OutWhite() {

    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth() + 1;
    const date = todayDate.getDate();
    return (<>
            <Link className={'out-white out-left'} to={"/calendar/" + year + "/" + month}>
                &lt; 달력으로 이동</Link>
            <Link className={'out-white out-right'} to={"/time-table/" + year + "/" + month + "/" + date}>
                시간표 작성 &gt;</Link>
        </>
    )
}