import checkMark from "../../../../../img/checkmark.png";
import xMark from "../../../../../img/x.png";
import addMark from "../../../../../img/추가.png";
import deleteMark from "../../../../../img/삭제.png";
import {getAuthHeader} from "../../../../../utils/auth";
import axios from "axios";

export default function ToDoItemRight(
    {
        planItem, itemRightRef, statusRef, planStatus
        , rightExpand, expandRight, addChild
        , setPlanStatus, setUpdateTrigger
        , updateTrigger, parentChildren
        , classUpdateTrigger, setClassUpdateTrigger
    }
) {


    const completePlan = async () => {
        let changeStatus = planStatus === 0 ? 1 : 0;
        await statusChange(planItem, setPlanStatus, changeStatus);
    }
    const cancelPlan = async () => {
        let changeStatus = planStatus === 2 ? 0 : 2;
        await statusChange(planItem, setPlanStatus, changeStatus);
    }

    return (<div className={'plan-right'} ref={itemRightRef}>
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
                            }
                        </span>
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
            <button className={'delete-button'}
                    onClick={() => itemDelete(planItem, setUpdateTrigger, updateTrigger
                        , parentChildren,classUpdateTrigger,setClassUpdateTrigger)}>
                <img src={deleteMark} alt="delete"/>
            </button>
            <br/>
            <span className={'plan-delete-text'}>
                            삭제
                        </span>
        </div>
    </div>)
}

const statusChange = async (planItem, setPlanStatus, changeStatus) => {
    const authHeader = await getAuthHeader();
    axios.post('/api/todo/change-status'
        , {
            planId: planItem.planId.toString()
            , status: changeStatus
        }, {
            headers: {
                Authorization: authHeader,
            },
        }).then(res => {
        if (res.status === 200) {
            setPlanStatus(changeStatus);
        }
    })
}
const itemDelete = async (planItem, setUpdateTrigger, updateTrigger
                          , parentChildren,classUpdateTrigger,setClassUpdateTrigger) => {
    const authHeader = await getAuthHeader();
    axios.delete('/api/todo/delete/' + planItem.planId, {
        headers: {
            Authorization: authHeader,
        }
    }).then(res => {
        if (res.status === 200) {
            if (planItem.depth === 1) {
                setUpdateTrigger(!updateTrigger);
                setClassUpdateTrigger(!classUpdateTrigger);
            } else {
                parentChildren();
                setClassUpdateTrigger(!classUpdateTrigger);
            }
        }
    })
}