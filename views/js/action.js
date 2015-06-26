$(".action").on("click", function(event) {
    var token1 = event.target.id.split("---")[0];
    var token2 = event.target.id.split("---")[1];
    $.ajax({
        type: "POST",
        url: "/action",
        data: {
            description: token1,
            id: token2,
            field: (token1 == "active" || token1 == "deactive") ? "Active" : "Admin",
            action: (token1 == "active" || token1 == "setAsAdmin") ? "true" : "false",
            delete: (token1 == "delete")
        },
        dataType: "json",
        success: function(data) {
            location.reload();
        }
    });
});