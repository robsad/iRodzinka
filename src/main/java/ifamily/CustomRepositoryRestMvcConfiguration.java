package ifamily;

import ifamily.entities.Grupa;
import ifamily.entities.Lista;
import ifamily.entities.Uzytkownik;

import org.springframework.boot.autoconfigure.data.rest.SpringBootRepositoryRestMvcConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

@Configuration
public class CustomRepositoryRestMvcConfiguration extends SpringBootRepositoryRestMvcConfiguration {

 
  @Override
  protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
	config.setReturnBodyOnCreate(true);
    config.exposeIdsFor(Lista.class, Grupa.class, Uzytkownik.class);
  }
}