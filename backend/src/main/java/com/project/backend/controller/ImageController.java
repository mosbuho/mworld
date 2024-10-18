package com.project.backend.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.project.backend.service.ImageService;

@RestController
@RequestMapping("/api")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/img")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file,
            @RequestParam("entityType") String entityType) {
        try {
            String imageUrl = imageService.saveImage(file, entityType);
            return ResponseEntity.ok().body(Map.of("url", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }

    @GetMapping("/img/{entityType}/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable String entityType,
            @PathVariable String filename) {
        Resource resource = imageService.loadImage(entityType, filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/img/{entityType}/{filename}")
    public ResponseEntity<?> deleteImage(
            @PathVariable String entityType,
            @PathVariable String filename) {
        try {
            imageService.deleteImage(entityType, filename);
            return ResponseEntity.ok().body("Image deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image deletion failed");
        }
    }
}