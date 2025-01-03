import {useEffect, useRef, useState} from "react";
import '../../../../css/toDoList/oneItem.css';
import axios from "axios";
import {getAuthHeader} from "../../../../utils/auth";
import ToDoItemLeft from "./item_left/ToDoItemLeft";
import ToDoItemRight from "./item_right/ToDoItemRight";

export default function ToDoListItem({
                                         planItem, setParentPlan, setModalType
                                         , updateTrigger, setUpdateTrigger
                                         , setChildrenUpdateFunc
                                         , parentChildren, setDetailPlan
                                         , setMyLineUpdateFunc, parentChildrenFunc
                                         , listOption, listSort, ascDesc
                                     }) {

    const [planStatus, setPlanStatus] = useState(planItem.status);
    const [childrenOpen, setChildrenOpen] = useState(false);
    const [childrenItems, setChildrenItems] = useState([]);

    const toggleChildren = async () => {
        setChildrenOpen(!childrenOpen);
        if (childrenOpen) {
            setChildrenItems([]);
        } else {
            await childrenAxios(planItem, listOption, listSort, ascDesc, setChildrenItems);
        }
    };

    const openChildren = async () => {
        setChildrenOpen(true);
        await childrenAxios(planItem, listOption, listSort, ascDesc, setChildrenItems);
    };

    const itemRightRef = useRef();
    const statusRef = useRef();

    const [rightExpand, setRightExpand] = useState(false);

    useEffect(() => {
        if (rightExpand) {

            itemRightRef.current.style.transition = 'transform 0.5s ease';
            itemRightRef.current.style.transform = ('translateX(0px)');

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

    const isInitialRender = useRef(true);
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        parentChildrenFunc();
        if (planItem.depth === 1) {
            setUpdateTrigger(!updateTrigger);
        }
    }, [listOption, listSort, ascDesc, planStatus])

    // right 에 넣으려니 너무 복잡해져서 따로 뺌
    const addChild = async () => {
        await openChildren();
        setModalType(planItem.depth + 1 + '');
        setParentPlan(planItem.planId);
        setChildrenUpdateFunc(() => () => childrenAxios(planItem, listOption, listSort, ascDesc, setChildrenItems));
    }


    return (
        <div className={'item-depth-' + planItem.depth}>
            <div className={'plan-item'}>

                <ToDoItemLeft
                    planItem={planItem} childrenOpen={childrenOpen}
                    toggleChildren={toggleChildren}/>

                <ToDoItemRight
                    itemRightRef={itemRightRef} statusRef={statusRef}
                    planItem={planItem} planStatus={planStatus} setPlanStatus={setPlanStatus}
                    rightExpand={rightExpand} expandRight={expandRight}
                    addChild={addChild} setModalType={setModalType}
                    setDetailPlan={setDetailPlan} setMyLineUpdateFunc={setMyLineUpdateFunc}
                    parentChildrenFunc={parentChildrenFunc} setUpdateTrigger={setUpdateTrigger}
                    updateTrigger={updateTrigger} parentChildren={parentChildren}
                />

            </div>
            <div>
                {
                    childrenItems.map(item =>
                        <ToDoListItem key={item.planId} planItem={item}
                                      setParentPlan={setParentPlan} setModalType={setModalType}
                                      updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                                      setChildrenUpdateFunc={setChildrenUpdateFunc}
                                      parentChildren={openChildren}
                                      setDetailPlan={setDetailPlan}
                                      setMyLineUpdateFunc={setMyLineUpdateFunc}
                                      parentChildrenFunc={() => childrenAxios(planItem, listOption, listSort, ascDesc, setChildrenItems)}
                                      listOption={listOption}
                                      listSort={listSort}
                                      ascDesc={ascDesc}
                        />)
                }
            </div>
        </div>
    )
}

const childrenAxios = async (planItem, listOption, listSort, ascDesc, setChildrenItems) => {

    const authHeader = await getAuthHeader();
    axios.get('/api/todo/get-children/' + planItem.planId
        + '/' + listOption + '/'
        + listSort + '/' + ascDesc, {
            headers: {
                Authorization: authHeader,
            },
        }
    ).then(res => {
        if (res.status === 200) {
            setChildrenItems(res.data);
        } else {
            throw new Error('리스트 받아오기 실패')
        }
    }).catch(error => {
        console.error(error);
    })
}