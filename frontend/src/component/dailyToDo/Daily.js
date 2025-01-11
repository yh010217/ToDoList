import '../../css/daily/daily.css'
import {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import {previousDateStrCal, nextDateStrCal} from "../../utils/dateStrCal";
import DailyModal from "./modal/DailyModal";
import DailySections from "./sections/DailySections";

export default function Daily() {

    const [modalType, setModalType] = useState('');
    const [prevDateStr, setPrevDateStr] = useState('');
    const [nextDateStr, setNextDateStr] = useState('');
    const location = useLocation();


    const params = useParams();
    //년,월,일,요일 표시

    const paramYear = params.year;
    const paramMonth = params.month;
    const paramDate = params.date;

    useEffect(() => {
        setPrevDateStr(previousDateStrCal(paramYear, paramMonth, paramDate));
        setNextDateStr(nextDateStrCal(paramYear, paramMonth, paramDate));
    }, [location.pathname])


    return (
        <div>
            <div className={'white-paper'}>

                <div className={'daily-header'}>
                    <div className={'daily-header-date'}>{paramYear + '.' + paramMonth + '.' + paramDate}</div>
                    <div className={'header-bottom-line'}></div>
                </div>

                <DailySections setModalType={setModalType}/>

                <div className={'daily-date-move'}>
                    <Link to={"/daily/" + prevDateStr} className={'month-move-button'}>
                        &lt;{prevDateStr.slice(5).replace('/', '.')}</Link>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Link to={"/daily/" + nextDateStr} className={'month-move-button'}>
                        {nextDateStr.slice(5).replace('/', '.')}&gt;</Link>
                </div>

                <div className={'daily-dim'} style={{display: modalType === '' ? 'none' : 'block'}}>
                    <DailyModal setModalType={setModalType} paramYear={paramYear}
                                paramMonth={paramMonth} paramDate={paramDate}
                                modalType={modalType}></DailyModal>
                </div>
            </div>
        </div>
    )
}