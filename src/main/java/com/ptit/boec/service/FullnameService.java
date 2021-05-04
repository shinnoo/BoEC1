package com.ptit.boec.service;

import com.ptit.boec.domain.Fullname;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Fullname}.
 */
public interface FullnameService {
    /**
     * Save a fullname.
     *
     * @param fullname the entity to save.
     * @return the persisted entity.
     */
    Fullname save(Fullname fullname);

    /**
     * Partially updates a fullname.
     *
     * @param fullname the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Fullname> partialUpdate(Fullname fullname);

    /**
     * Get all the fullnames.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Fullname> findAll(Pageable pageable);

    /**
     * Get the "id" fullname.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Fullname> findOne(Long id);

    /**
     * Delete the "id" fullname.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
