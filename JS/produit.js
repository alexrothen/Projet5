//----------------------IMPORT
import {
    formatPrice
} from "./main.js";

//------------------------RECUPERATION DE L'ID DU PRODUIT...
const getId = new URLSearchParams(window.location.search).get("id"); //...VIA SON URL
const itemUrl = `http://localhost:3000/api/cameras/${getId}`;
console.log(`Récupération de l'ID du produit : ${itemUrl}`);

//------------------------CREATION DU BLOC PRINCIPAL
let container = document.querySelector('main');
container.className = "container-fluid";


//----------------------------SI LA REQUETE ABOUTIT :

fetchProduct(itemUrl).then(item => {
        createItemBloc(item); // GENERER LE BLOC PRODUIT
        optionLoop(item); // GENERER LA BOUCLE DES OPTIONS 
        sendBtn(item); // GENERER LE BOUTON D'ENVOI

    })
    .catch(error => {
        container.innerHTML = `<h2 class="h4 text-center col-12 mt-5 pt-4">
             Une erreur est survenue, veuillez recharger la page.</h2>`;
        console.log(error);
    });


//----------------------------------CREATION DU PANIER
let cart = localStorage.getItem("itemCart");
createCart();


//----------------------------------BOUTON : ENVOYER LE PANIER 
function sendBtn(item) {
    document.getElementById('cartBtn').addEventListener('click', (e) => {

        e.preventDefault;
        let itemQuantitySelect = document.getElementById('selectQt');
        itemQuantitySelect.addEventListener('change', selectQuantity);

        let itemOptionsSelect = document.getElementById('selectOpt');
        itemOptionsSelect.addEventListener('change', selectOptions);
        //---------------------FONCTION : CAPTURER LA DERNIERE QUANTITE
        function selectQuantity() {
            return itemQuantitySelect.options[itemQuantitySelect.selectedIndex].value;
        }

        //--------------------FONCTION : CAPTURER LA DERNIERE OPTION 
        function selectOptions() {
            return itemOptionsSelect.options[itemOptionsSelect.selectedIndex].value;
        }

        let addItemToCart = { // CREATION DE L'OBJET PRODUIT
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            options: selectOptions(),
            quantity: selectQuantity(),
            subTotal: selectQuantity() * item.price
        };

        // SI LE PRODUIT EST DEJA PRESENT DANS PANIER...
        if (cart.find(item => item.id === addItemToCart.id && item.options === addItemToCart.options)) {

            for (let i in cart) {

                //...NE CHANGER QUE SA QUANTITE (SI L'UTILISATEUR LA MODIFIE)
                if (cart[i].quantity != addItemToCart.quantity && cart[i].options === addItemToCart.options) {
                    cart[i].quantity = addItemToCart.quantity;
                    cart[i].subTotal = addItemToCart.subTotal;

                    Swal.fire({
                        title: `Quantité mise à jour !`,
                        text: `${cart[i].quantity} ${cart[i].name} option ${cart[i].options}`,
                        confirmButtonColor: '#6C757D'
                    })
                    console.log(`Quantité mise à jour : ${cart[i].quantity} ${cart[i].name} option ${cart[i].options}`);
                }
            }
        }
        // SI LE PRODUIT EST ABSENT DU PANIER...
        else {
            //...L'AJOUTER

            cart.push(addItemToCart);
            console.log(`${addItemToCart.quantity} ${addItemToCart.name} option ${addItemToCart.options} dans le panier`);
            Swal.fire({
                title: `Article ajouté au panier !`,
                text: `${addItemToCart.quantity} ${addItemToCart.name} option ${addItemToCart.options}`,
                confirmButtonColor: '#6C757D'
            })
           
        }
        // ENVOI DE L'OBJET PRODUIT VERS LE LOCALSTORAGE
        localStorage.setItem("itemCart", JSON.stringify(cart));

    });
}
//---------------------------FONCTION : RECUPERER LE PRODUIT
async function fetchProduct(itemUrl) {

    let response = await fetch(itemUrl); // REQUETE
    if (response.ok) {
        let item = await response.json();
        return item;
    }
}

//-------------------------FONCTION : CREER LE PANIER
function createCart() {
    if (!cart) { // SI LE PANIER N'EXISTE PAS...
        cart = []; //... INITIALISER L'ARRAY.
        console.log('Panier créé')

    } else { // SI LE PANIER EXISTE...
        cart = JSON.parse(localStorage.getItem("itemCart")); //... LE PARSER.
        console.log('Panier existant');

    }
}

//----------------------FONCTION : CREER LE BLOC ITEM
function createItemBloc(item) {
    container.innerHTML =
        `<section class="row justify-content-center mx-auto col-12 mb-4">
    <div class="col-lg-7 col-md-8 col-sm-12"><img src=${item.imageUrl} class="img-fluid"></div>
        <aside class="col-lg-4 col-md-4" style="height: fit-content;">
            <ul class="row list-group-flush pl-0">
                <li class="text-left list-group-item col-lg-12">${item.name}</li>
                <li class="text-justify list-group-item col-lg-12">${item.description}</li>
                <li class="text-left list-group-item col-md-5 col-lg-4">
                    <select class="form-control" id="selectQt"><option>1</option><option>2</option><option>3</option><option>4</option>
                    <option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>
                    <option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option>
                    <option>18</option><option>19</option><option>20</option></select></li>
                <li class="text-left list-group-item col-md-7 col-lg-8">
                    <select id="selectOpt" class="form-control"></select></li>
                <li class="text-center col-md-12 list-group-item  "><strong>Prix : ${formatPrice(item.price)} €</strong></li></ul>
            <button id="cartBtn" class="btn btn-secondary d-flex mx-auto mt-4" type="button">Ajouter au panier</button>
        </aside>
</section>`
};

//----------------------FONCTION : GENERER LES OPTIONS
function optionLoop(item) {
    for (let option in item.lenses) {
        let itemOptionsSelect = document.getElementById('selectOpt');
        let itemOptions = document.createElement('option');
        itemOptions.innerHTML = item.lenses[option];
        itemOptionsSelect.appendChild(itemOptions);
    }
}