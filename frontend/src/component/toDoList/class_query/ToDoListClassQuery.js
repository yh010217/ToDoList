import ToDoListHeaderClassButton from "./class_button/ToDoListHeaderClassButton";
import {useEffect, useState} from "react";

export default function ToDoListClassQuery
    ({
         userAllClass, selectedClass, setSelectedClass
         , allSelected, setAllSelected
     }) {


    const allSelectButton = () => {
        setAllSelected(!allSelected);
        setSelectedClass(selectedClass.map(item => {
            return {...item, selected: !allSelected}
        }));
    }

    useEffect(() => {
        setSelectedClass(userAllClass.map(item => {
            return {classId: item.classId, className: item.className, selected: true}
        }));
    }, [userAllClass]);

    useEffect(() => {
        console.log(selectedClass);
        if (selectedClass.map(item => item.selected).includes(false))
            setAllSelected(false);
        else
            setAllSelected(true);
    }, [selectedClass])

    return <div className={'to-do-header-classes'}>
        <div className={'header-class-all-select-div'}>
            <button className={'to-do-class-item to-do-class-header-button'}
                    style={{backgroundColor: allSelected ? '' : 'white'}}
                    id={'to-do-class-all-btn'}
                    onClick={allSelectButton}>전체 선택
            </button>
        </div>
        <div className={'header-class-classes'}>
            {userAllClass
                .map((item) => <ToDoListHeaderClassButton
                    key={item.classId} classItem={item}
                    selectedClass={selectedClass} setSelectedClass={setSelectedClass}
                    allSelected={allSelected} setAllSelected={setAllSelected}
                />)
            }
        </div>
    </div>
}