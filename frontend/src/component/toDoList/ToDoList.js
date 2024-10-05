import '../../css/toDoList/backGround.css';
import '../../css/toDoList/items.css';
import '../../css/toDoList/modal.css';
import 추가 from '../../img/추가.png'
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import ToDoModal from "./ToDoModal";
import {useEffect, useState} from "react";
import {getAuthHeader} from "../../utils/auth";
import ToDoListItem from "./ToDoListItem";


export default function ToDoList({stateToken, setStateToken}) {


    const navigate = useNavigate();

    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [planList,setPlanList] = useState([]);
    const [modalType, setModalType] = useState('');

    const [parentPlan,setParentPlan] = useState(0);

    useEffect(() => {
        if (getAuthHeader()) {
            axios.get('/api/todo/list', {
                headers: {
                    Authorization: getAuthHeader(),
                },
            }).then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setPlanList(res.data);
                }else{
                    throw new Error('리스트 받아오기 실패')
                }
            }).catch(error => {console.error(error);})
        } else {
            alert('로그인 후 진행해 주세요');
            localStorage.removeItem('auth');
            setStateToken('');
            navigate('/');
        }
    }, [stateToken, updateTrigger]);

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

    const addMainList = function () {
        setModalType('1');
        setParentPlan(0);
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
            <div className={'plan-items'}>
            {
                planList.map(item => (
                    <ToDoListItem key={item.planId} planItem={item}
                                  updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                                  setParentPlan={setParentPlan} setModalType={setModalType}/>
                    )
                )
            }
            </div>

            <div className={'modal-container'} style={{display: modalType === '' ? 'none' : 'block'}}>
                <ToDoModal modalType={modalType} setModalType={setModalType}
                           year={year} month={month} date={date}
                           updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                           parentPlan={parentPlan}
                >
                </ToDoModal>
            </div>
        </div>
    )
}