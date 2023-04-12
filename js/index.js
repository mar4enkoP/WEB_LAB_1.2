const API = 'https://pokeapi.co/api/v2/pokemon/';
let users = [];

const $container = document.querySelector('.search-field');
const $listContainer = document.querySelector('.users-list');
const $field = document.querySelector('.field');

function isEmpty(e) {
    if (e != undefined) {
        return false;
    }
    return true;
}

function templateBuilder(list) {
    let template = '';
    if (!list.length) {
        template = '<li><span>Not Found</span></li>';
    } else {
        let i = 0;
        list.forEach(element => {
            i++
            template += '<li><a class="item" id= ' + element.index + '>' + element.name + '</a><button class="button" id= ' + element.index + ' >Delete</button></li>'


       console.log( JSON.parse(localStorage.getItem('pokemons')) )
        });
    }
    $listContainer.innerHTML = template;
}

function filterController(query) {
    let filteredUsers = JSON.parse(localStorage.getItem('pokemons')).filter((el) => {
        return ~el.name.toLowerCase().indexOf(query.toLowerCase());
    });
    templateBuilder(filteredUsers);

}

function deleteElement(e) {
    let id = e-1;
    let pokemons = JSON.parse(localStorage.getItem('pokemons'));
    pokemons.splice(id, 1);
    localStorage.setItem('pokemons', JSON.stringify(pokemons));
    templateBuilder(JSON.parse(localStorage.getItem('pokemons')));
    $field.value = "";

    console.log("Del " + id  + name);
}

fetch(API)
    .then((responce) => {
        return responce.json();
    })
    .then((data) => {
        users = data.results;
        if (isEmpty(JSON.parse(localStorage.getItem('pokemons')))) {
            localStorage.setItem('pokemons', JSON.stringify(users));
        } else {
           // console.log("Load complete");
        }


        templateBuilder(JSON.parse(localStorage.getItem('pokemons')));
    });

$field.addEventListener('input', (e) => {
    let query = e.target.value;
    filterController(query);
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
        let target = e.target.innerText;
        $field.value = target;
        filterController(target);
    }
});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("button") || e.target.closest(".button"))
        deleteElement(e.target.id);
});

$field.addEventListener('focus', () => {
    $container.classList.add('active');
});
$field.addEventListener('blur', () => {
    $container.classList.remove('active');
});

