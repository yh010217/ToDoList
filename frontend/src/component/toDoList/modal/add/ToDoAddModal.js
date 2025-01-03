import '../../../../css/toDoList/modal.css';
import x표시 from '../../../../img/x.png'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {getAuthHeader} from "../../../../utils/auth";
import ClassSearchWindow from "../../class_search/ClassSearchWindow";
import ToDoModalTitleTr from "../common/ToDoModalTitleTr";
import ToDoModalDeadlineTr from "../common/ToDoModalDeadlineTr";
import ToDoModalMemoRef from "../common/ToDoModalMemoRef";

export default function ToDoAddModal(props) {

    //'', '1', '2', '3' 중 하나 ('' 는 그냥 modal이 안보이는거임)
    //나중에 item에서 추가할 때는 modalType이 2,3이어야 함
    const modalType = props.modalType;

    const modalTitleRef = useRef();
    const classTypeRef = useRef();
    const modalMemoRef = useRef();

    const [title, setTitle] = useState('');

    //이건 모달용이어서 props로 받아온 값이 바뀌어도 됨, 그리고 string임
    const [year, setYear] = useState(props.year);
    const [month, setMonth] = useState(props.month);
    const [date, setDate] = useState(props.date);

    const [hour, setHour] = useState('23');
    const [minute, setMinute] = useState('59');

    const modalClose = function () {
        modalTitleRef.current.value = '';
        classTypeRef.current.value = '';
        setYear(props.year);
        setMonth(props.month);
        setDate(props.date);
        setHour('23');
        setMinute('59');
        setClasses([]);
        modalMemoRef.current.value = '';
        props.setModalType('');
    }

    const [classTypeFocus, setClassTypeFocus] = useState(false);
    const [classTypeWidth, setClassTypeWidth] = useState(0);
    useEffect(() => {
        setClassTypeWidth(classTypeRef.current.getBoundingClientRect().width);
        const handleResize = () => {
            setClassTypeWidth(classTypeRef.current.getBoundingClientRect().width);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    },[]);

    const [classType, setClassType] = useState('');
    const [classes, setClasses] = useState([]);
    const classTypeHandle = (e) => {
        const input = e.target.value;
        setClassType(input);
    }
    const classTypeHandleText = (text) =>{
        classTypeRef.current.value = text;
        setClassType(text);
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

    const [todoMemo, setTodoMemo] = useState('');

    const todoAdd = async () => {
        const postDeadline = new Date(parseInt(year), parseInt(month) - 1
            , parseInt(date), parseInt(hour), parseInt(minute));
        const authHeader = await getAuthHeader();
        axios.post('/api/todo/add', {
            title: title
            , deadline: postDeadline.toISOString()
            , classes: classes
            , depth: parseInt(modalType)
            , memo: todoMemo
            , parentPlanId: props.parentPlan
        }, {
            headers: {
                Authorization: authHeader,
            },
        }).then(res => {
            console.log(res);
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
                                       onFocus={() => setClassTypeFocus(true)}
                                       onMouseDown={() => setClassTypeFocus(true)}
                                       placeholder={'10자 이내'}
                                       maxLength={10}
                                       autoComplete={'off'}
                                       onKeyDown={(e) => {
                                           if (e.key === 'Enter') {
                                               classAdd(); // 엔터 키가 눌렸을 때 classAdd 함수를 실행
                                           }else if(e.keyCode === 27){//esc
                                               setClassTypeFocus(false);
                                           }
                                       }}/>
                                <button className={'class-add'} onClick={classAdd}>
                                    추가
                                </button>
                                {
                                    classTypeFocus ? <><ClassSearchWindow
                                        classType={classType}
                                        classInputClickHandle={classTypeHandleText}
                                        userAllClass={props.userAllClass}
                                        setClassTypeFocus={setClassTypeFocus}
                                        classTypeWidth={classTypeWidth}/>
                                        <button className={'class-search-close'}
                                                onClick={()=>{setClassTypeFocus(false);}}
                                        >닫기</button>
                                    </> :''
                                }
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
                        onClick={todoAdd}>완료
                </button>
            </div>
        </div>
    )
}