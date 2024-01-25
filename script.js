$("#consultarBtn").click(function () {
    $.ajax({
        url: "https://fakestoreapi.com/products",
        metodo: "GET",
        success: function (response) {
            console.log(response);
            var data = [];
            for (var i = 0; i < response.length; i++) {
                var item = response[i];
                data.push([
                    '<input type="checkbox">',
                    item.id,
                    item.title,
                    item.description,
                    item.price,
                    item.rating.count,
                    '<button class="view-image-btn" data-image-url="' +
                    item.image +
                    '"</i> Ver </button>',
                ]);
            }

            // mostrar imagen
            $(document).on("click", ".view-image-btn", function () {
                var imageUrl = $(this).data("image-url");
                Swal.fire({
                    imageUrl: imageUrl,
                    imageWidth: 400,
                    imageHeight: 400,
                });
            });

            // eliminar
            $("#deleteSelectedBtn").click(function () {
                var dt = $("#productTable").DataTable();
                var selectedRows = dt.$("input:checked", { page: "all" }).closest("tr");

                if (selectedRows.length == 0) {
                    Swal.fire({
                        title: "Error",
                        text: "Primero debes seleccionar un producto",
                        icon: "error",
                        confirmButtonText: "Entendido"
                    });
                    return;
                }

                Swal.fire({
                    title: "¿Estás seguro de que quieres eliminar estas filas?",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "No, cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        selectedRows.each(function () {
                            dt.row($(this)).remove().draw();
                        });
                        Swal.fire("Filas eliminadas", "", "success");
                    }
                });
            });

            // sumar productos
            $("#sumTotalBtn").click(function () {
                var dt = $("#productTable").DataTable();
                var selectedRows = dt.$("input:checked", { page: "all" });

                if (selectedRows.length == 0) {
                    Swal.fire({
                        title: "Error",
                        text: "Primero debes seleccionar un producto",
                        icon: "error",
                        confirmButtonText: "Entendido"
                    });
                    return;
                }

                var total = 0;
                selectedRows.each(function () {
                    var row = dt.row($(this).parents("tr"));
                    var price = parseFloat(row.data()[4]);

                    // Comprobar si el precio es un número válido
                    if (!isNaN(price)) {
                        total += price;
                    } else {
                        console.log("Error: Precio no es un número válido");
                        console.log("Precio: " + price);
                    }
                });
                Swal.fire("El total es: " + total);
            });

            //  dataTable
            $("#productTable").DataTable({
                data: data,
                columns: [
                    { title: "" },
                    { title: "ID" },
                    { title: "Título" },
                    { title: "Descripción" },
                    { title: "Precio" },
                    { title: "Cantidad" },
                    { title: "Imagen" },
                ],
                dom: "Bfrtip",
                buttons: [
                    {
                        extend: "copyHtml5",
                        text: '<i class="fas fa-copy"></i>',
                        titleAttr: "Copiar",
                    },
                    {
                        extend: "pdfHtml5",
                        text: '<i class="fas fa-file-pdf"></i>',
                        titleAttr: "Descargar PDF",
                    },
                    {
                        extend: "print",
                        text: '<i class="fas fa-print"></i>',
                        titleAttr: "Imprimir",
                    }
                ],
            });
        },
        error: function (error) {
            console.error("Error: ", error);
        },
    });
});
