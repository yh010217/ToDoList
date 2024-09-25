import '../../css/toDoList/backGround.css';
import '../../css/toDoList/items.css';
import '../../css/toDoList/modal.css';
import 추가 from '../../img/추가.png'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import ToDoModal from "./ToDoModal";
import {useState} from "react";


export default function ToDoList() {

    const params = useParams();
    //년,월,일,요일 표시

    const year = params.year;
    const month = params.month;
    const date = params.date;

    const date_object = new Date(year, month - 1, date);
    const day_int = date_object.getDay();
    const day_str_arr = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
    const day = day_str_arr[day_int] + 'day';
    console.log(day);

    const month_arr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month_str = month_arr[month - 1];



    const [modalType, setModalType] = useState('');

    const modalShow = function (type){
        setModalType(type);
    }
    const addMainList = function () {
        setModalType('main');
        modalShow('main');
    }

    return (
        <div className={"white-paper"}>
            <Link className={'out-white out-left'} to={"/calendar/" + year + "/" + month}>
                &lt; 달력으로 이동</Link>
            <Link className={'out-white out-right'} to={"/time-table/" + year + "/" + month + "/" + date}>
                시간표 작성 &gt;</Link>
            <div className={'to-do-list-header'}>
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
            </div>

            <div className={'modal-container'} style={{ display : modalType === '' ? 'none' : 'block'}}>
                <ToDoModal modalType={modalType} setModalType={setModalType}
                year={year} month={month} date={date}>

                </ToDoModal>
            </div>
        </div>
    )
}