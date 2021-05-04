package com.ptit.boec.service.impl;

import com.ptit.boec.domain.Payment;
import com.ptit.boec.repository.PaymentRepository;
import com.ptit.boec.service.PaymentService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Payment}.
 */
@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment save(Payment payment) {
        log.debug("Request to save Payment : {}", payment);
        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> partialUpdate(Payment payment) {
        log.debug("Request to partially update Payment : {}", payment);

        return paymentRepository
            .findById(payment.getId())
            .map(
                existingPayment -> {
                    if (payment.getCreateAt() != null) {
                        existingPayment.setCreateAt(payment.getCreateAt());
                    }
                    if (payment.getCode() != null) {
                        existingPayment.setCode(payment.getCode());
                    }

                    return existingPayment;
                }
            )
            .map(paymentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Payment> findAll(Pageable pageable) {
        log.debug("Request to get all Payments");
        return paymentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Payment> findOne(Long id) {
        log.debug("Request to get Payment : {}", id);
        return paymentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Payment : {}", id);
        paymentRepository.deleteById(id);
    }
}
