package com.project.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Admin findAdminById(String id);

}
