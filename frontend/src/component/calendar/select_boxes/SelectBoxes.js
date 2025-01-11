import CalendarOptionSelect from "./option_select/CalendarOptionSelect";
import CalendarContentSelect from "./content_select/CalendarContentSelect";


export default function SelectBoxes(){
    return(<div className={'select-boxes'}>
        <div className={'select-left'}></div>
        <div className={'calendar-select-right'}>
            <CalendarOptionSelect/>
            <CalendarContentSelect/>
        </div>
    </div>)
}