package com.project.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.backend.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Member findMemberById(String id);

    Member findByProviderAndProviderId(String provider, String providerId);

}
