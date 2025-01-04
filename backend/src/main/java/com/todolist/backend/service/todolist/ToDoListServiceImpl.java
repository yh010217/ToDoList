package com.todolist.backend.service.todolist;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.planClass.PlanClassRepository;
import com.todolist.backend.repository.planClasses.PlanClassesRepository;
import com.todolist.backend.repository.plan.PlanRepository;
import com.todolist.backend.repository.user.UserRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ToDoListServiceImpl implements ToDoListService {
    /*리파지토리 주입*/
    private final PlanRepository planRepository;
    private final PlanClassRepository planClassRepository;
    private final PlanClassesRepository planClassesRepository;
    private final UserRepository userRepository;

    private final ModelMapper modelMapper;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");


    private final TypeMap<PlanEntity, ToDoListDTO> planEntityToTDLTypeMap;

    public ToDoListServiceImpl(PlanRepository planRepository
        , PlanClassRepository planClassRepository, PlanClassesRepository planClassesRepository
        , UserRepository userRepository, ModelMapper modelMapper) {
        this.planRepository = planRepository;
        this.planClassRepository = planClassRepository;
        this.planClassesRepository = planClassesRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;

        this.planEntityToTDLTypeMap =
                modelMapper.createTypeMap(PlanEntity.class, ToDoListDTO.class)
                        .addMapping(PlanEntity::getPlanTitle, ToDoListDTO::setTitle);
    }

    @Override
    @Transactional
    public String insertPlan(ToDoListDTO dto, Long uid) {

        try {
            UserEntity user = userRepository.findById(uid).orElseThrow();

            PlanEntity parentPlan = planRepository.findById(dto.getParentPlanId()).orElseThrow();

            PlanEntity planEntity = savePlan(dto, user, parentPlan);

            savePlanClass(dto, user);

            savePlanClasses(dto, planEntity,user);

            return "complete";
        }catch (EntityNotFoundException ex) {
            System.out.println("Entity not found: " + ex.getMessage());
            return "fail";
        } catch (Exception exception) {
            System.out.println(exception);
            return "fail";
        }
    }

    private PlanEntity savePlan(ToDoListDTO dto, UserEntity user, PlanEntity parentPlan) {
        PlanEntity planEntity = PlanEntity.builder()
                .user(user)
                .planTitle(dto.getTitle())
                .deadline(LocalDateTime.parse(dto.getDeadline(), formatter))
                .depth(dto.getDepth())
                .memo(dto.getMemo())
                .parentPlan(parentPlan)
                .build();

        planRepository.save(planEntity);
        return planEntity;
    }

    private void savePlanClass(ToDoListDTO dto, UserEntity user) {

        Set<String> existingClassNameSet
            = planClassRepository.findExistingClassNamesByUidAndClassNames(user, dto.getClasses());
        List<String> dtoClasses = dto.getClasses();
        List<PlanClassEntity> newPlanClassList = dtoClasses.stream()
            .filter(item -> !existingClassNameSet.contains(item))
            .map(item -> PlanClassEntity.builder().className(item).user(user).build())
            .toList();

        planClassRepository.saveAll(newPlanClassList);
    }
    private void savePlanClasses(ToDoListDTO dto, PlanEntity planEntity, UserEntity user) {
        List<PlanClassEntity> UserClassList
            = planClassRepository.findExistingClassByPlanAndClasses(user, dto.getClasses());
        List<PlanClassesEntity> toSavePlanClassesList
            = UserClassList.stream()
            .map(item -> PlanClassesEntity.builder().planClass(item).className(item.getClassName()).plan(planEntity).build())
            .toList();
        planClassesRepository.saveAll(toSavePlanClassesList);
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

    @Override
    public List<ToDoListDTO> getToDoList(Long uid, String option, String sort, String asc) {

        UserEntity tempUser = new UserEntity();
        tempUser.setUid(uid);

        List<PlanEntity> usersPlan = planRepository.getToDoListByCondition(tempUser, 1, null, option, sort, asc);

        List<ToDoListDTO> toDoList = usersPlan.stream()
                .map(planEntityToTDLTypeMap::map)
                .toList();

        return toDoList;
    }

    @Override
    public List<ToDoListDTO> getChildren(Long uid, Long parentPlanId, String option, String sort, String asc) {

        UserEntity tempUser = new UserEntity();
        tempUser.setUid(uid);

        PlanEntity parentPlan = planRepository.findById(parentPlanId).orElse(null);
        Integer parentDepth = parentPlan.getDepth();

        List<PlanEntity> usersPlan = planRepository.getToDoListByCondition(tempUser, parentDepth + 1, parentPlan,option,sort,asc);

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
        if (planEntity != null && planEntity.getUser().getUid().equals(uid)) {
            planRepository.delete(planEntity);
            return "complete";
        }
        return "fail";
    }

    @Override
    public ToDoListDTO getToDoDetail(Long uid, Long planId) {
        PlanEntity planEntity = planRepository.findById(planId).orElseThrow(EntityExistsException::new);
        ToDoListDTO toDoDetail = planEntityToTDLTypeMap.map(planEntity);

        List<String> classes = planClassesRepository.findByPlan(planEntity)
                .stream()
                .map(item -> item.getClassName())
                .toList();
        toDoDetail.setClasses(classes);
        return toDoDetail;
    }

    @Override
    @Transactional
    public String modifyToDoList(ToDoListDTO dto, Long uid) {
        try {

            PlanEntity planEntity = planRepository.findById(dto.getPlanId()).orElseThrow(RuntimeException::new);

            UserEntity user = planEntity.getUser();

            if (!user.getUid().equals(uid)) {
                throw new RuntimeException();
            }

            if(!planEntity.getPlanTitle().equals(dto.getTitle())){
                planEntity.setPlanTitle(dto.getTitle());
            }
            if(!planEntity.getDeadline().equals(dto.getDeadline())){
                planEntity.setDeadline(LocalDateTime.parse(dto.getDeadline(), formatter));
            }
            if(!planEntity.getMemo().equals(dto.getMemo())){
                planEntity.setMemo(dto.getMemo());
            }

            planRepository.save(planEntity);

            // 한 유저가 가지고 있는 class들.
            // 너무 많아져서 받아오기 힘들어지면 나중에 사이즈 제한 둘듯
            Set<PlanClassEntity> userClassSet = planClassRepository.findByUser(user);

            Set<String> classNameSet = userClassSet.stream()
                    .map(PlanClassEntity::getClassName)
                    .collect(Collectors.toSet());

            //dto 에서 감지 안된건 classes에서 없에야되기도 함
            deleteClasses(dto,planEntity);


            // 없었던 plan_class들 insert 처리 하고, 리스트 정리 안해도 됨. 어차피 넣을거 밑에서 했음
            saveNewClassList(user, dto, classNameSet);


            // 지금은 투두리스트 modify 중이니까 이중에 원래 plan_classes에 들어있던 친구도 있을거임. 걔네 치움
            List<PlanClassEntity> toInsertIntoClasses = getToInsertIntoClasses(dto, planEntity);

            //그냥 합친 것. 두개 합치고, 합친것들은 PlanClassEntity 객체일테니 PlanClasses형식으로 바꿔줘야함
            List<PlanClassesEntity> toInsertClasses = toInsertIntoClasses.stream()
                    .map(item -> PlanClassesEntity.builder()
                            .planClass(item)
                            .className(item.getClassName())
                            .plan(planEntity)
                            .build())
                    .toList();

            planClassesRepository.saveAll(toInsertClasses);

            return "complete";
        } catch (Exception exception) {
            return "fail";
        }
    }

    private void deleteClasses(ToDoListDTO dto, PlanEntity planEntity) {
        List<PlanClassesEntity> thisPlanClassesList = planClassesRepository.findByPlan(planEntity);
        List<PlanClassesEntity> toDeleteList = new ArrayList<>();

        List<String> dtoClasses = dto.getClasses();
        for(PlanClassesEntity item : thisPlanClassesList){
            boolean find = false;
            for(String dtoClass : dtoClasses){
                if(dtoClass.equals(item.getClassName())){
                    find = true;
                    break;
                }
            }
            if(!find){
                toDeleteList.add(item);
            }
        }

        planClassesRepository.deleteAll(toDeleteList);

    }

    /** 여기선 classes에만 넣을 거 생각하면 됨 */
    private List<PlanClassEntity> getToInsertIntoClasses(ToDoListDTO dto, PlanEntity planEntity) {

        List<PlanClassesEntity> planClassesList = planClassesRepository.findByPlan(planEntity);

        List<String> dtoClasses = dto.getClasses();

        List<String> insertListStr = dtoClasses.stream()
                .filter(item -> {
                    boolean insert = true;
                    for (PlanClassesEntity planClasses : planClassesList) {
                        // 이미 있으니 classes 에는 안넣어도 됨
                        if (planClasses.getClassName().equals(item)) {
                            insert = false;
                            break;
                        }
                    }
                    return insert;
                }).toList();


        Set<PlanClassEntity> userClassSet = planClassRepository.findByUser(planEntity.getUser());

        List<PlanClassEntity> toInsertIntoClasses = insertListStr.stream()
                .map(item -> {
                    PlanClassEntity planClass = null;
                    Iterator<PlanClassEntity> userClassIter = userClassSet.iterator();
                    // class 의 set에서 이름 같은거 가져오기 (지금 class_id를 위해 이러고 있는거임... ㅋ)
                    while (userClassIter.hasNext()) {
                        PlanClassEntity nextClass = userClassIter.next();
                        if (nextClass.getClassName().equals(item)){
                            planClass = nextClass;
                            break;
                        }
                    }
                    return planClass;
                }).toList();
        return toInsertIntoClasses;
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
