package com.project.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.project.backend.dto.ProductResponse;
import com.project.backend.entity.Product;
import com.project.backend.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Map<String, Object> getProductWithPagination(int page, int size, String f, String q, boolean isAdmin) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "regDate"));
        Page<Product> productPage;

        if (f != null && !q.isEmpty()) {
            productPage = productRepository.findByField(f, q, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        List<ProductResponse> products = productPage.getContent().stream()
                .map(product -> isAdmin
                        ? new ProductResponse(
                                product.getNo(),
                                product.getTitle(),
                                product.getCategory(),
                                product.getQuantity(),
                                product.getPrice())
                        : new ProductResponse(
                                product.getNo(),
                                product.getTitle(),
                                product.getTitleImg(),
                                product.getPrice()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("products", products);
        response.put("totalCount", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return response;
    }

    public ProductResponse getProduct(int no, boolean isAdmin) {
        Product product = productRepository.findById(no)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        return isAdmin
                ? new ProductResponse(product.getNo(), product.getTitle(), product.getCategory(), product.getTitleImg(),
                        product.getPrice(), product.getQuantity(), product.getContent())
                : new ProductResponse(product.getNo(), product.getTitle(), product.getTitleImg(), product.getPrice(),
                        product.getQuantity(), product.getContent());
    }

    public Product updateProduct(int no, Product updateProduct) {
        Product product = productRepository.findByNo(no);
        if (product == null) {
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
        if (product == null) {
            throw new IllegalArgumentException("Invalid product No: " + no);
        }
        productRepository.delete(product);
    }
}
