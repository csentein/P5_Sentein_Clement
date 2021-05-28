// 7 min

// Utiliser les REGEX en js pour verifier les champs du formulaires

// Initialisation de la variable "products" au format Array
var products = [];

var idProducts = document.getElementById('id_products');
var totalPrice = 0;
var cart = [];
var storageCart;
storageCart = localStorage.getItem('cart')

if (IsJsonString(storageCart)) {
    cart = JSON.parse(storageCart)
}

// Création de la boucle et initialisation de chaque variable
for (let i = 0; i < cart.length; i++) {
    var id = cart[i]['id'];
    totalPrice += parseInt(cart[i]["price"]);
    products.push(id);
    var title = cart[i]['title'];
    var image = cart[i]['image'];
    var lense = cart[i]['lense'];
    var price = cart[i]['price'];
    var index = cart[i]['index'];
    var description = cart[i]['description'];

    // Génération du code HTML de chaque bloc de produit
    idProducts.innerHTML += `
                <div class="deletebutton">
                <button id="btn-close-${i}" class="cart-btn2" data-index="${index}">x</button>
                <img class="img-cart" src="${image}">
                <div class="title-cart">
                <h3>${title}</h3><br>
                <h5 class="left0">Ojectif : ${lense}</h5>
                <h5 class="left0">Prix : <span class="product-price">${price}</span></h5>
                </div>
                </div>
                <br>
                <br>`;

}

// Connection entre la fonction "deleteCartProduct" et le code HTML généré ci-dessus

let elements = document.getElementsByClassName("cart-btn2");

for (let i = 0; i < elements.length; i++) {

    elements[i].addEventListener("click", function () {
        console.log('5', elements[i]);
        deleteCartProduct(document.getElementById('btn-close-' + i), document.getElementById('btn-close-' + i).getAttribute("data-index"))
    }, false)
}

// Connection entre la fonction "sendForm" et l'élément 'form-1' (voir HTML)
document.getElementById('form-1').addEventListener('submit', function (event) {
    sendForm();
    event.preventDefault();
}, false);

console.log(document.getElementById('form-1'));

// Supprimer le "onclick" en inline HTML

console.log('4', products, title, image, lense, price, index)

document.getElementById("price").innerText = totalPrice;
console.log(totalPrice);

// Fonction permettant de supprimer un produit spécifique du tableau "products"
function deleteCartProduct(element, index) {
    let price = parseInt(element.parentNode.querySelector('.product-price').innerText)

    console.log('price', price)

    // Suppression du parent de l'élément sélectionné (tout le bloc du produit)
    element.parentNode.remove()

    for (let i = 0; i < cart.length; i++) {
        if (cart[i]["index"] == index) {

            // Tous les éléments en dessous de l'élément supprimé seront verticalement décalés d'une case
            cart.splice(i, 1)
        }
    }

    // Conversion de l'objet "cart" en chaîne de caractère pour pouvoir le stocker dans "localStorage"
    localStorage.setItem("cart", JSON.stringify(cart))

    // Conversion de l'élément "price" en number et Soustraction du prix de l'élément supprimé au prix total
    document.getElementById('price').innerText = parseInt(document.getElementById('price').innerText - price)
}

function sendForm() {
    console.log('sendForm()')

    // Création de l'item "name" et modification de sa valeur par le first name, un espace et le last name envoyé dans le formulaire précédent. Cela nous sera utile pour la page "order-confirmation"
    localStorage.setItem("name", document.getElementById('first_name').value + ' ' + document.getElementById('last_name').value);

    localStorage.setItem("totalPrice", document.getElementById('price').innerText);

    // Vérification des champs du formulaire en JS
    let firstName = document.getElementById('first_name').value,
        lastName = document.getElementById('last_name').value,
        address = document.getElementById('address').value,
        city = document.getElementById('city').value,
        email = document.getElementById('email').value;

    if (firstName == null || firstName.length < 1) {
        alert('Attention, le prénom a un problème');
        return;
    }

    if (lastName == null || lastName.length < 1) {
        alert('Attention, le nom a un problème');
        return;
    }

    if (address == null || address.length < 1) {
        alert('Attention, l adresse a un problème');
        return;
    }

    if (city == null || city.length < 1) {
        alert('Attention, la ville a un problème');
        return;
    }

    if (email == null || /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/.test(email)) {
        alert('Attention, l email a un problème');
        return;
    }

    // Initialisation de la variable "contact" et attribution des valeurs fournies par le formulaire précédent
    let contact = {
        firstName: document.getElementById('first_name').value,
        lastName: document.getElementById('last_name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    }

    let products = []
    let cartLocalStorage = localStorage.getItem("cart")

    // Si "cartLocalStorage" est un string au format JSON, alors on le convertit au format Objet et on rajoute les id des items du cart dans la variable "Products"
    if (IsJsonString(cartLocalStorage)) {
        cartLocalStorage = JSON.parse(cartLocalStorage)
        for (let i = 0; i < cartLocalStorage.length; i++) {
            products.push(cartLocalStorage[i].id)
        }
    }

    // Initialisation de la variable data contenant la variable "contact" et "products"
    var data = {
        contact,
        products
    }

    // Début de l'appel AJAX (requête HTTP)
    var xhr = new XMLHttpRequest();

    // Quand la variable "xhr" fait un appel, le code s'execute par la suite : (onreadystatechange = recevoir de l'AJAX). La fonction exécutée crée l'item "orderId" dans localStorage et sa valeur est "data.orderId"
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            localStorage.setItem('orderId', data.orderId);
            document.location.href = 'order-confirmation.html';
        };
    };

    // Initialisation de la méthode POST
    xhr.open('POST', 'http://localhost:3000/api/cameras/order', true);

    // Cette méthode permet d'éditer le header d'une requête HTTP. En l'occurence, dans notre cas, nous rajoutons "application/json" connecté à la requête HTTP
    xhr.setRequestHeader('Content-type', 'application/json')

    // Envoi de la requête au serveur, puis le serveur nous renvoye la réponse attendue et on stock cette réponse dans la variable "xhr", puis le code plus haut s'éxecute
    xhr.send(JSON.stringify(data));
}

// Cette fonction permet de vérifier si c'est bien une chaîne de caractères au format Json
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}