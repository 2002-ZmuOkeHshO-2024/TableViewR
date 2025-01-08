Lyte.Component.register("column-comp", {
_template:"<template tag-name=\"column-comp\"> <span class=\"index2\">{{idx}}</span> <div class=\"column-name2\"> <lyte-input class=\"columnName2\" lt-prop-value=\"{{columnName}}\" lt-prop-appearance=\"box\" lt-prop-direction=\"horizontal\" lt-prop-placeholder=\"Enter column{{idx}} Name \"> </lyte-input> </div> <div class=\"data-type2\"> <lyte-dropdown class=\"datatype-value_{{idx}} datatype2\" lt-prop-options=\"{{yourOption}}\" lt-prop-user-value=\"name\" lt-prop-system-value=\"value\" lt-prop-name=\"{{expHandlers(idx,'-',1)}}\" lt-prop-selected=\"{{dataType}}\" on-option-selected=\"{{method('onOptionSelect',idx)}}\"> </lyte-dropdown> </div> <div class=\"format-string_{{idx}}\"> <lyte-input class=\"dateformat\" lt-prop-value=\"{{dateFormat}}\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"Format used\"> </lyte-input> </div> <div class=\"numeric-length_{{idx}}\"> <lyte-number class=\"length_a_{{idx}} length1\" lt-prop-value=\"{{length1}}\"></lyte-number> <lyte-number class=\"length_b_{{idx}} length2\" lt-prop-value=\"{{length2}}\" before-render=\"{{method('TestbeforeRender',idx)}}\"></lyte-number> </div> </template>",
_dynamicNodes : [{"type":"text","position":[1,0]},{"type":"attr","position":[3,1]},{"type":"componentDynamic","position":[3,1]},{"type":"attr","position":[5,1]},{"type":"componentDynamic","position":[5,1]},{"type":"attr","position":[7]},{"type":"attr","position":[7,1]},{"type":"componentDynamic","position":[7,1]},{"type":"attr","position":[9]},{"type":"attr","position":[9,1]},{"type":"componentDynamic","position":[9,1]},{"type":"attr","position":[9,3]},{"type":"componentDynamic","position":[9,3]}],
_observedAttributes :["yourOption"],








    data: function () {
        return {
            yourOption: Lyte.attr('array', {
                default: [
                    { "name": "TEXT", "value": "VARCHAR" },
                    { "name": "INTEGER", "value": "INT" },
                    { "name": "DECIMAL", "value": "DECIMAL" },
                    { "name": "LONG", "value": "BIGINT" },
                    { "name": "DATE", "value": "DATE" },
                    { "name": "TIME", "value": "TIME" },
                    { "name": "DATETIME", "value": "DATETIME" },
                    { "name": "BOOLEAN", "value": "BOOLEAN" }
                ]
            }),

        }
    },
    actions: {



    },
    methods: {
        onOptionSelect: function (idx, event, currentItem, component) {

            if (component.$node.innerText === 'TEXT') {
                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 255);
                $L('.length_b_' + idx)[0].ltProp('value', -1);



            }
            else if (component.$node.innerText === 'DECIMAL') {

                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 10);
                $L('.length_b_' + idx)[0].ltProp('value', 2);

            }
            else if (component.$node.innerText === 'DATE' || component.$node.innerText === 'TIME' || component.$node.innerText === 'DATETIME') {


                document.querySelector(".format-string_" + idx).style.display = 'inline';
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
                document.querySelector(".format-string_" + idx).style.display = 'none';

            }



            if ($L('.length_a_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:inline');
            }
            console.log("changer");
            if ($L('.length_b_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:inline');
            }

        },
        TestbeforeRender: function (idx) {


            var datatype = $L('lyte-dropdown.datatype-value_' + idx)[0].ltProp('selected');


            if (datatype === 'VARCHAR') {
                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 255);
                $L('.length_b_' + idx)[0].ltProp('value', -1);

            }
            else if (datatype === 'DECIMAL') {

                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 10);
                $L('.length_b_' + idx)[0].ltProp('value', 2);

            }
            else if (datatype === 'DATE' || datatype === 'TIME' || datatype === 'DATETIME') {


                document.querySelector(".format-string_" + idx).style.display = 'inline';
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
                document.querySelector(".format-string_" + idx).style.display = 'none';

            }



            if ($L('.length_a_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:inline');
            }

            if ($L('.length_b_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:inline');
            }
        }
    }
});




