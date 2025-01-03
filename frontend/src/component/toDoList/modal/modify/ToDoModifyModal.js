import x표시 from "../../../../img/x.png";
import {useEffect, useRef, useState} from "react";
import {getAuthHeader} from "../../../../utils/auth";
import axios from "axios";
import ToDoModalTitleTr from "../common/ToDoModalTitleTr";
import ToDoModalDeadlineTr from "../common/ToDoModalDeadlineTr";
import ToDoModalMemoRef from "../common/ToDoModalMemoRef";
import ToDoModalClassInputTr from "../common/ToDoModalClassInputTr";
import ToDoModalClassesTr from "../common/ToDoModalClassesTr";


export default function ToDoModifyModal
    ({
         planDetail, setModalType, myLineUpdateFunc
        ,userAllClass
     }) {

    const modalClose = function () {
        setModalType('');
    }

    const modalTitleRef = useRef();
    const classInputRef = useRef();
    const modalMemoRef = useRef();

    const [title, setTitle] = useState('');

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [date, setDate] = useState('');

    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');


    const [classInput, setClassInput] = useState('');
    const [classes, setClasses] = useState(planDetail.classes);

    const [todoMemo, setTodoMemo] = useState('');

    useEffect(() => {
        setTitle(planDetail.title);
        setYear(planDetail.deadline.slice(0, 4));
        setMonth(planDetail.deadline.slice(5, 7));
        setDate(planDetail.deadline.slice(8, 10));
        setHour(planDetail.deadline.slice(11, 13));
        setMinute(planDetail.deadline.slice(14, 16));
        setTodoMemo(planDetail.memo);
        modalMemoRef.current.value = planDetail.memo;
    }, []);


    const todoModify = async () => {
        const postDeadline = new Date(parseInt(year), parseInt(month) - 1
            , parseInt(date), parseInt(hour), parseInt(minute));
        const authHeader = await getAuthHeader();
        await axios.post('/api/todo/modify', {
            planId: planDetail.planId
            , title: title
            , deadline: postDeadline.toISOString()
            , classes: classes
            , memo: todoMemo
        }, {
            headers: {
                Authorization: authHeader,
            },
        }).then(res => {
            console.log(res);
            if (res.status === 200) {
                myLineUpdateFunc();
            }
        }).catch(error => {
            console.error('update 실패 : ', error);
        }).finally(() => {
            modalClose();
        })
    }


    return (
        <div className={'modal-white'}>
            <button onClick={modalClose} className={'modal-close'}><img src={x표시} alt="닫기"/></button>
            <div className={'modal-title'}>목표</div>
            <div className={'modal-contents'}>
                <table id={'modal-todo-table'}>
                    <tbody>
                    <ToDoModalTitleTr
                        title={title} setTitle={setTitle} modalTitleRef={modalTitleRef}
                    />

                    <ToDoModalDeadlineTr
                        year={year} month={month} date={date} hour={hour} minute={minute}
                        setYear={setYear} setMonth={setMonth} setDate={setDate}
                        setHour={setHour} setMinute={setMinute}
                    />
                    <ToDoModalClassInputTr
                        classInput={classInput} setClassInput={setClassInput} classInputRef={classInputRef}
                        classes={classes} setClasses={setClasses} userAllClass={userAllClass}
                    />

                    <ToDoModalClassesTr
                        classes={classes} setClasses={setClasses}
                    />

                    <ToDoModalMemoRef
                        modalMemoRef={modalMemoRef} setTodoMemo={setTodoMemo}
                    />
                    </tbody>
                </table>
                <button className={'modal-buttons modal-button-left'} type={"button"}
                        onClick={modalClose}>취소
                </button>
                <button className={'modal-buttons modal-button-right'} type={"button"}
                        onClick={todoModify}>
                    완료
                </button>
            </div>
        </div>
    )
}