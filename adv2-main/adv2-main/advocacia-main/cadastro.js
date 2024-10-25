document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Limpa mensagens de erro
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('formSuccess').textContent = '';

    // Obtém os valores dos campos
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    let valid = true;

    // Validação do nome
    if (name === '') {
        document.getElementById('nameError').textContent = 'O nome é obrigatório.';
        valid = false;
    }

    // Validação do email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || !emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'O email é inválido.';
        valid = false;
    }

    // Validação da senha
    if (password === '') {
        document.getElementById('passwordError').textContent = 'A senha é obrigatória.';
        valid = false;
    }

    // Se o formulário estiver válido
    if (valid) {
        document.getElementById('formSuccess').textContent = 'Cadastro realizado com sucesso!';
        // Aqui você pode adicionar código para enviar os dados para o servidor
    }
});