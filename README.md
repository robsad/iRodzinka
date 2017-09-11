# iRodzinka

REST application made with SpringBoot, AngularJS, mySQL

![App view](http://robertsadlowski.pl/app/iFamily/3.jpg)


You must setup your mySQL database:

CREATE DATABASE zakupy;

USE zakupy;
CREATE TABLE grupa
(
   id INT NOT NULL AUTO_INCREMENT,
   nazwa VARCHAR(100) NOT NULL,
   utworzona TIMESTAMP DEFAULT 0,
   zmodyfikowana TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   pass VARCHAR(100) NOT NULL,
   PRIMARY KEY ( id )
);
   
   CREATE TABLE uzytkownik
   (
	id INT NOT NULL AUTO_INCREMENT,
	imie VARCHAR(100) NOT NULL,
	grupa_id INT,
	PRIMARY KEY ( id ),
	FOREIGN KEY (grupa_id) REFERENCES grupa(id)
   );

CREATE TABLE lista
(
	id INT NOT NULL auto_increment,
    opis VARCHAR(100) NOT NULL,
    ilosc VARCHAR(10) NOT NULL,
    kiedy DATE NOT NULL,
    stan VARCHAR(10) NOT NULL,
	kategoria VARCHAR(10) NOT NULL,
    uzytkownik_id INT,
    grupa_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownik(id),
    FOREIGN KEY (grupa_id) REFERENCES grupa(id)
);


INSERT INTO grupa (nazwa, utworzona, pass) VALUES ('?', current_timestamp(), 'admin');
INSERT INTO grupa (nazwa, utworzona, pass) VALUES ('grupa1', current_timestamp(), 'pass1');
INSERT INTO grupa (nazwa, utworzona, pass) VALUES ('grupa2', current_timestamp(), 'pass2');

INSERT INTO UZYTKOWNIK (imie, grupa_id) VALUES ('?', 1);
INSERT INTO UZYTKOWNIK (imie, grupa_id) VALUES ('Robert', 2);
INSERT INTO UZYTKOWNIK (imie, grupa_id) VALUES ('Monika', 2);
INSERT INTO UZYTKOWNIK (imie, grupa_id) VALUES ('Ernest', 3);

INSERT INTO lista (opis, ilosc, kiedy, stan, kategoria, uzytkownik_id, grupa_id) VALUES ('pieluszki Pampers rozmiar 4+', '25', '2015-05-20', 'kup', 'inne', 2, 2);
INSERT INTO lista (opis, ilosc, kiedy, stan, kategoria, uzytkownik_id, grupa_id) VALUES ('mleko UHT 2%', '2', '2015-05-22', 'kup', 'inne', 2, 2, 6);
INSERT INTO lista (opis, ilosc, kiedy, stan, kategoria, uzytkownik_id, grupa_id) VALUES ('Jablka (jakieś zielone)', '4', '2015-05-19', 'kup', 'inne', 3, 2);
INSERT INTO lista (opis, ilosc, kiedy, stan, kategoria, uzytkownik_id, grupa_id) VALUES ('Ser 300g', '1', '2015-05-23', 'kup', 'inne', 3, 2);
INSERT INTO lista (opis, ilosc, kiedy, stan, kategoria, uzytkownik_id, grupa_id) VALUES ('Serek Wiejski', '1', '2015-05-21', 'kup', 'inne', 1, 2);



