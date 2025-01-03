import x표시 from "../../../../img/x.png";


export default function ToDoModalClassesTr
    ({
        classes,setClasses
     }){

    const classDelete = (index) => {
        const toRemoveItem = classes[index];
        setClasses(classes.filter(item => item !== toRemoveItem));
    }

    return(<tr className={'modal-tr'}>
        <td className={'modal-left'}></td>
        <td className={'modal-right'}>
            <div className={'to-do-class-items'}>
                {classes.map((classItem, itemIndex) => {
                    return (
                        <div key={itemIndex} className={'to-do-class-item'}>
                            {classItem}
                            <button onClick={() => {
                                classDelete(itemIndex);
                            }}><img src={x표시} alt={'X'}/></button>
                        </div>
                    )
                })}
            </div>
        </td>
    </tr>)
}