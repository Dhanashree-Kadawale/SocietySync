package com.societysync.repository;

import com.societysync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByName(String name);
    List<User> findBySocietyId(Long societyId);
    boolean existsByEmail(String email);
}
