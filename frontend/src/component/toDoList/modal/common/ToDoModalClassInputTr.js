import ClassSearchWindow from "../../class_search/ClassSearchWindow";
import {useEffect, useState} from "react";


export default function ToDoModalClassInputTr
    ({
         classInput, setClassInput, classInputRef
         , classes, setClasses, userAllClass
     }) {

    const [classInputFocus, setClassInputFocus] = useState(false);

    const [classInputWidth, setClassInputWidth] = useState(0);

    useEffect(() => {
        setClassInputWidth(classInputRef.current.getBoundingClientRect().width);
        const handleResize = () => {
            setClassInputWidth(classInputRef.current.getBoundingClientRect().width);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const classInputHandle = (e) => {
        const input = e.target.value;
        setClassInput(input);
    }
    const classInputClickHandle = (text) => {
        classInputRef.current.value = text;
        setClassInput(text);
    }
    const classAdd = () => {
        //비지 않아야 추가할거임, 이미 있는 거는 더 추가 안함
        if (classInput && classInput !== '' && !classes.includes(classInput)) {
            setClasses([...classes, classInput]);
            classInputRef.current.value = '';
            setClassInput('');
        }
    }

    return (<tr className={'modal-tr'}>
        <td className={'modal-left'}><label htmlFor={"to-do-class"}>구분</label></td>
        <td className={'modal-right'}>
            <div className={'to-do-class-div'}>
                <input type="text" id={'to-do-class'}
                       onChange={classInputHandle} ref={classInputRef}
                       onFocus={() => setClassInputFocus(true)}
                       onMouseDown={() => setClassInputFocus(true)}
                       placeholder={'10자 이내'} maxLength={10} autoComplete={'off'}
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                               classAdd(); // 엔터 키가 눌렸을 때 classAdd 함수를 실행
                           } else if (e.keyCode === 27) {//esc
                               setClassInputFocus(false);
                           }
                       }}/>
                <button className={'class-add'} onClick={classAdd}>
                    추가
                </button>
                {
                    classInputFocus ? <>
                        <ClassSearchWindow
                            classInput={classInput}
                            classInputClickHandle={classInputClickHandle}
                            userAllClass={userAllClass}
                            setClassTypeFocus={setClassInputFocus}
                            classTypeWidth={classInputWidth}/>
                        <button className={'class-search-close'}
                                onClick={() => {
                                    setClassInputFocus(false);
                                }}
                        >닫기
                        </button>
                    </> : ''
                }
            </div>
        </td>
    </tr>)
}