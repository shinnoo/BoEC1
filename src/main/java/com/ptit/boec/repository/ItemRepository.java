package com.ptit.boec.repository;

import com.ptit.boec.domain.Item;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Item entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {}
