package com.ptit.boec.service.impl;

import com.ptit.boec.domain.Fullname;
import com.ptit.boec.repository.FullnameRepository;
import com.ptit.boec.service.FullnameService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Fullname}.
 */
@Service
@Transactional
public class FullnameServiceImpl implements FullnameService {

    private final Logger log = LoggerFactory.getLogger(FullnameServiceImpl.class);

    private final FullnameRepository fullnameRepository;

    public FullnameServiceImpl(FullnameRepository fullnameRepository) {
        this.fullnameRepository = fullnameRepository;
    }

    @Override
    public Fullname save(Fullname fullname) {
        log.debug("Request to save Fullname : {}", fullname);
        return fullnameRepository.save(fullname);
    }

    @Override
    public Optional<Fullname> partialUpdate(Fullname fullname) {
        log.debug("Request to partially update Fullname : {}", fullname);

        return fullnameRepository
            .findById(fullname.getId())
            .map(
                existingFullname -> {
                    if (fullname.getFirstName() != null) {
                        existingFullname.setFirstName(fullname.getFirstName());
                    }
                    if (fullname.getLastName() != null) {
                        existingFullname.setLastName(fullname.getLastName());
                    }

                    return existingFullname;
                }
            )
            .map(fullnameRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Fullname> findAll(Pageable pageable) {
        log.debug("Request to get all Fullnames");
        return fullnameRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Fullname> findOne(Long id) {
        log.debug("Request to get Fullname : {}", id);
        return fullnameRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Fullname : {}", id);
        fullnameRepository.deleteById(id);
    }
}
