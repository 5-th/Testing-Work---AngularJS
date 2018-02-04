	angular.module('myApp',[])
    	.controller('MyCtrl', function($scope){
    		$scope.n = 5;
    			$scope.m = 6;
    				$scope.maxMatrixLength = 20; // регулятор размерности матрицы
    					$scope.chance = 0.5;
    						$scope.matrix = [[1,0,0,0,1,0],[1,1,0,0,0,1],[0,0,0,0,0,0],
    											[0,0,0,0,0,1],[0,0,0,0,0,1]]; // начальный массив данных из задания
    							$scope.resultMatrix = [];
    						
    		$scope.setMatrixToDOM = function() {
    			$scope.n = valid($scope.n, '$scope.n');
    				$scope.m = valid($scope.m, '$scope.m');
    					$scope.chance = valid($scope.chance, '$scope.chance');
    			let matrix = [];
    				for (var i = 0; i < $scope.n; i++) {
    				let tr = [];
    					for (var j = 0; j < $scope.m; j++) {
							let number = function() {
								if (Math.random() > $scope.chance) return 0;
								else return 1;
							}
							tr.push(number());
	    				}
	    			matrix[i] = tr;
	   				}
	   			$scope.matrix = matrix;
	   		}

	   		$scope.count = function() { // функция поиска доменов
				$('td.number').css('background-color', '');
				let matrix = getMatrixFromDOM(), chains = [];
				/*
				поиск цепочек по горизонтали
										  */
				for (let i = 0; i < matrix.length; i++) {
					let chain = [];
					for (let j = 0; j < matrix[0].length; j++) {
						if (matrix[i][j] == 1) {
							chain.push(i+','+j);
							if (chain.length > 1 && j == matrix[0].length - 1) {
								chains.push(chain);
								chain = [];	
							}
						} else if (matrix[i][j] == 0){
							if (chain.length > 1) {
								chains.push(chain);
							}
							chain = [];
						}
					}
				}
				/*
				поиск цепочек по вертикали
										*/
				for (let j = 0; j < matrix[0].length; j++) {
					chain = [];
					for (let i = 0; i < matrix.length; i++) {
						if (matrix[i][j] == 1) {
							chain.push(i+','+j);
							if (chain.length > 1 && i == matrix.length - 1) {
								chains.push(chain);
								chain = [];	
							}
						} else if (matrix[i][j] == 0){
							if (chain.length > 1) {
								chains.push(chain);
							}
							chain = [];
						}
					}
				}

				/*
				склеиваем пересекающиеся цепочки
											  */
				for (let i = 0; i <  chains.length - 1; i++) {
					for (let j = 0; j < chains[i].length; j++) {
						for (let k = i+1; k < chains.length; k++) {
							if (chains[k].indexOf(chains[i][j]) != -1) {
								chains[i] = chains[i].concat(chains[k]); //склейка, двойников можно не удалять
								chains.splice(k,1); //удаление младшего
								i = 0; //запускаем снова
							}
						}	
					}
				}

				/*
				красим домены в разный цвет
							     		 */
				for (let i in chains) {
					let color = generateColor();
					for (let j = 0; j < chains[i].length; j++){
						var arr = chains[i][j].split(','); 
						var tdNumber = arr[0] * $scope.m + Number(arr[1]);
						$('td.number').eq(tdNumber).css('background-color', color);
					}
				}

				/*
				заполняем матрицу результатов
											*/
				if ($scope.resultMatrix.length < 10) {
					$scope.resultMatrix.push([$scope.chance, chains.length, $scope.n+String.fromCharCode(215)+$scope.m]);
				} else {
					$scope.resultMatrix.splice(0,1); // чистим массив при переполнении	
					$scope.resultMatrix.push([$scope.chance, chains.length, $scope.n+String.fromCharCode(215)+$scope.m]);
				}
				
					
			} // конец функции поиска доменов



	   	/* 
	   	--- вспомогательные функции модуля ---
	   										*/
	   		
	   		function getMatrixFromDOM() { // получаем матрицу из DOM, так как
	   			let matrix = [], tr = [];	// предусмотрено ее изменение 'руками' после генерации
					$('td.number').each(function() {
						tr.push( $(this).html() );
						if (tr.length == $('input:eq(1)').val()) {
							matrix.push(tr);
							tr = [];	
						}
				});
			return matrix;
	   		}	
    			
    		function valid(num, name) { // проверка валидности
    			if (String(num).indexOf(',') != -1) num = Number(num.replace(/\,/, "."));
    			if (name == '$scope.n' || name == '$scope.m') {
    				num < 0 ? num = 1 : num > $scope.maxMatrixLength ? num = $scope.maxMatrixLength : num;
    				return Math.round(num);
    			} else {
    				num < 0 ? num = 0 : num > 1 ? num = 1 : num;
    				return num;
    			}
    		}

    		function generateColor() { // генерация цвета
 				 return '#' + Math.floor(Math.random() * 16777215).toString(16);
			}

    	}
	);// конец angular модуля


	function myClick(elem) { // мигалка 1/0
		if ($(elem).html() == 0) $(elem).html('1');
		else $(elem).html('0');
	}

