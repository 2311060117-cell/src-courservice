package vn.edu.crs.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.crs.authservice.dto.LoginRequestDTO;
import vn.edu.crs.authservice.dto.LoginResponseDTO;
import vn.edu.crs.authservice.entity.User;
import vn.edu.crs.authservice.repository.UserRepository;
import vn.edu.crs.authservice.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        // Kiểm tra khớp BCrypt HOẶC khớp chuỗi thường (123456)
        boolean isBcryptMatched = passwordEncoder.matches(request.getPassword(), user.getPassword());
        boolean isPlainMatched = request.getPassword().equals(user.getPassword());

        if (!isBcryptMatched && !isPlainMatched) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());

        return new LoginResponseDTO(token, user.getUsername(), user.getRole(), user.getId());
    }
}