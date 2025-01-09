import '../../../../css/toDoList/modal.css';
import x표시 from '../../../../img/x.png'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {getAuthHeader} from "../../../../utils/auth";
import ToDoModalTitleTr from "../common/ToDoModalTitleTr";
import ToDoModalDeadlineTr from "../common/ToDoModalDeadlineTr";
import ToDoModalMemoRef from "../common/ToDoModalMemoRef";
import ToDoModalClassInputTr from "../common/ToDoModalClassInputTr";
import ToDoModalClassesTr from "../common/ToDoModalClassesTr";

export default function ToDoAddModal(props) {


    const modalClose = function () {
        modalTitleRef.current.value = '';
        classInputRef.current.value = '';
        setClasses([]);
        modalMemoRef.current.value = '';
        props.setModalType('');
    }
    //'', '1', '2', '3' 중 하나 ('' 는 그냥 modal이 안보이는거임)
    //나중에 item에서 추가할 때는 modalType이 2,3이어야 함
    const modalType = props.modalType;

    const modalTitleRef = useRef();
    const classInputRef = useRef();
    const modalMemoRef = useRef();

    const [title, setTitle] = useState('');

    const today = new Date();
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()+1 < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1;
    const todayDate = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    const [deadline,setDeadline] = useState(`${todayYear}-${todayMonth}-${todayDate} 23:59`);

    const [classInput, setClassInput] = useState('');
    const [classes, setClasses] = useState([]);

    const [todoMemo, setTodoMemo] = useState('');

    const todoAdd = async () => {
        if(title === ''){alert('제목을 입력해주세요.'); return;}
        const authHeader = await getAuthHeader();
        axios.post('/api/todo/add', {
            title: title
            , deadline: deadline
            , classes: classes
            , depth: parseInt(modalType)
            , memo: todoMemo
            , parentPlanId: props.parentPlan
        }, {
            headers: {
                Authorization: authHeader,
            },
        }).then(res => {
            if (res.status === 200) {
                //투두리스트 업데이트 하라고..
                if (modalType === '1') {
                    //depth 1짜리 추가할 때는 그냥 한번 추가만 해주면 됨
                    props.setUpdateTrigger(!props.updateTrigger);
                } else {
                    // depth 2,3인 리스트를 추가할 때에는,
                    // 닫혀있었으면 펼치고
                    // parent의 아가들을 다시 불러와야함.
                    props.childrenUpdateFunc();
                }
            }//뭐... else면 오류 한번 띄워야겠지만... 일단 뭐..
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
                        year={todayYear} month={todayMonth} date={todayDate} hour={'23'} minute={'59'}
                        setDeadline={setDeadline}
                    />

                    <ToDoModalClassInputTr
                        classInput={classInput} setClassInput={setClassInput} classInputRef={classInputRef}
                        classes={classes} setClasses={setClasses} userAllClass={props.userAllClass}
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
                        onClick={todoAdd}>완료
                </button>
            </div>
        </div>
    )
}