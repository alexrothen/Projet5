//----------------------IMPORT
import {
    formatPrice
} from "./main.js";

//--------------------------RECUPERATION DE L'ID DE COMMANDE
let orderId = localStorage.getItem("orderId");

//--------------------------RECUPERATION :
let cart = JSON.parse(localStorage.getItem("itemCart"));// PANIER
let contact = JSON.parse(localStorage.getItem("contact"));// CONTACT
let totalAmount = localStorage.getItem("totalAmount");// TOTAL


let rowBloc = document.getElementById('rowBloc');

//-------------------------ASSIGNATIONS AUX CHAMPS :
document.getElementById('numOrder').innerHTML = `<strong>Commande n° ${orderId}</strong>`; // NUMERO DE COMMANDE
document.getElementById('total').textContent = `${totalAmount} €`; //MONTANT

//-------------------------CONTACT
document.getElementById('thanks').textContent = `Merci pour votre commande ${contact.firstName} !`
document.getElementById('name').textContent = `${contact.firstName} ${contact.lastName}`;
document.getElementById('address').textContent = contact.address;
document.getElementById('city').textContent = `${contact.zip} ${contact.city}`;
document.getElementById('email').textContent = contact.email;

for (let i in cart) {
    invoiceProductList(cart[i]);
}
localStorage.clear(); // SUPPRESSION DU CONTENU DU LOCALSTORAGE

//----------------------------FONCTION : CREER LES BLOCS ITEM
function invoiceProductList(item){
    
    let row = document.createElement('tr')
    row.className = "d-flex col-12"
    let name = document.createElement('td')
    name.textContent = item.name;
    name.className = "col-2"

    let description = document.createElement('td')
    description.textContent = item.description;
    description.className = "col-5"
    let price = document.createElement('td')
    price.textContent = `${formatPrice(item.price)} €`;
    price.className = "col-2 text-right"
    let quantity = document.createElement('td')
    quantity.textContent = item.quantity;
    quantity.className = "col-1 text-center"
    let itemSubTotal = document.createElement('td')
    itemSubTotal.textContent = `${formatPrice(item.subTotal)} €`;
    itemSubTotal.className = "col-2 text-right"


    rowBloc.appendChild(row)
    row.appendChild(name);
    row.appendChild(description);
    row.appendChild(price);
    row.appendChild(quantity);
    row.appendChild(itemSubTotal);
}





