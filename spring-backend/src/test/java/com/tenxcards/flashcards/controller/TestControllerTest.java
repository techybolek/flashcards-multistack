package com.tenxcards.flashcards.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class TestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testRunIntegrationTestEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/integration"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("OK"))
                .andExpect(jsonPath("$.message").value("Integration test endpoint reached successfully."));
    }

    @Test
    void testCreateTestGenerationEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/create-generation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("OK"))
                .andExpect(jsonPath("$.message").value("Test generation created successfully."));
    }
}
