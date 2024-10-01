function cadastra_aluno() {
    const nome = document.getElementById('nome_advogado').value;
    const dataNascimento = document.getElementById('data_nascimento').value;
    const oab = document.getElementById('oab').value;

    document.getElementById('mostra_nome').textContent = nome;
    document.getElementById('mostra_data').textContent = dataNascimento;
    document.getElementById('mostra_oab').textContent = oab;
}