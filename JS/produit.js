//-----------------------------------RECUPERATION DE L'ID DU PRODUIT...
const getId = new URLSearchParams(window.location.search).get("id"); //...VIA SON URL
const itemUrl = `http://localhost:3000/api/cameras/${getId}`;

console.log(`Récupération de l'ID du produit : ${itemUrl}`);

// ---------------------------------- RECUPERATION DU PRODUIT
async function fetchProduct() {
    try {
        
        let response = await fetch(itemUrl); // REQUETE
        if (response.ok) {
            let item = await response.json(); // REPONSE PARSÉE

            //----------------------------------- TEMPLATE PRODUIT

            // VARIABLES
            let containerProduct = document.querySelector('main');
            containerProduct.className = "container-fluid";

            let mainBlocProduct = document.createElement('section');
            mainBlocProduct.className = "row justify-content-center col-12";

            let imgBloc = document.createElement('div');
            imgBloc.className = "col-6";

            let asideBlocProduct = document.createElement('aside');
            asideBlocProduct.className = "col-4";
            asideBlocProduct.style.height = "fit-content";

            let asideList = document.createElement('ul');
            asideList.className = "row list-group-flush"

            let itemNameProduct = document.createElement('li');
            itemNameProduct.className = "text-left list-group-item  col-12";

            let itemDescriptionProduct = document.createElement('li');
            itemDescriptionProduct.className = "text-left list-group-item  col-12";

            let itemPriceProduct = document.createElement('li');
            itemPriceProduct.className = "text-center col-7 list-group-item  ";

            let listOptionsBloc = document.createElement('li');
            listOptionsBloc.className = "text-left list-group-item  col-12";

            let listQuantityBloc = document.createElement('li');
            listQuantityBloc.className = "text-left list-group-item  col-5";

            let itemOptionsSelect = document.createElement('select');
            itemOptionsSelect.className = "form-control";

            let itemQuantitySelect = document.createElement('select');
            itemQuantitySelect.className = "form-control";
            itemQuantitySelect.id = "SelectQt";

            let cartBtn = document.createElement('button');
            cartBtn.className = "d-flex btn btn-secondary text-center col-4 mx-auto mt-4";

            itemNameProduct.textContent = item.name;
            itemPriceProduct.textContent = item.price + " €";
            itemDescriptionProduct.textContent = item.description;
            imgBloc.innerHTML = `<img src="${item.imageUrl}" class="img-fluid">`;
            cartBtn.textContent = `Ajouter au panier`;
            cartBtn.setAttribute("type", "button");

            let itemName = item.name;
            let itemPrice = item.price;
            let itemDescription = item.description;
            let itemImg = item.imageUrl;

            // LAYOUT
            containerProduct.appendChild(mainBlocProduct);
            mainBlocProduct.appendChild(imgBloc);
            mainBlocProduct.appendChild(asideBlocProduct);
            asideBlocProduct.appendChild(asideList);
            asideList.appendChild(itemNameProduct);
            asideList.appendChild(itemDescriptionProduct);
            asideList.appendChild(listOptionsBloc);
            listOptionsBloc.appendChild(itemOptionsSelect);
            asideList.appendChild(listQuantityBloc);
            listQuantityBloc.appendChild(itemQuantitySelect);
            asideList.appendChild(itemPriceProduct);
            asideBlocProduct.appendChild(cartBtn);

            // LOOP DES OPTIONS...
            for (let option in item.lenses) {
                let itemOptions = document.createElement('option');
                itemOptions.innerHTML = item.lenses[option];
                itemOptionsSelect.appendChild(itemOptions);

            }
            //...ET DES QUANTITE
            for (let i = 1; i < 15; i++) {
                let itemQuantity = document.createElement('option');
                itemQuantity.innerHTML = i;
                itemQuantitySelect.appendChild(itemQuantity);
            }


            // CAPTURE DES DERNIERS CHOIX UTILISATEURS OPTIONS & QUANTITES
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

            cartBtn.addEventListener('click', (e) => {

                e.preventDefault;

                let addItemToCart = { // CREATION DE L'OBJET PRODUIT
                    id: item._id,
                    name: itemName,
                    description: itemDescription,
                    price: itemPrice,
                    img: itemImg,
                    options: selectOptions(),
                    quantity: selectQuantity(),
                    subTotal: selectQuantity() * itemPrice
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

    } catch (error) {
        console.log(error);
    }

};


fetchProduct();