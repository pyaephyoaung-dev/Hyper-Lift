package com.hyperlift.dao;

import com.hyperlift.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutDao extends JpaRepository<Workout, Long> {

    List<Workout> findByUserId(Long userId);

    List<Workout> findByUserIdAndWorkoutDate(Long userId, LocalDate workoutDate);

    List<Workout> findByUserIdAndWorkoutDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Workout> findByWorkoutSplitId(Long workoutSplitId);
}
