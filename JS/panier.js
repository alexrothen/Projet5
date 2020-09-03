
//-----------------------------------------RECUPERATION DU PANIER
let cart = JSON.parse(localStorage.getItem("itemCart"));

//-----------------------------------------CREATION DU CONTAINER
let container = document.querySelector('main');
container.className = "container-fluid row mx-auto pb-5 col-12";

//-----------------------------------AFFICHER 'PANIER VIDE !'
function emptyCart() {
    let emptyCart = document.createElement('span');
    emptyCart.className = "text-center mr-auto display-4 mt-5 pt-5 col-12 mx-auto"
    emptyCart.textContent = "Panier vide !"
    container.appendChild(emptyCart);
};

if (!cart) { // SI LE PANIER EST VIDE...
    emptyCart(); //...AFFICHER 'PANIER VIDE !'
}

//---------------------------------CALCUL DU TOTAL
function total() {
    let total = 0;
    for (let i in cart) {

        total += cart[i].subTotal;
    }
    return total;
}

//---------------------------------RECUPERATION DES PRODUITS DANS LE PANIER :  
for (let i in cart) {

    //-----------------------------TEMPLATE PRODUIT :

    // VARIABLES
    let mainBloc = document.createElement('section');
    mainBloc.className = "mainBloc row mx-auto pt-0 col-10 shadow-sm pt-3 mb-5 bg-white rounded ";

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
    subTotal.className = "text-right font-weight-bold list-group-item col-12"

    let removeBtn = document.createElement('button');
    removeBtn.className = "close col-1 d-flex ml-auto p-4";

    setAttributes(removeBtn, {
        "type": "button",
        "aria-label": "close"
    });

    itemName.textContent = cart[i].name;
    itemPrice.textContent = cart[i].price + " €";
    itemDescription.textContent = cart[i].description;
    imgBloc.innerHTML = `<img src="${cart[i].img}" class="img-fluid pb-3">`;
    subTotal.textContent = cart[i].subTotal; // cart[i].quantity * cart[i].price + " €";
    itemOptions.textContent = cart[i].options;
    removeBtn.innerHTML = `<span aria-hidden="true">&times;</span>`;

    // LOOP DE LA QUANTITE 
    for (let i = 1; i <= 15; i++) {

        itemQuantityOption = document.createElement('option');
        itemQuantityOption.setAttribute("value", i);
        itemQuantityOption.innerHTML = i;
        itemQuantitySelect.appendChild(itemQuantityOption);
    }

    // CHANGEMENT DYNAMIQUE DES QUANTITES ET DES SOUS-TOTAUX...
    itemQuantitySelect.addEventListener('change', selectQuantity);

    function selectQuantity() {
        let quantitySelected = itemQuantitySelect.options[itemQuantitySelect.selectedIndex].value; //...RECUPERATION DE LA QUANTITE SELECTIONNEE
        cart[i].quantity = quantitySelected; //...LA REMPLACER DANS LE PANIER
        cart[i].subTotal = quantitySelected * cart[i].price; //...RECALCULER LE SOUS-TOTAL
        localStorage.setItem("itemCart", JSON.stringify(cart)); //...ENVOYER NOUVELLES DONNEES VERS LE LOCALSTORAGE

        total(); //...RECALCUL DU TOTAL GENERAL
        totalAmount.textContent = `total : ${total()} €`; //...AFFICHAGE DU TOTAL GENERAL
        subTotal.textContent = cart[i].subTotal + " €"; //...AFFICHAGE DES SOUS-TOTAUX
    }


    // ARCHITECTURE
    container.appendChild(mainBloc);
    mainBloc.appendChild(imgBloc);
    mainBloc.appendChild(asideBloc);
    asideBloc.appendChild(asideList);
    asideList.appendChild(itemName);
    asideList.appendChild(itemOptions);
    asideList.appendChild(itemQuantity);
    itemQuantity.appendChild(itemQuantitySelect)
    asideList.appendChild(itemPrice);
    asideList.appendChild(subTotal);
    asideList.appendChild(removeBtn);



    //BOUTON : SUPPRIMER L'ARTICLE
    removeBtn.addEventListener('click', (e) => {

        e.preventDefault;
        mainBloc.remove(); // SUPPRESSION DU BLOC ITEM...
        cart.splice(cart.indexOf(cart[i]), 1); //... ET DE L'ITEM DANS LE PANIER
        console.log(`article supprimé du panier`)
        localStorage.setItem("itemCart", JSON.stringify(cart));

        //PUIS LORSQUE LE PANIER EST VIDE...
        if (cart.length === 0) {

            localStorage.removeItem("itemCart"); //...SUPPRIMER L'ARRAY VIDE DANS LE LOCALSTORAGE
            console.log('Panier vide')
            formBloc.remove(); //...PUIS LE BLOC FORMULAIRE
            emptyCart(); //...PUIS AFFICHER 'PANIER VIDE'
        }
        total(); // RECALCUL DU TOTAL A CHAQUE SUPPRESSION
        totalAmount.textContent = `total : ${total()} €`; // AFFICHAGE DU TOTAL GENERAL

    });

    //RECUPERATION DE LA QUANTITE SELECTIONNEE SUR LA PAGE PRODUIT...
    let chosenQuantity = itemQuantitySelect.querySelector(`[value="${cart[i].quantity}"`);
    console.log(`Quantité récupérée pour ${cart[i].name} ${cart[i].options}: ${chosenQuantity.value}`);

    //...PUIS L'INTEGRER DANS L'OPTION CORRESPONDANTE VIA L'ATTRIBUT 'SELECTED'
    chosenQuantity.setAttribute('selected', "");

}

//---------------------------FORMULAIRE

// FORM VARIABLES
let orderBloc = document.createElement('div');
orderBloc.className = "d-flex flex-column row col-7 mx-auto mt-3 mb-3"

let totalAmount = document.createElement('h4');
totalAmount.className = "border-light text-center h5 font-weight-bold mx-auto p-2"

let orderBtn = document.createElement('input');
orderBtn.className = "btn btn-secondary col-lg-4 col-sm-5 col-md-6 mx-auto";
orderBtn.textContent = "Commander";
orderBtn.setAttribute("type", "submit");
orderBtn.setAttribute("disabled", "");

// FONCTION PERMETTANT D'INTEGRER PLUSIEURS ATTRIBUTS
function setAttributes(el, options) {
    Object.keys(options).forEach(function (attr) {
        el.setAttribute(attr, options[attr]);
    })
}
let formBloc = document.createElement('div');
formBloc.className = "col-lg-9 col-sm-10 row p-0 mx-auto shadow p-3 mb-5 bg-white rounded"

let form = document.createElement('form');
form.className = "col-sm-11 mx-auto mt-5 mb-3 pt-2 form-row"

let labelFirstName = document.createElement('label');
labelFirstName.setAttribute("for", "firstName");

let inputFirstName = document.createElement('input');
setAttributes(inputFirstName, {
    "id": "firstName",
    "placeholder": "Prénom",
    "type": "text",
    "name": "firstName",
    "required": "",
    "pattern": "^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$"

});
inputFirstName.className = "form-control  col-4"

let labelLastName = document.createElement('label');
labelLastName.setAttribute("for", "LastName")

let inputLastName = document.createElement('input');
setAttributes(inputLastName, {
    "id": "lastName",
    "placeholder": "Nom",
    "type": "text",
    "name": "lastName",
    "required": "",
    "pattern": "^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$"
});

inputLastName.className = "form-control  col-8 "

let labelEmail = document.createElement('label');
labelEmail.setAttribute("for", "email")

let inputEmail = document.createElement('input');
setAttributes(inputEmail, {
    "id": "email",
    "placeholder": "E-mail",
    "type": "email",
    "name": "email",
    "required": ""
    });
inputEmail.className = "form-control col-6"

let labelPhone = document.createElement('label');
labelPhone.setAttribute("for", "phone");

let inputPhone = document.createElement('input');
setAttributes(inputPhone, {
    "id": "phone",
    "placeholder": "Téléphone",
    "type": "tel",
    "name": "phone",
    "pattern": "[0-9]{10}",
    "required": ""
});
inputPhone.className = "form-control   col-6"

let labelAddress = document.createElement('label');
labelAddress.setAttribute("for", "address")

let inputAddress = document.createElement('input');
setAttributes(inputAddress, {
    "id": "address",
    "placeholder": "Adresse",
    "type": "text",
    "name": "address",
    "required": "",
    "pattern": "^[#.0-9a-zA-Z\\s,-]+$"
});
inputAddress.className = "form-control  col-12 "

let labelZip = document.createElement('label');
labelZip.setAttribute("for", "zip");

let inputZip = document.createElement('input');
setAttributes(inputZip, {
    "id": "zip",
    "placeholder": "Code postal",
    "type": "text",
    "name": "zip",
    "size": "5",
    "pattern": "[0-9]{5}",
    "required": ""
});
inputZip.className = "form-control   col-3"

let labelCity = document.createElement('label');
labelCity.setAttribute("for", "city");

let inputCity = document.createElement('input');
setAttributes(inputCity, {
    "id": "city",
    "placeholder": "Ville",
    "type": "text",
    "name": "city",
    "required": "",
    "pattern": "^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$"
});

inputCity.className = "form-control   col-5"

let labelCountry = document.createElement('label');
labelCountry.setAttribute("for", "country");

let inputCountry = document.createElement('input');
setAttributes(inputCountry, {
    "id": "country",
    "placeholder": "Pays",
    "type": "text",
    "name": "country",
    "required": "",
    "pattern": "^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$"

});
inputCountry.className = "form-control col-4";


// TEMPLATE DU FORMULAIRE
if (cart) {

    container.appendChild(formBloc);
    formBloc.append(form);
    form.appendChild(labelFirstName);
    form.appendChild(inputFirstName);
    form.appendChild(labelLastName);
    form.appendChild(inputLastName);
    form.appendChild(labelAddress);
    form.appendChild(inputAddress);
    form.appendChild(labelZip);
    form.appendChild(inputZip);
    form.appendChild(labelCity);
    form.appendChild(inputCity);
    form.appendChild(labelCountry);
    form.appendChild(inputCountry);
    form.appendChild(labelEmail);
    form.appendChild(inputEmail);
    form.appendChild(labelPhone);
    form.appendChild(inputPhone);
    form.appendChild(orderBloc);
    orderBloc.appendChild(totalAmount);
    orderBloc.appendChild(orderBtn);
    total();
    totalAmount.textContent = `total : ${total()} €`;
}

//------------------------------------BOUTON : COMMANDE

// BOUTON DESACTIVÉ SI LE FORMULAIRE EST INCOMPLET
form.addEventListener('change', () => {
    if (form.checkValidity() === true) {
        orderBtn.removeAttribute("disabled");
    } else {
        orderBtn.setAttribute("disabled", "");
    };
});
// BOUTON SUBMIT
form.addEventListener('submit', (e) => {
    let contact = {  // OBJET CONTACT
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value
    };
    let products = []; // ARRAY PRODUITS
        cart.forEach(item => {
            products.push(item.id);
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
            localStorage.setItem("cart", JSON.stringify(cart));

            localStorage.setItem("totalAmount", total()); // ENVOI DU TOTAL
            localStorage.removeItem("itemCart"); // SUPPRESSION DU PANIER 
            form.setAttribute("action", `${window.location.replace("conf.html")}`) // PAGE DE CONFIRMATION   
           })
           
    e.stopPropagation();       
    e.preventDefault();    
    })

