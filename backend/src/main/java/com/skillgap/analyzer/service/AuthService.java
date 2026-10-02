package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.AuthResponse;
import com.skillgap.analyzer.dto.LoginRequest;
import com.skillgap.analyzer.dto.RegisterRequest;
import com.skillgap.analyzer.entity.JobRole;
import com.skillgap.analyzer.entity.Role;
import com.skillgap.analyzer.entity.StudentProfile;
import com.skillgap.analyzer.entity.User;
import com.skillgap.analyzer.exception.BadRequestException;
import com.skillgap.analyzer.repository.JobRoleRepository;
import com.skillgap.analyzer.repository.StudentProfileRepository;
import com.skillgap.analyzer.repository.UserRepository;
import com.skillgap.analyzer.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final JobRoleRepository jobRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentProfileRepository profileRepository,
                       JobRoleRepository jobRoleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists!");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_STUDENT);
        user = userRepository.save(user);

        StudentProfile profile = new StudentProfile(user);
        profile.setCollege(request.getCollege());
        profile.setDegree(request.getDegree());
        profile.setGraduationYear(request.getGraduationYear());

        Long targetRoleId = null;
        String targetRoleTitle = null;

        if (request.getTargetRoleId() != null) {
            JobRole jobRole = jobRoleRepository.findById(request.getTargetRoleId()).orElse(null);
            if (jobRole != null) {
                profile.setTargetRole(jobRole);
                targetRoleId = jobRole.getId();
                targetRoleTitle = jobRole.getTitle();
            }
        }
        profileRepository.save(profile);

        // Authenticate & generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                targetRoleId,
                targetRoleTitle
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found with email: " + request.getEmail()));

        Long targetRoleId = null;
        String targetRoleTitle = null;

        if (user.getRole() == Role.ROLE_STUDENT) {
            StudentProfile profile = profileRepository.findByUser(user).orElse(null);
            if (profile != null && profile.getTargetRole() != null) {
                targetRoleId = profile.getTargetRole().getId();
                targetRoleTitle = profile.getTargetRole().getTitle();
            }
        }

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                targetRoleId,
                targetRoleTitle
        );
    }
}
