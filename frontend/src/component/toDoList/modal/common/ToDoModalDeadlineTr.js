import {useState} from "react";


export default function ToDoModalDeadlineTr
    ({year, month, date, hour, minute, setDeadline}){

    const [deadlineYear, setDeadlineYear] = useState(year);
    const [deadlineMonth, setDeadlineMonth] = useState(month);
    const [deadlineDate, setDeadlineDate] = useState(date);
    const [deadlineHour, setDeadlineHour] = useState(hour);
    const [deadlineMinute, setDeadlineMinute] = useState(minute);



    const dateChange = function (e) {
        let date_value = e.target.value.split("-");
        const currentDeadlineYear = date_value[0];
        const currentDeadlineMonth = date_value[1];
        const currentDeadlineDate = date_value[2];
        setDeadlineYear(currentDeadlineYear);
        setDeadlineMonth(currentDeadlineMonth);
        setDeadlineDate(currentDeadlineDate);
        let tempDeadline = `${currentDeadlineYear}-${currentDeadlineMonth}-${currentDeadlineDate} ${deadlineHour}:${deadlineMinute}`;
        setDeadline(tempDeadline);
    }
    const timeChange = function (e) {
        let time_value = e.target.value.split(":");
        const currentDeadlineHour = time_value[0];
        const currentDeadlineMinute = time_value[1];
        setDeadlineHour(currentDeadlineHour);
        setDeadlineMinute(currentDeadlineMinute);
        let tempDeadline = `${deadlineYear}-${deadlineMonth}-${deadlineDate} ${currentDeadlineHour}:${currentDeadlineMinute}`;
        setDeadline(tempDeadline);
    }

    return(<tr className={'modal-tr'}>
        <td className={'modal-left'}><label htmlFor={"to-do-deadline"}>기간</label></td>
        <td className={'modal-right'}>
            <div className={'to-do-deadline-div'}>
                <div className={'date-text'}>
                    <span>{deadlineYear}년 {deadlineMonth}월 {deadlineDate}일</span>
                </div>
                <input type="date" id={'to-do-deadline'}
                       onChange={dateChange}/>
                <div className={'time-text'}>
                    <span>{deadlineHour}시 {deadlineMinute}분</span>
                </div>
                <input type="time" id={'to-do-deadline-time'}
                       onChange={timeChange}/>
            </div>
        </td>
    </tr>);
}