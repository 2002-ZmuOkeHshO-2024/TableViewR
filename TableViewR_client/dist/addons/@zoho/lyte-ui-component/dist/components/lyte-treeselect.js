_lytedropTreeClass =0;
_lytedropdownClass =0;

Lyte.Component.register("lyte-treeselect", {
_template:"<template tag-name=\"lyte-treeselect\"> <lyte-dropdown class=\"{{dropclass}}\" lt-prop-selected=\"{{ltPropSelected}}\" lt-prop-type=\"{{ltPropType}}\" lt-prop-disable=\"{{ltPropDisable}}\" lt-prop-placeholder=\"{{ltPropPlaceholder}}\" lt-prop-selected-list=\"{{ltPropSelectedList}}\" lt-prop=\"{{stringify(ltPropDropdown)}}\" on-option-selected=\"{{method('OnOptionSelected')}}\" on-add=\"{{method('onSelect')}}\" on-remove=\"{{method('onRemove')}}\" on-before-remove=\"{{method('onBeforeRemove')}}\" on-before-add=\"{{method('onSelectBefore')}}\" on-before-show=\"{{method('beforeTreeRender')}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <template is=\"if\" value=\"{{ltPropButtonYield}}\"><template case=\"true\"><lyte-yield yield-name=\"yield\"></lyte-yield></template><template case=\"false\"><lyte-drop-button> <template is=\"if\" value=\"{{placeholder}}\"><template case=\"true\"><span class=\"lyteDropPlaceholderNormal lyteDroptreePlaceholder\">Select</span></template><template case=\"false\"><span class=\"lyteDropdownLabel\"> <template is=\"if\" value=\"{{expHandlers(ltPropType,'!=',&quot;multiple&quot;)}}\"><template case=\"true\"> {{ltPropSelected}} </template><template case=\"false\"> {{multiselelct}} </template></template> </span></template></template> <lyte-icon class=\"dropdown\"></lyte-icon> </lyte-drop-button></template></template> <lyte-drop-box class=\"lyteTreeSelectDropbox\"> <template is=\"if\" value=\"{{expHandlers(ltPropSearch,'==',true)}}\"><template case=\"true\"> <lyte-search lt-prop-component=\"tree\" lt-prop-query-selector=\"{{serachQuerySelector}}\"> </lyte-search> </template></template> <lyte-drop-body> <lyte-tree class=\"{{treeClass}}\" lt-prop-data=\"{{ltPropOptions}}\" lt-prop-open-class=\"{{ltPropOpenClass}}\" lt-prop-close-class=\"{{ltPropCloseClass}}\" lt-prop-sortable=\"{{ltpropSortable}}\" lt-prop-scrollspeed=\"{{ltPropScrollSpeed}}\" lt-prop-structure=\"horizontal\" lt-prop=\"{{stringify(ltPropTree)}}\" closetree=\"{{action('closeTree')}}\" on-toggle=\"{{method('onToggleTree')}}\"> <template is=\"registerYield\" yield-name=\"content\"> <lyte-tree-content> <lyte-tree-icon lyte-custom-icon=\"true\"> <div class=\"collapseBox\"> <div class=\"arrow\"> </div> </div> </lyte-tree-icon> <lyte-drop-item data-value=\"{{listValue.systemValue}}\" item-value=\"{{listValue[ltPropParentValue]}}\" list-index=\"{{listIndex}}\" class=\"lyteTreeDropItem\"> <template is=\"if\" value=\"{{expHandlers(ltPropCheck,'==',true)}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropDropYield}}\"><template case=\"true\"><lyte-checkbox lt-prop=\"{{stringify(ltPropCheckobx)}}\" lt-prop-name=\"checkbox\" class=\"treeItems\" lt-prop-calss=\"checkWithBox\" on-unchecked=\"{{method('uncheck')}}\" dropid=\"{{_lyteDropdownItemId}}\"> </lyte-checkbox></template><template case=\"false\"><lyte-checkbox lt-prop=\"{{stringify(ltPropCheckbox)}}\" lt-prop-name=\"checkbox\" class=\"treeItems\" lt-prop-calss=\"checkWithBox\" on-unchecked=\"{{method('uncheck')}}\" dropid=\"{{_lyteDropdownItemId}}\" lt-prop-label=\"{{listValue[ltPropParentValue]}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-yield yield-name=\"content\"></lyte-yield> </template> </lyte-checkbox></template></template> </template><template case=\"false\"> <template is=\"if\" value=\"{{expHandlers(ltPropDropYield,'==',true)}}\"><template case=\"true\"> <lyte-yield yield-name=\"content\"></lyte-yield> </template><template case=\"false\"> {{listValue[ltPropParentValue]}} </template></template> </template></template> </lyte-drop-item> </lyte-tree-content> </template> </lyte-tree> </lyte-drop-body> </lyte-drop-box> </template> </lyte-dropdown> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[]},"false":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[0,3]},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[3,1]},{"type":"if","position":[3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3,3,1]},{"type":"registerYield","position":[3,3,1,1],"dynamicNodes":[{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,3,1]},{"type":"if","position":[1,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"componentDynamic","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"insertYield","position":[1]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3,3,1]},{"type":"componentDynamic","position":[3,3]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropOptions","ltPropType","ltPropShow","ltPropFreeze","ltPropDisable","ltPropMaxCount","ltPropDisplayValue","ltPropBoxClass","ltPropIsOpen","ltPropFixPositionOnOpen","ltPropPlaceholder","ltPropSearch","ltPropSelected","ltPropOpenClass","ltPropCloseClass","ltPropSortable","ltpropMultiSelect","ltPropCheck","selectedDropItems","selectedDropIds","selectedItemsPath","ltPropSelectedList","ltPropParentValue","ltPropChildrenValue","ltPropDisplayPath","ltPropYield","serachQuerySelector","treeClass","ltPropCloseTree","dropclass","ltPropDisableList","ltPropButtonYield","ltPropDropYield","disable_List","ltPropDropdown","ltPropCheckbox","ltPropTree","ltPropSearchQuery"],

    init : function() {
      if(this.getData("ltPropCheck") == true){
        this.setData("ltPropType","multiple");
      }
      this.setData("treeClass","lyteTreeClass"+_lytedropTreeClass)
      this.setData("dropclass","lyteDropClass"+_lytedropdownClass)
      if(this.getData("ltPropSearch") && this.getData("ltPropCheck") && !this.getData("ltPropDropYield")){
        var search_obj = {"search":"lyte-checkbox.treeItems .lyteCheckbox .lyteCheckBoxDefault", "target":".lyteTreeBodyDiv"};
        search_obj.scope = "lyte-tree."+this.getData("treeClass");
        this.setData("serachQuerySelector",JSON.stringify(search_obj));
      }else{
        if(this.getData("ltPropSearchQuery")){
          var _Sdt = JSON.stringify(this.getData("ltPropSearchQuery"))
          this.setData("serachQuerySelector",_Sdt)
        }
      }
      //tree configurations 
      this.$node.setRecurssive = function(object,key,value,childKey,type){
        if(!object[childKey]){
          return;
        }
        else{
          for(var i =0; i<object[childKey].length; i++){
            if(type == "default"){
              Lyte.Component.set(object[childKey],key,value);
              if(object[childKey][i][childKey]){
                this.setRecurssive(object[childKey][i],key,value,childKey,"default");
              }
            }
            else if(type == "dynamic"){
              if(!object[childKey][i].hasOwnProperty(key)){
                Lyte.Component.set(object[childKey][i],key,value)
              }
              this.setRecurssive(object[childKey],key,value,childKey,"dynamic")
            }
          }
        }
      }
      if(this.getData("ltPropHideChildren")){
        for(var i =0; i<this.data.ltPropOptions.length; i++){
          if(!this.data.ltPropOptions[i].hasOwnProperty("defaultState")){
            Lyte.Component.set(this.data.ltPropOptions[i],"defaultState",true)
          }
          this.$node.setRecurssive(this.data.ltPropOptions[i],"defaultState",true,this.getData("ltPropChildrenValue"),"dynamic")
        }
      }
      // find path 
      this.$node.pathTraverse = function(data,path,pathobj,haschildren,Tthis){
        var parent = this.getData("ltPropParentValue"),child = this.getData("ltPropChildrenValue");
        if(!data || path ==""){
          return pathobj;
        }
        if(path[0]!=" " && path[0]!=""){
         return  pathobj+=data[path[0]][parent]+" / "+this.pathTraverse(data[path[0]][child]?data[path[0]][child]:undefined,path.substring(1),pathobj,haschildren);
        }
      }
      //parent -> child traverse
      this.$node.forwardTraverse = function(lyteYiled,nextElement,data,bool,type){
        var drop_item = $L(nextElement).find("LYTE-DROP-ITEM");
        if(nextElement.tagName == "LYTE-TREE"){
          for (var i=0 ;i<drop_item.length; i++){
            var _node = drop_item[i];
            var path = _node.getAttribute("list-index");
            path=path?path.replaceAll(" ",""):path;
            var treeJson = this.getData("ltPropOptions");
            var p = this.pathTraverse(treeJson,path,"");
            var selectedPath= p.slice(0,-2);
            if(type == 0){
              if(bool){
                _node.setAttribute("selected",true);
                // _node.classList.add('lyteDropdownSelection');
                _node.classList.add('lyteDropdownActive');
                Lyte.arrayUtils(this.getData("selectedItemsPath"),"push",selectedPath);
                var _obj = {
                  drop_id : _node.getAttribute("id"),
                  drop_item: _node.getAttribute("item-value"),
                  index : this.getData('selectedDropItems').length-1
                }
                Lyte.objectUtils(this.getData('selectedDropIds'),"add",_node.getAttribute("id"),_obj)
              }
              else{
                _node.removeAttribute("selected");
                _node.classList.remove('lyteDropdownActive');
                // _node.classList.remove('lyteDropdownSelection');
                if(this.getData("selectedItemsPath").includes(selectedPath)){
                  Lyte.arrayUtils(this.getData("selectedItemsPath"),"removeObjects",selectedPath);
                }
                var _d = this.getData('selectedDropIds'),_id = _node.getAttribute("id");
                if(_d[_id]){
                  Lyte.objectUtils(this.getData("selectedDropIds"),"delete",_id)
                }
              }
              $L(_node).find("LYTE-CHECKBOX")[0].setData("ltPropChecked",bool);
            }
            if(type==1){
              var _obj = {
                id : drop_item.getAttribute("id"),
                Sys_value : drop_item.getAttribute("data-value"),
                Act_value : drop_item.getAttribute("item-value")
              }
              Lyte.objectUtils(this.getData("disable_list"),"add",drop_item.getAttribute("id"),_obj)
            }

          }
        }
      }
      //child  ->  parent traverse
      this.$node.backwardTravese=function(parent,bool,type){
        var sibling = parent.nextElementSibling,t_bool=false,i=0,
        parent_bool = $L(parent).find("LYTE-CHECKBOX")[0].getData("ltPropChecked");
        if(sibling.tagName == "LYTE-TREE"){
          var checkBox =$L(sibling).find("LYTE-CHECKBOX");
          while(t_bool != true && i < checkBox.length){
            if(!bool){
              if(checkBox[i].component.getData("ltPropChecked") != parent_bool){
                $L(parent).find("LYTE-CHECKBOX")[0].setData("ltPropChecked",bool)
                $L(parent).find("LYTE-DROP-ITEM")[0].classList.remove("lyteDropdownActive");
                var _node = $L(parent).find("LYTE-DROP-ITEM")[0]
                var path = _node.getAttribute("list-index");
                path=path?path.replaceAll(" ",""):path;
                var treeJson = this.getData("ltPropOptions");
                var p = this.pathTraverse(treeJson,path,"");
                var selectedPath= p.slice(0,-2);
                t_bool = true;
                if(this.getData("selectedItemsPath").includes(selectedPath)){
                  Lyte.arrayUtils(this.getData("selectedItemsPath"),"removeObjects",selectedPath);
                }
                var _d = this.getData('selectedDropIds'),_id = _node.getAttribute("id");
                if(_d[_id]){
                  var _t = _d[_id]
                  Lyte.objectUtils(this.getData("selectedDropIds"),"delete",_id)
                }
              }
            }
            else{
              if(checkBox[i].component.getData("ltPropChecked")!=bool){
                t_bool =true;
                break;
              }
            }
            i++;
          }
          if(!t_bool && bool){
            $L(parent).find("LYTE-CHECKBOX")[0].setData("ltPropChecked",bool)
            // $L(parent).find("LYTE-DROP-ITEM")[0].classList.add("lyteDropdownActive");
            var _node = $L(parent).find("LYTE-DROP-ITEM")[0];
            var _obj = {
              drop_id : _node.getAttribute("id"),
              drop_item: _node.getAttribute("item-value"),
              index : this.getData('selectedDropItems').length-1
            }
            Lyte.objectUtils(this.getData('selectedDropIds'),"add",_node.getAttribute("id"),_obj)
          }
          parentYield = _lyteDropdown.traverse(parent,["LYTE-TREE"]).previousElementSibling
          if(parentYield){
            this.backwardTravese(parentYield,bool,type);
          }
        }
        else{
          return
        }
        var drop_item = $L(parent).find("LYTE-DROP-ITEM")[0];
        var check = $L(drop_item).find("LYTE-CHECKBOX");
      }
      //dispaly items
      this.$node.dropDispaly = function(){
        if(this.getData("selectedItemsPath").length ==0 && Object.keys(this.getData("selectedDropIds")).length ==0){
          this.setData("placeholder",true);
          return
        }
        else if(this.getData("ltPropDisplayPath")){
          var str="";
          var d_ = this.getData("selectedItemsPath");
          d_.forEach(function(val){
            str+=(str.length==0?"":" , ")+val;
          })
          this.setData("placeholder",false);
          this.setData("multiselelct",str)
        } else{
          var str="";
          var d_ = this.getData("selectedDropIds");
            for(var _v in d_){
              str+=(str.length==0?"":" , ")+d_[_v].drop_item;
          }
          this.setData("placeholder",false);
          this.setData("multiselelct",str)
        }
      }
    },
  didConnect: function(){
    if(this.getData("ltPropselected") || this.getData("ltPropSelectedList").length ==0 ){
      this.setData("placeholder",true);
    }
    var drop_node = $L(this.$node).find("lyte-dropdown")[0];
    var def =[];
    if(this.getData("ltPropType")=="multiple"){
      def = this.getData("ltPropSelectedList")
    }
    else{
      this.getData("ltPropSelected")?def[0]=this.getData("ltPropSelected"):undefined;
    }
    if(def){
      if(Array.isArray(def)){
        var drop_node = $L(this.$node).find("lyte-dropdown")[0];
        var drop_item = $L(drop_node).find("lyte-drop-item"),_node;
        if(def.length!=0){
          for(var i =0; i<def.length; i++){
            _node = drop_node.querySelector("[data-value="+def[i]);
            if(this.getData("ltPropType" )!= "multiple" && this.getMethods("OnOptionSelected") && _node){
              this.executeMethod("OnOptionSelected","script",def[i],undefined,_node);
            }
            else if(this.getData("ltPropType")=="multiple"){
              $L(_node).find("LYTE-CHECKBOX")[0].setData("ltPropChecked",true);
              if(this.getMethods("onSelect") && _node){
                this.executeMethod("onSelect","script",def[i],undefined,drop_node.component,_node);
              } 
            }
          }
        }
      }
    }
    _lytedropTreeClass++;
    _lytedropdownClass++;
  },

//disable-list
  setDisableClass: function(){
    var drop_node = $L(this.$node).find("LYTE-DROPDOWN")[0]
    var drop_box = $L(drop_node).find("lyte-drop-box")[0];
    var di_L = this.getData("ltPropDisableList");
    var disable = this.getData("disable_List");
    for(var di_ = 0; di_<di_L.length; di_++){
      var _node = drop_box.querySelector("[data-value="+di_L[di_])
      if(_node){
        var _yield = _lyteDropdown.traverse(_node,["LYTE-YIELD"])
        var nextElement = _yield.nextElementSibling;
        if(nextElement && nextElement.tagName == "LYTE-TREE"){
          var drop_items = $L(nextElement).find("LYTE-DROP-ITEM");
          for(var di_1=0; di_1<drop_items.length; di_1++){
            var dt_value = drop_items[di_1].getAttribute("data-value")
            Lyte.arrayUtils(disable,"push",dt_value);
          }
        }
      }
    }
    Lyte.arrayUtils(disable,"push",di_L);
    var drop_items =  $L(drop_node).find("lyte-drop-item");
    for(var di_2 = 0; di_2<drop_items.length; di_2++){
      var _node = drop_items[di_2];
      var dt_value = _node.getAttribute("data-value");
      if(disable.includes(dt_value)){
        _node.setAttribute("class","lyteDropdown-disabled");
        _node.setAttribute("disabled",true);
        if(this.getData("ltPropCheck")){
          $L(_node).find("LYTE-CHECKBOX")[0].setData("ltPropDisabled",true);
        }
      }
      else{
        if(_node.getAttribute("disabled")){
          _node.removeAttribute("disabled");
          _node.classList.remove("lyteDropdown-disabled")
          if(this.getData("ltPropCheck")){
            $L(_node).find("LYTE-CHECKBOX")[0].setData("ltPropDisabled",false);
          }
        }
      }
    }
  }.observes("ltPropDisableList.[]").on("didConnect"),

  exposeChildren:function(data,_yield,event,selectedDataSV,selectedItems,self,node,dthis){
    if(data.children){
      this.$node.forwardTraverse(_yield,_lyteDropdown.traverse(node,["LYTE-YIELD"]).nextElementSibling,data,true,0);
    }
    parentYield = _lyteDropdown.traverse(_yield,["LYTE-TREE"]).previousElementSibling
    if(parentYield){
      this.$node.backwardTravese(parentYield,true,"select");
    }
    var selectedData = dthis.getData("ltPropSelectedList");
    if(selectedData.length!=0){
      selectedData.forEach(function(val){
        Lyte.arrayUtils(selectedItems,"push",val.value)
      })
    }
    this.$node.dropDispaly()
    if(this.getMethods("onAdd")){
      this.executeMethod("onAdd",event,selectedDataSV,selectedItems,self,node)
    }
    console.log(this.getData("selectedItemsPath"))
  },

	data : function(){
		return {
      //dropdown APIs
      ltPropOptions : Lyte.attr('array'),

      ltPropType : Lyte.attr("string",{default: "default"}),

      ltPropShow : Lyte.attr("boolean",{default: true}),

      ltPropFreeze: Lyte.attr("object"),

      ltPropDisable: Lyte.attr("boolean",{default: false}),

      ltPropMaxCount : Lyte.attr("number",{default:100}),

      ltPropDisplayValue : Lyte.attr("string"),

      ltPropBoxClass : Lyte.attr("string"),

      ltPropIsOpen : Lyte.attr("boolean"),

      ltPropFixPositionOnOpen : Lyte.attr("boolean"),

      ltPropPlaceholder : Lyte.attr("string",{default:"select a value"}),

      ltPropSearch : Lyte.attr("boolean"),

      ltPropSelected : Lyte.attr("string"),
      // lyte-tree APIs
      ltPropOpenClass : Lyte.attr("string",{default:"open"}),

      ltPropCloseClass : Lyte.attr("string",{default:"close"}),

      ltPropSortable : Lyte.attr("boolean",{default:false}),
      //multiselect-dropdown APIs
      ltpropMultiSelect: Lyte.attr("boolean",{default:true}),
      //dropDownTree APIS
      ltPropCheck : Lyte.attr("boolean"),

      selectedDropItems : Lyte.attr("array",{default:[]}),

      selectedDropIds : Lyte.attr("object",{default:{}}),

      selectedItemsPath : Lyte.attr("array",{default:[]}),

      ltPropSelectedList :Lyte.attr("array",{default:[]}),

      ltPropParentValue: Lyte.attr("string",{default:"Name"}),

      ltPropChildrenValue: Lyte.attr("string",{default:"children"}),

      ltPropDisplayPath : Lyte.attr("boolean"),

      ltPropYield : Lyte.attr("boolean"),

      serachQuerySelector : Lyte.attr("string"),

      treeClass : Lyte.attr("string",{default:"dropClass"}),

      ltPropCloseTree : Lyte.attr("boolean",{default:false}),

      dropclass : Lyte.attr("string"),

      ltPropDisableList : Lyte.attr("array",{default:[]}),

      ltPropSelectedList : Lyte.attr("array",{default:[]}),

      ltPropSelected : Lyte.attr("string"),

      ltPropButtonYield : Lyte.attr("boolean",{default:false}),

      ltPropDropYield : Lyte.attr("boolean",{default:false}),

      disable_List : Lyte.attr("array",{default:[]}),

      ltPropDropdown : Lyte.attr("object",{default:{}}),

      ltPropCheckbox : Lyte.attr("object",{default:{}}),

      ltPropTree : Lyte.attr("object",{default:{}}),

      ltPropSearchQuery : Lyte.attr("object")

		}		
	},
	actions : {
    // handle the collapsed   
	},
	methods : {
        //on Before show -> return in promise
        beforeTreeRender : function(event,dthis){
          if(this.getMethods("onBeforeShow")){
            return this.executeMethod("onBeforeShow",event,this);
          }
        },
        onToggleTree : function(event){
          if(this.getMethods("onToggleTreeIcon")){
            return this.executeMethod("onToggleTreeIcon")
          }
        },
        //for the single selection
        OnOptionSelected : function(event,selectedSV,cmp,node){
          var selectedPath,haschildren,selected = node.getAttribute("item-value");
          if(this.getData("previousSelect")){
            var preSelected_node = $L("#" + (this.getData("previousSelect")))[0]
            preSelected_node.classList.remove("lyteTreeSelectSelected")
          }
          this.setData("previousSelect",node.getAttribute("id"))
          node.classList.add("lyteTreeSelectSelected");
          var data =  _lyteDropdown.traverse(node,["LYTE-YIELD"]).component.data.listValue;
          haschildren = data.hasOwnProperty(this.getData("ltPropChildrenValue"))?data[this.getData("ltPropChildrenValue")]:undefined
          var path = node.getAttribute("list-index");
          path=path?path.replaceAll(" ",""):path;
          var treeJson = this.getData("ltPropOptions");
          var p = this.$node.pathTraverse(treeJson,path,"",haschildren)
          selectedPath= p.slice(0,-2)
          this.setData("placeholder",false);
          if(this.getData("ltPropDisplayPath")){
            this.setData("ltPropSelected",selectedPath);
          }
          else{
            this.setData("ltPropSelected",selected);
          }
          if(this.getMethods("onOptionSelect")){
            this.executeMethod("onOptionSelect",event,selectedSV,selected,selectedPath,haschildren,node)
          }
        },
        // for multiple select
        onSelect : function(event,selectedDataSV,slectedArray,dthis,node){
          var data = _lyteDropdown.traverse(node,["LYTE-YIELD"]).component.data.listValue;
          var self = this,selectedItems=[];
          var _yield = _lyteDropdown.traverse(node,["LYTE-YIELD"]);
          if($L(node).find("LYTE-CHECKBOX")){
            $L(node).find("LYTE-CHECKBOX")[0].setData("ltPropChecked",true)
          }
          var selectedData = node.getAttribute("item-value");
          var path = node.getAttribute("list-index");
          path=path?path.replaceAll(" ",""):path;
          var treeJson = this.getData("ltPropOptions");
          var p = this.$node.pathTraverse(treeJson,path,"");
          var selectedPath= p.slice(0,-2);
          Lyte.arrayUtils(this.getData("selectedItemsPath"),"push",selectedPath);
          Lyte.arrayUtils(this.getData('selectedDropItems'),"push",selectedData)
          var _obj = {
            drop_id : node.getAttribute("id"),
            drop_item: selectedData,
            index : this.getData('selectedDropItems').length-1
          }
          Lyte.objectUtils(this.getData('selectedDropIds'),"add",node.getAttribute("id"),_obj)
          if(this.getMethods("onToggleTreeIcon")){
            var result = this.executeMethod("onToggleTreeIcon")
          }
          if(result instanceof Promise){
            if(result && result.then){
              result.then(function(arg){
                this.exposeChildren(data,_yield,event,selectedDataSV,selectedItems,this,node,dthis)
              })
              .catch(function(err){
                console.error(err)
              })
            }
          }
          else{
            this.exposeChildren(data,_yield,event,selectedDataSV,selectedItems,this,node,dthis)
          }
        },
        // for multiple unselect
        uncheck: function(input,cthis,event,eventName,){
          if(eventName == "click"){
            if(event && event.stopPropagation){
              event.stopPropagation();
            }
            var node = _lyteDropdown.traverse(input,["LYTE-CHECKBOX"])
            var data = _lyteDropdown.traverse(node.parentElement,["LYTE-YIELD"]).component.data.listValue;
            var _yield = _lyteDropdown.traverse(node,["LYTE-YIELD"]);
            var _node = node.parentElement;
            var path = _node.getAttribute("list-index");
            path=path?path.replaceAll(" ",""):path;
            var treeJson = this.getData("ltPropOptions");
            var p = this.$node.pathTraverse(treeJson,path,"");
            var selectedPath= p.slice(0,-2);
            t_bool = true;
            if(this.getData("selectedItemsPath").includes(selectedPath)){
              Lyte.arrayUtils(this.getData("selectedItemsPath"),"removeObjects",selectedPath);
            }
            var _d = this.getData('selectedDropIds'),_id = _node.getAttribute("id");
            if(_d[_id]){
              var _t = _d[_id]
              Lyte.arrayUtils(this.getData("selectedDropItems"),"removeAt",_t.index,1)
              Lyte.objectUtils(this.getData("selectedDropIds"),"delete",_id)
            }
            if(data.children){
              var _yield =_lyteDropdown.traverse(node,["LYTE-YIELD"]);
              this.$node.forwardTraverse(_yield,_lyteDropdown.traverse(node,["LYTE-YIELD"]).nextElementSibling,data,false,0);
            }
            parentYield = _lyteDropdown.traverse(_yield,["LYTE-TREE"]).previousElementSibling
            if(parentYield){
              this.$node.backwardTravese(parentYield,false);
            }
            this.$node.dropDispaly();
            if(this.getMethods("onRemove")){
              this.executeMethod("onRemove",event,)
            }
          }
        },
        onSelectBefore : function(event,selectedSV,selectedArray,dthis,node){
          if(event.target.tagName == "LYTE-DROP-ITEM"){
            if(this.getData("ltPropCheck")){
              if($L(node).find("LYTE-CHECKBOX")[0].getData("ltPropChecked")){
                $L(node).find("LYTE-CHECKBOX")[0].click();
                return false;
              }
            }
          }
          var selectedData = node.getAttribute("item-value");
          if(this.getMethods("onBeforeAdd")){
            this.executeMethod("onBeforeAdd",event,selectedSV,selectedData,this,node)
          }
        }
	}
});

