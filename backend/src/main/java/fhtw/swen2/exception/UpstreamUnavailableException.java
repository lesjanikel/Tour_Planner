package fhtw.swen2.exception;

public class UpstreamUnavailableException extends RuntimeException {
    public UpstreamUnavailableException(String message) {
        super(message);
    }
}