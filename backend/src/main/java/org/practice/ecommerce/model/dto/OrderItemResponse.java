package org.practice.ecommerce.model.dto;

public record OrderItemResponse(
        String productName,
        int quantity,
        java.math.BigDecimal totalPrice
) {
}
