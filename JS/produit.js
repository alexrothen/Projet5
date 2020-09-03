//-----------------------------------RECUPERATION DE L'ID DU PRODUIT...
const getId = new URLSearchParams(window.location.search).get("id"); //...VIA SON URL
const itemUrl = `http://localhost:3000/api/cameras/${getId}`;

//----------------------IMPORT
import { formatPrice } from "./main.js";

let container = document.querySelector('main');
container.className = "container-fluid";


console.log(`Récupération de l'ID du produit : ${itemUrl}`);

// ---------------------------------- RECUPERATION DU PRODUIT
async function fetchProduct() {
    try {
        
        let response = await fetch(itemUrl); // REQUETE
        if (response.ok) {
            let item = await response.json();
             // REPONSE PARSÉE
            //----------------------FONCTION : CREER LE BLOC ITEM
            container.innerHTML =    
            `<section class="row justify-content-center col-12">
                <div class="col-6"><img src=${item.imageUrl} class="img-fluid"></div>
                    <aside class="col-4" style="height: fit-content;">
                        <ul class="row list-group-flush">
                            <li class="text-left list-group-item  col-12">${item.name}</li>
                            <li class="text-left list-group-item  col-12">${item.description}</li>
                            <li class="text-left list-group-item  col-12">
                                <select id="selectOpt" class="form-control"></select></li>
                            <li class="text-left list-group-item  col-5">
                                <select class="form-control" id="selectQt"><option>1</option><option>2</option><option>3</option><option>4</option>
                                <option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>
                                <option>11</option><option>12</option><option>13</option><option>14</option></select></li>
                            <li class="text-center col-7 list-group-item  ">${formatPrice(item.price)} €</li></ul>
                        <button id="cartBtn" class="d-flex btn btn-secondary text-center col-4 mx-auto mt-4" type="button">Ajouter au panier</button>
                    </aside>
            </section>`
            let itemQuantitySelect = document.getElementById('selectQt');
            let itemOptionsSelect = document.getElementById('selectOpt');
            console.log(itemOptionsSelect)

    

             // LOOP DES OPTIONS...

             for (let option in item.lenses) {
                let itemOptions = document.createElement('option');
                itemOptions.innerHTML = item.lenses[option];
                itemOptionsSelect.appendChild(itemOptions);}


            //CAPTURE DES DERNIERS CHOIX UTILISATEURS OPTIONS & QUANTITES
            itemQuantitySelect.addEventListener('change', selectQuantity);

            function selectQuantity() {
                return itemQuantitySelect.options[itemQuantitySelect.selectedIndex].value; // DERNIERE QUANTITE SELECTIONNEE
            }

            itemOptionsSelect.addEventListener('change', selectOptions);

            function selectOptions() {
                return itemOptionsSelect.options[itemOptionsSelect.selectedIndex].value; // DERNIERE OPTION SELECTIONNEE
            }

            //----------------------------------CREATION DU PANIER
            let cart = localStorage.getItem("itemCart"); 
            
            function checkCart() {
                if (!cart) { // SI LE PANIER N'EXISTE PAS...
                    cart = []; //... INITIALISER L'ARRAY.
                    console.log('Panier créé')

                } else { // SI LE PANIER EXISTE...
                    cart = JSON.parse(localStorage.getItem("itemCart")); //... LE PARSER.
                    console.log('Panier existant');
                    
                }
            }
            checkCart();


            //----------------------------------BOUTON : ENVOI VERS PANIER 

            document.getElementById('cartBtn').addEventListener('click', (e) => {

                e.preventDefault;

                let addItemToCart = { // CREATION DE L'OBJET PRODUIT
                    id: item._id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    img: item.imageUrl,
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
                            text:`${cart[i].quantity} ${cart[i].name} option ${cart[i].options}`,
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
                        title: `Ajouté au panier !`,
                        text: `${addItemToCart.quantity} ${addItemToCart.name} option ${addItemToCart.options}`,
                        confirmButtonColor: '#6C757D'
                      })
                }

                // ENVOI DE L'OBJET PRODUIT VERS LE LOCALSTORAGE
                localStorage.setItem("itemCart", JSON.stringify(cart));
                
            });
        }

    }catch (error) {
        container.innerHTML = `<h2 class="h4 text-center col-12 mt-5 pt-4">
         Une erreur est survenue, veuillez recharger la page.</h2>`; 
        console.log(error);
    }

};


fetchProduct(itemUrl);

