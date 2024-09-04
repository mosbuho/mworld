package com.project.backend.service;

import com.project.backend.entity.Payment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;

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
