import {Link} from "react-router-dom";
import todoList from '../../img/목표관리.png'
import checkList from '../../img/checkList.png'
import timeTable from '../../img/일정관리.png'
import calendar from '../../img/calendar.png'
import travel from '../../img/이동계획.png'
import '../../css/Home.css'
import {useContext, useEffect} from "react";
import {HeaderContext} from "../../context/HeaderContext";

export default function Home() {


    const {headerUpdate, setHeaderUpdate} = useContext(HeaderContext);
    useEffect(()=>{
        setHeaderUpdate(!headerUpdate);
    },[]);

    const today = new Date();
    const today_year = today.getFullYear();
    const today_month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const month_str_arr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const today_month_str = month_str_arr[today.getMonth()];

    const today_date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    return (
        <div className={'home-div'}>
            <div>
                <Link to='/to-do-list'>
                    <div className={'item-container'}>
                        <img src={todoList} alt="목표 관리" id={'to-do-list-img'} className={'home-item-img'}/>
                        <div className={'home-item-title'}>투두 리스트</div>
                    </div>
                </Link>
            </div>
            <div>
                <Link to={"/daily/" + today_year + '/' + today_month + '/' + today_date}>
                    <div className={'item-container'}>
                        <img src={checkList} alt="데일리 투두" id={'daily-todo-img'} className={'home-item-img'}/>
                        <div className={'home-item-title'}>데일리 투두</div>
                    </div>
                </Link>
            </div>
            <div>
                <Link to={"/time-table/" + today_year + '/' + today_month + '/' + today_date}>
                    <div className={'item-container'}>
                        <img src={timeTable} alt="일정 관리" id={'time-table-img'} className={'home-item-img'}/>
                        <div className={'home-item-title'}>하루 시간표</div>
                    </div>
                </Link>
            </div>
            <div>
                <Link to={'/calendar/' + today_year + '/' + today_month}>
                    <div className={'item-container'}>
                        <img src={calendar} alt="달력" className={'home-item-img'}
                             id={'calendar-img'}/>
                        <div className={'home-item-title'}>달력</div>
                        <div id={'calendar-img-month'}>{today_month_str}</div>
                        <div id={'calendar-img-date'}>{today_date}</div>
                    </div>
                </Link>
            </div>
            <div>
                <Link to={'/travel'}>
                    <div className={'item-container'}>
                        <img src={travel} alt="이동 계획" className={'home-item-img'}
                             id={'travel-img'}/>
                        <div className={'home-item-title'}>이동 계획</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}