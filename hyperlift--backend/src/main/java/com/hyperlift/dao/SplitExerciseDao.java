package com.hyperlift.dao;

import com.hyperlift.entity.SplitExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SplitExerciseDao extends JpaRepository<SplitExercise, Long> {
}
