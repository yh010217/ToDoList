export default function ToDoModalTitleTr
    ({
         title, setTitle, modalTitleRef
     }) {
    return (<tr className={'modal-tr'}>
        <td className={'modal-left'}><label htmlFor={"to-do-title"}>제목</label></td>
        <td className={'modal-right'}>
            <div className={'to-do-title-div'}>
                <input type="text" id={'to-do-title'} placeholder={'20자 이내'}
                       maxLength={20} onChange={e => setTitle(e.target.value)}
                       ref={modalTitleRef} value={title}/>
            </div>
        </td>
    </tr>)
}