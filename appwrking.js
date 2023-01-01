const api_URL = 'https://dummyjson.com/products';
var noofPrd = 'number of products $';
var products = [];
let dragStartIndex;
function getProducts(skip = 0, limit = 10) {
    fetch(api_URL + `?skip=${skip}&limit=${limit}`)
        .then(res => {
            var result = res.json();
            result.then(f => {
                products = f.products.map(x => {
                    return {
                        id: x.id,
                        title: x.title,
                        price: x.price

                    }
                });
                document.getElementById('noOfPrd').innerHTML = noofPrd.replace('$', products.length);
                listItems();
                addEventListeners();
            })
        })
        .catch(err => {  // if api call is failed it will return the err msg
            console.log(err);
        })

}
getProducts();

function listItems() {
    let ul = document.getElementById('myList');
    ul.replaceChildren();
    products.forEach((x, i) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', i);
        li.setAttribute('id', x.id);
        li.innerHTML = ` 
    <div class="draggable" draggable="true" onmouseover="getProductById(${x.id})">${x.title} ${x.price}  
    </div>`;
        ul.appendChild(li);

    })
}

function addEventListeners() {   
    const draggables = document.querySelectorAll('.draggable');
    const dragListItems = document.querySelectorAll('#myList li');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    });

    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
    });
}


function getProductById(id) {
    // console.log(id)
    fetch(api_URL + '/' + id).then(result => {
        let res = result.json();
        res.then(f => {
            document.getElementById('desc').innerHTML = f.description == undefined ? 'nodata' : f.description;
            document.getElementById('price').innerHTML = f.price;
            document.getElementById('product-img').src = f.images.length>0?f.images[0]:'';

        })
    })
}

// function button(){
document.getElementById('btn').onclick = function () {
    let skip = document.getElementById('skip').value;
    let limit = document.getElementById('limit').value;
    console.log(skip, limit)
    getProducts(skip, limit==""?10:limit)
}

function sorting(filter = '') {
    if (filter == 'title') {
        products = products.sort(title);

    }
    else {
        products = products.sort(price)
    }

    listItems();

}
function title(a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
    }
    return 0;
}
function price(a, b) {
    if (a.price < b.price) {
        return -1;
    }
    if (a.price > b.price) {
        return 1;
    }
    return 0;
}

function dragStart() {
    dragStartIndex = +this.closest('li').getAttribute('data-index');
}


function dragOver(e) {
    e.preventDefault();
}

function dragDrop() {
    const dragEndIndex = +this.getAttribute('data-index');
    swapItems(dragStartIndex, dragEndIndex);
}

// Swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
    const listItems = document.querySelectorAll('#myList li');
    const itemOne = listItems[fromIndex].querySelector('.draggable');
    const itemTwo = listItems[toIndex].querySelector('.draggable');

    listItems[fromIndex].appendChild(itemTwo);
    listItems[toIndex].appendChild(itemOne);
}
