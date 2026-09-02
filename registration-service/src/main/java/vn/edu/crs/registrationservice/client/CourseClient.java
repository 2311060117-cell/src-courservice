package vn.edu.crs.registrationservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class CourseClient {

    private final RestTemplate restTemplate;

    public CourseClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void reduceSeats(Long courseId) {
        // Gọi thông qua API Gateway (cổng 8080) để đảm bảo điều hướng chính xác
        String url = "http://localhost:8080/api/courses/" + courseId + "/reduce-seats";
        restTemplate.put(url, null);
    }
}