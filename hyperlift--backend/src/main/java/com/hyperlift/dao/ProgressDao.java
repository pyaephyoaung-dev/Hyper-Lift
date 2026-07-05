package com.hyperlift.dao;

import com.hyperlift.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgressDao extends JpaRepository<Progress, Long> {

    List<Progress> findByUserId(Long userId);

    List<Progress> findByUserIdOrderByRecordDateDescCreatedAtDesc(Long userId);

    List<Progress> findByUserIdAndRecordDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    /** Used to auto-assign the next set number for an exercise on a given date. */
    int countByUserIdAndExerciseIdAndRecordDate(Long userId, Long exerciseId, LocalDate recordDate);
}
