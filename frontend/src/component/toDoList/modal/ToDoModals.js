import ToDoAddModal from "./add/ToDoAddModal";
import ToDoDetailModal from "./detail/ToDoDetailModal";
import ToDoModifyModal from "./modify/ToDoModifyModal";


export default function ToDoModals
    ({
         detailPlanId, modalType, setModalType,
         updateTrigger, setUpdateTrigger,
         parentPlan, childrenUpdateFunc,
         myLineUpdateFunc, userAllClass,
         planDetail, setPlanDetail
     }) {

    const renderModal = () => {
        switch (modalType) {
            case '1':
            case '2':
            case '3':
                return <ToDoAddModal modalType={modalType} setModalType={setModalType}
                                     updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}
                                     parentPlan={parentPlan} childrenUpdateFunc={childrenUpdateFunc}
                                     userAllClass={userAllClass}
                />
            case 'detail':
                return <ToDoDetailModal detailPlanId={detailPlanId}
                                        planDetail={planDetail}
                                        setPlanDetail={setPlanDetail}
                                        setModalType={setModalType}
                />
            case 'modify':
                return <ToDoModifyModal planDetail={planDetail} setModalType={setModalType}
                                        myLineUpdateFunc={myLineUpdateFunc}
                                        userAllClass={userAllClass}
                />
            default:
                return ''
        }
    }


    return (<div className={'modal-container'} style={{display: modalType === '' ? 'none' : 'block'}}>
        {renderModal()}
    </div>)
}