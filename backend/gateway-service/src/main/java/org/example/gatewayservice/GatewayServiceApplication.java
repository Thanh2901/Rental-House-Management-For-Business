package org.example.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);

    }

    @Bean
    public static RouteLocator getRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("data-route", r -> r.path("/data/**")
                        .filters(f -> f.stripPrefix(1)
                                .circuitBreaker(c -> c.setName("CircuitBeaker")
                                        .getFallbackUri()))
                        .uri("lb://data-service"))
                .route("fee-service", r -> r.path("/fee/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://fee-service"))
                .route("finance-service", r -> r.path("/finance/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://finance-service"))
                .route("asset-service", r -> r.path("/asset/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://asset-service"))
                .build();
    }

}
