// package com.ptit.boec.repository;

// import java.util.ArrayList;
// import java.util.List;

// import javax.persistence.EntityManager;
// import javax.persistence.PersistenceContext;

// import org.hibernate.Session;

// import com.ptit.boec.domain.Address;

// public class AddressRepositoryCustomImpl implements AddressRepository {
//     @PersistenceContext
//     private EntityManager entityManager;

//     @Override
//     @SuppressWarnings("unchecked")
//     public List<Address> customFindByCity(String city) {
//         String sql = "select * from address where address.city = :city";
//         Session session = (Session) entityManager.getDelegate();
//         List<Object[]> result = session.createSQLQuery(sql).list();
//         List<Address> cities = new ArrayList<>();
//         for (Object[] o : result) {
//             Address address = new Address():
//             address.setId(o[0]);
//             address.setLocation(o[1]);
//             address.setStreet(o[2]);
//             address.setCity(o[3]);
//             cities.add(address);
//         }
//         return cities;
//     }
// }
