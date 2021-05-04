package com.ptit.boec.domain;

import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import javax.persistence.*;

/**
 * Task entity.\n@author The JHipster team.
 */
@ApiModel(description = "Task entity.\n@author The JHipster team.")
@Entity
@Table(name = "cart")
public class Cart implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @OneToOne
    @JoinColumn(unique = true)
    private Payment payment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public Cart quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Payment getPayment() {
        return this.payment;
    }

    public Cart payment(Payment payment) {
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
        if (!(o instanceof Cart)) {
            return false;
        }
        return id != null && id.equals(((Cart) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cart{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            "}";
    }
}
