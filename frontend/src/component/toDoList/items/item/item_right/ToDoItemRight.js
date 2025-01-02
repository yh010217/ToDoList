import checkMark from "../../../../../img/checkmark.png";
import xMark from "../../../../../img/x.png";
import memoMark from "../../../../../img/메모.png";
import addMark from "../../../../../img/추가.png";
import deleteMark from "../../../../../img/삭제.png";

export default function ToDoItemRight(
    {
        itemRightRef, statusRef, planItem, planStatus
        , rightExpand, expandRight, completePlan
        , cancelPlan, getDetail, addChild, itemDelete
    }
) {
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
        <div className={'fix-button-div'}>
            <button className={'fix-button'} onClick={getDetail}>
                <img src={memoMark} alt="fix"/>
            </button>
            <br/>
            <span className={'plan-fix-text'}>
                        상세정보
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
    </div>)
}
