
export default function ToDoItemLeft({planItem,childrenOpen,toggleChildren}){
    return (
        <div className={'plan-left'}>
            {planItem.depth === 3 ? '' :
                <button className={(childrenOpen ? 'show-children' : 'close-children') + ' children-button'}
                        onClick={toggleChildren}>&gt;</button>
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
    )
}