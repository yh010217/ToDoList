import {useEffect, useState} from "react";


export default function ToDoListHeaderClassButton
    ({
         classItem, allSelected,
         selectedClass, setSelectedClass
     }) {

    const [isSelected, setIsSelected] = useState(true);

    const clickButton = () => {
        const toChangeSelectedClass = selectedClass
            .map(item => {
                if (item.classId === classItem.classId) {
                    return {
                        ...item,
                        selected: !isSelected
                    }
                } else return item;
            })
        setSelectedClass(toChangeSelectedClass)
        setIsSelected(!isSelected)
    }

    useEffect(() => {
        if (allSelected) setIsSelected(allSelected); // true로 바뀔 때만 영향 받을거임
    }, [allSelected])

    useEffect(() => {
        if(selectedClass.length === 0) return;
        if(!selectedClass.find(item => item.classId === classItem.classId))return;
        setIsSelected(selectedClass.find(item => item.classId === classItem.classId).selected);
    }, [selectedClass]);

    return <button
        className={'to-do-class-item to-do-class-header-button'}
        onClick={clickButton}
        style={{backgroundColor: isSelected ? '' : 'white'}}>
        {classItem.className}
    </button>
}
