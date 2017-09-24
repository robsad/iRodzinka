package ifamily;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



@EnableJpaRepositories(basePackages = {"ifamily.repository"})
@Import(CustomRepositoryRestMvcConfiguration.class)
@EnableAutoConfiguration
@Configuration
@SpringBootApplication
@EntityScan(basePackages = {"ifamily.entities"})
@ComponentScan({"ifamily.*"})
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	
	
}

