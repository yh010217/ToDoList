import {useEffect, useState} from "react";
import {optionToView} from "../../utils/switchFunc";


export default function ToDoOptionSelect({setListOption,updateTrigger,setUpdateTrigger}) {

    const [viewOption,setViewOption] = useState('');
    const [selectOpen, setSelectOpen] = useState(false);
    const [ulStyle, setUlStyle] = useState({})

    const openSelectBox = () => {
        setSelectOpen(!selectOpen);
    }

    /** c : 완료, n : 미완료 , e: 종료 */
    const setOptionToLocal = (optionName) => {
        localStorage.setItem('option', optionName);
        setListOption(optionName);
        setViewOption(optionToView(optionName));
        setSelectOpen(!selectOpen);
        setUpdateTrigger(!updateTrigger);
    }

    useEffect(() => {
        if (selectOpen) {
            setUlStyle({display: 'block'});
        } else {
            setUlStyle({display: 'none'});
        }

        const localOption = localStorage.getItem('option');

        if (localOption) {
            setListOption(localOption)
            setViewOption(optionToView(localOption));
        } else {
            localStorage.setItem('option', 'nce');
            setListOption('nce');
            setViewOption(optionToView('nce'));
        }
    }, [selectOpen]);


    return (<div className={'select-box'}>
            <span className={'select-label'}>보기</span>

            <div className={'select-box-div'}>
                <button className={'selected-item-div'} onClick={openSelectBox}>
                    {viewOption}
                </button>
                <ul style={ulStyle}>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('nce')
                        }}
                                className={'select-button'}>전체
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('nc')
                        }}
                                className={'select-button'}>미완료 + 완료
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('ne')
                        }}
                                className={'select-button'}>미완료 + 종료
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('ce')
                        }}
                                className={'select-button'}>완료 + 종료
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('n')
                        }}
                                className={'select-button'}>미완료
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('c')
                        }}
                                className={'select-button'}>완료
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            setOptionToLocal('e')
                        }}
                                className={'select-button'}>종료
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
