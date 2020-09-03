//----------------------------------URL PRODUIT DE L'API
const url = "http://localhost:3000/api/cameras/";

function numberWithCommas(x) {
    return x.toString().replace(/d{2}/, ",");
}
console.log(numberWithCommas(59000))

//----------------------------------RECUPERATION DES PRODUITS
async function fetchIndex() {

    try{

    let response = await fetch(url); // REQUETE
    if (response.ok) {
        let itemsData = await response.json(); // REPONSE PARSÉE

//----------------------------------- TEMPLATE
        for (let i in itemsData) {

            let mainBloc = document.querySelector('main')
            mainBloc.className ="container-fluid row mx-auto";

            let itemsLink = document.createElement('a');
            itemsLink.className = "badge badge-light col-md-6 col-sm-12 mx-auto "
            itemsLink.style.whiteSpace ="normal";

            let itemsBloc = document.createElement('ul');
            itemsBloc.className = "row list-group-flush col-12 col-sm-12 text-center mx-auto ";

            let itemName = document.createElement('li');
            itemName.className = "text-left col-10 mx-auto list-group-item";

            let itemPrice = document.createElement('li');
            itemPrice.className = "text-right col-3 mr-auto list-group-item";

            let itemDescription = document.createElement('li');
            itemDescription.className = "text-left col-7 ml-auto list-group-item";

            let itemPic = document.createElement('li');
            itemPic.className = "text-center col-10 list-group-item mx-auto";

            itemsLink.setAttribute("href",`produit.html?id=${itemsData[i]._id}`); // LIEN DU PRODUIT 
            itemName.textContent = itemsData[i].name;
            itemPrice.textContent = `${itemsData[i].price} €`;
            itemDescription.textContent = itemsData[i].description;
            itemPic.innerHTML = `<img src="${itemsData[i].imageUrl}" class="img-fluid">`;
         
            // LAYOUT            
            mainBloc.appendChild(itemsLink);
            itemsLink.appendChild(itemsBloc);
            itemsBloc.appendChild(itemPic);
            itemsBloc.appendChild(itemName);
            itemsBloc.appendChild(itemDescription);
            itemsBloc.appendChild(itemPrice);

        }
    }
    }catch{
        console.error();
    }

};
fetchIndex();
