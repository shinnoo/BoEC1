package com.ptit.boec.domain;

import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import javax.persistence.*;

/**
 * not an ignored comment
 */
@ApiModel(description = "not an ignored comment")
@Entity
@Table(name = "address")
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location")
    private String location;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Address id(Long id) {
        this.id = id;
        return this;
    }

    public String getLocation() {
        return this.location;
    }

    public Address location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStreet() {
        return this.street;
    }

    public Address street(String street) {
        this.street = street;
        return this;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return this.city;
    }

    public Address city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Address)) {
            return false;
        }
        return id != null && id.equals(((Address) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Address{" +
            "id=" + getId() +
            ", location='" + getLocation() + "'" +
            ", street='" + getStreet() + "'" +
            ", city='" + getCity() + "'" +
            "}";
    }
}
