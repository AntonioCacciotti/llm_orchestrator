package com.catoritech.player.resource;

import com.catoritech.player.dto.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.stream.Collectors;

public class ExceptionMappers {

    @Provider
    public static class BadRequestMapper implements ExceptionMapper<BadRequestException> {
        @Override
        public Response toResponse(BadRequestException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(400, "Bad Request", e.getMessage()))
                    .build();
        }
    }

    @Provider
    public static class NotAuthorizedMapper implements ExceptionMapper<NotAuthorizedException> {
        @Override
        public Response toResponse(NotAuthorizedException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse(401, "Unauthorized", e.getMessage()))
                    .build();
        }
    }

    @Provider
    public static class NotFoundMapper implements ExceptionMapper<NotFoundException> {
        @Override
        public Response toResponse(NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(404, "Not Found", e.getMessage()))
                    .build();
        }
    }

    @Provider
    public static class ValidationMapper implements ExceptionMapper<ConstraintViolationException> {
        @Override
        public Response toResponse(ConstraintViolationException e) {
            String message = e.getConstraintViolations().stream()
                    .map(v -> v.getPropertyPath().toString().replaceFirst(".*\\.", "") + ": " + v.getMessage())
                    .collect(Collectors.joining(", "));
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(400, "Validation Failed", message))
                    .build();
        }
    }
}
