package com.ptit.boec.repository;

import com.ptit.boec.domain.Address;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    // //JPA
    // List<Address> findAllByCity(String city);

    // //Hibernate
    // @Query("select address from Address address where address.city = :city")
    // List<Address> findAllAddress(String city);

    // //Native query
    // public List<Address> customFindByCity(String city);
}
