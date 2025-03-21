package org.example.gatewayservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@RequiredArgsConstructor
public class RouteConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("data-service", r -> r
                        .path("/api/data/**")
                        .uri("lb://DATA-SERVICE"))
                .route("openapi", r -> r
                        .path("/v3/api-docs/**")
                        .filters(f -> f.rewritePath("/v3/api-docs/(?<service>.*)", "/${service}/v3/api-docs"))
                        .uri("lb://GATEWAY-SERVICE"))
                .route("swagger", r -> r
                        .path("/swagger-ui/**")
                        .uri("lb://GATEWAY-SERVICE"))
                .build();
    }
}