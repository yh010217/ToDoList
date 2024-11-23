import {Link, useNavigate, useParams} from "react-router-dom";
import '../../css/calendar.css';
import {useEffect, useRef, useState} from "react";
import CalendarOptionSelect from "./CalendarOptionSelect";
import CalendarContentSelect from "./CalendarContentSelect";

export default function Calendar() {

    const navigate = useNavigate();
    const [calendarDate, setCalendarDate] = useState([]);

    const params = useParams();
    //년,월,일,요일 표시

    const year = params.year;
    const month = params.month;
    const date = new Date().getDate();

    const int_year = parseInt(year);
    const int_month = parseInt(month);
    if(month.length !== 2 && int_month >= 1 && int_month <= 12){
        const navMonth = '0'+month;

        navigate('/calendar/'+year+'/'+navMonth)
    }

    const prevMonth = int_month === 1 ? int_year - 1 +"/" + 12 : year + "/"
        + (int_month - 1 < 10 ? "0"+(int_month - 1) : (int_month-1));
    const nextMonth = int_month === 12 ? int_year + 1 + "/0" + 1 : year +"/"
        + (int_month + 1 < 10 ? "0"+(int_month + 1) : (int_month+1));

    const monthInfo = new Date(year,month-1);

    const firstDate = new Date(monthInfo.getFullYear(), monthInfo.getMonth(), 1);
    const firstDay = firstDate.getDay();

    const lastDateDate = new Date(monthInfo.getFullYear(), monthInfo.getMonth() + 1, 0).getDate();

    let monthPadding = (7 - (firstDay + lastDateDate)) % 7;
    monthPadding = monthPadding >= 0 ? monthPadding : monthPadding + 7;

    const month_str_arr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month_str = month_str_arr[month - 1];

    const yearRef = useRef();
    const monthRef = useRef();

    useEffect(() => {
        yearRef.current.style.left = -yearRef.current.offsetWidth / 2 + 'px'
        monthRef.current.style.left = -monthRef.current.offsetWidth / 2 + 'px'


        let monthDate = []
        let dayDate = [];
        for(let i = 0 ; i < firstDay + lastDateDate + monthPadding ; i++){

            if(i < firstDay || i > firstDay + lastDateDate - 1){
                dayDate.push('');
            }else{
                dayDate.push(i - firstDay + 1 + '');
            }

            if(i % 7 === 6){
                monthDate.push(dayDate);
                dayDate = [];
            }
            if(i === firstDay + lastDateDate + monthPadding - 1){
                setCalendarDate(monthDate);
            }
        }
    }, [params])
    useEffect(()=>{
        console.log(calendarDate);
    },[calendarDate])

    return (
        <div>
            <div className={"white-paper"}>
                <Link className={'out-white out-left'} to={"/to-do-list"}>
                    &lt; 투두리스트로 이동</Link>
                <Link className={'out-white out-right'} to={"/time-table/"+year+"/"+month+"/"+date}>
                    시간표로 이동 &gt;</Link>
                <div className={'calendar-header'}>
                    <div>
                        <div ref={yearRef}
                             className={'calendar-year'}>
                            {year}
                        </div>
                    </div>
                    <div>
                        <div ref={monthRef}
                             className={'calendar-month'}>{month}
                        </div>
                        <div className={'calendar-month-str'}>{month_str}</div>
                    </div>
                    <div></div>
                </div>
                <div className={'calendar-header-bottom'}></div>

                <div className={'select-boxes'}>
                    <div className={'select-left'}></div>
                    <div className={'calendar-select-right'}>
                        <CalendarOptionSelect/>
                        <CalendarContentSelect/>
                    </div>
                </div>

                <div className={'calendar-div'}>
                    <table className={'calendar-table'}>
                        <thead>
                        <tr>
                            <th className={'day-th sunday'}>일</th>
                            <th className={'day-th'}>월</th>
                            <th className={'day-th'}>화</th>
                            <th className={'day-th'}>수</th>
                            <th className={'day-th'}>목</th>
                            <th className={'day-th'}>금</th>
                            <th className={'day-th saturday'}>토</th>
                        </tr>
                        </thead>
                        <tbody>
                        {calendarDate.map(monthItem =>{
                            return (<tr>
                                {monthItem.map(weekItem =>{
                                    return <td>{weekItem}</td>
                                })}
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
                <div className={'month-move'}>
                    <Link to={"/calendar/"+prevMonth} className={'month-move-button'}>&lt;이전 달</Link>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Link to={"/calendar/"+nextMonth} className={'month-move-button'}>다음 달&gt;</Link>
                </div>

            </div>
        </div>)
}



