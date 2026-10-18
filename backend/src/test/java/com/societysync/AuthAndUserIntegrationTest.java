package com.societysync;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.societysync.dto.LoginRequestDto;
import com.societysync.dto.RegisterResidentRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.password=${DB_PASSWORD:root}"
})
class AuthAndUserIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("1. Successful Login returns valid JWT and safe user profile")
    void testLoginSuccess() throws Exception {
        LoginRequestDto request = new LoginRequestDto("superadmin@societysync.com", "SuperAdmin@2026");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("superadmin@societysync.com"))
                .andExpect(jsonPath("$.user.name").value("Dhanashree Kadawale"))
                .andExpect(jsonPath("$.user.roles", hasItem("ROLE_SUPER_ADMIN")))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("2. Login with incorrect password returns 401 Unauthorized")
    void testLoginInvalidPassword() throws Exception {
        LoginRequestDto request = new LoginRequestDto("superadmin@societysync.com", "WrongPassword@999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("3. Resident Registration creates user and returns 201 Created")
    void testRegisterResidentSuccess() throws Exception {
        String uniqueEmail = "resident." + System.currentTimeMillis() + "@example.com";
        RegisterResidentRequestDto request = new RegisterResidentRequestDto();
        request.setFullName("Ananya Deshmukh");
        request.setEmail(uniqueEmail);
        request.setPhone("+91 98888 77777");
        request.setPassword("Resident@2026");
        request.setWing("Tower B");
        request.setFlatNumber("B-202");
        request.setResidentType("Flat Owner");

        mockMvc.perform(post("/api/auth/register/resident")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.name").value("Ananya Deshmukh"))
                .andExpect(jsonPath("$.roles", hasItem("ROLE_RESIDENT")))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("4. Registering with duplicate email returns 409 Conflict")
    void testRegisterDuplicateEmailFails() throws Exception {
        RegisterResidentRequestDto request = new RegisterResidentRequestDto();
        request.setFullName("Duplicate User");
        request.setEmail("priya.sharma@greenwood.com"); // Pre-existing email
        request.setPhone("+91 99999 00000");
        request.setPassword("SomePass@2026");
        request.setFlatNumber("A-101");

        mockMvc.perform(post("/api/auth/register/resident")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    @Test
    @DisplayName("5. Access protected /api/auth/me with Bearer token succeeds")
    void testProtectedMeEndpointWithJwt() throws Exception {
        // First login to acquire token
        LoginRequestDto loginRequest = new LoginRequestDto("secretary@greenwood.com", "Secretary@2026");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("token").asText();

        // Call protected /api/auth/me
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("secretary@greenwood.com"))
                .andExpect(jsonPath("$.name").value("Rajesh Mehta"))
                .andExpect(jsonPath("$.societyName").value("Greenwood Heights Co-op Society"));
    }

    @Test
    @DisplayName("6. Access protected /api/auth/me without token returns 401 Unauthorized")
    void testProtectedMeEndpointWithoutTokenFails() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("7. Non-admin user cannot update user status (403 Forbidden)")
    void testResidentCannotUpdateUserStatus() throws Exception {
        // Login as resident
        LoginRequestDto residentLogin = new LoginRequestDto("priya.sharma@greenwood.com", "Resident@2026");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(residentLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();

        // Attempt to change user status
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/api/users/2/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"SUSPENDED\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("8. Resident cannot access users from another society (403 Forbidden)")
    void testResidentCannotAccessOtherSocietyUsers() throws Exception {
        // Login as resident of Greenwood Heights (societyId = 1)
        LoginRequestDto residentLogin = new LoginRequestDto("priya.sharma@greenwood.com", "Resident@2026");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(residentLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();

        // Attempt to query users for Palm Meadows (societyId = 2)
        mockMvc.perform(get("/api/users/society/2")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message", containsString("outside your housing society")));
    }
}
