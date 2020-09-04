//----------------------IMPORT
import {
    formatPrice
} from "./main.js";

//-----------------------------------------RECUPERATION DU PANIER
let cart = JSON.parse(localStorage.getItem("itemCart"));
let form = document.getElementById('form');
let formBloc = document.getElementById('formBloc');
formBloc.style.display = 'block';
let totalAmount = document.getElementById('totalAmount');
let orderBtn = document.getElementById('orderBtn');


//-----------------------------------------CREATION DU CONTAINER

let container = document.getElementById('mainBloc');
container.className = "container-fluid d-flex row mx-auto pb-5 col-12";

checkCart();

for (let i in cart) {
    createItemBloc(cart[i]);
}
//BOUTON SUBMIT
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let contact = {  // OBJET CONTACT
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        email: document.getElementById('email').value
    };
    let products = []; // ARRAY PRODUITS
        cart.forEach(item => {
            products.push(item._id);
        });

    let order = {contact,products}; // OBJET COMMANDE COMPLETE

    fetch("http://localhost:3000/api/cameras/order/", { // ENVOI VERS L'API
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        mode: "cors",
        body: JSON.stringify(order)
    })
    .then( response => response.json()) 
    .then( response => {

            let orderId = response.orderId; // RECUPERATION DE L'ID DE COMMANDE
            localStorage.setItem("orderId", orderId);
            localStorage.setItem("itemCart", JSON.stringify(cart));
            localStorage.setItem("contact", JSON.stringify(contact));

            localStorage.setItem("totalAmount", formatPrice(total())); // ENVOI DU TOTAL
            form.setAttribute("action", `${window.location.replace("conf.html")}`)
           })
           e.stopPropagation();      

    })
//---------------------------------FONCTION : CREER LE BLOC ITEM
function createItemBloc(item) {
  
    let itemBloc = document.createElement('section');
    itemBloc.className = "row mx-auto pt-0 col-10 shadow-sm pt-3 mb-5 bg-white rounded ";

    let imgBloc = document.createElement('div');
    imgBloc.className = "d-flex col-5 align-items-start";

    let asideBloc = document.createElement('aside');
    asideBloc.className = "col-7 d-flex flex-column p-0";
    asideBloc.style.height = "fit-content";

    let asideList = document.createElement('ul');
    asideList.className = "d-flex list-group-flush row col-12"

    let itemName = document.createElement('li');
    itemName.className = "text-left list-group-item col-12";

    let itemDescription = document.createElement('li');
    itemDescription.className = "text-justify list-group-item col-12";

    let itemPrice = document.createElement('li');
    itemPrice.className = "text-right col-4 list-group-item col-9";

    let itemOptions = document.createElement('li');
    itemOptions.className = "text-left list-group-item col-12";

    let itemQuantity = document.createElement('li');
    itemQuantity.className = "text-left list-group-item col-3";

    let itemQuantitySelect = document.createElement('select');
    itemQuantitySelect.className = "form-control";

    let itemQuantityOption = document.createElement('option');
    itemQuantityOption.className = "option";

    let subTotal = document.createElement('li');
    subTotal.className = "subTotal text-right font-weight-bold list-group-item col-12"

    let removeBtn = document.createElement('button');
    removeBtn.className = "removeBtn close col-1 d-flex ml-auto p-4";

    setAttributes(removeBtn, {
        "type": "button",
        "aria-label": "close"
    });

    itemName.textContent = item.name;
    itemPrice.textContent = `${formatPrice(item.price)} €`;
    itemDescription.textContent = item.description;
    imgBloc.innerHTML = `<img src="${item.imageUrl}" class="img-fluid pb-3">`;
    subTotal.textContent = `${formatPrice(item.subTotal)} €`;
    itemOptions.textContent = item.options;
    removeBtn.innerHTML = `<span aria-hidden="true">&times;</span>`;

    // LOOP DE LA QUANTITE 
    for (let i = 1; i <= 20; i++) {

        itemQuantityOption = document.createElement('option');
        itemQuantityOption.setAttribute("value", i);
        itemQuantityOption.innerHTML = i;
        itemQuantitySelect.appendChild(itemQuantityOption);
    }

    // CHANGEMENT DYNAMIQUE DES QUANTITES ET DES SOUS-TOTAUX...

    itemQuantitySelect.addEventListener('change', selectQuantity);

    function selectQuantity() {
        let quantitySelected = itemQuantitySelect.options[itemQuantitySelect.selectedIndex].value; //...RECUPERATION DE LA QUANTITE SELECTIONNEE
        item.quantity = quantitySelected; //...LA REMPLACER DANS LE PANIER
        item.subTotal = quantitySelected * item.price; //...RECALCULER LE SOUS-TOTAL
        localStorage.setItem("itemCart", JSON.stringify(cart)); //...ENVOYER NOUVELLES DONNEES VERS LE LOCALSTORAGE
        total(); //...RECALCUL DU TOTAL GENERAL
        totalAmount.textContent = `total : ${formatPrice(total())} €`; // AFFICHAGE DU TOTAL GENERAL
        subTotal.textContent = `${formatPrice(item.subTotal)} €`; //...AFFICHAGE DES SOUS-TOTAUX
        console.log(`Quantité mise à jour : ${item.quantity} ${item.name} option ${item.options} ${formatPrice(item.subTotal)} €`)
        Swal.fire({
            title: `Quantité mise à jour !`,
            html: `<p>${item.quantity} ${item.name} option ${item.options}</p> 
            <br><p><b>Montant: ${formatPrice(item.subTotal)} €</b></p>`,
            confirmButtonColor: '#6C757D'

        });
    }
    // ARCHITECTURE
    container.appendChild(itemBloc);
    itemBloc.appendChild(imgBloc);
    itemBloc.appendChild(asideBloc);
    asideBloc.appendChild(asideList);
    asideList.appendChild(itemName);
    asideList.appendChild(itemOptions);
    asideList.appendChild(itemQuantity);
    itemQuantity.appendChild(itemQuantitySelect)
    asideList.appendChild(itemPrice);
    asideList.appendChild(subTotal);
    asideList.appendChild(removeBtn);
    retrieveQt(item);
    removeItem(item);

    function removeItem(item) {
        removeBtn.addEventListener('click', (e) => {

            e.preventDefault;
            itemBloc.remove(); // SUPPRESSION DU BLOC ITEM...
            cart.splice(cart.indexOf(item), 1); //... ET DE L'ITEM DANS LE PANIER
            console.log(`article supprimé du panier`)
            localStorage.setItem("itemCart", JSON.stringify(cart));

            //PUIS LORSQUE LE PANIER EST VIDE...
            if (cart.length === 0) {

                localStorage.removeItem("itemCart"); //...SUPPRIMER L'ARRAY VIDE DANS LE LOCALSTORAGE
                console.log('Panier vide')
                emptyCart(); //...PUIS AFFICHER 'PANIER VIDE'
            }
            total(); // RECALCUL DU TOTAL A CHAQUE SUPPRESSION
            totalAmount.textContent = `total : ${formatPrice(total())} €`; // AFFICHAGE DU TOTAL GENERAL
            subTotal.textContent = item.subTotal + " €"; //...AFFICHAGE DES SOUS-TOTAUX
        })
    }

    function retrieveQt(item) {
        //RECUPERATION DE LA QUANTITE SELECTIONNEE SUR LA PAGE PRODUIT...
        let chosenQuantity = itemQuantitySelect.querySelector(`[value="${item.quantity}"`);
        console.log(`Quantité récupérée pour ${item.name} ${item.options}: ${chosenQuantity.value}`);

        //...PUIS L'INTEGRER DANS L'OPTION CORRESPONDANTE VIA L'ATTRIBUT 'SELECTED'
        chosenQuantity.setAttribute('selected', "");
    }
}

//--------------------------------VERIFICATION DU PANIER
function checkCart() {
    if (!cart) { // SI LE PANIER EST VIDE...
        emptyCart(); //...AFFICHER 'PANIER VIDE !'
    } else {
        total();
        totalAmount.textContent = `total : ${formatPrice(total())} €`; // AFFICHAGE DU TOTAL GENERAL

    }
}

//-----------------------------------AFFICHER 'PANIER VIDE !'
function emptyCart() {

    let emptyCart = document.createElement('h2');
    emptyCart.className = "text-center display-4 mt-5 pt-5 ml-5 col-11 d-flex p-2 justify-content-center"
    emptyCart.textContent = "Panier vide !"
    container.appendChild(emptyCart);
    formBloc.remove();

};
//---------------------------------CALCUL DU TOTAL
function total() {
    let total = 0;
    for (let i in cart) {

        total += cart[i].subTotal;
    }
    return total;

}
// FONCTION PERMETTANT D'INTEGRER PLUSIEURS ATTRIBUTS
function setAttributes(el, options) {
    Object.keys(options).forEach(function (attr) {
        el.setAttribute(attr, options[attr]);
    })
}

// //------------------------------------BOUTON : COMMANDE

// BOUTON DESACTIVÉ SI LE FORMULAIRE EST INCOMPLET
form.addEventListener('change', () => {
    if (form.checkValidity() === true) {
        orderBtn.removeAttribute("disabled");
    } else {
        orderBtn.setAttribute("disabled", "");
    };
});
