package com.project.backend.service;

import com.project.backend.entity.Product;
import com.project.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Map<String, Object> getProductWithPagination(int page, int size, String f, String q) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "regDate"));
        Page<Product> productPage;

        if (f != null && !q.isEmpty()) {
            productPage = productRepository.findByField(f, q, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("totalCount", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return response;
    }

    public Product updateProduct(int no, Product updateProduct) {
        Product product = productRepository.findByNo(no);
        if(product == null){
            throw new IllegalArgumentException("Invalid product No: " + no);
        }

        product.setTitle(updateProduct.getTitle());
        product.setCategory(updateProduct.getCategory());
        product.setTitleImg(updateProduct.getTitleImg());
        product.setPrice(updateProduct.getPrice());
        product.setQuantity(updateProduct.getQuantity());
        product.setContent(updateProduct.getContent());

        return productRepository.save(product);
    }

    public void deleteProduct(int no) {
        Product product = productRepository.findByNo(no);
        if(product == null){
            throw new IllegalArgumentException("Invalid product No: " + no);
        }
        productRepository.delete(product);
    }
}
