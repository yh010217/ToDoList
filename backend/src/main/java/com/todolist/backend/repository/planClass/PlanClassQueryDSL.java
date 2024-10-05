package com.todolist.backend.repository.planClass;

import com.todolist.backend.domain.PlanClassEntity;

import java.util.List;

public interface PlanClassQueryDSL {
    //원래 뱃치 삽입 하려 했는데, IDENTITY 방식에선 안된다고 하네...?
    //필요하면 네이티브 쿼리로 하기
    //void saveClassBatch(List<PlanClassEntity> classEntities);
}