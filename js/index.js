const API = 'https://pokeapi.co/api/v2/pokemon/?limit=20';
let pokemonDataArray = [];

const $field = document.querySelector('.field');
fetchPokemonData();

function generatePokemonList(pokemonDataArray) {


// Получаем количество элементов массива
    const count = pokemonDataArray.length;

// Отображаем количество элементов в HTML-документе
    const countElement = document.getElementById('count');
    countElement.textContent = `Pokemons: ${count}`;


    let temp = '';
    if (pokemonDataArray.length) {
        pokemonDataArray.forEach(pokemonData => {
            temp += `<li>
                <img src="${pokemonData.imageUrl}">
                <a>${pokemonData.name[0].toUpperCase() + pokemonData.name.substring(1)}</a>
                <p>Height: ${pokemonData.height}</p>
                <p>Weight: ${pokemonData.weight}</p>
                <button class="button" id="${pokemonData.id}">Delete</button>
              </li>`;
        });
    } else {
        temp += '<h1 class="NF">Pokemons not found!</h1>';
    }
    const pokemonList = document.querySelector('.users-list');
    pokemonList.innerHTML = temp;

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

                            // Создаем объект с данными покемона
                            const pokemonDataObj = {
                                id: id,
                                name: name,
                                weight: weight,
                                height: height,
                                imageUrl: imageUrl
                            };

                            // Добавляем объект с данными покемона в массив
                            pokemonDataArray.push(pokemonDataObj);

                            // Преобразуем массив в строку JSON и сохраняем в localStorage
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
    console.log(id + " id del");
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('button')) {
        const pokemonId = e.target.id;
        pokemonDataArray = removePokemonDataById(pokemonId);
        console.log(pokemonId + " id find");
    }
});

$field.addEventListener('input', (e) => {
    let query = e.target.value;
    filterController(query);
});
// Получаем массив из localStorage
