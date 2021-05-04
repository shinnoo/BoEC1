package com.ptit.boec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "age")
    private Integer age;

    @OneToOne
    @JoinColumn(unique = true)
    private Fullname fullname;

    @ManyToOne
    @JsonIgnoreProperties(value = { "item" }, allowSetters = true)
    private Orders orders;

    @ManyToOne
    private Address address;

    @ManyToOne
    private Payment payment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getAge() {
        return this.age;
    }

    public Customer age(Integer age) {
        this.age = age;
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Fullname getFullname() {
        return this.fullname;
    }

    public Customer fullname(Fullname fullname) {
        this.setFullname(fullname);
        return this;
    }

    public void setFullname(Fullname fullname) {
        this.fullname = fullname;
    }

    public Orders getOrders() {
        return this.orders;
    }

    public Customer orders(Orders orders) {
        this.setOrders(orders);
        return this;
    }

    public void setOrders(Orders orders) {
        this.orders = orders;
    }

    public Address getAddress() {
        return this.address;
    }

    public Customer address(Address address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Payment getPayment() {
        return this.payment;
    }

    public Customer payment(Payment payment) {
        this.setPayment(payment);
        return this;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", age=" + getAge() +
            "}";
    }
}
