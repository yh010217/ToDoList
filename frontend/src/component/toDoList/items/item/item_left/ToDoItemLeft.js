export default function ToDoItemLeft
    ({
         planItem, childrenOpen, toggleChildren,
         setModalType, setDetailPlan, setMyLineUpdateFunc, parentChildrenFunc
     }) {

    const getDetail = () => {
        setModalType('detail');
        setDetailPlan(planItem.planId);
        // 어차피 depth 1은 parentChildrenFunc를 그냥 전체 update로 해놨음
        if (planItem.depth === 1) {
            setMyLineUpdateFunc(parentChildrenFunc)
        } else {
            setMyLineUpdateFunc(() => parentChildrenFunc);
        }
    }

    return (
        <div className={'plan-left'}>
            {planItem.depth === 3 ? '' :
                <button className={(childrenOpen ? 'show-children' : 'close-children') + ' children-button'}
                        onClick={toggleChildren}>&gt;</button>
            }
            <div className={'plan-left-text'}>
                <button className={'plan-title'} onClick={getDetail}>{planItem.title}</button>
                <span className={'plan-deadline'}>&nbsp;&nbsp;...&nbsp;{
                    planItem.deadline.slice(2, 4) + '/' +
                    planItem.deadline.slice(5, 7) + '/' +
                    planItem.deadline.slice(8, 10) + '  ' +
                    planItem.deadline.slice(11, 13) + ':' +
                    planItem.deadline.slice(14, 16)
                }</span>
            </div>
        </div>
    )
}