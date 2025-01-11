import 추가 from "../../../img/추가.png";


export default function ToDoListHeader
    ({year, month, date, setModalType, setParentPlan, setChildrenUpdateFunc}) {


    const date_object = new Date(year, month, date);
    const day_int = date_object.getDay();
    const day_str_arr = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
    const day = day_str_arr[day_int] + 'day';

    const month_arr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month_str = month_arr[month];


    const addMainList = () => {
        setModalType('1');
        setParentPlan(0);
        setChildrenUpdateFunc(() => () => {
        });
    };

    return (<div className={'to-do-list-header'}>
        <div className={'header-day'}><span>{day}</span></div>
        <div className={'header-row'}>
            <div className={'header-row-left'}>
                <span className={'header-date'}>{date}</span>
                <span className={'header-month-year'}>
                            <div className={'header-month'}>{month_str}</div>
                            <div>{year}</div>
                        </span>
            </div>
            <div className={'header-row-right'}>
                <button id={'add-to-do-header'} onClick={addMainList}>
                    <img src={추가} alt="추가"/>
                    <div>추가</div>
                </button>
            </div>
        </div>
        <div className={'header-bottom-line'}></div>
    </div>);
}
