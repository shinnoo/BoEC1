package com.ptit.boec.web.rest;

import com.ptit.boec.domain.Fullname;
import com.ptit.boec.repository.FullnameRepository;
import com.ptit.boec.service.FullnameService;
import com.ptit.boec.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ptit.boec.domain.Fullname}.
 */
@RestController
@RequestMapping("/api")
public class FullnameResource {

    private final Logger log = LoggerFactory.getLogger(FullnameResource.class);

    private static final String ENTITY_NAME = "fullname";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FullnameService fullnameService;

    private final FullnameRepository fullnameRepository;

    public FullnameResource(FullnameService fullnameService, FullnameRepository fullnameRepository) {
        this.fullnameService = fullnameService;
        this.fullnameRepository = fullnameRepository;
    }

    /**
     * {@code POST  /fullnames} : Create a new fullname.
     *
     * @param fullname the fullname to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fullname, or with status {@code 400 (Bad Request)} if the fullname has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fullnames")
    public ResponseEntity<Fullname> createFullname(@RequestBody Fullname fullname) throws URISyntaxException {
        log.debug("REST request to save Fullname : {}", fullname);
        if (fullname.getId() != null) {
            throw new BadRequestAlertException("A new fullname cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fullname result = fullnameService.save(fullname);
        return ResponseEntity
            .created(new URI("/api/fullnames/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fullnames/:id} : Updates an existing fullname.
     *
     * @param id the id of the fullname to save.
     * @param fullname the fullname to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fullname,
     * or with status {@code 400 (Bad Request)} if the fullname is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fullname couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fullnames/{id}")
    public ResponseEntity<Fullname> updateFullname(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Fullname fullname
    ) throws URISyntaxException {
        log.debug("REST request to update Fullname : {}, {}", id, fullname);
        if (fullname.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fullname.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fullnameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fullname result = fullnameService.save(fullname);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fullname.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fullnames/:id} : Partial updates given fields of an existing fullname, field will ignore if it is null
     *
     * @param id the id of the fullname to save.
     * @param fullname the fullname to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fullname,
     * or with status {@code 400 (Bad Request)} if the fullname is not valid,
     * or with status {@code 404 (Not Found)} if the fullname is not found,
     * or with status {@code 500 (Internal Server Error)} if the fullname couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fullnames/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Fullname> partialUpdateFullname(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Fullname fullname
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fullname partially : {}, {}", id, fullname);
        if (fullname.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fullname.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fullnameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fullname> result = fullnameService.partialUpdate(fullname);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fullname.getId().toString())
        );
    }

    /**
     * {@code GET  /fullnames} : get all the fullnames.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fullnames in body.
     */
    @GetMapping("/fullnames")
    public ResponseEntity<List<Fullname>> getAllFullnames(Pageable pageable) {
        log.debug("REST request to get a page of Fullnames");
        Page<Fullname> page = fullnameService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fullnames/:id} : get the "id" fullname.
     *
     * @param id the id of the fullname to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fullname, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fullnames/{id}")
    public ResponseEntity<Fullname> getFullname(@PathVariable Long id) {
        log.debug("REST request to get Fullname : {}", id);
        Optional<Fullname> fullname = fullnameService.findOne(id);
        return ResponseUtil.wrapOrNotFound(fullname);
    }

    /**
     * {@code DELETE  /fullnames/:id} : delete the "id" fullname.
     *
     * @param id the id of the fullname to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fullnames/{id}")
    public ResponseEntity<Void> deleteFullname(@PathVariable Long id) {
        log.debug("REST request to delete Fullname : {}", id);
        fullnameService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
