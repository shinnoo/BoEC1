package com.ptit.boec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ptit.boec.IntegrationTest;
import com.ptit.boec.domain.Fullname;
import com.ptit.boec.repository.FullnameRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FullnameResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FullnameResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fullnames";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FullnameRepository fullnameRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFullnameMockMvc;

    private Fullname fullname;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fullname createEntity(EntityManager em) {
        Fullname fullname = new Fullname().firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME);
        return fullname;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fullname createUpdatedEntity(EntityManager em) {
        Fullname fullname = new Fullname().firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);
        return fullname;
    }

    @BeforeEach
    public void initTest() {
        fullname = createEntity(em);
    }

    @Test
    @Transactional
    void createFullname() throws Exception {
        int databaseSizeBeforeCreate = fullnameRepository.findAll().size();
        // Create the Fullname
        restFullnameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fullname)))
            .andExpect(status().isCreated());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeCreate + 1);
        Fullname testFullname = fullnameList.get(fullnameList.size() - 1);
        assertThat(testFullname.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testFullname.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    @Transactional
    void createFullnameWithExistingId() throws Exception {
        // Create the Fullname with an existing ID
        fullname.setId(1L);

        int databaseSizeBeforeCreate = fullnameRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFullnameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fullname)))
            .andExpect(status().isBadRequest());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFullnames() throws Exception {
        // Initialize the database
        fullnameRepository.saveAndFlush(fullname);

        // Get all the fullnameList
        restFullnameMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fullname.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));
    }

    @Test
    @Transactional
    void getFullname() throws Exception {
        // Initialize the database
        fullnameRepository.saveAndFlush(fullname);

        // Get the fullname
        restFullnameMockMvc
            .perform(get(ENTITY_API_URL_ID, fullname.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fullname.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME));
    }

    @Test
    @Transactional
    void getNonExistingFullname() throws Exception {
        // Get the fullname
        restFullnameMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFullname() throws Exception {
        // Initialize the database
        fullnameRepository.saveAndFlush(fullname);

        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();

        // Update the fullname
        Fullname updatedFullname = fullnameRepository.findById(fullname.getId()).get();
        // Disconnect from session so that the updates on updatedFullname are not directly saved in db
        em.detach(updatedFullname);
        updatedFullname.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restFullnameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFullname.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFullname))
            )
            .andExpect(status().isOk());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
        Fullname testFullname = fullnameList.get(fullnameList.size() - 1);
        assertThat(testFullname.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testFullname.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void putNonExistingFullname() throws Exception {
        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();
        fullname.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFullnameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fullname.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fullname))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFullname() throws Exception {
        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();
        fullname.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFullnameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fullname))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFullname() throws Exception {
        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();
        fullname.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFullnameMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fullname)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFullnameWithPatch() throws Exception {
        // Initialize the database
        fullnameRepository.saveAndFlush(fullname);

        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();

        // Update the fullname using partial update
        Fullname partialUpdatedFullname = new Fullname();
        partialUpdatedFullname.setId(fullname.getId());

        restFullnameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFullname.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFullname))
            )
            .andExpect(status().isOk());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
        Fullname testFullname = fullnameList.get(fullnameList.size() - 1);
        assertThat(testFullname.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testFullname.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    @Transactional
    void fullUpdateFullnameWithPatch() throws Exception {
        // Initialize the database
        fullnameRepository.saveAndFlush(fullname);

        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();

        // Update the fullname using partial update
        Fullname partialUpdatedFullname = new Fullname();
        partialUpdatedFullname.setId(fullname.getId());

        partialUpdatedFullname.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restFullnameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFullname.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFullname))
            )
            .andExpect(status().isOk());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
        Fullname testFullname = fullnameList.get(fullnameList.size() - 1);
        assertThat(testFullname.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testFullname.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingFullname() throws Exception {
        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();
        fullname.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFullnameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fullname.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fullname))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFullname() throws Exception {
        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();
        fullname.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFullnameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fullname))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFullname() throws Exception {
        int databaseSizeBeforeUpdate = fullnameRepository.findAll().size();
        fullname.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFullnameMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fullname)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fullname in the database
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFullname() throws Exception {
        // Initialize the database
        fullnameRepository.saveAndFlush(fullname);

        int databaseSizeBeforeDelete = fullnameRepository.findAll().size();

        // Delete the fullname
        restFullnameMockMvc
            .perform(delete(ENTITY_API_URL_ID, fullname.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fullname> fullnameList = fullnameRepository.findAll();
        assertThat(fullnameList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
