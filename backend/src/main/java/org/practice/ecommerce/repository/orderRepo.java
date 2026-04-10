package org.practice.ecommerce.repository;

import org.practice.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface orderRepo  extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderId(String orderId);
}
