import '../../css/toDoList/modal.css';
import x표시 from '../../img/x.png'
import {useState} from "react";

export default function ToDoModal(props) {

    //'', main, second, third
    const modalType = props.modalType;

    const [year, setYear] = useState(props.year);
    const [month, setMonth] = useState(props.month);
    const [date, setDate] = useState(props.date);

    const [hour,setHour] = useState('23');
    const [minute,setMinute] = useState('59');

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

    const modalClose = function () {
        props.setModalType('');
    }

    return (
        <div className={'modal-white'}>
            <button onClick={modalClose} className={'modal-close'}><img src={x표시} alt="닫기"/></button>
            <div className={'modal-title'}>목표</div>
            <div className={'modal-contents'}>
                <table id={'modal-todo-table'}>
                    <tbody>
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-title"}>제목</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-title-div'}>
                                <input type="text" id={'to-do-title'}/>
                            </div>
                        </td>
                    </tr>
                    <tr className={'modal-tr'}>
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
                                <input type="time" id={'to-do-deadline-time'} onChange={timeChange}/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}