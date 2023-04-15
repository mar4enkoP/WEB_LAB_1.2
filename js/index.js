const API = 'https://pokeapi.co/api/v2/pokemon/?limit=20';
let pokemonDataArray = [];

const $field = document.querySelector('.field');
const $count = document.querySelector('.count');
const $pokemonList = document.querySelector('.users-list');

fetchPokemonData();

function generatePokemonList(pokemonDataArray) {
    const count = pokemonDataArray.length;
    $count.textContent = 'Pokemons:' + count;

    let temp = '';
    if (pokemonDataArray.length) {
        pokemonDataArray.forEach(pokemonData => {
            //Интерполяция строк
            temp += `<li> 
                <img src="${pokemonData.imageUrl}">
                <a>${pokemonData.name}</a>
                <span>Height: ${pokemonData.height}</span>
                <span>Weight: ${pokemonData.weight}</span>
                <button class="button" id="${pokemonData.id}">Delete</button>
              </li>`;
            //Многострочные литералы
            //temp+= '<li>' + '<a>'+pokemonData.name+'</a>' + '<span>' + 'Height:' + pokemonData.height + '</span>' + '</li>';
        });
    } else {
        temp += '<h1 class="NF">Pokemons not found!</h1>';
    }
    $pokemonList.innerHTML = temp;
}

function fetchPokemonData() {
    if (!localStorage.getItem('pokemonDataArray')) {
        fetch(API)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(pokemon => {
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .then(pokemonData => {
                            const imageUrl = pokemonData.sprites.front_default;
                            const id = pokemonData.id;
                            const name = pokemonData.name;
                            const weight = pokemonData.weight;
                            const height = pokemonData.height;
                            const pokemonDataObj = {
                                id: id,
                                name: name,
                                weight: weight,
                                height: height,
                                imageUrl: imageUrl
                            };
                            pokemonDataArray.push(pokemonDataObj);
                            localStorage.setItem('pokemonDataArray', JSON.stringify(pokemonDataArray));
                            generatePokemonList(JSON.parse(localStorage.getItem('pokemonDataArray')));
                        });
                });
            });
    } else {
        generatePokemonList(JSON.parse(localStorage.getItem('pokemonDataArray')));
    }
}

function filterController(query) {
    let filteredUsers = JSON.parse(localStorage.getItem('pokemonDataArray')).filter((el) => {
        return ~el.name.toLowerCase().indexOf(query.toLowerCase());
    });
    generatePokemonList(filteredUsers);
}

function removePokemonDataById(id) {
    let pokemonDataArray = JSON.parse(localStorage.getItem('pokemonDataArray'));
    pokemonDataArray = pokemonDataArray.filter(pokemonData => pokemonData.id != id);
    localStorage.setItem('pokemonDataArray', JSON.stringify(pokemonDataArray));
    generatePokemonList(JSON.parse(localStorage.getItem('pokemonDataArray')));
    $field.value = "";
}

$field.addEventListener('input', (e) => {
    let query = e.target.value;
    filterController(query);
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('button')) {
        const pokemonId = e.target.id;
        pokemonDataArray = removePokemonDataById(pokemonId);
    }
});
