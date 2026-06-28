package fhtw.swen2.exception;

// Thrown when ORS rejects a route request as uncomputable (e.g. distance exceeds its limit).
// The input is well-formed, so this is a 422, not a 4xx-as-our-fault or a 503.
public class InvalidRouteException extends RuntimeException {
    public InvalidRouteException(String message) {
        super(message);
    }
}
