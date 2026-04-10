package org.practice.ecommerce.service;

import org.practice.ecommerce.model.Product;
import org.practice.ecommerce.repository.productRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private productRepo productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {

        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());
        return productRepository.save(product);
    }

    public byte[] getImage(int id) {
        Product product= productRepository.findById(id).orElse(null);
        return product.getImageData();
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException{
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());
        productRepository.save(product);
            return product;
    }

    public Product deleteProduct(int id) {
        Product deletedProduct = productRepository.findById(id).orElse(null);
        productRepository.deleteById(id);
        return deletedProduct;
    }

    public List<Product> searchProduct(String keyword) {
        return productRepository.search(keyword);
    }
}
