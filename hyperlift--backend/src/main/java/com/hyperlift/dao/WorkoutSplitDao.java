package com.hyperlift.dao;

import com.hyperlift.entity.WorkoutSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutSplitDao extends JpaRepository<WorkoutSplit, Long> {

    List<WorkoutSplit> findByWorkoutPlanId(Long workoutPlanId);

    List<WorkoutSplit> findByWorkoutPlanIdOrderByOrderIndexAsc(Long workoutPlanId);
}
