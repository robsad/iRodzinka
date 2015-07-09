apka.controller('FamilyController', function($scope,$http,$filter,$q) {
 
	$scope.listaStyle = function (lista) {
		var style = {
				'color':(lista.stan=='kupione'?'darkgray':'white'),
				'border-style':((lista.kiedy<$scope.today)?'dashed':'solid')
				}	
		return style;
	};
	
	$scope.kategoriaStyle = function (lista) {
		var style = {
				'background-color': $scope.kategorie.kolory[lista.kategoria],
				}	
		return style;
	};
	
	$scope.parseDate = function (s) {
	    var tokens = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
	    return tokens && new Date(tokens[1], tokens[2] - 1, tokens[3]);
	};

     //date format
    $scope.formatDate = function (date) {
        return $filter("date")(date, 'yyyy-MM-dd');
      }; 
   
    function parseDate(input) {
  		var parts = input.match(/(\d+)/g);
  		// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  		return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
	}
 
 	function odczyt_listy(irodzina, od) {
 	date = parseDate(od);
   	date.setDate(date.getDate() - 1);
    od = $scope.formatDate(date);
    $http.get("http://localhost:8080/lista/search/findByGrupa_NazwaAndKiedyAfter?grupa=" + irodzina + "&od=" + od )
    .then(function(data) {
        var zakupy = data.data._embedded.lista;
        var TasksArray = [];
        angular.forEach(zakupy,function(i) { TasksArray.push($http.get(i._links.uzytkownik.href)); });
        $scope.zakupy = zakupy;
        return $q.all(TasksArray)  //$http.get(userURL)
    	})
    .then(function(arrayOfResults) {
        for(var i=0;i<arrayOfResults.length;i++) {
            $scope.zakupy[i].imie = arrayOfResults[i].data.imie;
        	}
        });
    }
 
 	function init() {
		$scope.selectedUser = 'all';
  	  	$scope.selectedUserIndex  = 'all';
  	  	$scope.stepPast = 7;
    	$scope.users = [];
   	 	$scope.usersNames = [];
   	 	$scope.zakupy = [];
    	$http.defaults.headers.post["Content-Type"] = "application/json";
    	var date = new Date();  
    	$scope.today = $scope.formatDate(date);
    	$scope.dateStart = $scope.today;
    	$scope.kategorie = ["inne","pieczywo","owoce_warzywa","spożywcze","mrożonki","AGD","chemia","odzież"];
    	$scope.kategorieW = angular.copy($scope.kategorie);
    	$scope.kategorieW.splice(0, 0, "wszystkie");
    	$scope.selectedKate = "wszystkie";
    	$scope.kategorie.kolory = { 
    		inne:null,
    		pieczywo:"brown",
    		owoce_warzywa:"green",
    		spożywcze:"yellow",
    		mrożonki:"blue",
    		AGD:"black",
    		chemia:"pink",
    		odzież:"white"
    		};
    	}
 
 
 	function odczyt_userow() {
    $http.get("http://localhost:8080/uzytkownik/search/findByGrupa_Nazwa?grupa="+irodzina).success(function (data)
            { $scope.users = data._embedded.uzytkownik;    
            	var userAny = { id:"?", imie:"?" };
            	$scope.users.push(userAny);
                for(var i=0;i<$scope.users.length;i++) { $scope.usersNames[i] = $scope.users[i].imie; }
               }).error(function(error)
            { alert("Problem z odczytem uzytkownikow"); });
    }
 
 	function odczyt_family() {
 	    $http.get("http://localhost:8080/grupa/search/findByNazwa?nazwa="+irodzina).success(function (data)
 	            { $scope.id = data._embedded.grupa[0].id; }).error(function(error)
 	            { alert("Problem z odczytem ID grupy"); });
 	}
 	
    
    $scope.showPast = function() {
    	var date = parseDate($scope.dateStart);
    	date.setDate(date.getDate() - $scope.stepPast);
    	$scope.dateStart = $scope.formatDate(date);
    	odczyt_listy ($scope.irodzina, $scope.dateStart);
    };
    
    $scope.selectUser = function(user,$index) {
    	if (user=='all') {
    		$scope.selectedUser = 'all'
    		$scope.selectedUserIndex = 'all';
    		}
    	else {
    	$scope.selectedUser = user.imie;
    	$scope.selectedUserIndex = $index;
    	}
    };

    
    $scope.filterFunction = function(input) {
    		if ((($scope.Check.kup)&&(input.stan == 'kupione'))||
    		((input.imie != $scope.selectedUser)&&($scope.selectedUser != "all"))||
    		((input.kategoria != $scope.selectedKate)&&($scope.selectedKate != "wszystkie"))) return false;
    		else return true;
    	};
  
  
    $scope.edycjaOkno = function(item)
    	{
    	$scope.panelEdit = !$scope.panelEdit;
    	if (item!=null) {
    		var index = $scope.zakupy.indexOf(item);
    		$scope.zakupy.index = index;
    		$scope.edycja = angular.copy($scope.zakupy[index]);
    		$scope.edycja.imie = $scope.users[$scope.usersNames.indexOf($scope.zakupy[index].imie)];
    	}
    	else {
    		$scope.edycja = null;
    		$scope.zakupy.index = null;
    		$scope.edycja = { imie: $scope.users[$scope.usersNames.indexOf("?")],
    						  kiedy: $scope.today,
    						  kategoria: "inne"
    						 };
    	}
    	};


    $scope.cofnij = function()
		{
    	$scope.panelEdit = !$scope.panelEdit;
    	$scope.edycja = null;
		};
    
    
    $scope.zapisz = function()
		{
		if (typeof $scope.edycja.opis == 'undefined') return;
    	$scope.panelEdit = !$scope.panelEdit;
    	var imieIndex = $scope.usersNames.indexOf($scope.edycja.imie.imie);
    	if ($scope.zakupy.index != null) {
    		var index = $scope.zakupy.index;
    		$scope.zakupy[index] = angular.copy($scope.edycja);
    		$scope.zakupy[index].imie = $scope.users[imieIndex].imie;
        	if ($scope.edycja.imie.imie != "?") {
    			$scope.zakupy[index].uzytkownik = "http://localhost:8080/uzytkownik/"+$scope.users[imieIndex].id;
    			} else {
    			$scope.zakupy[index].uzytkownik = "http://localhost:8080/uzytkownik/1";
    			}
    		$http.put("http://localhost:8080/lista/"+$scope.zakupy[index].id,$scope.zakupy[index]).success(function (data)
        		{
        		console.log("Zmieniono zakup id:" + $scope.zakupy[index].id)
        		}).error(function(error)
        	    {
                alert("Problem z zmianą statusu");
                });
    		$scope.edycja = null;
    		}
    	else {
    		$scope.edycja.stan = "kup";
    		$scope.edycja.grupa = "http://localhost:8080/grupa/" + $scope.id;
        	if ($scope.edycja.imie.imie != "?") {
    			$scope.edycja.uzytkownik = "http://localhost:8080/uzytkownik/"+$scope.users[imieIndex].id;
    			} else {
    			$scope.edycja.uzytkownik = "http://localhost:8080/uzytkownik/1";
    			}
    		if (typeof $scope.edycja.ilosc == 'undefined') $scope.edycja.ilosc=" ";
    		$http.post("http://localhost:8080/lista",$scope.edycja).success(function(callback)
            		{
    				$scope.edycja.imie = $scope.edycja.imie.imie;
    				$scope.edycja.id = callback.id;
    				$scope.zakupy.push($scope.edycja);
            		}).error(function(error)
            	    {
                    alert("Błąd dodania zakupu");
                    });
    		}
		};
    
    
    $scope.stan = function(item)
    {
    	var index = $scope.zakupy.indexOf(item);
    	if ($scope.zakupy[index].stan == "kup") $scope.zakupy[index].stan="kupione"; 
    		else $scope.zakupy[index].stan="kup";;
    	$http.put("http://localhost:8080/lista/"+$scope.zakupy[index].id,$scope.zakupy[index]).success(function (data)
    		{
    		console.log("Zmieniono status w id:" + $scope.zakupy[index].id)
    		}).error(function(error)
    	    {
            alert("Problem z zmianą statusu", data);
            });
    };

    
    $scope.usun = function(item)
    	{
    	var index = $scope.zakupy.indexOf(item);
    	$http.delete("http://localhost:8080/lista/"+$scope.zakupy[index].id).success(function (data)
    			{
    			console.log("Usunięto pozycję");
    			}).error(function(error)
    			{
    			alert("Problem z usunięciem pozycji");
    			});
    	$scope.zakupy.splice(index, 1);
    	};


	$scope.deleteUser = function()
    	{
    	if (($scope.selectedUserIndex>=0)&&($scope.selectedUserIndex<$scope.users.length-1)) 
    		{
    		$scope.users[$scope.selectedUserIndex].grupa = "http://localhost:8080/grupa/1";
    		$http.put("http://localhost:8080/uzytkownik/"+$scope.users[$scope.selectedUserIndex].id,$scope.users[$scope.selectedUserIndex]).success(function (data)
    			{
    			alert("Usunięto użytkownika !");
    			$scope.users.splice($scope.selectedUserIndex, 1);
    			}).error(function(error)
    	    	{
            	alert("Problem z edycją użytkownika");
            	});
    		}
    	};


	$scope.addUser = function(decision)
    	{
    	if ((decision)&&($scope.newUser.imie != null)) {
    		$scope.newUser.grupa = "http://localhost:8080/grupa/"+$scope.id;
    		$http.post("http://localhost:8080/uzytkownik",$scope.newUser).success(function (data)
    			{
    			alert("Dodano użytkownika !");
				odczyt_userow ();
				$scope.panelUser = !$scope.panelUser;
    			}).error(function(error)
    	    	{
            	alert("Problem z dodaniem użytkownika");
            	});
    		}
    	if (!(decision)) $scope.panelUser = !$scope.panelUser;
    	};
    	
    	
    $scope.addUserWindow = function() {
    	$scope.newUser = null;
    	$scope.panelUser = !$scope.panelUser;
    	}
    	
    
    $scope.logOff = function() {
    	$scope.panelLogin = !$scope.panelLogin;
    	$scope.panelMain = !$scope.panelMain;
        irodzina = null;
        $scope.irodzina = null;
        $scope.users = null;
        $scope.zakupy = null;
    	}
    
    $scope.login = function() {
    	$http.get("http://localhost:8080/grupa/search/findByNazwa?nazwa="+$scope.family.login).success(function (response) { 
			if (typeof response._embedded == 'undefined') alert ("Nie ma takiej rodziny"); 
				else { 
				if ($scope.family.pass != response._embedded.grupa[0].pass) alert ("Niewłaściwe hasło"); 
					else {
						irodzina = $scope.family.login
    					$scope.irodzina = irodzina;
    					init();
        				odczyt_family();
        				odczyt_listy ($scope.irodzina, $scope.dateStart);
        				odczyt_userow ();
    					$scope.panelLogin = !$scope.panelLogin; 
    					}
    			}
		}).error(function(error)
 		{ alert("Problem z odczytem ID grupy"); });
    	}
    	
    	

 
	$scope.logOff();
    	
});