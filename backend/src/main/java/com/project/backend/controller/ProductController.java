package com.project.backend.controller;

import com.project.backend.entity.Product;
import com.project.backend.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/admin/product")
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        try {
            log.info("createProduct : " + product);
            Product savedProduct = productService.createProduct(product);
            log.info("savedProduct : " + savedProduct);
            return ResponseEntity.ok(savedProduct.getTitle());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/product-list")
    public Map<String, Object> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam String f,
            @RequestParam String q) {
        return productService.getProductWithPagination(page, size, f, q);
    }

    @PutMapping("/admin/product/{no}")
    public ResponseEntity<String> updateProduct(
            @PathVariable int no,
            @RequestBody Product updateProduct) {
        try {
            log.info("updateProduct : " + updateProduct);
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
