package com.hyperlift.dao;

import com.hyperlift.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseDao extends JpaRepository<WorkoutExercise, Long> {

    List<WorkoutExercise> findByWorkoutId(Long workoutId);

    List<WorkoutExercise> findByExerciseId(Long exerciseId);

    void deleteByWorkoutId(Long workoutId);
}
