package com.ptit.boec.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Orders.
 */
@Entity
@Table(name = "orders")
public class Orders implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_price")
    private Long totalPrice;

    @Column(name = "cart_id")
    private Integer cartId;

    @ManyToOne
    private Item item;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Orders id(Long id) {
        this.id = id;
        return this;
    }

    public Long getTotalPrice() {
        return this.totalPrice;
    }

    public Orders totalPrice(Long totalPrice) {
        this.totalPrice = totalPrice;
        return this;
    }

    public void setTotalPrice(Long totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getCartId() {
        return this.cartId;
    }

    public Orders cartId(Integer cartId) {
        this.cartId = cartId;
        return this;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public Item getItem() {
        return this.item;
    }

    public Orders item(Item item) {
        this.setItem(item);
        return this;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Orders)) {
            return false;
        }
        return id != null && id.equals(((Orders) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Orders{" +
            "id=" + getId() +
            ", totalPrice=" + getTotalPrice() +
            ", cartId=" + getCartId() +
            "}";
    }
}
