package com.ptit.boec.domain;

import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * The Employee entity.
 */
@ApiModel(description = "The Employee entity.")
@Entity
@Table(name = "payment")
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "create_at")
    private Instant createAt;

    @Column(name = "code")
    private String code;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Payment id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getCreateAt() {
        return this.createAt;
    }

    public Payment createAt(Instant createAt) {
        this.createAt = createAt;
        return this;
    }

    public void setCreateAt(Instant createAt) {
        this.createAt = createAt;
    }

    public String getCode() {
        return this.code;
    }

    public Payment code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payment)) {
            return false;
        }
        return id != null && id.equals(((Payment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", createAt='" + getCreateAt() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
