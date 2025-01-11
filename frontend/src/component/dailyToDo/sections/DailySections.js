import ToDoSection from "./todo/ToDoSection";
import NotToDoSection from "./notTodo/NotToDoSection";


export default function DailySections({setModalType}) {
    return (<div className={'daily-items'}>
        <div className={'daily-item'}>
            <h3>Daily Todo</h3>
            <ToDoSection setModalType={setModalType}></ToDoSection>
        </div>
        <div className={'daily-item'}>
            <h3>Daily Not Todo</h3>
            <NotToDoSection setModalType={setModalType}></NotToDoSection>
        </div>
    </div>);
}