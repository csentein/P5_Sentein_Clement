// 4 min

// Début de l'appel AJAX (requête HTTP)
var xhr = new XMLHttpRequest();

// Quand la variable "xhr" fait un appel, le code s'execute par la suite :
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        let data = JSON.parse(xhr.responseText);
        let HTML = "";
        for (let i = 0; i < data.length; i++) {
            let currentData = data[i];
            console.log(currentData);
            // Début de la génération de l'HTML
            HTML += `<a class="sectioncamera_container">
    <a href="product.html?id=${currentData["_id"]}" class="sectioncamera">
            <img class="img_style" src="${currentData["imageUrl"]}"
        <div class="background-color">
            <h3 class="title_product">${currentData["name"]}</h3><br>
            <p class="price_product">${currentData["price"]}</p>
            <p class="detail_product">Plus de détails</p>
        </div>
    </a>
</a>`
            // Fin de la génération de l'HTML

        }
        document.getElementById('product_section').innerHTML = HTML;
    }
};

// Initialisation de la méthode GET (affichage des paramètres dans l'URL avec la forme "?id=1273")
xhr.open('GET', 'http://localhost:3000/api/cameras/');

// Envoi de la requête au serveur, puis le serveur nous renvoye la réponse attendue et on stock cette réponse dans la variable "xhr", puis le code plus haut s'éxecute
xhr.send();

// Fin de l'appel AJAX
