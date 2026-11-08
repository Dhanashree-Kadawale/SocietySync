package com.societysync;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.societysync.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.JsonNode;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureMockMvc
public class SocietySyncApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAuthLogin() throws Exception {
        AuthRequest req = new AuthRequest();
        req.setIdentity("superadmin@societysync.com");
        req.setPassword("SuperAdmin@2026");
        req.setRole("Super Admin");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("superadmin@societysync.com"))
                .andExpect(jsonPath("$.data.role").value("Super Admin"));
    }

    @Test
    void testGetSocieties() throws Exception {
        mockMvc.perform(get("/societies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testGetDashboardStats() throws Exception {
        mockMvc.perform(get("/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalFlats").isNumber());
    }

    @Test
    void testComplaintCrud() throws Exception {
        ComplaintDto dto = new ComplaintDto();
        dto.setSocietyId(1L);
        dto.setTitle("Test Corridor Light Flickering");
        dto.setDescription("Light near A-101 is flickering intermittent.");
        dto.setCategory("Electrical");
        dto.setPriority("HIGH");

        mockMvc.perform(post("/complaints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Test Corridor Light Flickering"));
    }

    @Test
    void testBillingAndPayment() throws Exception {
        MaintenanceBillDto bill = new MaintenanceBillDto();
        bill.setSocietyId(1L);
        bill.setFlatNumber("A-101");
        bill.setBillingMonth("November");
        bill.setBillingYear(2026);
        bill.setBaseAmount(BigDecimal.valueOf(4000));
        bill.setTotalAmount(BigDecimal.valueOf(4500));
        bill.setBillNumber("BILL-TEST-" + System.currentTimeMillis());
        bill.setDueDate(LocalDate.now().plusDays(20));

        String billResponse = mockMvc.perform(post("/bills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bill)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getContentAsString();

        // Extract bill id from JSON response
        Long billId = objectMapper.readTree(billResponse).path("data").path("id").asLong();

        // Pay the bill
        mockMvc.perform(post("/bills/" + billId + "/pay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paymentMethod\":\"UPI\",\"transactionId\":\"TXN-TEST-123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));
    }

    @Test
    void testVisitorCrud() throws Exception {
        String residentsResponse = mockMvc.perform(get("/residents").param("societyId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getContentAsString();
        JsonNode resident = null;
        for (JsonNode candidate : objectMapper.readTree(residentsResponse).path("data")) {
            if (candidate.path("flatNumber").asText().equals("A-101")) {
                resident = candidate;
                break;
            }
        }
        assertNotNull(resident, "The visitor test requires a seeded resident in flat A-101");

        VisitorDto v = new VisitorDto();
        v.setSocietyId(1L);
        v.setFlatNumber("A-101");
        v.setHostResidentId(resident.path("id").asLong());
        v.setName("Sameer Deshmukh");
        v.setPhone("+91 98765 99999");
        v.setPurpose("Guest Visit");
        v.setExpectedVisitAt(LocalDateTime.now().plusDays(1).withNano(0));

        String visitorResponse = mockMvc.perform(post("/visitors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(v)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.expectedVisitAt").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        Long visitorId = objectMapper.readTree(visitorResponse).path("data").path("id").asLong();

        mockMvc.perform(put("/visitors/" + visitorId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CHECKED_IN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CHECKED_IN"));
    }

    @Test
    void testNewUserRegistrationAndLogin() throws Exception {
        long ts = System.currentTimeMillis();
        String uniqueEmail = "newsec" + ts + "@test.com";

        // 1. Register a brand new Secretary & Society
        String regPayload = "{"
                + "\"name\":\"Sunil Sharma\","
                + "\"email\":\"" + uniqueEmail + "\","
                + "\"phone\":\"+91 99999 " + (ts % 100000) + "\","
                + "\"password\":\"SecureSecret@2026\","
                + "\"role\":\"Secretary\","
                + "\"societyName\":\"Harmony Heights Co-op\","
                + "\"societyRegNo\":\"MAH/PUN/" + ts + "\","
                + "\"city\":\"Pune\""
                + "}";

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(regPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(uniqueEmail))
                .andExpect(jsonPath("$.data.role").value("Secretary Admin"));

        // 2. Real-time login with the newly registered user credentials
        String loginPayload = "{"
                + "\"identity\":\"" + uniqueEmail + "\","
                + "\"password\":\"SecureSecret@2026\","
                + "\"role\":\"Secretary Admin\""
                + "}";

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(uniqueEmail))
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }
}
