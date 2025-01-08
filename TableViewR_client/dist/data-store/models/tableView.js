store.registerModel("tableView", {

    id: Lyte.attr("number", { primaryKey: true }),
    currentQuery: Lyte.attr("string"),
    totalPages: Lyte.attr("number"),
    currentPage: Lyte.attr('number'),
    contentJSON: Lyte.attr('array'),
    headerJSON: Lyte.attr('array')

});
