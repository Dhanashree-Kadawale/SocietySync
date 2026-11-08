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

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE REPLACE(REPLACE(REPLACE(u.phone, ' ', ''), '-', ''), '+91', '') = :digitsOnly")
    Optional<User> findByPhoneDigits(@org.springframework.data.repository.query.Param("digitsOnly") String digitsOnly);

    List<User> findBySocietyId(Long societyId);
}
