//---------------------URL PRODUIT DE L'API
const url = "http://localhost:3000/api/cameras/";

//----------------------IMPORT
import { formatPrice } from "./main.js";

//----------------------BLOC PARENT
let container = document.querySelector('main');
container.className = "container-fluid row mx-auto"
        
//---------------------SI LA REQUETE A ABOUTI...
fetchIndex(url).then(items =>{
    for (let i in items) { //...GENERER LES BLOCS
        createItemBloc(items[i]);
        }
    })
    .catch(error =>{ //...SINON AFFICHER :
         container.innerHTML = `<h2 class="h4 text-center col-12 mt-5 pt-4">
         Une erreur est survenue, veuillez recharger la page.</h2>`; 
         console.log(error);  
    });

//---------------------FONCTION : RETOURNER LE CONTENU DE LA REQUETE
async function fetchIndex(url) {

    let response = await fetch(url); 
    if (response.ok) {
        let items = await response.json();
        
        return items; 
    };
};      
    
function createItemBloc(item) {

    let product =  `<a class = "badge badge-light col-md-6 col-sm-12 mx-auto" href = "produit.html?id=${item._id}" style = "white-space: normal;" > 
                        <ul class = "row list-group-flush col-12 col-sm-12 text-center mx-auto "> 
                            <li class = "text-center col-10 list-group-item mx-auto"> 
                                <img src=${item.imageUrl} class="img-fluid"></li>
                            <li class="text-left col-10 mx-auto list-group-item">${item.name}</li> 
                            <li class = "text-justify col-6 ml-auto list-group-item">${item.description}</li>
                            <li class="text-right col-4 mr-auto list-group-item"><strong>Prix: ${formatPrice(item.price)} €</strong></li> 
                        </ul>
                    </a>`;
    container.innerHTML += product; // CREATION D'UN BLOC 
                                    // SUPPLEMENTAIRE A CHAQUE TOUR DE BOUCLE               
}




