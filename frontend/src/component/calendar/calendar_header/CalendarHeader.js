import {useEffect, useRef} from "react";


export default function CalendarHeader({year, month, params}) {

    const yearRef = useRef();
    const monthRef = useRef();

    useEffect(() => {
        yearRef.current.style.left = -yearRef.current.offsetWidth / 2 + 'px'
        monthRef.current.style.left = -monthRef.current.offsetWidth / 2 + 'px'
    }, [params])


    const month_str_arr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month_str = month_str_arr[month - 1];

    return (<div className={'calendar-header'}>
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
    </div>);
}