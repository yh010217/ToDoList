import {Link} from "react-router-dom";
import 목표관리 from '../img/목표관리.png'
import 일정관리 from '../img/일정관리.png'
import 이동계획 from '../img/이동계획.png'
import '../css/Home.css'

export default function Home() {
    const today = new Date();
    const today_year = today.getFullYear();
    const today_month = today.getMonth()+1 < 10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1);
    const today_date = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
    return (
        <div className={'home-div'}>
            <Link to={'/to-do-list/'+today_year+'/'+today_month+'/'+today_date}>
                <div className={'item-container'}>
                    <img src={목표관리} alt="목표 관리" id={'to-do-list-img'} className={'home-item-img'}/>
                    <div className={'home-item-title'}>목표 관리</div>
                    <div className={'home-item-content-container'}>
                        <div className={'home-item-content'}>
                            목표를 설정하고<br/>
                            완료해 나가세요!
                        </div>
                        <div className={'home-item-content'}>
                            큰 목표를 위해<br/>
                            세부 목표를 작성해보세요!
                        </div>
                    </div>
                </div>
            </Link>
            <Link to="/time-table">
                <div className={'item-container'}>
                    <img src={일정관리} alt="일정 관리" id={'time-table-img'} className={'home-item-img'}/>
                    <div className={'home-item-title'}>일정 관리</div>
                    <div className={'home-item-content-container'}>
                        <div className={'home-item-content'}>
                            하루 일과를<br/>
                            시간 단위로 관리해보세요!
                        </div>
                        <div className={'home-item-content'}>
                            하루를 돌아보고<br/>
                            목표에 가까워지세요!
                        </div>
                    </div>
                </div>
            </Link>
            <Link to="/move-plan">
                <div className={'item-container'}>
                    <img src={이동계획} alt="이동 계획" className={'home-item-img'}/>
                    <div className={'home-item-title'}>이동 계획</div>
                    <div className={'home-item-content-container'}>
                        <div className={'home-item-content'}>
                            위치 정보와 함께<br/>
                            이동 계획을 세워보세요!
                        </div>
                        <div className={'home-item-content'}>
                            친구와 실시간으로<br/>
                            여행계획을 세워보세요!
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}