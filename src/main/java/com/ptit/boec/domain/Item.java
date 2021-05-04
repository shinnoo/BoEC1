package com.ptit.boec.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Long price;

    @Column(name = "cart_id")
    private Integer cartId;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Item id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Item name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPrice() {
        return this.price;
    }

    public Item price(Long price) {
        this.price = price;
        return this;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public Integer getCartId() {
        return this.cartId;
    }

    public Item cartId(Integer cartId) {
        this.cartId = cartId;
        return this;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Item)) {
            return false;
        }
        return id != null && id.equals(((Item) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Item{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", price=" + getPrice() +
            ", cartId=" + getCartId() +
            "}";
    }
}
