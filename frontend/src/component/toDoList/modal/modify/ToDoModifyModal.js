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
         , userAllClass, classUpdateTrigger, setClassUpdateTrigger
     }) {

    const modalClose = function () {
        setModalType('');
    }

    const modalTitleRef = useRef();
    const classInputRef = useRef();
    const modalMemoRef = useRef();

    const [title, setTitle] = useState('');


    const planYear = planDetail.deadline.slice(0, 4);
    const planMonth = planDetail.deadline.slice(5, 7);
    const planDate = planDetail.deadline.slice(8, 10);
    const planHour = planDetail.deadline.slice(11, 13);
    const planMinute = planDetail.deadline.slice(14, 16);
    const [deadline, setDeadline] = useState(`${planYear}-${planMonth}-${planDate} ${planHour}:${planMinute}`);

    const [classInput, setClassInput] = useState('');
    const [classes, setClasses] = useState(planDetail.classes);

    const [todoMemo, setTodoMemo] = useState('');

    useEffect(() => {
        setTitle(planDetail.title);
        setTodoMemo(planDetail.memo);
        modalMemoRef.current.value = planDetail.memo;
    }, []);


    const todoModify = async () => {
        if (title === '') {
            alert('제목을 입력해주세요.');
            return;
        }
        const authHeader = await getAuthHeader();
        await axios.post('/api/todo/modify', {
            planId: planDetail.planId
            , title: title
            , deadline: deadline
            , classes: classes
            , memo: todoMemo
        }, {
            headers: {
                Authorization: authHeader,
            },
        }).then(res => {
            if (res.status === 200) {
                myLineUpdateFunc();
            }
        }).catch(error => {
            console.error('update 실패 : ', error);
        }).finally(() => {
            setClassUpdateTrigger(!classUpdateTrigger);
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
                        year={planYear} month={planMonth} date={planDate} hour={planHour} minute={planMinute}
                        setDeadline={setDeadline}
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