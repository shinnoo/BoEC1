package com.ptit.boec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ptit.boec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FullnameTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fullname.class);
        Fullname fullname1 = new Fullname();
        fullname1.setId(1L);
        Fullname fullname2 = new Fullname();
        fullname2.setId(fullname1.getId());
        assertThat(fullname1).isEqualTo(fullname2);
        fullname2.setId(2L);
        assertThat(fullname1).isNotEqualTo(fullname2);
        fullname1.setId(null);
        assertThat(fullname1).isNotEqualTo(fullname2);
    }
}
