import '../../css/toDoList/backGround.css';
import '../../css/toDoList/items.css';
import '../../css/toDoList/modal.css';
import '../../css/toDoList/selectBox.css';
import 추가 from '../../img/추가.png'
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import ToDoAddModal from "./ToDoAddModal";
import {useEffect, useState} from "react";
import {getAuthHeader, getNewToken} from "../../utils/auth";
import ToDoListItem from "./ToDoListItem";
import ToDoDetailModal from "./ToDoDetailModal";
import ToDoModifyModal from "./ToDoModifyModal";
import ToDoOptionSelect from "./ToDoOptionSelect";
import ToDoSortSelect from "./ToDoSortSelect";


export default function ToDoList() {


    const navigate = useNavigate();

    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [planList, setPlanList] = useState([]);
    const [modalType, setModalType] = useState('');

    const [childrenUpdateFunc, setChildrenUpdateFunc] = useState(() => () => {
    });
    const [myLineUpdateFunc, setMyLineUpdateFunc] = useState(() => () => {
    });

    const [parentPlan, setParentPlan] = useState(0);
    const [detailPlanId, setDetailPlanId] = useState(0);
    const [planDetail, setPlanDetail] = useState({});


    const [listOption, setListOption] = useState(localStorage.getItem('option') || 'nce');
    const [listSort, setListSort] = useState(localStorage.getItem('sort') || 'name');
    const [ascDesc, setAscDesc] = useState(localStorage.getItem('asc') || 'asc');

    useEffect(() => {

        const authHeaderFunc = async () => {
            const authHeader = await getAuthHeader();

            if (authHeader) {

                localStorage.setItem('auth', authHeader);

                axios.get('/api/todo/list/' + listOption + '/'
                    + listSort + '/' + ascDesc
                    , {
                        headers: {
                            Authorization: authHeader,
                        },
                    }).then(res => {
                    if (res.status === 200) {
                        console.log(res.data);
                        setPlanList(res.data);
                    } else {
                        throw new Error('리스트 받아오기 실패')
                    }
                }).catch(error => {
                    console.error(error);
                })
            } else {
                alert('로그인 후 진행해 주세요');
                localStorage.removeItem('auth');
                navigate('/');
            }

        }
        authHeaderFunc();
    }, [updateTrigger]);

    const params = useParams();
    //년,월,일,요일 표시

    const year = params.year;
    const month = params.month;
    const date = params.date;

    const date_object = new Date(year, month - 1, date);
    const day_int = date_object.getDay();
    const day_str_arr = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
    const day = day_str_arr[day_int] + 'day';

    const month_arr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month_str = month_arr[month - 1];

    const addMainList = function () {
        setModalType('1');
        setParentPlan(0);
        setChildrenUpdateFunc(() => () => {
        });
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
            <div className={'select-boxes'}>
                <div className={'select-left'}></div>
                <div className={'select-right'}>
                    <ToDoOptionSelect listOption={listOption} setListOption={setListOption}
                                      updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}/>
                    <ToDoSortSelect listSort={listSort} setListSort={setListSort}
                                    ascDesc={ascDesc} setAscDesc={setAscDesc}
                                    updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}/>
                </div>
            </div>
            <div className={'plan-items'}>
                {
                    planList.map(item => (
                            <ToDoListItem key={item.planId} planItem={item}
                                          updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                                          setParentPlan={setParentPlan} setModalType={setModalType}
                                          setChildrenUpdateFunc={setChildrenUpdateFunc}
                                          setDetailPlan={setDetailPlanId}
                                          setMyLineUpdateFunc={setMyLineUpdateFunc}
                                          parentChildrenFunc={() => () => {
                                              setUpdateTrigger(!updateTrigger)
                                          }}
                                          listOption={listOption}
                                          listSort={listSort}
                                          ascDesc={ascDesc}
                            />
                        )
                    )
                }
            </div>

            <div className={'modal-container'} style={{display: modalType === '' ? 'none' : 'block'}}>
                {modalType === '1' || modalType === '2' || modalType === '3' ?
                    <ToDoAddModal modalType={modalType} setModalType={setModalType}
                                  year={year} month={month} date={date}
                                  updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                                  parentPlan={parentPlan} childrenUpdateFunc={childrenUpdateFunc}
                    />
                    : modalType === 'detail' ?
                        <ToDoDetailModal detailPlanId={detailPlanId}
                                         planDetail={planDetail}
                                         setPlanDetail={setPlanDetail}
                                         setModalType={setModalType}
                        /> :
                        modalType === 'modify' ?
                            <ToDoModifyModal planDetail={planDetail} setModalType={setModalType}
                                             updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                                             childrenUpdateFunc={childrenUpdateFunc}
                                             myLineUpdateFunc={myLineUpdateFunc}
                            /> : ''
                }
            </div>
        </div>
    )
}