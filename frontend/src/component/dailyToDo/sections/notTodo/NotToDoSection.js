import addPng from "../../../../img/추가.png"
import xPng from "../../../../img/x.png"

export default function NotToDoSection({setModalType}) {

    const addDailyNotToDo = ()=>{
        setModalType('Daily Not Todo');
    }
    return (
        <div className={'daily-item-container'}>
            <ul>
                <li className={'daily-item-li'}>
                    <button className={'daily-success-box'}></button>
                    <div className={'daily-item-li-content'}>임시</div>
                    <button className={'daily-item-delete'}>
                        <img src={xPng} alt="X"/>
                    </button>
                </li>
                <li className={'daily-item-li'}>
                    <button className={'daily-success-box'}></button>
                    <div className={'daily-item-li-content'}>임시</div>
                    <button className={'daily-item-delete'}>
                        <img src={xPng} alt="X"/>
                    </button>
                </li>
            </ul>
            <button className={'daily-item-add'} onClick={addDailyNotToDo}>
                <img src={addPng} alt="추가"/>
                <span>&nbsp;&nbsp;추가</span>
            </button>
        </div>
    )

}