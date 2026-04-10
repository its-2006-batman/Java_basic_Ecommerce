package org.practice.ecommerce.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {}
