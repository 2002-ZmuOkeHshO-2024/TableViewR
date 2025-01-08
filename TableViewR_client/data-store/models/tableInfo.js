store.registerModel("tableInfo", {


    id: Lyte.attr("number", { primaryKey: true }),
    tableName: Lyte.attr("string"),
    delimiter: Lyte.attr("string"),
    pkColumn: Lyte.attr("number"),
    firstLineRecord: Lyte.attr("boolean"),
    columnCount: Lyte.attr("number"),
    columnNames: Lyte.attr("array"),
    dateFormats: Lyte.attr("array"),
    columnDataTypes: Lyte.attr("array"),
    length1: Lyte.attr("array"),
    length2: Lyte.attr("array")


});