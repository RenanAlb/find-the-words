const card = document.querySelector('.card');
const input = document.querySelector('#input');
const header = document.querySelector('.header');
const palavrasEscritas = document.querySelector('.palavras-escritas');
const modo = document.querySelector('.tema');
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
const getRandomPosition = () => {
  const marginX = 50; // Margem para a esquerda e direita
  const marginY = 50; // Margem para o topo e rodapé
  const topOffset = 150; // Espaço reservado no topo
  const bottomOffset = 100; // Espaço reservado na parte inferior

  const x = Math.random() * (window.innerWidth - 2 * marginX) + marginX;
  const y = Math.random() * (window.innerHeight - topOffset - bottomOffset - 2 * marginY) + topOffset + marginY;

  return { x, y };
};

// Estilo da posição das letras
const positionWordsOnWindow = () => {
  const ps = document.querySelectorAll('.card p');
  ps.forEach((p, index) => {
    const { x, y } = getRandomPosition();
    console.log(x, y)
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
  });
};

const responsiveLayout = () => {
  positionWordsOnWindow();
};

window.addEventListener('resize', responsiveLayout);

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
    }
    card.innerHTML = '<button>Próximo tema <span class="material-symbols-outlined">arrow_outward</span></button>';

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

// Input
const verificarInputValue = () => {
  contIndex = 0;
  if (!input.value) {
    return;
  }

  const word = input.value.toLowerCase();
  const filterWords = palavras.filter((e) => e == word);

  if (filterWords.length > 0) {
    palavrasEscritas.innerHTML = '';
    palavrasEscritasArray.push(word);

    const getWords = palavras.length == 0 ? [] : palavras.reduce((a, b) => a + b);
    const verificarString = getWords.indexOf(word);

    if (verificarString !== -1) {
      console.log('ok', verificarString)
      const lenghtInputValue = word.length;
      const getWordString = getWords.slice(verificarString, lenghtInputValue + verificarString);

      if (getWordString) {
        const ps = document.querySelectorAll('.card p');
        ps.forEach((p, index) => {
          if (index >= verificarString && index < getWordString.length + verificarString) {
            p.style.color = 'red';

            setTimeout(() => {
              p.style.display = 'none';
            }, 2000);
          }
        });
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
    const ps = document.querySelectorAll('.card p');

    ps.forEach((p, index) => {
      p.style.color = 'red';
    });

    setTimeout(() => {
      ps.forEach((p, index) => {
        p.style.color = localStorage.getItem('temaColor') === 'dark' ? 'white' : 'black';
      });
    }, 2000);
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

  console.log(localStorage)
});

const styleCard = () => {
  card.innerHTML = `
  <l-grid
    size="60"
    speed="1.5"
    color="${localStorage.getItem('temaColor') == 'dark' ? 'white' : 'black'}"
  ></l-grid>
  <strong style="${localStorage.getItem('temaColor') == 'dark' ? 'white' : 'black'}">Carregando...</strong>
  <strong style="${localStorage.getItem('temaColor') == 'dark' ? 'white' : 'black'}">Isso pode levar alguns segundos</strong>
  `;
};

// Iniciar aplicação
const app = () => {
  styleCard();
  changeTheme();
  getDados();
  getThemes();
};
app();
