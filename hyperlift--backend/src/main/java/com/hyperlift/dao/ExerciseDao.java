package com.hyperlift.dao;

import com.hyperlift.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseDao extends JpaRepository<Exercise, Long> {

    List<Exercise> findByMuscleGroup(String muscleGroup);

    List<Exercise> findByDifficultyLevel(String difficultyLevel);

    List<Exercise> findByNameContainingIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
