document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const uploadButton = document.getElementById("upload-button");
    const generateButton = document.getElementById("generate-button");
    const columnList = document.getElementById("column-list");

    let selectedColumns = [];

    uploadButton.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                
                // Get column names from the first row
                const range = XLSX.utils.decode_range(sheet['!ref']);
                selectedColumns = [];
                for (let c = range.s.c; c <= range.e.c; ++c) {
                    const columnHeader = sheet[XLSX.utils.encode_cell({ r: 0, c })].v;
                    selectedColumns.push(columnHeader);
                }

                columnList.innerHTML = "";
                selectedColumns.forEach(column => {
                    const label = document.createElement("label");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.name = "columns";
                    checkbox.value = column;
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(column));
                    columnList.appendChild(label);
                });

                generateButton.style.display = "block";
            };
            reader.readAsBinaryString(file);
        }
    });

    generateButton.addEventListener("click", function () {
        const selectedColumnValues = selectedColumns.filter(column => document.querySelector(`input[value="${column}"]`).checked);
        if (selectedColumnValues.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Extract selected columns' indices
                const selectedColumnIndices = selectedColumns
                    .map((column, index) => selectedColumnValues.includes(column) ? index : -1)
                    .filter(index => index !== -1);

                // Create a new worksheet with selected columns
                const newSheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
                    .map(row => selectedColumnIndices.map(index => row[index]));

                // Create a new workbook and add the new sheet
                const newWorkbook = XLSX.utils.book_new();
                const newSheet = XLSX.utils.aoa_to_sheet(newSheetData);
                XLSX.utils.book_append_sheet(newWorkbook, newSheet, sheetName);

                // Save the new workbook
                const newFileName = "selected_columns.xlsx";
                XLSX.writeFile(newWorkbook, newFileName);
            };
            reader.readAsBinaryString(file);
        }
    });
});
