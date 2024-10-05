import '../../css/toDoList/modal.css';
import x표시 from '../../img/x.png'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {getAuthHeader} from "../../utils/auth";

export default function ToDoModal(props) {

    //'', '1', '2', '3' 중 하나 ('' 는 그냥 modal이 안보이는거임)
    //나중에 item에서 추가할 때는 modalType이 2,3이어야 함
    const modalType = props.modalType;

    const modalTitleRef = useRef();
    const classTypeRef = useRef();
    const modalMemoRef = useRef();

    const [title,setTitle] = useState('');

    //이건 모달용이어서 props로 받아온 값이 바뀌어도 됨, 그리고 string임
    const [year, setYear] = useState(props.year);
    const [month, setMonth] = useState(props.month);
    const [date, setDate] = useState(props.date);

    const [hour, setHour] = useState('23');
    const [minute, setMinute] = useState('59');

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
        modalTitleRef.current.value='';
        classTypeRef.current.value='';
        setYear(props.year);
        setMonth(props.month);
        setDate(props.date);
        setHour('23');
        setMinute('59');
        setClasses([]);
        modalMemoRef.current.value='';
        props.setModalType('');
    }

    const [classType, setClassType] = useState('');
    const [classes, setClasses] = useState([]);
    const classTypeHandle = (e) => {
        const input = e.target.value;
        setClassType(input);
    }
    const classAdd = () => {
        //비지 않아야 추가할거임
        if (classType && classType !== '') {
            setClasses([...classes, classType]);
            classTypeRef.current.value = '';
            setClassType('');
        }
    }
    const classDelete = (index) =>{
        const toRemoveItem = classes[index];
        setClasses(classes.filter(item=>item!==toRemoveItem));
    }


    const [todoMemo, setTodoMemo] = useState('');
    const textAreaResize = (e) => {
        setTodoMemo(e.target.value);
        e.target.style.height = 'auto'; //height 초기화
        e.target.style.height = e.target.scrollHeight + 4 + 'px';
    }
    const todoAdd = () => {
        const postDeadline = new Date(parseInt(year),parseInt(month)-1
            ,parseInt(date),parseInt(hour),parseInt(minute));
        axios.post('/api/todo/add', {
            title : title
            ,deadline : postDeadline.toISOString()
            ,classes : classes
            ,depth : parseInt(modalType)
            ,memo : todoMemo
            ,parentPlanId : props.parentPlan
        },{
            headers: {
                Authorization: getAuthHeader(),
            },
        }).then(res=>{
            console.log(res);
            if(res.status === 200){
                //투두리스트 업데이트 하라고..
                props.setUpdateTrigger(!props.updateTrigger);
            }//뭐... else면 오류 한번 띄워야겠지만... 일단 뭐..
        }).finally(()=>{
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
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-title"}>제목</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-title-div'}>
                                <input type="text" id={'to-do-title'} placeholder={'20자 이내'}
                                maxLength={20} onChange={e => setTitle(e.target.value)}
                                ref={modalTitleRef}/>
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
                                            <button onClick={()=>{
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
                onClick={modalClose}>취소</button>
                <button className={'modal-buttons modal-button-right'} type={"button"}
                onClick={todoAdd}>완료</button>
            </div>
        </div>
    )
}