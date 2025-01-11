
export default function ToDoModalMemoRef
    ({modalMemoRef,setTodoMemo}) {


    const textAreaResize = (e) => {
        setTodoMemo(e.target.value);
        e.target.style.height = 'auto'; //height 초기화
        e.target.style.height = e.target.scrollHeight + 4 + 'px';
    }
    return (<tr className={'modal-tr'}>
        <td className={'modal-left'}><label htmlFor={"to-do-memo"}>메모</label></td>
        <td className={'modal-right'}>
            <div className={'to-do-title-div'}>
                <textarea id={'to-do-memo'}
                          rows={1} onChange={textAreaResize} ref={modalMemoRef}/>
            </div>
        </td>
    </tr>)
}