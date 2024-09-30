const card = document.querySelector('.card');
const input = document.querySelector('#input');
const header = document.querySelector('.header');
const palavrasEscritas = document.querySelector('.palavras-escritas');
const modo = document.querySelector('.tema');
const randomLetras = document.querySelector('.random');
const message = document.querySelector('.message');
let palavrasEscritasArray = [];

const getThemes = async () => {
  try {
    const response = await fetch('https://find-the-words.onrender.com/temas', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar os temas');
    }

    const responseJSON = await response.json();

    if (responseJSON) {
      const local = localStorage.getItem('tema');
      if (local == null) {
        localStorage.setItem('tema', 0);
      }
    }

    return responseJSON;
  } catch(error) {
    console.error(error);
  }
};

let palavras = [];
let nomeTema = '';

const changeTheme = () => {
  if (localStorage.getItem('temaColor') === 'dark') {
    modo.innerText = 'claro';
    document.body.style.backgroundColor = '#181818';
    input.style.backgroundColor = '#181818';
    input.style.border = '1px solid white';
    input.style.color = 'white';
    document.querySelectorAll('.header p').forEach((e) => e.style.color = 'white');
    document.querySelectorAll('.palavras-escritas p').forEach((e) => e.style.color = 'white');
    modo.style.backgroundColor = 'white';
    modo.style.color = 'black';
    document.querySelectorAll('.card p').forEach((e) => e.style.color = 'white');
    document.querySelector('.random').style.backgroundColor = 'white';
    document.querySelector('.random').style.color = '#181818';
    document.querySelector('.message').style.backgroundColor = '#E9E9E9';
    document.querySelector('.message').style.color = 'black';
    document.querySelector('.message').style.border = '1px solid white';
  } else {
    modo.innerText = 'escuro';
    document.body.style.backgroundColor = '#E9E9E9';
    input.style.backgroundColor = '#E9E9E9';
    input.style.border = '1px solid #181818';
    input.style.color = 'black';
    document.querySelectorAll('.header p').forEach((e) => e.style.color = 'black');
    document.querySelectorAll('.palavras-escritas p').forEach((e) => e.style.color = 'black');
    modo.style.backgroundColor = '#181818';
    modo.style.color = 'white';
    document.querySelectorAll('.card p').forEach((e) => e.style.color = 'black');
    document.querySelector('.random').style.backgroundColor = '#181818';
    document.querySelector('.random').style.color = 'white';
    document.querySelector('.message').style.backgroundColor = '#181818';
    document.querySelector('.message').style.color = 'white';
    document.querySelector('.message').style.border = '1px solid black';
  }
}

const getDados = async () => {
  try {
    const indexTema = parseInt(localStorage.getItem('tema'), 10);
    const temas = await getThemes();

    if (temas && temas.themes && indexTema >= 0 && indexTema < temas.themes.length) {
      const temaSelecionado = temas.themes[indexTema];
      console.log(temaSelecionado);
      nomeTema = temaSelecionado.nome;
      palavras = temaSelecionado.palavras || [];
      createWords();
    } else {
      console.error('Tema inválido ou não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao obter dados:', error);
  }
};

// Gerar posição das letras
const getRandomPosition = (card) => {
  const x = (Math.random() * card.clientWidth);
  const y = (Math.random() * card.clientHeight);
  return { x, y };
};


// Estilo da posição das letras
const positionWordsOnWindow = () => {
  const card = document.querySelector('.card');
  const ps = document.querySelectorAll('.card p');
  ps.forEach((p, index) => {
    const { x, y } = getRandomPosition(card);
    p.style.left = `${card.clientWidth - 60 <= x ? x - 70 : x}px`;
    p.style.top = `${card.clientWidth - 60 <= y ? y - 70 : y}px`;
  });
};

window.addEventListener('resize', positionWordsOnWindow);

const renderPalavrasEscritas = () => {
  palavrasEscritas.innerHTML = '<p>Palavras escritas <span class="material-symbols-outlined">arrow_downward</span></p>';
  for (let i = 0; i < palavrasEscritasArray.length; i++) {
    palavrasEscritas.innerHTML += `<p class="palavra">${palavrasEscritasArray[i]}</p>`;
  }
};

// Criar letras
const createWords = () => {
  header.innerHTML = `
    <p class="title">Tema: ${nomeTema}</p>
    <p class="res">Palavras restantes: ${palavras.length}</p>
  `;

  const getWords = palavras.length == 0 ? [] : palavras.reduce((a, b) => a + b);
  card.innerHTML = '';
  if (getWords.length == 0) {
    const index = Number(localStorage.getItem('tema'));
    if (index == 10 && palavras.length == 0) {
      card.innerHTML = '<button>Parabéns! Recomece!<span class="material-symbols-outlined">arrow_outward</span></button>';
    } else {
      card.innerHTML = '<button>Próximo tema <span class="material-symbols-outlined">arrow_outward</span></button>';
    }

    if (localStorage.getItem('temaColor') === 'dark') {
      document.querySelector('.card button').style.backgroundColor = 'white';
      document.querySelector('.card button').style.color = 'black';
      document.querySelector('.card button').style.border = '1px solid white';
    } else {
      document.querySelector('.card button').style.backgroundColor = '#181818';
      document.querySelector('.card button').style.color = 'white';
      document.querySelector('.card button').style.border = '1px solid black';
    }

    const button = document.querySelector('.card button');
    button.addEventListener('click', () => {
      if (index >= 0 && index < 10) {
        localStorage.setItem('tema', index + 1);
        palavrasEscritasArray = []
        getDados();
      } else {
        localStorage.setItem('tema', 0);
      }
    });
  } else {
    for (let i = 0; i < getWords.length; i++) {
      const createP = document.createElement('p');
      createP.classList.add(getWords[i]);
      createP.innerHTML = `${getWords[i]}`;
      card.appendChild(createP);
    }
    renderPalavrasEscritas();
    positionWordsOnWindow();
  }
  changeTheme();
};

let index = 0;

const nextStep = (index, palavra, palavrasAll) => {
  const filterPalavrasAll = palavrasAll.slice(index, index + palavra.length);

  for (let i = 0; i < palavras.length; i++) {
    if (palavras[i][0] == palavra[0] && filterPalavrasAll[0] == palavra[0]) {
      const filtrar = palavras.filter((e) => e[i] == filterPalavrasAll[i]);
      const res = filtrar.filter((e) => e[0] == palavra[0]);
      if (res.length > 0) {
        if (res.length == 1) {
          message.innerText = `Há ${res.length} palavra com ${res[0].length} letras e inicial ${res[0][0].toUpperCase()}`;
          return;
        } else if (res.length > 1) {
          message.innerText = `Existem ${res.length} palavras que começam com ${palavra[0].toUpperCase()}`;
          return;
        } else {
          message.innerText = 'Palavra não encontrada';
          return;
        }
      }
    }
  }
};

const avaliarAproximacaoWord = (palavra, palavrasAll) => {
  for (let o = 0; o < palavra.length; o++) {
    for (let i = 0; i < palavrasAll.length; i++) {
      if (palavra[o] == palavrasAll[i]) {
        index = i;
        nextStep(index, palavra, palavrasAll);
      }
    }
  }
};

// Input
const verificarInputValue = () => {
  contIndex = 0;
  if (!input.value) {
    return;
  }

  const word = input.value.toLowerCase();
  const filterWords = palavras.filter((e) => e.toLowerCase() === word);
  const getWords = palavras.length == 0 ? [] : palavras.reduce((a, b) => a + b);

  if (filterWords.length !== 0) {
    palavrasEscritas.innerHTML = '';
    palavrasEscritasArray.push(word);
    const verificarString = getWords.indexOf(word);

    if (verificarString !== -1) {
      console.log('ok', verificarString)
      const lenghtInputValue = word.length;
      const getWordString = getWords.slice(verificarString, lenghtInputValue + verificarString);

      console.log('getWordString', getWordString);

      if (getWordString) {
        const ps = document.querySelectorAll('.card p');

        ps.forEach((p, index) => {
          if (index >= verificarString && index < getWordString.length + verificarString) {
            p.style.color = 'red';
            message.style.bottom = '70px';
            message.innerText = 'Palavra encontrada';

            setTimeout(() => {
              p.style.display = 'none';
              message.style.bottom = '30px';
            }, 2000);
          }
        });
      } else {
        return;
      }
    } else {
      console.error('error');
    }

    setTimeout(() => {
      const indexWord = palavras.indexOf(word);
      palavras.splice(indexWord, 1);
      createWords();
    }, 2000);
  } else {
    console.log('Aqui')
    const ps = document.querySelectorAll('.card p');

    ps.forEach((p, index) => {
      p.style.color = 'red';
    });

    message.innerText = 'Palavra não encontrada';

    // Calcular aproximação da palavra
    avaliarAproximacaoWord(word, getWords);

    message.style.bottom = '70px';

    setTimeout(() => {
      ps.forEach((p) => {
        p.style.color = localStorage.getItem('temaColor') === 'dark' ? 'white' : 'black';
      });
      message.style.bottom = '30px';
    }, 3500);
  }

  input.value = '';
};

document.addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    verificarInputValue();
  }
});

// Modo claro/escuro
modo.addEventListener('click', () => {
  if (!localStorage.getItem('temaColor')) {
    localStorage.setItem('temaColor', 'dark');
    console.log(localStorage.getItem('temaColor'))
  } else {
    if (localStorage.getItem('temaColor') == 'dark') {
      localStorage.setItem('temaColor', 'light');
    } else {
      localStorage.setItem('temaColor', 'dark');
    }
  }

  changeTheme();
});

const styleCard = () => {
  changeTheme();
  card.innerHTML = `
  <l-grid
    size="60"
    speed="1.5"
    color="${localStorage.getItem('temaColor') == 'dark' ? 'white' : 'black'}"
  ></l-grid>
  <strong style="color: ${localStorage.getItem('temaColor') == 'dark' ? 'white' : 'black'}">Carregando...</strong>
  <strong style="color: ${localStorage.getItem('temaColor') == 'dark' ? 'white' : 'black'}">Isso pode levar alguns segundos</strong>
  `;
};

// Random letras
randomLetras.addEventListener('click', positionWordsOnWindow);

// Iniciar aplicação
const app = () => {
  styleCard();
  changeTheme();
  getDados();
  getThemes();
};
app();
