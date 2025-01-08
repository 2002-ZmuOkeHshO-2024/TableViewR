(function( $L ) {
		var $JSON= {};
		var $jUtils={};
		var nextStar = false;
		$JSON.pathFinder = function(scope , path ){
			if(path){
				var Json = scope;
				if(typeof scope == "object"){
					nextStar = false;
					return $jUtils.parsePath(scope,path)
				}
			}
			else{
				console.error("path not defined")
			}
		}
		$jUtils.parsePath = function(scope,path){
			if(path.includes(".")){
				path=path.replaceAll(" ","");
				var pathArr =path.split(".")
				if(pathArr[0] == "$"){
					pathArr.splice(0,1)
				}
			}
			return $jUtils.GetData(scope,pathArr)
		}
		$jUtils.GetData = function(scope,path,DeepTraverse){
			if(DeepTraverse){
				var arr =[];
				if(Array.isArray(scope)){
					path.splice(0,1);
					for(var i_deep=0; i_deep<scope.length ; i_deep++){
						var value = $jUtils.deepBranches(scope[i_deep],path,DeepTraverse)
						if(Array.isArray(value) && value.length ==0){
							value = undefined;
						}
						if(value){
							arr.push(value)
						}
					}
					return arr;
				}
			}
			else{
				return $jUtils.deepBranches(scope,path,DeepTraverse)
			}
		}
		$jUtils.deepBranches = function(obj,path,DeepTraverse){
			for(var pathIndex =0 ; pathIndex<path.length; pathIndex ++){
				var key = path[pathIndex];
				var nextKey = path[pathIndex+1],_nextKey;
				if(nextKey){
					_nextKey = $jUtils.keyParser(nextKey);
				}
				if(key.includes("[") && key.includes("]")){
					var utilScope = key.match(/\[([^\]]+)\]/g)[0]
					var utilKey = key.match(/^(.+?)\[/g)
					if(utilKey){
						utilKey=utilKey[0].replaceAll("[","");
					}
					if(!Array.isArray(obj) && utilKey){
						obj = obj[utilKey];
					}
					obj = (!Array.isArray(obj) && utilScope) ? undefined : obj;
					if(Array.isArray(obj)){
						if(utilScope && !utilScope.includes("@")){
							if(utilScope.includes(":")){
								utilScope = utilScope.replaceAll("[","").replaceAll("]","");
								var slice = utilScope.split(":");
								var start = slice[0]==""?undefined:parseInt(slice[0]);
								var end = slice[1]==""?undefined:parseInt(slice[1]);
								obj = obj.slice(start,end)
							}
							else if(utilScope.includes("*")){
								if(utilKey && nextStar){
									obj = $jUtils.getArrayData(obj,utilKey,nextKey?true:false);
								}
								nextStar = true;
							}
							else if(utilScope){
								var key = utilScope.match(/\[(.*?)\]/)[1]
								obj = obj[key]
							}
						}
					}
				}
				else if(key == ""){
					if(_nextKey == undefined){
						console.error("Path string should not end with the  '..' ")
					}
					obj = $jUtils.GetAllKeys(obj,_nextKey)
					if(path.length-1 != pathIndex){
						if(Array.isArray(obj)){
							DeepTraverse =1;
							var utilScope = nextKey.match(/\[([^\]]+)\]/g)
							path.splice(0,pathIndex+1)
							if(utilScope!=null){
								utilScope = utilScope[0];
								utilScope = utilScope.match(/\[(.*?)\]/)[1]
								obj = $jUtils.separateArray(obj,utilScope);
							}
							if(path.length>1){
								obj = $jUtils.GetData(obj,path,DeepTraverse)
								break;
							}
						}
					}
					if(!nextKey.includes("[") && !nextKey.includes("]")){
						pathIndex++;
					}
				}
				else if(key == "*"){
					nextStar = true;
					continue;
				}
				else{
					if((path[pathIndex-1] && (path[pathIndex-1] == "*" || path[pathIndex-1].includes("*"))) || nextStar){
						if(Array.isArray(obj)){
							var newArray=[];
							var ind=0;
							var toStringKey = parseInt(key)
							for(var arr_index = 0; arr_index<obj.length; arr_index++){
								if(!Array.isArray(obj[arr_index]) && isNaN(toStringKey)){
									newArray[ind] = obj[arr_index][key];
									ind++;
								}
								else if(Array.isArray(obj[arr_index]) && !isNaN(toStringKey)){
									newArray[ind] = obj[arr_index][key];
									ind++;
								}
							}
							obj=newArray;
						}
						else if (typeof obj == "object"){
							obj = obj[key]
						}
					}
					else{
						obj = obj[key]?obj[key]:undefined;
					}
				}

			}
			return obj
		}
		$jUtils.keyParser = function(key){
			if(key.includes("[") && key.includes("]")){
				var utilScope = key.match(/\[([^\]]+)\]/g)[0]
				var utilKey = key.match(/^(.+?)\[/g) 
				if(utilKey){
					utilKey=utilKey[0].replaceAll("[","");
					return utilKey;
				}
			}
			return key;
		}
		$jUtils.GetAllKeys = function(scope,key){
			var arr= []; 
			$jUtils.getRecurssive(scope,key,arr);
			return arr
		}
		$jUtils.getRecurssive=function(scope,key,arr){
			if(typeof scope == "object"){
				for(var v in scope){
					if(v == key){
						arr.push(scope[key])
					}
					if(typeof scope[v] == "object"){
						$jUtils.getRecurssive(scope[v],key,arr)
					}
				}
			}
			else if(Array.isArray(scope)){
				for( var index = 0 ; index<scope.length ; index++ ){
					var obj = scope[index];
					$jUtils.getRecurssive(obj,key,arr);
				}
			}
		}
		$jUtils.separateArray = function(scope,index){
			var Arr =[];
			nextStar = true
			for (var i=0; i< scope.length; i++){
				if(scope[i][index]){
					Arr.push(scope[i][index]);
				}
			}
			return Arr;
		}
		$jUtils.getArrayData = function(obj , key , separateArray){
			if(Array.isArray(obj)){
				var newArray=[];
				var ind=0;
				for(var arr_index = 0; arr_index<obj.length; arr_index++){
					if(obj[arr_index][key]){
						if(Array.isArray(obj[arr_index][key]) && separateArray){
							obj[arr_index][key].forEach(function(value){
								newArray.push(value);
								ind++;
							})
						}
						else{
							newArray[ind] = obj[arr_index][key];
							ind++;
						}
					}
				}
				obj=newArray;
			}
			return obj;
		}
		$L.Jwalk = $JSON.pathFinder;
	})($L)
