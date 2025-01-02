import x표시 from "../../../img/x.png";
import {useEffect, useRef, useState} from "react";
import {getAuthHeader} from "../../../utils/auth";
import axios from "axios";


export default function ToDoModifyModal({
                                            planDetail, setModalType
                                            , updateTrigger, setUpdateTrigger
                                            , childrenUpdateFunc, myLineUpdateFunc
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

    const textAreaResize = (e) => {
        setTodoMemo(e.target.value);
        e.target.style.height = 'auto'; //height 초기화
        e.target.style.height = e.target.scrollHeight + 4 + 'px';
    }


    const todoModify = async () => {
        const postDeadline = new Date(parseInt(year), parseInt(month) - 1
            , parseInt(date), parseInt(hour), parseInt(minute));
        const authHeader = await getAuthHeader();
        axios.post('/api/todo/modify', {
            planId : planDetail.planId
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
        }).catch(error =>{
            console.error('update 실패 : ',error);
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
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-title"}>제목</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-title-div'}>
                                <input type="text" id={'to-do-title'} placeholder={'20자 이내'}
                                       maxLength={20} onChange={e => setTitle(e.target.value)}
                                       ref={modalTitleRef} value={title}/>
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
                                <input type="time" id={'to-do-deadline-time'}
                                       onChange={timeChange}/>
                            </div>
                        </td>
                    </tr>

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

                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-memo"}>메모</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-title-div'}>
                                <textarea id={'to-do-memo'}
                                          rows={1} onChange={textAreaResize} ref={modalMemoRef}/>
                            </div>
                        </td>
                    </tr>
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