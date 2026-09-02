package vn.edu.crs.courseservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping({"/api/courses", "/courses", "/api/public/courses"})
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createCourse(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Course course) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            String token = authHeader.substring(7).trim();
            String[] chunks = token.split("\\.");

            if (chunks.length >= 2) {
                String payload;
                try {
                    payload = new String(Base64.getUrlDecoder().decode(chunks[1]));
                } catch (Exception e) {
                    payload = new String(Base64.getDecoder().decode(chunks[1]));
                }

                if (!payload.contains("ADMIN")) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Access Denied: Chỉ ADMIN mới có quyền tạo môn học");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi lưu Database: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/reduce-seats")
    public ResponseEntity<?> reduceSeats(@PathVariable Long id) {
        return courseRepository.findById(id).map(course -> {
            if (course.getSoChoConLai() != null && course.getSoChoConLai() > 0) {
                course.setSoChoConLai(course.getSoChoConLai() - 1);
                courseRepository.save(course);
            }
            return ResponseEntity.ok("Đã giảm số chỗ thành công");
        }).orElseGet(() -> ResponseEntity.ok("Đã giảm số chỗ thành công"));
    }

    @PutMapping("/{id}/increase-seats")
    public ResponseEntity<?> increaseSeats(@PathVariable Long id) {
        return courseRepository.findById(id).map(course -> {
            if (course.getSoChoConLai() != null) {
                course.setSoChoConLai(course.getSoChoConLai() + 1);
                courseRepository.save(course);
            }
            return ResponseEntity.ok("Đã tăng số chỗ thành công");
        }).orElseGet(() -> ResponseEntity.ok("Đã tăng số chỗ thành công"));
    }
}