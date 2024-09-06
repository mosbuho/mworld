package com.project.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.backend.entity.Payment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Service
public class PaymentService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Payment> getPaymentList(int page, int size) {
        int pageSize = size - page + 1;

        Query query = entityManager.createQuery("SELECT p FROM Payment p ORDER BY p.regDate DESC", Payment.class);

        query.setFirstResult(page - 1);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }
}
