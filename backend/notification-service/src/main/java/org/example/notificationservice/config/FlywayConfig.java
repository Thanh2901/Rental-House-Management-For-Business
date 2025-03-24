package org.example.notificationservice.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {
    @Value("${spring.flyway.locations}")
    private String[] locations;

    @Value("${spring.datasource.url}")
    private String dataSourceUrl;

    @Value("${spring.datasource.username}")
    private String dataSourceUserName;

    @Value("${spring.datasource.password}")
    private String dataSourcePassword;

    @Bean
    public Flyway flyway() {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource())
                .locations(locations)
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .load();
        flyway.migrate();
        System.out.println("migrating...");
        return flyway;
    }

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(dataSourceUrl);
        dataSource.setUsername(dataSourceUserName);
        dataSource.setPassword(dataSourcePassword);
        return dataSource;
    }
}
