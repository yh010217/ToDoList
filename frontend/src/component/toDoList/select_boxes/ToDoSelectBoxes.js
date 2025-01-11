import ToDoOptionSelect from "./option/ToDoOptionSelect";
import ToDoSortSelect from "./sort/ToDoSortSelect";


export default function ToDoSelectBoxes({listOption,setListOption,listSort,setListSort,ascDesc,setAscDesc,updateTrigger,setUpdateTrigger}){
    return(<div className={'select-boxes'}>
        <div className={'select-left'}></div>
        <div className={'select-right'}>
            <ToDoOptionSelect listOption={listOption} setListOption={setListOption}
                              updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}/>
            <ToDoSortSelect listSort={listSort} setListSort={setListSort}
                            ascDesc={ascDesc} setAscDesc={setAscDesc}
                            updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger}/>
        </div>
    </div>);
}