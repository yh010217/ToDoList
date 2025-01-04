import '../../css/backGround.css';
import '../../css/toDoList/items.css';
import '../../css/toDoList/modal.css';
import '../../css/toDoList/selectBox.css';
import {useEffect, useState, useContext} from "react";
import {HeaderContext} from "../../context/HeaderContext";
import ToDoSelectBoxes from "./select_boxes/ToDoSelectBoxes";
import OutWhite from "./out_white/OutWhite";
import ToDoListHeader from "./header/ToDoListHeader";
import ToDoListItems from "./items/ToDoListItems";
import ToDoModals from "./modal/ToDoModals";


export default function ToDoList() {


    const {headerUpdate, setHeaderUpdate} = useContext(HeaderContext);
    const [updateTrigger, setUpdateTrigger] = useState(false);

    useEffect(() => {
        setHeaderUpdate(!headerUpdate);
    }, [updateTrigger]);

    const [modalType, setModalType] = useState('');

    const [childrenUpdateFunc, setChildrenUpdateFunc] = useState(() => () => {
    });
    const [myLineUpdateFunc, setMyLineUpdateFunc] = useState(() => () => {
    });

    const [parentPlan, setParentPlan] = useState(0);
    const [detailPlanId, setDetailPlanId] = useState(0);
    const [planDetail, setPlanDetail] = useState({});

    const [userAllClass, setUserAllClass] = useState([]);


    const [listOption, setListOption] = useState(localStorage.getItem('option') || 'nce');
    const [listSort, setListSort] = useState(localStorage.getItem('sort') || 'name');
    const [ascDesc, setAscDesc] = useState(localStorage.getItem('asc') || 'asc');


    const today = new Date();
    const year = today.getFullYear()
    const month = today.getMonth();
    const date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

    return (
        <div className={"white-paper"}>
            <OutWhite/>

            <ToDoListHeader year={year} month={month} date={date}
                            setModalType={setModalType} setParentPlan={setParentPlan}
                            setChildrenUpdateFunc={setChildrenUpdateFunc}
            />

            <ToDoSelectBoxes
                listOption={listOption} setListOption={setListOption}
                listSort={listSort} setListSort={setListSort}
                ascDesc={ascDesc} setAscDesc={setAscDesc}
                updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
            />

            <ToDoListItems updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                           setParentPlan={setParentPlan} setModalType={setModalType}
                           setUserAllClass={setUserAllClass}
                           setChildrenUpdateFunc={setChildrenUpdateFunc}
                           setDetailPlanId={setDetailPlanId} setMyLineUpdateFunc={setMyLineUpdateFunc}
                           listOption={listOption} listSort={listSort} ascDesc={ascDesc}
            />

            <ToDoModals
                modalType={modalType} setModalType={setModalType}
                updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                parentPlan={parentPlan} childrenUpdateFunc={childrenUpdateFunc}
                myLineUpdateFunc={myLineUpdateFunc}
                detailPlanId={detailPlanId} planDetail={planDetail} setPlanDetail={setPlanDetail}
                userAllClass={userAllClass}
            />
        </div>
    )
}