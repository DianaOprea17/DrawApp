const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const culoare1 = document.getElementById("culoare1"); //pentru selectarea culorii 
const culoare2 = document.getElementById("culoare2"); //pentru culoarea fundalului
const grosimeStr = document.getElementById("grosimeStr"); 

const cerc = document.getElementById("cerc");
const creion = document.getElementById("creion");
const patrat = document.getElementById("patrat");
const dreapta = document.getElementById("linie");
const elipsa = document.getElementById("elipsa");

canvas.width = 1200;
canvas.height = 500;

let array = []; //Salveaza starea canvasului
let deseneaza = false; //Pentru a verifica daca se deseneaza
let culoare = "#E065A4"; //Stocheaza culoarea curentă pentru linii.
let grosime = "2"; 
saveCanva = document.querySelector(".saveAS"); //Permite salvarea imaginii desenate

// Event listeners pentru desen
canvas.addEventListener("mousedown", startDesen);
canvas.addEventListener("mousemove", desen);
canvas.addEventListener("mouseup", stopDesen);

function startDesen(event) {
    deseneaza = true;
    ctx.beginPath();
    //move to seteaza punctul de start al desenului
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.strokeStyle = culoare;
    ctx.lineWidth = grosime;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    event.preventDefault();
    salveaza();
}

function desen(event) {
    if (deseneaza) {
        //ajusteaza pozitia mouse-ului astefl incat sa se tina cont de pozitia si dimensiunile canvasului
        //lline to seteaza traiectoria liniilor
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
    }
}

function stopDesen() { //opreste procesul de desen
    deseneaza = false;
}

// Functii pentru butoane si alte actiuni
function selecteazaCuloare() {
    culoare1.click();
}

culoare1.addEventListener("change", function() { //permite schimbarea culorii atunci cand se va apasa pe butonul culoare
    culoare = culoare1.value;
    salveaza();
});

function sterge() { //sterge intreg continutul canvasului
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = 'white'; //seteaza backgroundul alb
}

function salveaza() {  //Salveaza starea curenta a canvasului
    let state = {
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
        backgroundColor: canvas.style.backgroundColor
    };
    array.push(state);
}


function undo() { //sterge ultima modificare adusa canvas-ului
    if (array.length > 0) {
        let lastState = array.pop();
        ctx.putImageData(lastState.imageData, 0, 0);
        canvas.style.backgroundColor = lastState.backgroundColor;
    }
}


function fundal(){  //schimba culoarea fundalului
  const culoare2 = document.getElementById("culoare2");
  culoare2.click(); 
} 

culoare2.addEventListener("change", function() { //culoare2 face referinta la culoarea fundalului
canvas.style.backgroundColor = culoare2.value;
salveaza();
})

grosimeStr.addEventListener("click", function() {
    const grosime_noua = prompt("Grosime Stroke:");
    if (grosime_noua !== null && grosime_noua != 0 && grosime_noua > 0) {
        grosime = grosime_noua;
    } else {
        alert("Introduceți o altă valoare");
    }
});

saveCanva.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "ImagineDesenata.png";
    link.href = canvas.toDataURL();
    link.click();
});

// CERC -------------------------------------------------------------------------------------
desenareCerc = false;
let startX, startY;
let desenCurent = false; // Variabila pentru a verifica daca se deseneaza un cerc curent
let cercSelectat = null; 

cerc.addEventListener('click', function() { //atunci cand e apasat butonul cerc, celelalte butoane de desen sunt dezactivate
    desenareCerc = true;
    desenarePatrat = false;
    desenareLibera = false;
    desenareLinie = false;
    desenareElipsa = false;
});

canvas.addEventListener('mousedown', function(event) {
    if (desenareCerc) {
        desenCurent = true;
        //sunt ajustate pozitiile startX si startY in functie si de dimensiunile canvasului
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        ctx.beginPath();
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (desenCurent) {
        //se respecta dimensiunile canvasului in care e incadrat desenul
        let mouseX = event.clientX - canvas.offsetLeft;
        let mouseY = event.clientY - canvas.offsetTop;
        let radius = Math.sqrt(Math.pow((mouseX - startX), 2) + Math.pow((mouseY - startY), 2));
        actualizeazaCerc(startX, startY, radius);
    }
});

canvas.addEventListener('mouseup', function() {
    if (desenCurent) {
        desenCurent = false; // se finalizeaza desenarea cercului curent
    }
});

function actualizeazaCerc(x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); //cerc complet
    ctx.fillStyle = culoare;
    ctx.fill();
    ctx.restore();
}

function deseneazaCerc(x, y, radius) {
  cercuri.push({ x, y, radius, color });
  ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);  //2*Math.PI -> numarul de grade pe care il are cercul (360) 
    ctx.fillStyle = culoare;
    ctx.fill();
    ctx.closePath();
    
}
//CREION------------------------------------------------------------------------------

creion.addEventListener('click', function() {
  desenareCerc = false; // Dezactivati modul cerc
  desenarePatrat = false;
  desenareLibera = true; // Activarea modului de desenare libera
  desenareLinie = false;
  desenareElipsa = false;
});

let desenareLibera = false; // Variabila pentru a verifica daca se desenează liber

canvas.addEventListener('mousedown', function(event) {
  if (desenareLibera) {
      deseneaza = true;
      ctx.beginPath();
      ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
  }
});

canvas.addEventListener('mousemove', function(event) {
  if (deseneaza && desenareLibera) {
      ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
      ctx.stroke();
  }
});

canvas.addEventListener('mouseup', function() {
  if (desenareLibera) {
      deseneaza = false;
  }
});


// PATRAT -------------------------------------------------------------------------------------
let desenarePatrat = false;
let desenP = false; // Variabila pentru a verifica daca se deseneaza un patrat acum

patrat.addEventListener('click', function() {
    desenarePatrat = true;
    desenareCerc = false;
    desenareLibera = false;
    desenareLinie = false;
    desenareElipsa = false;
});

canvas.addEventListener('mousedown', function(event) {
    if (desenarePatrat) {
        desenP = true;
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        ctx.beginPath();
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (desenP) {
        let mouseX = event.clientX - canvas.offsetLeft;
        let mouseY = event.clientY - canvas.offsetTop;
        deseneazaPatrat(startX, startY, mouseX, mouseY);
        
    }
});

canvas.addEventListener('mouseup', function() {
    if (desenP) {
        desenP = false; 
    }
});

function deseneazaPatrat(startX, startY, endX, endY) {
   
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY); //creeaza un dreptunghi 
    ctx.fillStyle = culoare;
    ctx.fill();
    ctx.closePath();
    salveaza();
}


// DREAPTA -------------------------------------------------------------------------------------
let desenareLinie = false;
let  endX, endY;

dreapta.addEventListener('click', function() {
    desenarePatrat = false;
    desenareCerc = false;
    desenareLibera = false;
    desenareLinie = true;
    desenareElipsa = false;
});

//canvas.addEventListener('mousedown', startDesenLinie);
//canvas.addEventListener('mousemove', startDesenLinie);
//canvas.addEventListener('mouseup', stopDesenLinie);

function startDesenLinie(event) {
    if (desenareLinie) {
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        endX = startX; // Inițial, setăm endX și endY la aceleasi coordonate ca startX și startY
        endY = startY;
        ctx.beginPath();
    }
}

function deseneazaLinie(event) {
    if (desenareLinie) {
        endX = event.clientX - canvas.offsetLeft;
        endY = event.clientY - canvas.offsetTop;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

function stopDesenLinie() {
    if (desenareLinie) {
        ctx.closePath();
        salveaza();
    }
    desenareLinie = false;
}


//ELIPSA-------------------------------------------------------------------
let desenareElipsa = false;
let desenEL = false;

elipsa.addEventListener('click', function() {
    desenareElipsa = true;
    desenareCerc = false;
    desenarePatrat = false;
    desenareLibera = false;
    desenareLinie = false;
});

canvas.addEventListener('mousedown', function(event) {
    if (desenareElipsa) {
        desenEL = true;
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        ctx.beginPath();
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (desenEL) {
        let mouseX = event.clientX - canvas.offsetLeft;
        let mouseY = event.clientY - canvas.offsetTop;
        let radiusX = Math.abs(mouseX - startX);
        let radiusY = Math.abs(mouseY - startY);
        let rotation = 0; // Nu se rotește elipsa în această versiune
        actualizeazaElipsa(startX, startY, radiusX, radiusY, rotation);
    }
});

canvas.addEventListener('mouseup', function() {
    if (desenEL) {
        desenEL = false;
    }
});

function actualizeazaElipsa(x, y, radiusX, radiusY, rotation) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, radiusY / radiusX);
    ctx.arc(0, 0, radiusX, 0, 2 * Math.PI);
    ctx.fillStyle = culoare;
    ctx.fill();
    ctx.restore();
}

