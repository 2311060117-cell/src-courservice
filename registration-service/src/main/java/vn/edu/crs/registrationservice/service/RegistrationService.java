package vn.edu.crs.registrationservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.crs.registrationservice.client.CourseClient;
import vn.edu.crs.registrationservice.dto.RegistrationRequestDTO;
import vn.edu.crs.registrationservice.model.Registration;
import vn.edu.crs.registrationservice.repository.RegistrationRepository;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final CourseClient courseClient;

    public RegistrationService(RegistrationRepository registrationRepository, CourseClient courseClient) {
        this.registrationRepository = registrationRepository;
        this.courseClient = courseClient;
    }

    @Transactional
    public Registration registerCourse(RegistrationRequestDTO dto) {
        Long studentId = dto.getStudentId();
        Long courseId = dto.getCourseId();

        // 1. Kiểm tra nếu sinh viên đã đăng ký rồi
        if (registrationRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Sinh viên đã đăng ký môn học này rồi");
        }

        // 2. Gọi sang course-service để giảm số chỗ
        courseClient.reduceSeats(courseId);

        // 3. Lưu bản ghi đăng ký mới
        Registration registration = new Registration();
        registration.setStudentId(studentId);
        registration.setCourseId(courseId);
        return registrationRepository.save(registration);
    }

    @Transactional
    public void cancelRegistration(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi đăng ký"));

        // Xóa bản ghi đăng ký
        registrationRepository.delete(registration);
    }
}