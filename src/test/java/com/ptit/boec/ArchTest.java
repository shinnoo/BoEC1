package com.ptit.boec;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.ptit.boec");

        noClasses()
            .that()
            .resideInAnyPackage("com.ptit.boec.service..")
            .or()
            .resideInAnyPackage("com.ptit.boec.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.ptit.boec.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
