document.addEventListener('DOMContentLoaded', function() {
    // Login Page Logic
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const message = document.getElementById('message');

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita o envio padrão do formulário

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Verificação simples (deve ser substituída por uma verificação real)
            if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
                message.textContent = 'Login bem-sucedido!';
                message.style.color = 'green';
                // Redirecionar ou mostrar uma página de sucesso pode ser adicionado aqui
            } else {
                message.textContent = 'Nome de usuário ou senha incorretos.';
                message.style.color = 'red';
            }
        });
    }

    // Register Page Logic
    if (document.getElementById('registerForm')) {
        const registerForm = document.getElementById('registerForm');
        const registerMessage = document.getElementById('registerMessage');

        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita o envio padrão do formulário

            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;

            // Armazena as credenciais no localStorage
            localStorage.setItem('username', newUsername);
            localStorage.setItem('password', newPassword);

            registerMessage.textContent = 'Cadastro bem-sucedido! Você pode fazer login agora.';
            registerMessage.style.color = 'green';
        });
    }
});