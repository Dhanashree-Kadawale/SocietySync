package com.societysync.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final SecretKey key;
    private final long jwtExpirationMs;
    private final String jwtIssuer;

    public JwtTokenProvider(
            @Value("${societysync.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}") String secret,
            @Value("${societysync.jwt.expiration-ms:86400000}") long jwtExpirationMs,
            @Value("${societysync.jwt.issuer:SocietySync-Auth-Server}") String jwtIssuer) {
        this.jwtExpirationMs = jwtExpirationMs;
        this.jwtIssuer = jwtIssuer;

        // Ensure key has adequate bytes for HMAC-SHA256
        SecretKey parsedKey;
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            if (keyBytes.length >= 32) {
                parsedKey = Keys.hmacShaKeyFor(keyBytes);
            } else {
                parsedKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            parsedKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
        this.key = parsedKey;
    }

    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .issuer(jwtIssuer)
                .subject(principal.getUsername())
                .claim("userId", principal.getId())
                .claim("name", principal.getName())
                .claim("roles", roles)
                .claim("societyId", principal.getSocietyId())
                .claim("societyName", principal.getSocietyName())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Object id = claims.get("userId");
        if (id instanceof Number) {
            return ((Number) id).longValue();
        }
        return null;
    }

    public Long getSocietyIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Object sid = claims.get("societyId");
        if (sid instanceof Number) {
            return ((Number) sid).longValue();
        }
        return null;
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public long getExpirationMs() {
        return jwtExpirationMs;
    }
}
