package com.project.backend.repository;

import com.project.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Product findByNo(int no);

    @Query("SELECT p FROM Product p WHERE :f = 'title' AND p.title LIKE %:q%")
    Page<Product> findByField(@Param("f") String f, @Param("q") String q, Pageable pageable);
}
