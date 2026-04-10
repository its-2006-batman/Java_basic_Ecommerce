package org.practice.ecommerce.service;

import org.practice.ecommerce.model.Order;
import org.practice.ecommerce.model.OrderItem;
import org.practice.ecommerce.model.Product;
import org.practice.ecommerce.model.dto.OrderItemRequest;
import org.practice.ecommerce.model.dto.OrderItemResponse;
import org.practice.ecommerce.model.dto.OrderRequest;
import org.practice.ecommerce.model.dto.OrderResponse;
import org.practice.ecommerce.repository.orderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.practice.ecommerce.repository.productRepo;

@Service
public class OrderService {

    @Autowired
    private  productRepo ProductRepo;
    @Autowired
    private  orderRepo OrderRepo;

//    public OrderService(productRepo productRepo, orderRepo orderRepo) {
//        this.ProductRepo = productRepo;
//        this.OrderRepo = orderRepo;
//    }

    public OrderResponse placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        String orderId="ORD"+ UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        order.setOrderId(orderId);
        order.setCustomerName(orderRequest.customerName());
        order.setEmail(orderRequest.email());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for(OrderItemRequest itemRequest : orderRequest.items()) {
            Product product = ProductRepo.findById(itemRequest.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found "));
           product.setStockQuantity(product.getStockQuantity() -  itemRequest.quantity());
           ProductRepo.save(product);
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);
        Order savedOrder = OrderRepo.save(order);

        List<OrderItemResponse>orderresp= new ArrayList<>();
        for(OrderItem item:order.getOrderItems()){
            OrderItemResponse itemResponse= new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            );
            orderresp.add(itemResponse);
        }

        OrderResponse orderResponse= new OrderResponse(
                savedOrder.getOrderId(),
                savedOrder.getCustomerName(),
                savedOrder.getEmail(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate(),
                orderresp

        );


        return orderResponse;
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = OrderRepo.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();
        for(Order order:orders){
            List<OrderItemResponse>itemResponses= new ArrayList<>();
            for(OrderItem item:order.getOrderItems()){
                OrderItemResponse itemResponse= new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalPrice()
                );
                itemResponses.add(itemResponse);
            }
            OrderResponse orderResponse= new OrderResponse(
                    order.getOrderId(),
                    order.getCustomerName(),
                    order.getEmail(),
                    order.getStatus(),
                    order.getOrderDate(),
                    itemResponses
            );
            orderResponses.add(orderResponse);
        }
        return orderResponses;
    }
}
