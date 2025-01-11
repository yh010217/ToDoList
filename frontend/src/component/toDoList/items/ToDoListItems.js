import ToDoListItem from "./item/ToDoListItem";
import {useEffect, useState} from "react";
import {getAuthHeader} from "../../../utils/auth";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {filterBySelectedClass} from "./func/filterBySelectedClass";


export default function ToDoListItems
    ({
         updateTrigger, setUpdateTrigger
         , setUserAllClass, selectedClass, allSelected
         , setParentPlan, setModalType, setChildrenUpdateFunc
         , setDetailPlanId, setMyLineUpdateFunc
         , listOption, listSort, ascDesc
         , classUpdateTrigger, setClassUpdateTrigger
     }) {

    const navigate = useNavigate();
    const [planList, setPlanList] = useState([]);

    const [filterSelectedMap, setFilterSelectedMap] = useState(new Map());

    useEffect(() => {
        if (selectedClass === null || selectedClass.length === 0) return;
        const tempFilterSelectedMap = new Map(
            selectedClass.map(item => [item.className, item.selected])
        )
        setFilterSelectedMap(tempFilterSelectedMap);
    }, [selectedClass]);
    useEffect(() => {
        const classUpdateFunc = async () => {
            const authHeader = await getAuthHeader();
            if (authHeader) {
                await getPlanClasses(authHeader, setUserAllClass);
            } else {
                alert('로그인 후 진행해 주세요');
                navigate('/');
            }
        }
        classUpdateFunc();
    }, [classUpdateTrigger]);
    useEffect(() => {
        const authHeaderFunc = async () => {
            const authHeader = await getAuthHeader();
            if (authHeader) {
                await getTodoList(authHeader, listOption, listSort, ascDesc, setPlanList);
                await getPlanClasses(authHeader, setUserAllClass);
            } else {
                alert('로그인 후 진행해 주세요');
                navigate('/');
            }
        }
        authHeaderFunc();
    }, [updateTrigger]);


    return (<div className={'plan-items'}>
        {
            planList.filter(item => filterBySelectedClass(item, allSelected, filterSelectedMap))
                .map(item => (
                        <ToDoListItem
                            key={item.planId} planItem={item}
                            updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                            setParentPlan={setParentPlan} setModalType={setModalType}
                            setChildrenUpdateFunc={setChildrenUpdateFunc} setDetailPlan={setDetailPlanId}
                            setMyLineUpdateFunc={setMyLineUpdateFunc}
                            parentChildrenFunc={() => () => {
                                setUpdateTrigger(!updateTrigger)
                            }}
                            listOption={listOption} listSort={listSort} ascDesc={ascDesc}
                            selectedClass={selectedClass} allSelected={allSelected}
                            filterSelectedMap={filterSelectedMap}
                            classUpdateTrigger={classUpdateTrigger}
                            setClassUpdateTrigger={setClassUpdateTrigger}
                        />
                    )
                )
        }
    </div>);
}

const getTodoList = async (authHeader, listOption, listSort, ascDesc, setPlanList) => {
    return axios.get('/api/todo/list/' + listOption + '/'
        + listSort + '/' + ascDesc
        , {
            headers: {
                Authorization: authHeader,
            },
        }).then(res => {
        if (res.status === 200) {
            setPlanList(res.data);
        } else {
            throw new Error('리스트 받아오기 실패')
        }
    }).catch(error => {
        console.error(error);
    })
}

const getPlanClasses = async (authHeader, setUserAllClass) => {
    return axios.get('/api/plan-class/all', {
        headers: {
            Authorization: authHeader,
        },
    }).then(res => {
        if (res.status === 200) {
            setUserAllClass(res.data);
        } else {
            throw new Error('클래스 받아오기 실패')
        }
    }).catch(error => {
        console.error(error);
    })
}