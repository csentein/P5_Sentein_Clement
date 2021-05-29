// 7 min

// Début de l'appel AJAX (requête HTTP)
var xhr = new XMLHttpRequest();

// Quand la variable "xhr" fait un appel, le code s'execute par la suite : (onreadystatechange = recevoir de l'AJAX)
xhr.onreadystatechange = function () {

    // L'AJAX a bien été reçu dans la variable "xhr"
    if (xhr.readyState === 4) {
        let data = JSON.parse(xhr.responseText);
        document.getElementById('camera-title').innerText = data["name"];
        document.getElementById('camera-description').innerText = data["description"];
        document.getElementById('camera-img').src = data["imageUrl"];
        document.getElementById('camera-price').innerText = data["price"];
        for (let i = 0; i < data["lenses"].length; i++) {
            document.getElementById('lenses').innerHTML +=
                // Début de la génération du code HTML pour "lenses" (objectif de la camera)
                `<option name="${data["lenses"][i]}" class="cameraselector">${data["lenses"][i]}
</option>
`
            // Fin de la génération du code HTML pour "lenses" (objectif de la camera)

        }
    }
};

/* Récupération des paramètres de l'URL actuelle (ex. de paramètre : ?id=17238123)
var queryString = window.location.search;
*/

// Récupération des paramètres de l'URL actuelle (ex. de paramètre : ?id=17238123) & Modification du formatage avec la méthode "new URLSearchParams"
var urlParams = new URLSearchParams(window.location.search);

// Récupération d'un paramètre spécifique, en l'occurence "id" dans notre cas (ex. : 17238123)
var id = urlParams.get('id')

// Initialisation de la méthode GET (affichage des paramètres dans l'URL avec la forme "?id=1273")
xhr.open('GET', 'http://localhost:3000/api/cameras/' + id);

// Envoi de la requête au serveur, puis le serveur nous renvoye la réponse attendue et on stock cette réponse dans la variable "xhr", puis le code plus haut s'éxecute
xhr.send();

// Fin de l'appel AJAX

// Connection entre la fonction "addToCart" et l'élément 'product-btn' (voir HTML)
document.getElementById('product-btn').addEventListener('click', function () {
    addToCart();
}, false);

// Cette fonction permet d'ajouter un produit au panier
var cart;
function addToCart() {

    // Si "cart" (stocké dans le localStorage) (localStorage = les Items stockées dans l'ordinateurs sans délai d'expiration (=/= sessionStorage qui s'expire à la fermeture du navigateur))
    if (IsJsonString(localStorage.getItem('cart'))) {

        // Conversion d'une chaîne de caractères en Objet
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    // Affichage en chaine de caractères
    console.log("3", localStorage.getItem('cart'))

    // Affichage d'une liste contenant les 5 objets correspondant à chaque caméra
    console.log("3", cart)

    // Vérification que la variable "cart" est bien une liste
    if (!Array.isArray(cart) || cart == null) {
        cart = [];
        console.log("La variable Cart n'est pas une liste");
    }

    let title = document.getElementById('camera-title').innerText;
    let price = document.getElementById('camera-price').innerText;
    let image = document.getElementById('camera-img').src;
    let lense = document.getElementById('lenses').value;
    let description = document.getElementById('camera-description').innerText;
    let index = cart.length;

    // "index" permet d'attribuer à un produit spécifique un "id" spécifique (1, 2, 3, etc.) (cet id nous permettra de supprimer un produit spécifique au panier)
    cart.push({
        'id': id,
        'title': title,
        'price': price,
        'image': image,
        'lense': lense,
        'index': index,
        'description': description
    })

    // Modification de la variable "cart" (en Array) en chaîne de caractères
    localStorage.setItem('cart', JSON.stringify(cart));
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
