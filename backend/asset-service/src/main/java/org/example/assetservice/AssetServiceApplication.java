package org.example.assetservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AssetServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssetServiceApplication.class, args);
	}

}
