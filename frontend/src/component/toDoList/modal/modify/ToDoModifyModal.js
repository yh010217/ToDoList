import x표시 from "../../../../img/x.png";
import {useEffect, useRef, useState} from "react";
import {getAuthHeader} from "../../../../utils/auth";
import axios from "axios";
import ToDoModalTitleTr from "../common/ToDoModalTitleTr";
import ToDoModalDeadlineTr from "../common/ToDoModalDeadlineTr";
import ToDoModalMemoRef from "../common/ToDoModalMemoRef";


export default function ToDoModifyModal({
                                            planDetail, setModalType, myLineUpdateFunc
                                        }) {

    const modalTitleRef = useRef();
    const classTypeRef = useRef();
    const modalMemoRef = useRef();

    const [title, setTitle] = useState('');

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [date, setDate] = useState('');

    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');


    const [classType, setClassType] = useState('');
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


    const classTypeHandle = (e) => {
        const input = e.target.value;
        setClassType(input);
    }
    const classAdd = () => {
        //비지 않아야 추가할거임, 이미 있는 거는 더 추가 안함
        if (classType && classType !== '' && !classes.includes(classType)) {
            setClasses([...classes, classType]);
            classTypeRef.current.value = '';
            setClassType('');
        }
    }
    const classDelete = (index) => {
        const toRemoveItem = classes[index];
        setClasses(classes.filter(item => item !== toRemoveItem));
    }


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


    const modalClose = function () {
        setModalType('');
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

                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-class"}>구분</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-class-div'}>
                                <input type="text" id={'to-do-class'}
                                       onChange={classTypeHandle} ref={classTypeRef}
                                       placeholder={'10자 이내'}
                                       maxLength={10}
                                       onKeyDown={(e) => {
                                           if (e.key === 'Enter') {
                                               classAdd(); // 엔터 키가 눌렸을 때 classAdd 함수를 실행
                                           }
                                       }}/>
                                <button className={'class-add'} onClick={classAdd}>
                                    추가
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-class-items'}>
                                {classes.map((classItem, itemIndex) => {
                                    return (
                                        <div key={itemIndex} className={'to-do-class-item'}>
                                            {classItem}
                                            <button onClick={() => {
                                                classDelete(itemIndex);
                                            }}><img src={x표시} alt={'X'}/></button>
                                        </div>
                                    )
                                })}
                            </div>
                        </td>
                    </tr>

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