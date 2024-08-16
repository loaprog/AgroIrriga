document.getElementById('calculate-btn').addEventListener('click', function() {
    // Limpa mensagens de erro anteriores
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = '';

    // Captura os valores dos campos de entrada e valida se são números
    const campo1 = parseFloat(document.getElementById('campo1').value.trim());
    const campo2 = parseFloat(document.getElementById('campo2').value.trim());
    const campo3 = parseFloat(document.getElementById('campo3').value.trim());
    const campo4 = parseFloat(document.getElementById('campo4').value.trim());

    // Verifica se todos os campos estão preenchidos e contêm valores numéricos válidos
    if (isNaN(campo1) || isNaN(campo2) || isNaN(campo3) || isNaN(campo4)) {
        errorContainer.textContent = 'Todos os campos devem conter valores numéricos válidos.';
        return;
    }

    // Dados da nova linha
    const rowData = [campo1, campo2, campo3, campo4];

    // Cria uma nova linha na tabela
    let row = document.createElement('tr');

    rowData.forEach(cellData => {
        let cell = document.createElement('td');
        cell.textContent = cellData.toFixed(2); // Formata com duas casas decimais
        row.appendChild(cell);
    });

    // Cria células de ação (Editar/Excluir)
    let actionCell = document.createElement('td');

    // Botão Editar
    let editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-2');
    editButton.addEventListener('click', function() {
        editRow(row, rowData);
    });
    actionCell.appendChild(editButton);

    // Botão Excluir
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteButton.addEventListener('click', function() {
        row.remove();
        updateSummary(); // Atualiza o resumo após a exclusão
    });
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    // Adiciona a linha à tabela existente ou cria uma nova tabela se não existir
    let tableContainer = document.getElementById('table-container');
    let table = tableContainer.querySelector('table');

    if (!table) {
        table = document.createElement('table');
        table.classList.add('table', 'table-bordered');
        tableContainer.appendChild(table);

        // Cabeçalhos da tabela
        let headerRow = document.createElement('tr');
        ['Coluna 1', 'Coluna 2', 'Coluna 3', 'Coluna 4', 'Ações'].forEach(headerText => {
            let header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);

        // Adiciona um corpo à tabela
        let tbody = document.createElement('tbody');
        table.appendChild(tbody);
    }

    table.querySelector('tbody').appendChild(row);

    // Atualiza o resumo
    updateSummary();

    // Limpa os campos de entrada
    document.getElementById('campo1').value = '';
    document.getElementById('campo2').value = '';
    document.getElementById('campo3').value = '';
    document.getElementById('campo4').value = '';
});

function editRow(row, rowData) {
    // Substitui as células atuais por campos de entrada
    row.innerHTML = '';

    rowData.forEach((cellData, index) => {
        let input = document.createElement('input');
        input.type = 'text';
        input.value = cellData;
        input.classList.add('form-control');
        input.oninput = function() {
            // Permite apenas números e pontos decimais
            this.value = this.value.replace(/[^0-9.]/g, '');
        };
        let cell = document.createElement('td');
        cell.appendChild(input);
        row.appendChild(cell);
    });

    // Cria célula de ações para salvar ou cancelar
    let actionCell = document.createElement('td');

    // Botão Salvar
    let saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.classList.add('btn', 'btn-sm', 'btn-success', 'mr-2');
    saveButton.addEventListener('click', function() {
        saveRow(row);
    });
    actionCell.appendChild(saveButton);

    // Botão Cancelar
    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.classList.add('btn', 'btn-sm', 'btn-secondary');
    cancelButton.addEventListener('click', function() {
        cancelEdit(row, rowData);
    });
    actionCell.appendChild(cancelButton);

    row.appendChild(actionCell);
}

function saveRow(row) {
    // Salva os valores editados na linha
    let inputs = row.querySelectorAll('input');
    let newData = [];
    let valid = true;

    inputs.forEach(input => {
        let value = parseFloat(input.value.trim());
        if (isNaN(value)) {
            input.classList.add('is-invalid');
            valid = false;
        } else {
            input.classList.remove('is-invalid');
            newData.push(value);
        }
    });

    if (!valid) {
        return; // Não salva se algum campo estiver vazio ou inválido
    }

    // Atualiza a linha com os novos valores
    row.innerHTML = '';

    newData.forEach(cellData => {
        let cell = document.createElement('td');
        cell.textContent = cellData.toFixed(2); // Formata com duas casas decimais
        row.appendChild(cell);
    });

    // Cria novamente as células de ação
    let actionCell = document.createElement('td');

    // Botão Editar
    let editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-2');
    editButton.addEventListener('click', function() {
        editRow(row, newData);
    });
    actionCell.appendChild(editButton);

    // Botão Excluir
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteButton.addEventListener('click', function() {
        row.remove();
        updateSummary(); // Atualiza o resumo após a exclusão
    });
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    // Atualiza o resumo
    updateSummary();
}

function cancelEdit(row, rowData) {
    // Reverte para os valores anteriores sem salvar as alterações
    row.innerHTML = '';

    rowData.forEach(cellData => {
        let cell = document.createElement('td');
        cell.textContent = cellData.toFixed(2); // Formata com duas casas decimais
        row.appendChild(cell);
    });

    // Cria novamente as células de ação
    let actionCell = document.createElement('td');

    // Botão Editar
    let editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-2');
    editButton.addEventListener('click', function() {
        editRow(row, rowData);
    });
    actionCell.appendChild(editButton);

    // Botão Excluir
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteButton.addEventListener('click', function() {
        row.remove();
        updateSummary(); // Atualiza o resumo após a exclusão
    });
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);
}

function updateSummary() {
    let tableContainer = document.getElementById('table-container');
    let table = tableContainer.querySelector('table');
    
    if (!table) return;

    // Calcula a soma dos valores
    let totalCampo1 = 0;
    let totalCampo2 = 0;
    let totalCampo3 = 0;
    let totalCampo4 = 0;
    let rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        let cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            totalCampo1 += parseFloat(cells[0].textContent) || 0;
            totalCampo2 += parseFloat(cells[1].textContent) || 0;
            totalCampo3 += parseFloat(cells[2].textContent) || 0;
            totalCampo4 += parseFloat(cells[3].textContent) || 0;
        }
    });

    // Remove tabela de resumo existente
    let existingSummaryTable = tableContainer.querySelector('.summary-table');
    if (existingSummaryTable) {
        existingSummaryTable.remove();
    }

    // Remove o texto de resumo existente
    let existingSummaryText = tableContainer.querySelector('.summary-text');
    if (existingSummaryText) {
        existingSummaryText.remove();
    }

    // Adiciona o texto informativo
    let summaryText = document.createElement('h4');
    summaryText.textContent = 'Tabela de Resumo de Irrigação';
    summaryText.classList.add('summary-text');
    tableContainer.appendChild(summaryText);

    // Cria uma nova tabela de resumo
    let summaryTable = document.createElement('table');
    summaryTable.classList.add('table', 'table-bordered', 'mt-4', 'summary-table');
    
    let summaryHeaderRow = document.createElement('tr');
    ['Campo 1', 'Campo 2', 'Campo 3', 'Campo 4', 'Total'].forEach(headerText => {
        let header = document.createElement('th');
        header.textContent = headerText;
        summaryHeaderRow.appendChild(header);
    });
    summaryTable.appendChild(summaryHeaderRow);

    let summaryRow = document.createElement('tr');
    let summaryData = [totalCampo1, totalCampo2, totalCampo3, totalCampo4, totalCampo1 + totalCampo2 + totalCampo3 + totalCampo4];

    summaryData.forEach(data => {
        let cell = document.createElement('td');
        cell.textContent = data.toFixed(2); // Formata com duas casas decimais
        summaryRow.appendChild(cell);
    });

    summaryTable.appendChild(summaryRow);

    tableContainer.appendChild(summaryTable);
}
