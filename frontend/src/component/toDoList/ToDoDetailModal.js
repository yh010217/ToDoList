import x표시 from "../../img/x.png";
import detailImg from "../../img/detail.png";
import '../../css/toDoList/modal.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {getAuthHeader} from "../../utils/auth";
import {useNavigate} from "react-router-dom";

export default function ToDoDetailModal({
                                            detailPlanId,
                                            planDetail,
                                            setPlanDetail,
                                            setModalType
                                        }) {
    const navigate = useNavigate();

    const [deadline, setDeadline] = useState('');
    const [classes, setClasses] = useState([]);

    useEffect(() => {

        const getDetailAxios = async () => {
            const authHeader = await getAuthHeader();

            if (authHeader) {

                localStorage.setItem('auth', authHeader);

                axios.get('/api/todo/detail/' + detailPlanId, {
                    headers: {
                        Authorization: authHeader,
                    },
                }).then(res => {
                    if (res.status === 200) {
                        setPlanDetail(res.data);
                        setClasses(res.data.classes);
                        setDeadline(res.data.deadline)
                    } else {
                        throw new Error('리스트 받아오기 실패')
                    }
                }).catch(error => {
                    console.error(error);
                })
            } else {
                alert('로그인 후 진행해 주세요');
                localStorage.removeItem('auth');
                navigate('/');
            }

        }
        getDetailAxios();
    }, [])


    const modalClose = function () {
        setModalType('');
    }


    function goModify() {
        setModalType('modify');
    }

    return <>
        <div className={'modal-white'}>
            <button onClick={modalClose} className={'modal-close'}><img src={x표시} alt="닫기"/></button>
            <div className={'modal-title'}>목표</div>
            <div className={'modal-contents'}>
                <table id={'modal-todo-table'}>
                    <tbody>
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-title"}>상태</label></td>
                        <td className={'modal-right'}>
                            <div className={'modal-detail-status-div'}>
                                <div className={'modal-detail-status'}>
                                    <span className={planDetail.status === 0 ? 'black-text' : 'gray-text'}>
                                    미완료
                                    </span>
                                </div>
                                <div className={'modal-detail-status'}>
                                    <span className={planDetail.status === 1 ? 'black-text' : 'gray-text'}>
                                    완료
                                    </span>
                                </div>
                                <div className={'modal-detail-status'}>
                                    <span className={planDetail.status === 2 ? 'black-text' : 'gray-text'}>
                                    종료
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-title"}>제목</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-title-div'}>
                                {planDetail.title}
                            </div>
                        </td>
                    </tr>

                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-deadline"}>기간</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-deadline-div'}>
                                <div className={'date-text'}>
                                    {
                                        deadline.slice(0, 4) + '년 ' +
                                        deadline.slice(5, 7) + '월 ' +
                                        deadline.slice(8, 10) + '일'
                                    }
                                    &nbsp;&nbsp;&nbsp;
                                    {
                                        deadline.slice(11, 13) + '시 ' +
                                        deadline.slice(14, 16) + '분 '
                                    }
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-class"}>구분</label></td>
                        <td className={'modal-right'}>
                            <div className={'to-do-class-items'}>
                                {
                                    classes.map((item, itemIndex) => {
                                        return (
                                            <div key={itemIndex} className={'to-do-class-item'}>
                                                {item}
                                                <button><img src={detailImg} alt={'detail'}/></button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </td>
                    </tr>
                    <tr className={'modal-tr'}>
                        <td className={'modal-left'}><label htmlFor={"to-do-memo"}>메모</label></td>
                        <td className={'modal-right'}>
                            <div
                                className={(planDetail.memo === '' ? 'text-center gray-text ' : 'black-text') + 'to-do-memo-detail'}>
                                {planDetail.memo === '' ? '메모가 없습니다' : planDetail.memo}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button className={'modal-buttons modal-button-left'} type={"button"}
                        onClick={modalClose}>취소
                </button>
                <button className={'modal-buttons modal-button-right'} type={"button"}
                        onClick={goModify}>
                    수정
                </button>
            </div>
        </div>
    </>
}