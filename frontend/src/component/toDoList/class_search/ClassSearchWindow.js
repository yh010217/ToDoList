import '../../../css/toDoList/classSearch/classSearch.css';
import {useEffect, useState} from "react";

export default function ClassSearchWindow
    ({
         classType,
         classTypeHandleText,
         userAllClass,
         classTypeWidth,
         setClassTypeFocus
     }) {
    const [includeClass, setIncludeClass] = useState(userAllClass);
    useEffect(() => {
        const currentIncludeClass = userAllClass.filter(item => item.className.includes(classType));
        setIncludeClass(currentIncludeClass);
    }, [classType]);

    const clickSearch = (className) => {
        setClassTypeFocus(false);
        classTypeHandleText(className);
    }
    return (
        <div className={'class-search-window'} style={{width: classTypeWidth + 'px'}}>
            {includeClass.map(item =>
                <button className={'class-search-item'}
                        onClick={() => {
                            clickSearch(item.className)
                        }}
                        key={item.classId}>
                    {item.className}
                </button>)}
        </div>
    )
}

