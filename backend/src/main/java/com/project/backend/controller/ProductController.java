package com.project.backend.controller;

import java.util.Map;

import com.project.backend.dto.ProductResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.entity.Product;
import com.project.backend.service.ProductService;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/admin/product")
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productService.createProduct(product);
            return ResponseEntity.ok(savedProduct.getTitle());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/product")
    public Map<String, Object> getAllProductsForAdmin(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam String f,
            @RequestParam String q) {
        return productService.getProductWithPagination(page, size, f, q, true);
    }

    @GetMapping("/member/product")
    public Map<String, Object> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam String f,
            @RequestParam String q) {
        return productService.getProductWithPagination(page, size, f, q, false); // 멤버 호출
    }

    @GetMapping("/admin/product/{no}")
    public ResponseEntity<ProductResponse> getProductForAdmin(@PathVariable int no) {
        try {
            ProductResponse product = productService.getProduct(no, true);
            return ResponseEntity.ok(product);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/member/product/{no}")
    public ResponseEntity<ProductResponse> getProductForMember(@PathVariable int no) {
        try {
            ProductResponse product = productService.getProduct(no, false);
            return ResponseEntity.ok(product);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/admin/product/{no}")
    public ResponseEntity<String> updateProduct(
            @PathVariable int no,
            @RequestBody Product updateProduct) {
        try {
            productService.updateProduct(no, updateProduct);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/admin/product/{no}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable int no) {
        try {
            productService.deleteProduct(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
