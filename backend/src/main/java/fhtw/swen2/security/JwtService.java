package fhtw.swen2.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import fhtw.swen2.config.JwtProperties;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final long expirationMillis;

    public JwtService(JwtProperties props) {
        this.algorithm = Algorithm.HMAC256(props.secret());
        this.verifier = JWT.require(algorithm).build();
        this.expirationMillis = props.expirationMinutes() * 60_000;
    }

    public String generateToken(String username) {
        Instant now = Instant.now();
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plusMillis(expirationMillis)))
                .sign(algorithm);
    }

    public String extractUsername(String token) throws JWTVerificationException {
        DecodedJWT decoded = verifier.verify(token);
        return decoded.getSubject();
    }
}