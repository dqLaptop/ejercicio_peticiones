import '../css/components.css'
const urlProductos = "https://fakestoreapi.com/products";

let tBody;
const divModal = document.querySelector('.modal');
const btnAceptar = document.querySelector('.aceptar');
const btnGuardar = document.querySelector('.guardar');
let cod = 0;

const obtenerProducto = async (cod) => {
    const resp = await fetch(`${urlProductos}/${cod}`);
    const { id, title, price, image } = await resp.json();
    return { id, title, price, image };
}
const getProductos = async (cod) => {
    try {
        const resp = await fetch(urlProductos);
        if (!resp.ok) { throw ('No se ha encontrado ningun producto'); }
        const data = await resp.json();
        return data;
    } catch (error) {
        throw error
    }
}

const crearProducto = async (producto) => {
    const resp = await fetch(urlProductos, {
        method: 'POST',
        body: JSON.stringify(producto),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await resp.json();
}

const actualizarProducto = async (id, producto) => {
    const resp = await fetch(`${urlProductos}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(producto),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await resp.json();
}

const borrarProducto = async (id) => {
    const resp = await fetch(`${urlProductos}/${id}`, {
        method: 'DELETE'
    });

    return (resp.ok) ? 'Borrado' : 'No se pudo eliminar';
}

const crearTabla = () => {
    const html = `
    <h1 class="mt-5">Productos</h1>
    <hr>

    <table class="table">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Imagen</th>
                <th scope="col">Modificar</th>
                <th scope="col">Eliminar</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    `;

    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('body').appendChild(div);
    tBody = document.querySelector('tbody');
}
const crearFilaProducto = (producto) => {

    const html = `
        <td scope="col"> ${producto.id} </td>
        <td scope="col"> ${producto.title} </td>
        <td scope="col"> ${producto.price} </td>
        <td scope="col">
            <img class="img-thumbnail" src="${producto.image}" style: width=200px>
        </td>
        <td scope="col"><button type="button" class="btn btn-primary modificar">Modificar</button></td>
        <td scope="col"><button type="button" class="btn btn-danger eliminar">Eliminar</button></td>
    `;

    const tr = document.createElement('tr');
    tr.innerHTML = html;
    tr.setAttribute('id', "A" + producto.id);

    tBody.appendChild(tr);
    document.querySelectorAll('.modificar').forEach(btn => {
        btn.addEventListener('click', functionModificar)
    });
    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', functionEliminar)
    });
}

export const init = async () => {
    crearTabla();
    const productos = await getProductos();
    productos.forEach(p =>
        crearFilaProducto(p));

}

const functionModificar = async (e) => {
    divModal.classList.remove('desaparecer');
    divModal.classList.add('aparecer');
    btnAceptar.classList.remove('aparecer');
    btnAceptar.classList.add('desaparecer');
    btnGuardar.classList.remove('desaparecer');
    btnGuardar.classList.add('aparecer');

    let id = e.target.parentNode.parentNode.id;
    let cod = id.charAt(id.length - 1);
    let pro = await obtenerProducto(cod);
    document.querySelector('#nom').value = pro.title;
    document.querySelector('#precio').value = pro.price;
    document.querySelector('#img').value = pro.image;
}
document.querySelector('.cerrar').addEventListener('click', function () {
    divModal.classList.remove('aparecer');
    divModal.classList.add('desaparecer');
    document.querySelector('#nom').value = '';
    document.querySelector('#precio').value = '';
    document.querySelector('#img').value = '';
});
btnGuardar.addEventListener('click', async (e) => {
    divModal.classList.remove('aparecer');
    divModal.classList.add('desaparecer');

    let pro = {
        id: cod,
        title: document.querySelector('#nom').value,
        price: document.querySelector('#precio').value,
        descripcion: '',
        image: document.querySelector('#img').value,
        category: ''

    }
    actualizarProducto(cod, pro);
    document.querySelector('#nom').value = '';
    document.querySelector('#precio').value = '';
    document.querySelector('#img').value = '';
});
const functionEliminar = async (e) => {
    let id = e.target.parentNode.parentNode.id;
    let respuesta = await borrarProducto(id.charAt(id.length - 1));
    console.log(respuesta);
    if (respuesta === 'Borrado') {
        e.target.parentNode.parentNode.removeChild(document.querySelector('#' + id));
    } else {
        alert('No se pudo borrar');
    }
}

document.querySelector('.add').addEventListener('click', async (e) => {
    divModal.classList.remove('desaparecer');
    divModal.classList.add('aparecer');
    btnAceptar.classList.remove('desaparecer');
    btnAceptar.classList.add('aparecer');
    btnGuardar.classList.remove('aparecer');
    btnGuardar.classList.add('desaparecer');
});
btnAceptar.addEventListener('click', async () => {
    console.log('entro');
    divModal.classList.remove('aparecer');
    divModal.classList.add('desaparecer');
    const productos = await getProductos();
    let num = productos.length + 1;
    let pro = {
        id: num,
        title: document.querySelector('#nom').value,
        price: document.querySelector('#precio').value,
        descripcion: '',
        image: document.querySelector('#img').value,
        category: ''
    }
    crearProducto(pro);
    crearFilaProducto(pro);
    document.querySelector('#nom').value = '';
    document.querySelector('#precio').value = '';
    document.querySelector('#img').value = '';
});






