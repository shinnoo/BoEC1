package com.ptit.boec.service.impl;

import com.ptit.boec.domain.Orders;
import com.ptit.boec.repository.OrdersRepository;
import com.ptit.boec.service.OrdersService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Orders}.
 */
@Service
@Transactional
public class OrdersServiceImpl implements OrdersService {

    private final Logger log = LoggerFactory.getLogger(OrdersServiceImpl.class);

    private final OrdersRepository ordersRepository;

    public OrdersServiceImpl(OrdersRepository ordersRepository) {
        this.ordersRepository = ordersRepository;
    }

    @Override
    public Orders save(Orders orders) {
        log.debug("Request to save Orders : {}", orders);
        return ordersRepository.save(orders);
    }

    @Override
    public Optional<Orders> partialUpdate(Orders orders) {
        log.debug("Request to partially update Orders : {}", orders);

        return ordersRepository
            .findById(orders.getId())
            .map(
                existingOrders -> {
                    if (orders.getTotalPrice() != null) {
                        existingOrders.setTotalPrice(orders.getTotalPrice());
                    }
                    if (orders.getCartId() != null) {
                        existingOrders.setCartId(orders.getCartId());
                    }

                    return existingOrders;
                }
            )
            .map(ordersRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Orders> findAll(Pageable pageable) {
        log.debug("Request to get all Orders");
        return ordersRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Orders> findOne(Long id) {
        log.debug("Request to get Orders : {}", id);
        return ordersRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Orders : {}", id);
        ordersRepository.deleteById(id);
    }
}
