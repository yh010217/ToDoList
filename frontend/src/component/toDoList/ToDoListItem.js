import {useEffect, useRef, useState} from "react";
import '../../css/toDoList/oneItem.css';
import checkMark from '../../img/checkmark.png';
import xMark from '../../img/x.png';
import memoMark from '../../img/메모.png';
import addMark from '../../img/추가.png';
import deleteMark from '../../img/삭제.png';
import axios from "axios";
import {getAuthHeader} from "../../utils/auth";


export default function ToDoListItem({planItem, setParentPlan, setModalType
                                         ,updateTrigger,setUpdateTrigger}) {
    //setModalType으로 depth도 정할거임

    const [planStatus, setPlanStatus] = useState(planItem.status);
    const [childrenOpen, setChildrenOpen] = useState(false);
    const [childrenItems, setChildrenItems] = useState([]);

    const showChildren = () => {
        setChildrenOpen(!childrenOpen);
        if (childrenOpen) {
            setChildrenItems([]);
        } else {
            axios.get('/api/todo/get-children/' + planItem.planId, {
                headers: {
                    Authorization: getAuthHeader(),
                },
            }).then(res => {
                if (res.status === 200) {
                    setChildrenItems(res.data);
                } else {
                    throw new Error('리스트 받아오기 실패')
                }
            }).catch(error => {
                console.error(error);
            })
        }
    };

    const itemRightRef = useRef();
    const statusRef = useRef();

    const [rightExpand, setRightExpand] = useState(false);

    useEffect(() => {
        if (rightExpand) {

            itemRightRef.current.style.transition = 'transform 0.5s ease';
            itemRightRef.current.style.transform
                = ('translateX(0px)');

        } else {

            itemRightRef.current.style.transition = 'transform 0s';
            const toSlideDistance = itemRightRef.current.offsetWidth
                - statusRef.current.offsetLeft - statusRef.current.offsetWidth
            itemRightRef.current.style.transform
                = ('translateX(' + (toSlideDistance - 4) + 'px)');

        }
    }, [rightExpand, planStatus])

    const expandRight = () => {
        setRightExpand(!rightExpand);
    }

    const statusChange = (changeStatus) => {
        axios.post('/api/todo/change-status'
            , {
                planId: planItem.planId.toString()
                , status: changeStatus
            }, {
                headers: {
                    Authorization: getAuthHeader(),
                },
            }).then(res => {
            if (res.status === 200) {
                setPlanStatus(changeStatus);
            }
        })
    }
    const completePlan = () => {
        let changeStatus = planStatus === 0 ? 1 : 0;
        statusChange(changeStatus);
    }
    const cancelPlan = () => {
        let changeStatus = planStatus === 2 ? 0 : 2;
        statusChange(changeStatus);
    }
    const addChild = () => {
        setModalType(planItem.depth + 1 + '');
        setParentPlan(planItem.planId);
    }
    const itemDelete = () =>{
        axios.delete('/api/todo/delete/'+planItem.planId,{
            headers: {
                Authorization: getAuthHeader(),
            }
        }).then(res=>{
            if(res.status === 200){
                setUpdateTrigger(!updateTrigger);
            }
        })
    }

    return (
        <div className={'item-depth-'+planItem.depth}>
            <div className={'plan-item'}>

                <div className={'plan-left'}>
                    {planItem.depth === 3 ? '' :
                        <button className={(childrenOpen ? 'show-children' : 'close-children') + ' children-button'}
                                onClick={showChildren}>&gt;</button>
                    }
                    <div className={'plan-left-text'}>
                        <span className={'plan-title'}>{planItem.title}</span>
                        <span className={'plan-deadline'}>&nbsp;&nbsp;...&nbsp;{
                            planItem.deadline.slice(2, 4) + '/' +
                            planItem.deadline.slice(5, 7) + '/' +
                            planItem.deadline.slice(8, 10) + '  ' +
                            planItem.deadline.slice(11, 13) + ':' +
                            planItem.deadline.slice(14, 16)
                        }</span>
                    </div>
                </div>


                <div className={'plan-right'} ref={itemRightRef}>
                    <button className={'right-expand-button ' + (rightExpand ? 'expanded' : 'close')}
                            onClick={expandRight}>&lt;</button>
                    <div className={'status-div'} ref={statusRef}>
                        <button className={'complete-button'}
                                onClick={completePlan}>
                            {planStatus === 0 ? '' :
                                <>
                                    <img className={planStatus === 1 ? 'status-complete-img' : 'status-cancel-img'}
                                         src={planStatus === 1 ? checkMark : xMark}
                                         alt={planStatus === 1 ? 'complete' : 'cancel'}
                                    />
                                </>
                            }
                        </button>
                        <br/>
                        <span className={'plan-status-text'}>
                    {planStatus === 0 ? '미완료' :
                        planStatus === 1 ? '완료' : '종료'
                    }</span>
                    </div>
                    {(planStatus === 1 || planStatus === 2) ? '' :
                        <div className={'cancel-button-div'}>
                            <button className={'cancel-button'} onClick={cancelPlan}>
                                <img src={xMark} alt="x"/>
                            </button>
                            <br/>
                            <span className={'plan-cancel-text'}>
                            종료
                        </span>
                        </div>
                    }
                    <div className={'fix-button-div'}>
                        <button className={'fix-button'}>
                            <img src={memoMark} alt="fix"/>
                        </button>
                        <br/>
                        <span className={'plan-fix-text'}>
                        수정
                    </span>
                    </div>
                    {planItem.depth === 3 ? '' :
                        planStatus !== 0 ? '' :
                            <div className={'child-add-button-div'}>
                                <button className={'child-add-button'} onClick={addChild}>
                                    <img src={addMark} alt="child-add"/>
                                </button>
                                <br/>
                                <span className={'plan-child-add-text'}>
                                    추가
                                </span>
                            </div>
                    }
                    <div className={'delete-button-div'}>
                        <button className={'delete-button'} onClick={itemDelete}>
                            <img src={deleteMark} alt="delete"/>
                        </button>
                        <br/>
                        <span className={'plan-delete-text'}>
                            삭제
                        </span>
                    </div>

                </div>
            </div>
            <div>
                {
                    /*planItem, setParentPlan, setModalType*/
                    childrenItems.map(item =>
                        <ToDoListItem key={item.planId} planItem={item}
                                      setParentPlan={setParentPlan} setModalType={setModalType}
                        updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}/>)
                }
            </div>
        </div>
    )
}

/*
<div>
    플랜 아이디 : {planItem.planId || 'null'}<br/>
    제목 : {planItem.title || 'null'}<br/>
    마감 : {planItem.deadline || 'null'}<br/>
    깊이 : {planItem.depth || 'null'}<br/>
    메모 : {planItem.memo || 'null'}<br/>
    생성일 : {planItem.createdAt || 'null' }<br/>
    부모 플랜 :{planItem.parentPlanId || 'null'}<br/>
    점수 : {planItem.score || 'null'}<br/>
    상태 : {planItem.status || 'null'}<br/>
    <hr/>
</div>
*/