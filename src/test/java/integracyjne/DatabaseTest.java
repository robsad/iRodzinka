package integracyjne;

import static org.junit.Assert.assertEquals;
import ifamily.entities.Grupa;
import ifamily.entities.Lista;
import ifamily.entities.Uzytkownik;

import org.junit.Test;
import org.springframework.boot.test.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;


public class DatabaseTest{

	private RestTemplate restTemplate = new TestRestTemplate();

	@Test
	public void getUzytkownik() {
	    String uzytkownikUrl = "http://localhost:8080/uzytkownik/1";

	    ParameterizedTypeReference<Resource<Uzytkownik>> responseType = new ParameterizedTypeReference<Resource<Uzytkownik>>() {};

	    ResponseEntity<Resource<Uzytkownik>> responseEntity = 
	    		restTemplate.exchange(uzytkownikUrl, HttpMethod.GET, null, responseType);

	    Uzytkownik uzytkownik = responseEntity.getBody().getContent();
	    assertEquals("?", uzytkownik.getImie());
	}
	
	@Test
	public void getLista() {
	    String listaUrl = "http://localhost:8080/lista/2";

	    ParameterizedTypeReference<Resource<Lista>> responseType = new ParameterizedTypeReference<Resource<Lista>>() {};

	    ResponseEntity<Resource<Lista>> responseEntity = 
	    		restTemplate.exchange(listaUrl, HttpMethod.GET, null, responseType);

	    Lista lista = responseEntity.getBody().getContent();
	    assertEquals("2", lista.getIlosc());
	}
	
	@Test
	public void getGrupa() {
	    String grupaUrl = "http://localhost:8080/grupa/1";

	    ParameterizedTypeReference<Resource<Grupa>> responseType = new ParameterizedTypeReference<Resource<Grupa>>() {};

	    ResponseEntity<Resource<Grupa>> responseEntity = 
	    		restTemplate.exchange(grupaUrl, HttpMethod.GET, null, responseType);

	    Grupa grupa = responseEntity.getBody().getContent();
	    assertEquals("?", grupa.getNazwa());
	}
}

