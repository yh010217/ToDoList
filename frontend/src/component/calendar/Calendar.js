import {Link, useNavigate, useParams} from "react-router-dom";
import '../../css/calendar/calendar.css';
import CalendarHeader from "./calendar_header/CalendarHeader";
import SelectBoxes from "./select_boxes/SelectBoxes";
import OutWhite from "./out_white/OutWhite";
import CalendarBody from "./body/CalendarBody";
import {useEffect} from "react";

export default function Calendar() {

    const navigate = useNavigate();

    const params = useParams();
    //년,월,일,요일 표시

    const year = params.year;
    const month = params.month;

    const int_year = parseInt(year);
    const int_month = parseInt(month);

    useEffect(()=>{
        if (month.length === 1 && int_month >= 1 && int_month <= 12) {
            const navMonth = '0' + month;
            navigate('/calendar/' + year + '/' + navMonth)
        }else if(int_month < 1 || int_month > 12){
            alert('정확한 연,월을 입력해주세요');
            navigate('/');
        }
    },[params]);

    const prevMonth = int_month === 1 ? int_year - 1 + "/" + 12 :
        year + "/" + (int_month - 1 < 10 ? "0" + (int_month - 1) : (int_month - 1));
    const nextMonth = int_month === 12 ? int_year + 1 + "/0" + 1 :
        year + "/" + (int_month + 1 < 10 ? "0" + (int_month + 1) : (int_month + 1));


    return (
        <div className={"white-paper"}>

            {/*<OutWhite/>*/}

            <CalendarHeader month={month}
                            year={year} params={params}>
            </CalendarHeader>

            <div className={'calendar-header-bottom'}></div>

            <SelectBoxes></SelectBoxes>

            <CalendarBody params={params}></CalendarBody>

            <div className={'month-move'}>
                <Link to={"/calendar/" + prevMonth} className={'month-move-button'}>&lt;이전 달</Link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <Link to={"/calendar/" + nextMonth} className={'month-move-button'}>다음 달&gt;</Link>
            </div>

        </div>
    )
}
