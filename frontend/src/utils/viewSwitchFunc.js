


export const optionToView = (option) =>{
    let view;
    switch (option){
        case 'nce' :
            view = '전체'
            break;
        case 'nc' :
            view = '미완료 + 완료'
            break;
        case 'ne' :
            view = '미완료 + 종료'
            break;
        case 'ce' :
            view = '완료 + 종료'
            break;
        case 'n' :
            view = '미완료'
            break;
        case 'c' :
            view = '완료'
            break;
        case 'e' :
            view = '종료'
            break;
        default:
            view = '전체'
            break;
    }
    return view;
}

export const sortToView = (sort) =>{

    let view;
    switch (sort){
        case 'deadline' :
            view = '마감기한'
            break;
        case 'name' :
            view = '이름'
            break;
        case 'status' :
            view = '상태'
            break;
        default:
            view = '마감기한'
            break;
    }
    return view;
}
