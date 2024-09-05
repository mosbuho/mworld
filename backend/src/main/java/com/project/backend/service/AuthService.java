package com.project.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.project.backend.entity.Admin;
import com.project.backend.entity.Member;
import com.project.backend.repository.AdminRepository;
import com.project.backend.repository.MemberRepository;

@Service
public class AuthService {
    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.client-secret}")
    private String googleClientSecret;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-uri}")
    private String naverRedirectUri;

    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(MemberRepository memberRepository, AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Member authenticateMember(String id, String pw) {
        Member member = memberRepository.findMemberById(id);
        if (member != null && passwordEncoder.matches(pw, member.getPw())) {
            return member;
        }
        return null;
    }

    public Admin authenticateAdmin(String id, String pw) {
        Admin admin = adminRepository.findAdminById(id);
        if (admin != null && passwordEncoder.matches(pw, admin.getPw())) {
            return admin;
        }
        return null;
    }

    @Transactional
    public Member socialLoginOrRegister(String provider, Map<String, Object> userInfo) {
        String providerId = (String) userInfo.get("id");

        Member existingMember = memberRepository.findByProviderAndProviderId(provider, providerId);

        if (existingMember != null) {
            return existingMember;
        } else {
            Member newMember = new Member();
            newMember.setId(provider + "_" + providerId);
            newMember.setName((String) userInfo.get("name"));
            newMember.setPw(passwordEncoder.encode("SOCIAL_LOGIN"));

            String phone = (String) userInfo.get("phone");
            if (phone != null) {
                phone = phone.replaceAll("[^0-9]", "");
                if (phone.startsWith("82")) {
                    phone = "0" + phone.substring(2);
                }
            } else {
                phone = "00000000000";
            }
            newMember.setPhone(phone);

            newMember.setAddr((String) userInfo.getOrDefault("addr", "Unknown"));
            newMember.setProvider(provider);
            newMember.setProviderId(providerId);

            return memberRepository.save(newMember);
        }
    }

    public Map<String, Object> getSocialUserInfo(String provider, String code) {
        String tokenUrl = "";
        String userInfoUrl = "";
        Map<String, String> params = new HashMap<>();

        if (provider.equals("kakao")) {
            tokenUrl = "https://kauth.kakao.com/oauth/token";
            userInfoUrl = "https://kapi.kakao.com/v2/user/me";
            params.put("grant_type", "authorization_code");
            params.put("client_id", kakaoClientId);
            params.put("client_secret", kakaoClientSecret);
            params.put("redirect_uri", kakaoRedirectUri);
            params.put("code", code);
        } else if (provider.equals("google")) {
            tokenUrl = "https://oauth2.googleapis.com/token";
            userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
            params.put("client_id", googleClientId);
            params.put("client_secret", googleClientSecret);
            params.put("grant_type", "authorization_code");
            params.put("redirect_uri", googleRedirectUri);
            params.put("code", code);
        } else if (provider.equals("naver")) {
            tokenUrl = "https://nid.naver.com/oauth2.0/token";
            userInfoUrl = "https://openapi.naver.com/v1/nid/me";
            params.put("client_id", naverClientId);
            params.put("client_secret", naverClientSecret);
            params.put("grant_type", "authorization_code");
            params.put("state", "RANDOM_STATE_VALUE");
            params.put("redirect_uri", naverRedirectUri);
            params.put("code", code);
        } else {
            throw new IllegalArgumentException("Unknown provider: " + provider);
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.setAll(params);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
        String accessToken = (String) tokenResponse.getBody().get("access_token");

        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.add("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(userInfoHeaders);

        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
        Map<String, Object> userInfo = new HashMap<>();
        
        if (provider.equals("kakao")) {
            Long id = (Long) userInfoResponse.getBody().get("id");
            String idStr = String.valueOf(id);
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfoResponse.getBody().get("kakao_account");
            Map<String, Object> properties = (Map<String, Object>) userInfoResponse.getBody().get("properties");
            String name = null;
            String phone = null;

            if (kakaoAccount != null && kakaoAccount.get("profile") != null) {
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                name = (String) profile.get("nickname");
            }
            if (name == null && properties != null) {
                name = (String) properties.get("nickname");
            }
            if (name == null) {
                name = "Unknown";
            }
            if (kakaoAccount != null && kakaoAccount.get("phone_number") != null) {
                phone = (String) kakaoAccount.get("phone_number");
            }

            userInfo.put("id", idStr);
            userInfo.put("name", name);
            userInfo.put("email", kakaoAccount != null ? kakaoAccount.get("email") : null);
            userInfo.put("phone", phone);
        } else if (provider.equals("google")) {
            userInfo.put("id", userInfoResponse.getBody().get("id"));
            userInfo.put("name", userInfoResponse.getBody().get("name"));
            userInfo.put("email", userInfoResponse.getBody().get("email"));
        } else if (provider.equals("naver")) {
            Map<String, Object> response = (Map<String, Object>) userInfoResponse.getBody().get("response");
            String id = (String) response.get("id");
            String name = (String) response.get("name");
            String email = (String) response.get("email");
            String phone = (String) response.get("mobile");
            userInfo.put("id", id);
            userInfo.put("name", name);
            userInfo.put("email", email);
            userInfo.put("phone", phone != null ? phone.replaceAll("-", "") : null);
        }

        System.out.println("Final user info: " + userInfo); // 테스트용 log
        return userInfo;
    }

}
