

export default function ToDoModalDeadlineTr
    ({year, month, date, hour, minute, setYear, setMonth, setDate, setHour, setMinute}){


    const dateChange = function (e) {
        let date_value = e.target.value;
        setYear(date_value.split("-")[0]);
        setMonth(date_value.split("-")[1]);
        setDate(date_value.split("-")[2]);
    }
    const timeChange = function (e) {
        let time_value = e.target.value;
        setHour(time_value.split(":")[0]);
        setMinute(time_value.split(":")[1]);
    }

    return(<tr className={'modal-tr'}>
        <td className={'modal-left'}><label htmlFor={"to-do-deadline"}>기간</label></td>
        <td className={'modal-right'}>
            <div className={'to-do-deadline-div'}>
                <div className={'date-text'}>
                    <span>{year}년 {month}월 {date}일</span>
                </div>
                <input type="date" id={'to-do-deadline'}
                       onChange={dateChange}/>
                <div className={'time-text'}>
                    <span>{hour}시 {minute}분</span>
                </div>
                <input type="time" id={'to-do-deadline-time'}
                       onChange={timeChange}/>
            </div>
        </td>
    </tr>);
}