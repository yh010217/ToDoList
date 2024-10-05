package com.todolist.backend;

import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.service.todolist.ToDoListService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Transactional
public class ServiceTest {
    @Autowired
    private ToDoListService toDoListService;

    @Test
    public void getToDoListTest(){
        List<ToDoListDTO> toDoList = toDoListService.getToDoList(4l);
        for(ToDoListDTO oneToDo : toDoList){
            System.out.println(oneToDo);
        }
    }

}
