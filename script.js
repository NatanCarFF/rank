// Função para adicionar um novo item
document.getElementById("adicionar-btn").addEventListener("click", function() {
  const tabelaBody = document.getElementById("tabela-body");

  // Cria a nova linha da tabela
  const novaLinha = document.createElement("tr");

  // Adiciona as células para a imagem, nome, nota e ações
  novaLinha.innerHTML = `
    <td contenteditable="true" class="imagem">
      <img src="" alt="Imagem do item" class="item-imagem" onclick="editarImagem(event)">
    </td>
    <td contenteditable="true" class="nome-item">Novo Item</td>
    <td contenteditable="true" class="nota-item">Nota</td>
    <td class="acoes">
      <button onclick="moverItemUp(this)">⬆️</button>
      <button onclick="moverItemDown(this)">⬇️</button>
      <button onclick="removerItem(this)">🗑️</button>
    </td>
  `;

  // Adiciona a nova linha no topo da tabela
  tabelaBody.insertBefore(novaLinha, tabelaBody.firstChild);
});

// Função para editar a imagem do item
function editarImagem(event) {
  const novaImagem = prompt("Insira o link da imagem:", event.target.src);
  if (novaImagem) {
    event.target.src = novaImagem;
  }
}

// Função para remover um item
function removerItem(button) {
  const linha = button.closest("tr");
  linha.remove();
}

// Função para mover um item para cima
function moverItemUp(button) {
  const linha = button.closest("tr");
  const linhaAnterior = linha.previousElementSibling;
  if (linhaAnterior) {
    linha.parentNode.insertBefore(linha, linhaAnterior);
  }
}

// Função para mover um item para baixo
function moverItemDown(button) {
  const linha = button.closest("tr");
  const linhaProxima = linha.nextElementSibling;
  if (linhaProxima) {
    linha.parentNode.insertBefore(linhaProxima, linha);
  }
}

// Função para exportar os dados da tabela
document.getElementById("exportar-btn").addEventListener("click", function() {
  const tabelaBody = document.getElementById("tabela-body");
  const itens = [];

  // Percorrer as linhas da tabela e extrair os dados
  const linhas = tabelaBody.getElementsByTagName("tr");
  for (let linha of linhas) {
    const celulas = linha.getElementsByTagName("td");

    // Criar um objeto para cada item da tabela
    const item = {
      imagem: celulas[0].querySelector("img").src, // Obtém o src da imagem
      nome: celulas[1].innerText,
      nota: celulas[2].innerText // Obtém a nota do item
    };

    // Adicionar o item à lista
    itens.push(item);
  }

  // Converter os dados para JSON
  const json = JSON.stringify(itens, null, 2);

  // Criar um Blob com os dados JSON
  const blob = new Blob([json], { type: "application/json" });

  // Criar um link de download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "itens.json"; // Nome do arquivo a ser baixado

  // Disparar o clique para baixar o arquivo
  link.click();
});

// Função para importar os dados de um arquivo JSON
document.getElementById("importar-btn").addEventListener("change", function(event) {
  const arquivo = event.target.files[0];
  
  if (arquivo) {
    const reader = new FileReader();

    // Ler o arquivo como texto
    reader.readAsText(arquivo);

    reader.onload = function() {
      const dados = JSON.parse(reader.result);

      // Limpar a tabela antes de adicionar novos itens
      const tabelaBody = document.getElementById("tabela-body");
      tabelaBody.innerHTML = '';

      // Adicionar os itens importados à tabela
      dados.forEach(item => {
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
          <td contenteditable="true" class="imagem">
            <img src="${item.imagem}" alt="Imagem do item" class="item-imagem" onclick="editarImagem(event)">
          </td>
          <td contenteditable="true" class="nome-item">${item.nome}</td>
          <td contenteditable="true" class="nota-item">${item.nota}</td>
          <td class="acoes">
            <button onclick="moverItemUp(this)">⬆️</button>
            <button onclick="moverItemDown(this)">⬇️</button>
            <button onclick="removerItem(this)">🗑️</button>
          </td>
        `;

        tabelaBody.appendChild(novaLinha);
      });
    };

    reader.onerror = function() {
      alert("Erro ao ler o arquivo!");
    };
  }
});

// Função de filtro da busca
document.getElementById("search-box").addEventListener("input", function() {
  const filtro = this.value.toLowerCase();
  const linhas = document.getElementById("tabela-body").getElementsByTagName("tr");

  for (let linha of linhas) {
    const nomeItem = linha.getElementsByTagName("td")[1].innerText.toLowerCase();
    if (nomeItem.includes(filtro)) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  }
});
