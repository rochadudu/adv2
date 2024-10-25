async function consultarAdvogados() {
    const nome = document.getElementById('nome').value;
    const oab = document.getElementById('oab').value;

    const queryParams = new URLSearchParams();
    if (nome) queryParams.append('nome', nome);
    if (oab) queryParams.append('oab', oab);

    // Faz a requisição para a rota de consulta
    const response = await fetch(`/consultar-advogados?${queryParams.toString()}`);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
        console.error('Erro ao consultar os advogados:', response.statusText);
        return;
    }

    const advogados = await response.json();
    console.log('Advogados retornados:', advogados); // Verifica os dados retornados
    const tabelaResultados = document.getElementById('resultadoConsulta');
    const tbody = tabelaResultados.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de adicionar resultados

    if (advogados.length > 0) {
        tabelaResultados.style.display = 'table';
        advogados.forEach(advogado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${advogado.oab}</td>
                <td>${advogado.nome}</td>
                <td>${advogado.processo || '-'}</td>        
            `;
            tbody.appendChild(row);
        });
    } else {
        tabelaResultados.style.display = 'none';
        alert('Nenhum advogado encontrado com os critérios informados.');
    }
}

async function cadastrarAdvogado() {
    const oab = document.getElementById('oab').value;
    const nome = document.getElementById('nome').value;

    await fetch('/cadastrar-advogado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oab, nome })
    });

    alert('Advogado cadastrado com sucesso!');
}

async function buscarAdvogado() {
    const buscaAdvogado = document.getElementById('buscaAdvogado').value;

    if (buscaAdvogado === '') return;

    const response = await fetch(`/buscar-advogado?query=${buscaAdvogado}`);

    if (response.ok) {
        const advogados = await response.json();

        const advogadoSelecionado = document.getElementById('advogadoSelecionado');
        advogadoSelecionado.innerHTML = '<option value="">Selecione um advogado</option>';

        advogados.forEach(advogado => {
            const option = document.createElement('option');
            option.value = advogado.oab;
            option.textContent = `${advogado.nome} (OAB: ${advogado.oab})`;
            advogadoSelecionado.appendChild(option);
        });

    } else {
        alert('Erro ao buscar advogados. Tente novamente.');
    }
}

async function cadastrarNota() {
    const oabAdvogado = document.getElementById('advogadoSelecionado').value;
    const materia = document.getElementById('materia').value;
    const nota = document.getElementById('nota').value;

    if (!oabAdvogado) {
        alert('Por favor, selecione um advogado.');
        return;
    }

    await fetch('/cadastrar-nota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oabAdvogado, materia, nota })
    });

    alert('Nota cadastrada com sucesso!');
}
