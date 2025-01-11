import xPng from '../../../img/x.png';
import {useEffect, useState} from "react";
import '../../../css/daily/daily-modal.css';

export default function DailyModal({setModalType, modalType, paramYear, paramMonth, paramDate}){

    const closeModal = () => {
        setModalType('');
    }
    const [apiPath, setApiPath] = useState('');
    useEffect(()=>{
        if(modalType === 'Daily Todo'){
            setApiPath('/api/daily/todo');
        }else if(modalType === 'Daily Not Todo'){
            setApiPath('/api/daily/not-todo');
        }
    },[modalType]);

    return (
        <div className={'modal-white'}>
            <div className={'modal-header'}>
                <h2>{modalType}</h2>
            </div>
            <button onClick={closeModal} className={'modal-close'}>
                <img src={xPng} alt="닫기"/>
            </button>
            <div className={'daily-modal-content'}>
                <div className={'daily-modal-input-line modal-tr'}>
                    <input type="text" id={'daily-modal-input'}/>
                    <button className={'daily-modal-input-button'}>추가</button>
                </div>
            </div>
        </div>
    )
}


