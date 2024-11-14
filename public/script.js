// Função para cadastrar cliente
let listaClientes = [];
let idClienteAtualizar = -1;

// Função para cadastrar ou atualizar um cliente
function cadastrarCliente() {
    const nome = document.getElementById('nomeCliente').value;
    const cpf = document.getElementById('cpfCliente').value;
    const nascimento = document.getElementById('dataNascimento').value;
    const endereco = document.getElementById('enderecoCliente').value;

    if (nome === '' || cpf === '' || endereco === '') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (idClienteAtualizar === -1) {
        // Adiciona um novo cliente à lista
        listaClientes.push({ nome, cpf, nascimento, endereco });
    } else {
        // Atualiza cliente existente
        listaClientes[idClienteAtualizar] = { nome, cpf, nascimento, endereco };
        idClienteAtualizar = -1;
        document.getElementById('btnCadastrarCliente').textContent = 'Cadastrar Cliente';
    }

    // Limpar o formulário após cadastrar ou atualizar
    document.getElementById('formCadastroCliente').reset();

    // Atualizar a tabela com os dados
    exibirClientes();
}

// Função para exibir os clientes na tabela
function exibirClientes() {
    const tabelaBody = document.getElementById('tabelaClientesBody');
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de preencher novamente

    listaClientes.forEach((cliente, index) => {
        const novaLinha = document.createElement('tr');

        novaLinha.innerHTML = `
            <td>${index + 1}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.nascimento}</td>
            <td>${cliente.endereco}</td>
            <td>
                <button onclick="editarCliente(${index})">Editar</button>
                <button onclick="removerCliente(${index})">Excluir</button>
            </td>
        `;

        tabelaBody.appendChild(novaLinha);
    });
}

// Função para editar um cliente
function editarCliente(index) {
    const cliente = listaClientes[index];

    // Preencher o formulário com os dados do cliente para edição
    document.getElementById('nomeCliente').value = cliente.nome;
    document.getElementById('cpfCliente').value = cliente.cpf;
    document.getElementById('dataNascimento').value = cliente.nascimento;
    document.getElementById('enderecoCliente').value = cliente.endereco;

    // Atualizar o índice global para saber qual cliente está sendo editado
    idClienteAtualizar = index;

    // Alterar o texto do botão para indicar atualização
    document.getElementById('btnCadastrarCliente').textContent = 'Atualizar Cliente';
}

// Função para remover um cliente da lista
function removerCliente(index) {
    listaClientes.splice(index, 1);
    exibirClientes();
}


let listaProfissionais = [];
let idAtualizar = -1;

// Função para cadastrar ou atualizar um advogado
function cadastrarProfissional() {
    const nome = document.getElementById('nomeProfissional').value;
    const cpf = document.getElementById('cpfProfissional').value;
    const nascimento = document.getElementById('nascimentoProfissional').value;
    const endereco = document.getElementById('enderecoProfissional').value;
    const oab = document.getElementById('oabProfissional').value;

    if (idAtualizar === -1) {
        // Adicionar novo advogado à lista
        listaProfissionais.push({ nome, cpf, nascimento, endereco, oab });
    } else {
        // Atualizar advogado existente
        listaProfissionais[idAtualizar] = { nome, cpf, nascimento, endereco, oab };
        idAtualizar = -1;
        document.getElementById('btnCadastrar').textContent = 'Cadastrar Profissional';
    }

    // Limpar o formulário após cadastrar ou atualizar
    document.getElementById('container').reset();

    // Atualizar a tabela com os dados
    exibirProfissionais();
}

// Função para exibir os profissionais na tabela
function exibirProfissionais() {
    const tabelaBody = document.getElementById('tabelaBody');
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de preencher novamente

    listaProfissionais.forEach((profissional, index) => {
        const novaLinha = document.createElement('tr');

        novaLinha.innerHTML = `
            <td>${index + 1}</td>
            <td>${profissional.nome}</td>
            <td>${profissional.cpf}</td>
            <td>${profissional.nascimento}</td>
            <td>${profissional.endereco}</td>
            <td>${profissional.oab}</td>
            <td>
                <button onclick="editarProfissional(${index})">Editar</button>
            </td>
        `;

        tabelaBody.appendChild(novaLinha);
    });
}

// Função para editar um profissional
function editarProfissional(index) {
    const profissional = listaProfissionais[index];
    document.getElementById('nomeProfissional').value = profissional.nome;
    document.getElementById('cpfProfissional').value = profissional.cpf;
    document.getElementById('nascimentoProfissional').value = profissional.nascimento;
    document.getElementById('enderecoProfissional').value = profissional.endereco;
    document.getElementById('oabProfissional').value = profissional.oab;

    idAtualizar = index;
    document.getElementById('btnCadastrar').textContent = 'Atualizar Profissional';
}



// Função para editar um profissional
function editarProfissional(index) {
    const profissional = listaProfissionais[index];
    document.getElementById('nomeProfissional').value = profissional.nome;
    document.getElementById('cpfProfissional').value = profissional.cpf;
    document.getElementById('nascimentoProfissional').value = profissional.nascimento;
    document.getElementById('enderecoProfissional').value = profissional.endereco;
    document.getElementById('oabProfissional').value = profissional.oab;

    idAtualizar = index;
    document.getElementById('btnCadastrar').textContent = 'Atualizar Profissional';
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


