import {useState,useEffect} from "react";


export default function CalendarBody({params}){

    const [calendarDate, setCalendarDate] = useState([]);

    const year = parseInt(params.year);
    const month = parseInt(params.month);

    const monthInfo = new Date(year, month - 1);

    const firstDay = new Date(monthInfo.getFullYear(), monthInfo.getMonth(), 1).getDay();

    const lastDate = new Date(monthInfo.getFullYear(), monthInfo.getMonth() + 1, 0).getDate();

    console.log(firstDay + lastDate);
    let monthPadding = 7 - ((firstDay + lastDate) % 7);
    monthPadding = monthPadding === 7 ? 0 : monthPadding;

    useEffect(() => {
        let monthDate = []
        let dayDate = [];
        for (let i = 0; i < firstDay + lastDate + monthPadding; i++) {

            if (i < firstDay || i > firstDay + lastDate - 1) {
                dayDate.push('');
            } else {
                dayDate.push(i - firstDay + 1 + '');
            }

            if (i % 7 === 6) {
                monthDate.push(dayDate);
                dayDate = [];
            }
            if (i === firstDay + lastDate + monthPadding - 1) {
                setCalendarDate(monthDate);
            }
        }
    }, [params])

    return(
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
            {calendarDate.map((monthItem,weekIndex) => {
                return (<tr key={weekIndex}>
                    {monthItem.map((weekItem,dateIndex) => {
                        return <td key={dateIndex}>{weekItem}</td>
                    })}
                </tr>)
            })}
            </tbody>
        </table>
    </div>);
}