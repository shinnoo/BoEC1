package com.ptit.boec.service.impl;

import com.ptit.boec.domain.Address;
import com.ptit.boec.repository.AddressRepository;
import com.ptit.boec.service.AddressService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Address}.
 */
@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final Logger log = LoggerFactory.getLogger(AddressServiceImpl.class);

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public Address save(Address address) {
        log.debug("Request to save Address : {}", address);
        return addressRepository.save(address);
    }

    @Override
    public Optional<Address> partialUpdate(Address address) {
        log.debug("Request to partially update Address : {}", address);

        return addressRepository
            .findById(address.getId())
            .map(
                existingAddress -> {
                    if (address.getLocation() != null) {
                        existingAddress.setLocation(address.getLocation());
                    }
                    if (address.getStreet() != null) {
                        existingAddress.setStreet(address.getStreet());
                    }
                    if (address.getCity() != null) {
                        existingAddress.setCity(address.getCity());
                    }

                    return existingAddress;
                }
            )
            .map(addressRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Address> findAll(Pageable pageable) {
        log.debug("Request to get all Addresses");
        return addressRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Address> findOne(Long id) {
        log.debug("Request to get Address : {}", id);
        return addressRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Address : {}", id);
        addressRepository.deleteById(id);
    }
}
