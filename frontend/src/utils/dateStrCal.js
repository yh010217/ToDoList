
export const previousDateStrCal = (year,month,date)=>{
    const paramDate = new Date(year,month-1,date);
    const prevDate = new Date(paramDate.setDate(paramDate.getDate()-1));
    const prev_year = prevDate.getFullYear();
    const prev_month = prevDate.getMonth()+1 < 10 ? '0'+(prevDate.getMonth()+1) : (prevDate.getMonth()+1);
    const prev_date = prevDate.getDate() < 10 ? '0'+prevDate.getDate() : prevDate.getDate();
    return prev_year+'/'+prev_month+'/'+prev_date;
}

export const nextDateStrCal = (year,month,date)=>{
    const paramDate = new Date(year,month-1,date);
    const nextDate = new Date(paramDate.setDate(paramDate.getDate()+1));
    const next_year = nextDate.getFullYear();
    const next_month = nextDate.getMonth()+1 < 10 ? '0'+(nextDate.getMonth()+1) : (nextDate.getMonth()+1);
    const next_date = nextDate.getDate() < 10 ? '0'+nextDate.getDate() : nextDate.getDate();
    return next_year+'/'+next_month+'/'+next_date;
}


