package com.todolist.backend;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.repository.planClass.PlanClassRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@SpringBootTest
@Transactional
public class RepositoryTest {

    @Autowired
    private PlanClassRepository planClassRepository;

    @Test
    public void classFindByUid(){
        UserEntity user = new UserEntity();
        user.setUid(4l);
        Set<PlanClassEntity> list = planClassRepository.findByUser(user);
        System.out.println("=============================");
        System.out.println("=============================");
        for(PlanClassEntity classEntity : list){
            System.out.println(classEntity.getClassId());
            System.out.println(classEntity.getClassName());
        }
        System.out.println("=============================");
        System.out.println("=============================");
    }

}
