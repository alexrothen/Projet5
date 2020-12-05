// ----------------------IMPORT
import {
  formatPrice,
} from './main.js';

// --------------------------RECUPERATION DE L'ID DE COMMANDE
const orderId = localStorage.getItem('orderId');

// --------------------------RECUPERATION :
const cart = JSON.parse(localStorage.getItem('itemCart')); // PANIER
const contact = JSON.parse(localStorage.getItem('contact')); // CONTACT
const totalAmount = localStorage.getItem('totalAmount'); // TOTAL

// ---------------------------ELEMENT PARENT SUR LEQUEL LES BLOCS VONT SE GREFFER
const rowBlock = document.getElementById('rowBlock');

assignCartElements(contact, totalAmount, orderId); // ASSIGNATION DES ELEMENTS

for (const i in cart) {
  invoiceProductList(cart[i]); // CREATION DES BLOCS
}

// ----------------------------FONCTION : CREER LES ROW ITEM
function invoiceProductList(item) {
  // VARIABLES
  const row = document.createElement('tr');
  row.className = 'd-flex col-12';

  const name = document.createElement('td');
  name.textContent = item.name;
  name.className = 'col-lg-2 col-md-2 col-sm-3';

  const description = document.createElement('td');
  description.textContent = item.description;
  description.className = 'd-none d-lg-block d-md-block col-5 text-justify';

  const price = document.createElement('td');
  price.textContent = `${formatPrice(item.price)} €`;
  price.className = 'col-lg-2 col-md-2 col-sm-3 text-right';

  const quantity = document.createElement('td');
  quantity.textContent = item.quantity;
  quantity.className = 'col-1 text-center';

  const itemSubTotal = document.createElement('td');
  itemSubTotal.textContent = `${formatPrice(item.subTotal)} €`;
  itemSubTotal.className = 'col-lg-2 col-md-2 col-sm-3 text-right';

  // ARCHITECTURE
  rowBlock.appendChild(row);
  row.appendChild(name);
  row.appendChild(description);
  row.appendChild(price);
  row.appendChild(quantity);
  row.appendChild(itemSubTotal);
}

// --------------------------FONCTION : VERIFIER LE PANIER
function assignCartElements(contact, total, orderId) {
  // SI LE PANIER EST PRESENT DANS LE LOCALSTORAGE...
  if (cart) {
    // ...ASSIGNER LES ELEMENTS
    document.getElementById('numOrder').innerHTML = `<strong>Commande n° ${orderId}</strong>`; // NUMERO DE COMMANDE
    document.getElementById('total').textContent = `${total} €`; // MONTANT
    document.getElementById('thanks').textContent = `Merci pour votre commande ${contact.firstName} !`;
    document.getElementById('name').textContent = `${contact.firstName} ${contact.lastName}`;
    document.getElementById('address').textContent = contact.address;
    document.getElementById('city').textContent = `${contact.zip} ${contact.city}`;
    document.getElementById('phone').textContent = contact.phone;
    document.getElementById('email').textContent = contact.email;
  } else {
    // ...SINON EFFACER LE TABLEAU HTML ET AFFICHER LE MESSAGE CI-DESSOUS
    document.getElementById('invoice').remove();
    document.getElementById('mainBlock').innerHTML = '<h2 class="text-center display-4 mt-5 pt-5 ml-5 col-11 d-flex p-2 justify-content-center">A bientôt sur Orinico !</h2>';
  }
  localStorage.clear(); // ...PUIS SUPPRIMER LE CONTENU DU LOCALSTORAGE
}
