Lyte.Component.register("column-comp", {







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




