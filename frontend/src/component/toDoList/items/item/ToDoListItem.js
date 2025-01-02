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
    //setModalType으로 depth도 정할거임
    const [planStatus, setPlanStatus] = useState(planItem.status);
    const [childrenOpen, setChildrenOpen] = useState(false);
    const [childrenItems, setChildrenItems] = useState([]);

    const toggleChildren = async () => {
        setChildrenOpen(!childrenOpen);
        if (childrenOpen) {
            setChildrenItems([]);
        } else {
            await childrenAxios();
        }
    };

    const openChildren = async () => {
        setChildrenOpen(true);
        await childrenAxios();
    };


    const childrenAxios = async () => {

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

    const statusChange = async (changeStatus) => {
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
    const completePlan = () => {
        let changeStatus = planStatus === 0 ? 1 : 0;
        statusChange(changeStatus);
    }
    const cancelPlan = () => {
        let changeStatus = planStatus === 2 ? 0 : 2;
        statusChange(changeStatus);
    }
    const addChild = async () => {
        await openChildren();
        setModalType(planItem.depth + 1 + '');
        setParentPlan(planItem.planId);
        setChildrenUpdateFunc(() => childrenAxios);
    }
    const itemDelete = async () => {
        const authHeader = await getAuthHeader();
        axios.delete('/api/todo/delete/' + planItem.planId, {
            headers: {
                Authorization: authHeader,
            }
        }).then(res => {
            if (res.status === 200) {
                if (planItem.depth === 1) {
                    setUpdateTrigger(!updateTrigger);
                } else {
                    parentChildren();
                }

            }
        })
    }

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
        <div className={'item-depth-' + planItem.depth}>
            <div className={'plan-item'}>

                <ToDoItemLeft planItem={planItem} childrenOpen={childrenOpen} toggleChildren={toggleChildren}/>
                <ToDoItemRight
                    itemRightRef={itemRightRef} statusRef={statusRef}
                    planItem={planItem} planStatus={planStatus}
                    rightExpand={rightExpand} expandRight={expandRight}
                    completePlan={completePlan} cancelPlan={cancelPlan}
                    getDetail={getDetail} addChild={addChild} itemDelete={itemDelete}
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
                                      parentChildrenFunc={childrenAxios}
                                      listOption={listOption}
                                      listSort={listSort}
                                      ascDesc={ascDesc}
                        />)
                }
            </div>
        </div>
    )
}
