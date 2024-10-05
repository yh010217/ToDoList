package com.todolist.backend.service.todolist;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.planClass.PlanClassRepository;
import com.todolist.backend.repository.plan.PlanClassesRepository;
import com.todolist.backend.repository.plan.PlanRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ToDoListServiceImpl implements ToDoListService {
    /*리파지토리 주입*/
    private final PlanRepository planRepository;
    private final PlanClassRepository planClassRepository;
    private final PlanClassesRepository planClassesRepository;

    private final ModelMapper modelMapper;


    private final TypeMap<PlanEntity, ToDoListDTO> planEntityToTDLTypeMap;

    public ToDoListServiceImpl(PlanRepository planRepository, PlanClassRepository planClassRepository, PlanClassesRepository planClassesRepository, ModelMapper modelMapper) {
        this.planRepository = planRepository;
        this.planClassRepository = planClassRepository;
        this.planClassesRepository = planClassesRepository;
        this.modelMapper = modelMapper;

        this.planEntityToTDLTypeMap =
                modelMapper.createTypeMap(PlanEntity.class, ToDoListDTO.class)
                        .addMapping(PlanEntity::getPlanTitle, ToDoListDTO::setTitle);
    }


    /**
     * <pre>
     * PlanEntity에서 그냥 classes 말고 다 넣음
     *
     * 우선 dto의 classes에서 각각으로 분리 ->
     * 일단 class에서 find 해와서 찾을 수 있는거만 List에 넣고 classes에 넣을 준비하기
     * 못찾은 것들은 plan_class insert, 그 과정에서 나온 Entity List를 위에서 찾은거에 합침
     *
     * List와 Plan가지고 insert를 처리함
     * </pre>
     */
    @Override
    @Transactional
    public String insertPlan(ToDoListDTO dto, Long uid) {

        try {
            // findBy로 하면 DB Select 할까봐 uid만 필요하다면 대충 이렇게 넣었음.
            // 일관성 유지에도 영향 없을거 같고...
            UserEntity tempUser = new UserEntity();
            tempUser.setUid(uid);

            PlanEntity parentPlan = planRepository.findById(dto.getParentPlanId()).orElse(null);

            PlanEntity planEntity = PlanEntity.builder()
                    .user(tempUser)
                    .planTitle(dto.getTitle())
                    .deadline(dto.getDeadline())
                    .depth(dto.getDepth())
                    .memo(dto.getMemo())
                    .parentPlan(parentPlan)
                    .build();

            planRepository.save(planEntity);


            // 한 유저가 가지고 있는 class들.
            // 너무 많아져서 받아오기 힘들어지면 나중에 사이즈 제한 둘듯
            Set<PlanClassEntity> userClassSet = planClassRepository.findByUser(tempUser);

            Set<String> classNameSet = userClassSet.stream()
                    .map(PlanClassEntity::getClassName)
                    .collect(Collectors.toSet());


            // 없었던 plan_class들 insert 처리 하고, plan_classes들 넣을 List정리 함
            List<PlanClassEntity> savedNewClassList = saveNewClassList(tempUser, dto, classNameSet);

            // 있었던 plan_class들 중 이미 있던 친구들도 plan_classes에 넣어야하니 정리해 놔야함
            List<PlanClassEntity> alreadyExistClassList = confirmExistClass(dto, classNameSet, userClassSet);

            //그냥 합친 것. 두개 합치고, 합친것들은 PlanClassEntity 객체일테니 PlanClasses형식으로 바꿔줘야함
            List<PlanClassesEntity> toInsertClasses = Stream
                    .concat(savedNewClassList.stream(), alreadyExistClassList.stream())
                    .map(item -> PlanClassesEntity.builder()
                            .planClass(item)
                            .plan(planEntity)
                            .build())
                    .toList();

            planClassesRepository.saveAll(toInsertClasses);

            return "complete";
        } catch (Exception exception) {
            return "fail";
        }
    }

    private List<PlanClassEntity> saveNewClassList(UserEntity user, ToDoListDTO dto, Set<String> classNameSet) {

        // plan_class에 새로 넣을 거 넣은 후, 저장해야함 (이건 새로운 친구들이어서 저장하고 id를 써야함)
        List<PlanClassEntity> toInsertClassList = dto.getClasses()
                .stream()
                .filter(item -> !classNameSet.contains(item))
                .map(item -> PlanClassEntity.builder()
                        .className(item)
                        .user(user)
                        .build())
                .toList();

        // 어차피 영속성으로 관리될 친구들이어서 saveAll을 거치면 지금 리스트의 Entity에도 id가 들어가있음
        planClassRepository.saveAll(toInsertClassList);

        return toInsertClassList;
    }


    private List<PlanClassEntity> confirmExistClass(ToDoListDTO dto, Set<String> classNameSet, Set<PlanClassEntity> userClassSet) {

        List<PlanClassEntity> existClassList = dto.getClasses()
                .stream()
                .filter(classNameSet::contains)
                .map(item -> userClassSet.stream()
                        .filter(userClass -> userClass.getClassName().equals(item))
                        .findFirst()
                        .orElse(null)
                ).filter(Objects::nonNull)
                .toList();

        return existClassList;
    }

    @Override
    public List<ToDoListDTO> getToDoList(Long uid) {
        UserEntity tempUser = new UserEntity();
        tempUser.setUid(uid);

        List<PlanEntity> usersPlan = planRepository.getToDoList(tempUser, 1, null);

        List<ToDoListDTO> toDoList = usersPlan.stream()
                .map(planEntityToTDLTypeMap::map)
                .toList();

        return toDoList;
    }

    @Override
    public List<ToDoListDTO> getChildren(Long uid, Long parentPlanId) {

        UserEntity tempUser = new UserEntity();
        tempUser.setUid(uid);

        PlanEntity parentPlan = planRepository.findById(parentPlanId).orElse(null);
        Integer parentDepth = parentPlan.getDepth();

        List<PlanEntity> usersPlan = planRepository.getToDoList(tempUser, parentDepth + 1, parentPlan);

        List<ToDoListDTO> toDoList = usersPlan.stream()
                .map(planEntityToTDLTypeMap::map)
                .toList();

        return toDoList;
    }

    @Override
    public String deletePlan(Long planId, Long uid) {

        UserEntity tempUser = new UserEntity();
        tempUser.setUid(uid);
        //그냥... 최소한의 보안정도...? 바로 deleteBy 해도 되긴 했겠지만...?
        PlanEntity planEntity = planRepository.findById(planId).orElse(null);
        if(planEntity != null && planEntity.getUser().getUid().equals(uid)){
            planRepository.delete(planEntity);
            return "complete";
        }
        return "fail";
    }


    @Override
    public String changeStatus(Long uid, Long planId, Integer changeStatus) {

        PlanEntity planEntity = planRepository.findById(planId).orElse(null);

        if (planEntity != null && planEntity.getUser().getUid().equals(uid)) {
            planEntity.setStatus(changeStatus);
            try {
                planRepository.save(planEntity);
                return "complete";
            } catch (Exception e) {
                System.out.println(e);
            }
        }
        return "fail";
    }

}
