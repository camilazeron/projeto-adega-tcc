// Função para listar produtos
function listarProdutos() {
    fetch('http://localhost:5000/api/read/products')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';

            let idCounter = 1;
            data.forEach(produto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${idCounter++}</td>
                    <td>${produto.name}</td>
                    <td>R$ ${produto.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>${produto.quantity}</td>
                    <td>${produto.category}</td>
                    <td>${produto.description}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao listar os produtos:', error);
        });
}

// Função para cadastrar novo produto
function cadastrarProduto() {
    const nome = document.getElementById('nome_produto').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const valor = parseFloat(document.getElementById('valor').value.trim());
    const quantidade = parseInt(document.getElementById('quantidade').value.trim());
    const categoria = document.getElementById('categoria').value.trim();

    const password = generatePassword();

    const novoProduto = {
        name: nome,
        description: descricao,
        value: valor,
        quantity: quantidade,
        category: categoria,
        password: password
    };

    fetch('http://localhost:5000/api/insert/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Produto cadastrado com sucesso:', data);
            alert(`Essa é a senha do produto: ${password}, anote-a e guarde-a em um local seguro, para que possa ser usada para deletar o produto.`);
            location.reload();
        })
        .catch(error => {
            console.error('Erro ao cadastrar o produto:', error);
        });
}

// Função para deletar um produto
function deletarProduto(passwordProduto, nameProduto) {
    fetch(`http://localhost:5000/api/delete/products/${passwordProduto}/${encodeURIComponent(nameProduto)}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                return response.json().then(data => {
                    console.error('Produto não encontrado:', data.error);
                    alert('Produto não encontrado. Verifique o nome e a senha.');
                });
            } else {
                throw new Error('Erro ao deletar o produto.');
            }
        })
        .then(data => {
            if (data.message) {
                console.log('Produto deletado com sucesso:', data);
                alert('Produto deletado com sucesso.');
                location.reload();
            }
        })
        .catch(error => {
            console.error('Erro ao deletar o produto:', error);
        });
}

// Função para pesquisar um produto
function pesquisarProduto(idProduto, nomeProduto) {
    fetch(`http://localhost:5000/api/filter/products/${idProduto}/${encodeURIComponent(nomeProduto)}`, {
        method: 'GET'
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                return response.json().then(data => {
                    console.error('Produto não encontrado:', data.error);
                    throw new Error('Produto não encontrado. Verifique o nome e a senha. Ou o mesmo foi excluído');
                });
            } else {
                throw new Error('Erro ao pesquisar o produto.');
            }
        })
        .then(data => {
            if (data.products && data.products.length > 0) {
                const product = data.products[0];

                // Preencher as divs do modal de informações do produto
                document.getElementById('informations-product-nome').textContent = product.name;
                document.getElementById('informations-product-valor').textContent = `R$ ${product.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                document.getElementById('informations-product-quantidade').textContent = product.quantity;
                document.getElementById('informations-product-categoria').textContent = product.category;
                document.getElementById('informations-product-descricao').textContent = product.description;

                // Abrir o modal de informações do produto
                const modal = document.getElementById('informations-product-modal');
                modal.style.display = 'block';
                document.getElementById('overlay').style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                throw new Error('Produto não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao pesquisar o produto:', error);
            alert(error.message);
        });
}

// Função para exportar relatório em Excel
function exportarRelatorio() {
    fetch('http://localhost:5000/api/export/excel', {
        method: 'GET'
    })
        .then(response => {
            if (response.status === 200) {
                return response.blob();
            } else {
                throw new Error('Erro ao exportar relatório');
            }
        })
        .then(blob => {
            // Criar um link temporário e clicar nele para iniciar o download do arquivo
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'relatorio_produtos.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Erro ao exportar relatório:', error);
            alert('Erro ao exportar relatório. Verifique o console para mais informações.');
        });
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('nome_produto').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('delete_password').value = '';
    document.getElementById('delete_nome').value = '';
    document.getElementById('pesquisa_password').value = '';
    document.getElementById('pesquisa_nome').value = '';
}

// Função para validar o campo Nome
function validarNome() {
    const nomeInput = document.getElementById('nome_produto');
    const nomeValue = nomeInput.value;
    const nomeError = document.getElementById('nome_produto_error');

    if (/[\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(nomeValue) || nomeValue.trim() === '') {
        nomeError.textContent = 'Nome inválido';
        return false;
    } else {
        nomeError.textContent = '';
        return true;
    }
}

// Função para validar o campo Valor
function validarValor() {
    const valorInput = document.getElementById('valor');
    const valorValue = valorInput.value;
    const valorError = document.getElementById('valor_error');

    if (isNaN(parseFloat(valorValue)) || !isFinite(valorValue) || valorValue.trim() === '') {
        valorError.textContent = 'Valor inválido';
        return false;
    } else {
        valorError.textContent = '';
        return true;
    }
}

// Função para validar o campo Categoria
function validarCategoria() {
    const categoriaInput = document.getElementById('categoria');
    const categoriaValue = categoriaInput.value;
    const categoriaError = document.getElementById('categoria_error');

    if (/[\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(categoriaValue) || categoriaValue.trim() === '') {
        categoriaError.textContent = 'Categoria inválida';
        return false;
    } else {
        categoriaError.textContent = '';
        return true;
    }
}

// Função para validar o campo Quantidade
function validarQuantidade() {
    const quantidadeInput = document.getElementById('quantidade');
    const quantidadeValue = quantidadeInput.value;
    const quantidadeError = document.getElementById('quantidade_error');

    if (isNaN(parseInt(quantidadeValue)) || !isFinite(quantidadeValue) || quantidadeValue.trim() === '') {
        quantidadeError.textContent = 'Quantidade inválida';
        return false;
    } else {
        quantidadeError.textContent = '';
        return true;
    }
}

// Função para validar o campo Descrição
function validarDescricao() {
    const descricaoInput = document.getElementById('descricao');
    const descricaoValue = descricaoInput.value;
    const descricaoError = document.getElementById('descricao_error');

    if (descricaoValue.trim() === '') {
        descricaoError.textContent = 'Descrição não pode ser vazia';
        return false;
    } else {
        descricaoError.textContent = '';
        return true;
    }
}

// Função para realizar todas as validações do formulário
function validarFormulario() {
    const nomeValido = validarNome();
    const valorValido = validarValor();
    const categoriaValida = validarCategoria();
    const quantidadeValida = validarQuantidade();
    const descricaoValida = validarDescricao();

    if (nomeValido && valorValido && quantidadeValida && descricaoValida && categoriaValida) {
        return true;
    } else {
        return false;
    }
}

//Função para gerar senha do produto
function generatePassword() {
    const randomPassword = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return randomPassword;
}

// Função para abrir o modal de cadastrar produto
function openModalCadastrar() {
    limparFormulario();
    const modal = document.getElementById('product-modal');
    modal.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Função para abrir o modal de deletar produto
function openModalDeletar() {
    limparFormulario();
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Função para abrir o modal de pesquisar produto
function openModalPesquisar() {
    limparFormulario();
    const modal = document.getElementById('pesquisa-modal');
    modal.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal de deletar produto
function fecharModalDeletar() {
    limparFormulario();
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para fechar o modal de cadastrar produto
function fecharModalCadastrar() {
    limparFormulario();
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para fechar o modal de deletar produto
function fecharModalPesquisa() {
    limparFormulario();
    const modal = document.getElementById('pesquisa-modal');
    modal.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function fecharModalInformacoesProduto() {
    const modal = document.getElementById('informations-product-modal');
    modal.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
    limparFormulario();
    fecharModalPesquisa()
}

// Função para confirmar o cadastro do produto
function confirmarCadastro() {
    if (validarFormulario()) {
        cadastrarProduto();
        limparFormulario();
        fecharModalCadastrar();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Função para confirmar a exclusão de produto
function confirmarDelecao() {
    const idProduto = document.getElementById('delete_password').value.trim();
    const nomeProduto = document.getElementById('delete_nome').value.trim();

    if (idProduto !== '' && nomeProduto !== '') {
        deletarProduto(idProduto, nomeProduto);
        limparFormulario();
        fecharModalDeletar();
    } else {
        alert('ID de produto ou nome de produto inválido');
    }
}

// Função para confirmar a pesquisa de produto
function confirmarPesquisa() {
    const idProduto = document.getElementById('pesquisa_password').value.trim();
    const nomeProduto = document.getElementById('pesquisa_nome').value.trim();

    if (idProduto !== '' && nomeProduto !== '') {
        fecharModalPesquisa();
        pesquisarProduto(idProduto, nomeProduto);
    } else {
        alert('ID de produto ou nome de produto inválido');
    }
}

// Este cara é executado quando a página é carregada
document.addEventListener('DOMContentLoaded', function () {
    listarProdutos();
});