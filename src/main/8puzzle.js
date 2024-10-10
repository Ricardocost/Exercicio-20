class EstadoPuzzle {
    constructor(tabuleiro, vazio) {
        this.tabuleiro = tabuleiro; // Uma matriz 3x3
        this.vazio = vazio; // Tupla [linha, coluna]
    }
}

function copiarEEditar(estado, movimento) {
    const novoTabuleiro = estado.tabuleiro.map(linha => [...linha]); // Copia o tabuleiro
    const [linhaVazia, colunaVazia] = estado.vazio;
    const [novaLinha, novaColuna] = movimento;

    // Troca o espaço vazio com o tile alvo
    [novoTabuleiro[linhaVazia][colunaVazia], novoTabuleiro[novaLinha][novaColuna]] =
        [novoTabuleiro[novaLinha][novaColuna], novoTabuleiro[linhaVazia][colunaVazia]];

    return new EstadoPuzzle(novoTabuleiro, [novaLinha, novaColuna]);
}

function modificarEDesfazer(estado, movimento) {
    const [linhaVazia, colunaVazia] = estado.vazio;
    const [novaLinha, novaColuna] = movimento;

    // Troca o espaço vazio com o tile alvo
    [estado.tabuleiro[linhaVazia][colunaVazia], estado.tabuleiro[novaLinha][novaColuna]] =
        [estado.tabuleiro[novaLinha][novaColuna], estado.tabuleiro[linhaVazia][colunaVazia]];

    // Retorna o estado à sua configuração original
    [estado.tabuleiro[linhaVazia][colunaVazia], estado.tabuleiro[novaLinha][novaColuna]] =
        [estado.tabuleiro[novaLinha][novaColuna], estado.tabuleiro[linhaVazia][colunaVazia]];
}

function iddfs(estado, limiteProfundidade, usarFuncaoCopia) {
    for (let profundidade = 0; profundidade <= limiteProfundidade; profundidade++) {
        const visitados = new Set();
        const resultado = dls(estado, profundidade, visitados, usarFuncaoCopia);
        if (resultado) {
            return resultado;
        }
    }
    return null;
}

function dls(estado, profundidade, visitados, usarFuncaoCopia) {
    if (profundidade === 0 && ehMeta(estado)) {
        return estado;
    }
    if (profundidade > 0) {
        for (const movimento of obterMovimentosPossiveis(estado)) {
            const novoEstado = usarFuncaoCopia(estado, movimento);
            const estadoStr = JSON.stringify(novoEstado.tabuleiro);
            if (!visitados.has(estadoStr)) {
                visitados.add(estadoStr);
                const resultado = dls(novoEstado, profundidade - 1, visitados, usarFuncaoCopia);
                if (resultado) {
                    return resultado;
                }
                visitados.delete(estadoStr);
            }
        }
    }
    return null;
}

function ehMeta(estado) {
    const estadoObjetivo = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    return JSON.stringify(estado.tabuleiro) === JSON.stringify(estadoObjetivo);
}

function obterMovimentosPossiveis(estado) {
    const movimentos = [];
    const [linha, coluna] = estado.vazio;
    const direcoes = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Cima, Baixo, Esquerda, Direita

    for (const [dL, dC] of direcoes) {
        const novaLinha = linha + dL;
        const novaColuna = coluna + dC;
        if (novaLinha >= 0 && novaLinha < 3 && novaColuna >= 0 && novaColuna < 3) {
            movimentos.push([novaLinha, novaColuna]);
        }
    }
    return movimentos;
}

function compararDesempenho(estadoInicial) {
    const inicioCopia = performance.now();
    const resultadoCopia = iddfs(estadoInicial, 20, copiarEEditar);
    const tempoCopia = performance.now() - inicioCopia;

    const inicioModificar = performance.now();
    const resultadoModificar = iddfs(estadoInicial, 20, modificarEDesfazer);
    const tempoModificar = performance.now() - inicioModificar;

    console.log(`Tempo Copiar e Editar: ${tempoCopia.toFixed(4)}ms, Resultado: ${resultadoCopia ? JSON.stringify(resultadoCopia.tabuleiro) : 'Nenhuma solução encontrada'}`);
    console.log(`Tempo Modificar e Desfazer: ${tempoModificar.toFixed(4)}ms, Resultado: ${resultadoModificar ? JSON.stringify(resultadoModificar.tabuleiro) : 'Nenhuma solução encontrada'}`);
}

// Uso
const tabuleiroInicial = [[1, 2, 3], [4, 0, 5], [7, 8, 6]];
const estadoInicial = new EstadoPuzzle(tabuleiroInicial, [1, 1]);
compararDesempenho(estadoInicial);
