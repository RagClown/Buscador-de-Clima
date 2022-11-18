const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e){
    e.preventDefault()

    //validar
    
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad===''|| pais ===''){
        //hubo error
        mostrarError('Ambos campos son obligatorios')
    }

    //consultar la API
    consultAPI(ciudad, pais);
}

function mostrarError(msg){

    const alert = document.querySelector('.bg-red-100');

    if(!alert){
        //crear alerta
        const alert = document.createElement('div');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alert.innerHTML = `
            <stroing class="font-bold">Error!</strong>
            <span class="block">${msg}</span>
        `;
        container.appendChild(alert);

        //Se elimine la alerta despues de 5seg

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

function consultAPI(ciudad,pais){

    const appId = 'f91ad77cba060a778ec42ad3444ddee5'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`
    
    spinner();
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML(); //Limpiar el HTML previo
            console.log(datos)
            if(datos.cod === "404"){
                mostrarError('Ciudad no Encontrada')
                return;
            }

            //Imprime el HTML
            mostarClima(datos);
        })
}

function mostarClima(datos){

    const {name , main:{temp, temp_max, temp_min }} = datos
    
    const centigr = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nameCity = document.createElement('p');
    nameCity.textContent = `Clima en ${name}`;
    nameCity.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `${centigr} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p')
    tempMax.innerHTML=`Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p')
    tempMin.innerHTML=`Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nameCity);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);
    resultado.appendChild(resultadoDiv);

}

const kelvinACentigrados = grados => parseInt(grados - 273.15)

function limpiarHTML(){

    while (resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner(){

    limpiarHTML();

    const divSpinner = document.createElement('span');
    divSpinner.classList.add('loader', 'margin-auto')

    divSpinner.innerHTML =`<span class="loader"></span>`
    resultado.appendChild(divSpinner);
}