import {useEffect, useState} from "react";
import arrow from '../../../../img/arrow.png'
import {sortToView} from "../../../../utils/viewSwitchFunc";


export default function ToDoSortSelect({setListSort,ascDesc,setAscDesc
                                           ,updateTrigger,setUpdateTrigger}){

    const [viewSort, setViewSort] = useState('');
    const [selectOpen,setSelectOpen] = useState(false);
    const [ulStyle, setUlStyle] = useState({});


    useEffect(()=>{
        if(selectOpen){
            setUlStyle({display:'block'});
        }else{
            setUlStyle({display:'none'});
        }

        const localSort = localStorage.getItem('sort');
        if(localSort){
            setViewSort(sortToView(localSort));
            setListSort(localSort)
        }else{
            localStorage.setItem('sort', 'deadline');
            setViewSort(sortToView('deadline'));
            setListSort('deadline')
        }

        const localAsc = localStorage.getItem('asc');
        if(localAsc === 'asc'){
            setAscDesc('asc');
        }else if(localAsc === 'desc'){
            setAscDesc('desc');
        }else{
            localStorage.setItem('asc','asc');
            setAscDesc('asc');
        }

    },[selectOpen]);


    const setSortToLocal = (sortName)=>{
        localStorage.setItem('sort', sortName);
        setSelectOpen(!selectOpen);
        setListSort(sortName);
        setUpdateTrigger(!updateTrigger);
    }

    const openSelectBox = () =>{
        setSelectOpen(!selectOpen);
    }
    const changeAscDesc = () =>{
        if(ascDesc === 'asc'){
            localStorage.setItem('asc','desc');
            setAscDesc('desc');
        }else{
            localStorage.setItem('asc','asc');
            setAscDesc('asc');
        }

        setUpdateTrigger(!updateTrigger);
    }


    return(<div className={'select-box'}>
            <span className={'select-label'}>순서</span>

            <div className={'select-box-div'}>
                <button className={'selected-item-div'} onClick={openSelectBox}>
                    {viewSort}
                </button>
                <ul style={ulStyle}>
                    <li><button onClick={()=>{setSortToLocal('deadline')}}
                                className={'select-button'}>마감기한
                    </button></li>
                    <li><button onClick={()=>{setSortToLocal('name')}}
                                className={'select-button'}>이름
                    </button></li>
                    <li><button onClick={()=>{setSortToLocal('status')}}
                                className={'select-button'}>상태
                    </button></li>
                </ul>
            </div>
            <button className={'sort-img-button'} onClick={changeAscDesc}>
                <img src={arrow} alt="정렬" className={ascDesc === 'asc' ? 'sort-asc' : 'sort-desc'}/>
            </button>
        </div>
    )
}