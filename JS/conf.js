
//--------------------------RECUPERATION DE L'ID DE COMMANDE
let orderId = localStorage.getItem("orderId");

let totalAmount = localStorage.getItem("totalAmount")

let numOrder = document.getElementById('numOrder');
numOrder.textContent = `Commande n° ${orderId}`;

let total = document.getElementById('total');
total.textContent = `Montant total de la commande:  ${totalAmount} €`;

localStorage.clear(); // SUPPRESSION DU CONTENU DU LOCALSTORAGE



