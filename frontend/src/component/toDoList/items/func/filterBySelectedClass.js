export const filterBySelectedClass = (planItem, allSelected, filterSelectedMap) => {
    if (allSelected) return true;
    if (filterSelectedMap === null || filterSelectedMap.size === 0) return false;

    return planItem.classes.some(currentClassName => filterSelectedMap.get(currentClassName));
}

/* 위에 리턴 한줄이랑 밑에랑 같은 코드임
const planClasses = planItem.classes;
let isFind = false;
for(let i = 0 ; i < planClasses.length ; i++){
    const currentClassName = planClasses[i];
    if(filterSelectedMap.get(currentClassName)){
        isFind = true;
        break;
    }
}
return isFind;
*/
