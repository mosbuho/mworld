package com.project.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${upload.img.path}")
    private String imgPath;

    @Value("${upload.product.path}")
    private String productImgPath;

    // 이미지 파일을 반환하는 메서드
    public Resource loadImage(String entityType, String filename) {
        try {
            Path filePath = Paths.get(imgPath).resolve(entityType).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public String saveImage(MultipartFile file, String entityType) throws IOException {
        if (file.isEmpty()){
            throw new IOException("Empty file");
        }
        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + ".webp";
        String directoryPath = getDirectoryPath(entityType);

        Path directory = Paths.get(directoryPath);
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }
        Path filePath = directory.resolve(fileName);

        BufferedImage image = ImageIO.read(file.getInputStream());

        saveAsWebP(image, filePath);

        return entityType + "/" + fileName;
    }

    private void saveAsWebP(BufferedImage image, Path filePath) throws IOException {
        ImageWriter writer = ImageIO.getImageWritersByFormatName("webp").next();
        try (ImageOutputStream outputStream = ImageIO.createImageOutputStream(
                Files.newOutputStream(filePath))) {
            writer.setOutput(outputStream);
            writer.write(image);
        } finally {
            writer.dispose();
        }
    }

    private String getDirectoryPath(String entityType) {
        switch (entityType) {
            case "product":
                return productImgPath;
            default:
                throw new IllegalArgumentException("지정하지 않은 타입의 이미지파일입니다.");
        }
    }
}
