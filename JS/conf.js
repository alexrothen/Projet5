//----------------------IMPORT
import {
    formatPrice
} from "./main.js";

//--------------------------RECUPERATION DE L'ID DE COMMANDE
let orderId = localStorage.getItem("orderId");

//--------------------------RECUPERATION :
let cart = JSON.parse(localStorage.getItem("itemCart")); // PANIER
let contact = JSON.parse(localStorage.getItem("contact")); // CONTACT
let totalAmount = localStorage.getItem("totalAmount"); // TOTAL


//---------------------------ELEMENT PARENT SUR LEQUEL LES BLOCS VONT SE GREFFER
let rowBloc = document.getElementById('rowBloc');

assignCartElements(contact, totalAmount, orderId); // ASSIGNATION DES ELEMENTS

for (let i in cart) {
    invoiceProductList(cart[i]); // CREATION DES BLOCS
}

//----------------------------FONCTION : CREER LES ROW ITEM
function invoiceProductList(item) {
    //VARIABLES
    let row = document.createElement('tr')
    row.className = "d-flex col-12"

    let name = document.createElement('td')
    name.textContent = item.name;
    name.className = "col-lg-2 col-md-2 col-sm-3"

    let description = document.createElement('td')
    description.textContent = item.description;
    description.className = "d-none d-lg-block d-md-block col-5 text-justify"

    let price = document.createElement('td')
    price.textContent = `${formatPrice(item.price)} €`;
    price.className = "col-lg-2 col-md-2 col-sm-3 text-right"

    let quantity = document.createElement('td')
    quantity.textContent = item.quantity;
    quantity.className = "col-1 text-center"

    let itemSubTotal = document.createElement('td')
    itemSubTotal.textContent = `${formatPrice(item.subTotal)} €`;
    itemSubTotal.className = "col-lg-2 col-md-2 col-sm-3 text-right"

    //ARCHITECTURE
    rowBloc.appendChild(row)
    row.appendChild(name);
    row.appendChild(description);
    row.appendChild(price);
    row.appendChild(quantity);
    row.appendChild(itemSubTotal);
}

//--------------------------FONCTION : VERIFIER LE PANIER
function assignCartElements(contact, total, id) {
    //SI LE PANIER EST PRESENT DANS LE LOCALSTORAGE...
    if (cart) {
        //...ASSIGNER LES ELEMENTS
        document.getElementById('numOrder').innerHTML = `<strong>Commande n° ${id}</strong>`; // NUMERO DE COMMANDE
        document.getElementById('total').textContent = `${total} €`; //MONTANT
        document.getElementById('thanks').textContent = `Merci pour votre commande ${contact.firstName} !`
        document.getElementById('name').textContent = `${contact.firstName} ${contact.lastName}`;
        document.getElementById('address').textContent = contact.address;
        document.getElementById('city').textContent = `${contact.zip} ${contact.city}`;
        document.getElementById('email').innerHTML = `<a href="mailto:${contact.email}">${contact.email}</a>`;
    } else {
        //...SINON EFFACER LE TABLEAU HTML ET AFFICHER LE MESSAGE CI-DESSOUS   
        document.getElementById('invoice').remove()
        document.getElementById('mainBloc').innerHTML = `<h2 class="text-center display-4 mt-5 pt-5 ml-5 col-11 d-flex p-2 justify-content-center">A bientôt sur Orinico !</h2>
        `
    }
    localStorage.clear(); //...PUIS SUPPRIMER LE CONTENU DU LOCALSTORAGE
};