package com.todolist.backend.repository.planClass;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.repository.user.UserRepository;

@SpringBootTest
@TestPropertySource(properties = "spring.main.lazy-initialization=true")
@Transactional
class PlanClassRepositoryTest {

	@Autowired
	private PlanClassRepository planClassRepository;
	@Autowired
	private UserRepository userRepository;

	@Test
	void findExistingClassNamesByUidAndClassNames() {
		UserEntity user = userRepository.findById(4L).get();
		List<String> classNames = new ArrayList<>();
		classNames.add("백엔드");
		classNames.add("백엔드2");
		classNames.add("프론트");
		classNames.add("프론트2");

		Set<String> existingClassNames = planClassRepository.findExistingClassNamesByUidAndClassNames(user, classNames);

		Assertions.assertThat(existingClassNames).isEqualTo(Set.of("백엔드", "프론트"));
	}

	@Test
	void deleteNotReferenced(){
		PlanClassEntity entity = planClassRepository.findById(117L).orElseThrow();
		List<PlanClassEntity> list = new ArrayList<>();
		list.add(entity);
		planClassRepository.deleteNotReferenced(list);

	}
}