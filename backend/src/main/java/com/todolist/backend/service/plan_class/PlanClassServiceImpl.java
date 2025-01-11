package com.todolist.backend.service.plan_class;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.PlanClassDTO;
import com.todolist.backend.repository.planClass.PlanClassRepository;
import com.todolist.backend.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanClassServiceImpl implements PlanClassService {
	private final PlanClassRepository planClassRepository;
	private final UserRepository userRepository;

	@Override
	public List<PlanClassDTO> getAllPlanClass(Long uid) {
		UserEntity user = userRepository.findById(uid).orElseThrow();
		List<PlanClassDTO> planClassList =
			planClassRepository.findByUser(user).stream()
				.map(entity -> PlanClassDTO.builder()
					.classId(entity.getClassId())
					.className(entity.getClassName())
					.build())
				.collect(Collectors.toList());
		return planClassList;
	}
}
