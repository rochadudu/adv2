// Função para cadastrar cliente
async function cadastrarCliente() {
    const nome = document.getElementById('nomeCliente').value;
    const cpf = document.getElementById('cpfCliente').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const endereco = document.getElementById('enderecoCliente').value;
    

    try {
        const response = await fetch('/cadastrar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpf, dataNascimento, endereco })
        });

        if (!response.ok) throw new Error('Erro ao cadastrar cliente');

        alert('Cliente cadastrado com sucesso!');
        document.getElementById('formCadastroCliente').reset();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar cliente');
    }
}


// Função para cadastrar profissional
async function cadastrarProfissional() {
    const nome = document.getElementById('nomeProfissional').value;
    const cpf = document.getElementById('cpfProfissional').value;
    const oab = document.getElementById('oabProfissional').value;
    const nascimentoProfissional = document.getElementById('nascimentoProfissional').value;
    const enderecoProfissional = document.getElementById('enderecoProfissional').value;
    

    await fetch('/cadastrar-profissional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, oab, nascimentoProfissional, enderecoProfissional }) 
    });
    alert('Profissional Cadastrado');
}



// Função para cadastrar agendamento
async function cadastrarAgendamento() {
    const data = document.getElementById('dataConsulta').value;
    const horario = document.getElementById('horarioAgendamento').value;
    const sala = document.getElementById('salaAgendamento').value;
    const cpf_cliente = document.getElementById('cpfClienteConsulta').value;
    const cpf_profissional = document.getElementById('cpfProfissionalConsulta').value;


    await fetch('/cadastrar-agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, horario, sala, cpf_cliente, cpf_profissional })
    });
    alert('Agendamento Cadastrado');
    consultarAgendamentos(new Event('submit')); // Atualiza a lista após o cadastro
}

// Função para consultar agendamentos
async function consultarAgendamentos(event) {
    event.preventDefault(); // Previne o envio do formulário
   
    const cpfCliente = document.getElementById("cpfClienteConsulta").value;
    const cpfProfissional = document.getElementById("cpfProfissionalConsulta").value;
    const data = document.getElementById("dataConsulta").value;
    const horario = document.getElementById("horarioAgendamento").value;
    const sala = document.getElementById("salaAgendamento").value;



    const tabelaAgendamentos = document.getElementById("tabelaAgendamentos").querySelector("tbody");
    tabelaAgendamentos.innerHTML = ""; // Limpa resultados anteriores

    const params = new URLSearchParams({
        cpf_cliente: cpfCliente,
        cpf_profissional: cpfProfissional,
        data: data,
        horario: horario,
        sala: sala

    });

    try {
        const response = await fetch(`/consultar-agendamentos?${params}`);
        if (!response.ok) throw new Error('Erro na consulta');

        const agendamentos = await response.json();
        if (agendamentos.length === 0) {
            const row = tabelaAgendamentos.insertRow();
            row.insertCell(0).colSpan = 6;
            row.cells[0].innerText = "Nenhum agendamento encontrado.";
            return;
        }

        agendamentos.forEach(agendamento => {
            const row = tabelaAgendamentos.insertRow();
            row.insertCell(0).innerText = agendamento.id;
            row.insertCell(1).innerText = agendamento.data;
            row.insertCell(2).innerText = agendamento.horario;
            row.insertCell(3).innerText = agendamento.sala;
            row.insertCell(4).innerText = agendamento.cpf_cliente;
            row.insertCell(5).innerText = agendamento.cpf_profissional;


            const actionsCell = row.insertCell(6);
            actionsCell.innerHTML = `
                <button onclick="excluirAgendamento('${agendamento.id}')">Excluir</button>
                <button onclick="carregarAgendamentoParaEdicao('${agendamento.id}')">Editar</button>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        const row = tabelaAgendamentos.insertRow();
        row.insertCell(0).colSpan = 6;
        row.cells[0].innerText = "Erro ao consultar agendamentos.";
    }
}

async function excluirAgendamento(id) {
    try {
        const response = await fetch(`/excluir-agendamento?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir agendamento');
        alert('Agendamento excluído com sucesso!');
        consultarAgendamentos(new Event('submit')); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento');
    }
}

// Função para carregar agendamento para edição
async function carregarAgendamentoParaEdicao(id) {
    try {
        const response = await fetch(`/buscar-agendamento?id=${id}`);
        if (!response.ok) throw new Error('Erro ao buscar agendamento');
        const agendamento = await response.json();

        // Preenche os campos do formulário com os dados do agendamento
        document.getElementById('dataConsulta').value = agendamento.data;
        document.getElementById('horarioAgendamento').value = agendamento.horario;
        document.getElementById('salaAgendamento').value = agendamento.sala;
        document.getElementById('cpfClienteConsulta').value = agendamento.cpf_cliente;
        document.getElementById('cpfProfissionalConsulta').value = agendamento.cpf_profissional;
        document.getElementById('enderecoCliente').value = agendamento.endereco;
        document.getElementById('dataNascimento').value = agendamento.dataNascimento;
        document.getElementById('oabProfissional').value = agendamento.oabProfissional;

        // Armazena o ID do agendamento para usar na atualização
        document.getElementById('formConsultaAgendamentos').setAttribute('data-id', agendamento.id);

        // Exibe o botão de atualização
        document.getElementById('btnAtualizarAgendamento').style.display = 'inline-block';
    } catch (error) {
        console.error('Erro ao carregar agendamento para edição:', error);
        alert('Erro ao carregar agendamento para edição');
    }
}

// Função para atualizar agendamento
async function carregarAgendamentoParaEdicao(id) {
    try {
        const response = await fetch(`/buscar-agendamento?id=${id}`);

        if (!response.ok) throw new Error(`Erro na consulta: ${response.status} - ${response.statusText}`);

        const agendamento = await response.json();
        console.log('Agendamento carregado:', agendamento); // Log para depuração

        // Preenche os campos do formulário com os dados do agendamento
        document.getElementById('dataConsulta').value = agendamento.data;
        document.getElementById('horarioAgendamento').value = agendamento.horario;
        document.getElementById('salaAgendamento').value = agendamento.sala;
        document.getElementById('cpfClienteConsulta').value = agendamento.cpf_cliente;
        document.getElementById('cpfProfissionalConsulta').value = agendamento.cpf_profissional;

        // Armazena o ID do agendamento para usar na atualização
        document.getElementById('formConsultaAgendamentos').setAttribute('data-id', agendamento.id);

        // Exibe o botão de atualização
        document.getElementById('btnAtualizarAgendamento').style.display = 'inline-block';
    } catch (error) {
        console.error('Erro ao carregar agendamento para edição:', error);
        alert(`Erro ao carregar agendamento para edição: ${error.message}`);
    }
}


