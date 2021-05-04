package com.ptit.boec.repository;

import com.ptit.boec.domain.Fullname;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Fullname entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FullnameRepository extends JpaRepository<Fullname, Long> {}
