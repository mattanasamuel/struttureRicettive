var strutture = [];
var listaProvincie = [];
var listaComuni = [];
var listaStrutture = []; //lista ottenuta dopo la filtratura per parametri di ricerca
let selProvincia = document.getElementById('sel-provincia'); //elemento select campo provincia
let selComune = document.getElementById('sel-comune'); //elemento select campo comune
selProvincia.addEventListener("change", loadComuni);
//selComune.addEventListener("change", loadStrutture);
let tabella = document.getElementById('tabella');
let carica = document.getElementById('btnLoad')
carica.addEventListener("click", loadStrutture)

let piscina = document.getElementById('esiste-piscina') //input type checkbox
let ariaCondizionata = document.getElementById('aria-condizionata') //input type checkbox
let animaliAmmessi = document.getElementsByName('animaliAmmessi')



async function loadInitialData() {
  const requestURL =
    "json/Regione-Veneto---Elenco-strutture-ricettive.json";

  try {
    // after this line, our function will wait for the `fetch()` call to be settled
    // the `fetch()` call will either return a Response or throw an error
    const response = await fetch(requestURL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    strutture = await response.json();
    //console.log(strutture[0].Comune);
  } catch (error) {
    console.error(`Errore reperimento strutture recettive: ${error}`);
  }

  listaProvincie.push("tutte") //lista provincie è un array di stringhe!!! servirà per valorizzare le option figlie di selectProvincia
  for (const sr of strutture) {
    if (!listaProvincie.includes(sr.Provincia)) 
    { //riempimento arrayProvincie da array strutture
      listaProvincie.push(sr.Provincia);
    }
  }

  for(let provincia of listaProvincie) //creazione delle opzioni del select "provincia"
  {
    let opt = document.createElement("option");
    opt.value = provincia;
    opt.textContent = provincia;
    selProvincia.appendChild(opt);
  }
    /*
    if (!listaComuni.includes(sr.Comune)) {  //riempimento array comuni da array strutture
      listaComuni.push(sr.Comune);
      let opt = document.createElement("option");
      opt.value = sr.Comune;
      opt.textContent = sr.Comune;
      selComune.appendChild(opt);
    }
      */
  }

  for(let provincia of listaProvincie)
  {
    let opt = document.createElement("option");
    opt.value = provincia;
    opt.textContent = provincia;
    selProvincia.appendChild(opt);
  }




}



function loadComuni(){
  selComune.innerHTML = ""
  listaComuni = []
  listaComuni.push("tutti")
  for(const struttura of strutture)
  {

      if(struttura.Provincia == selProvincia.value || selProvincia.value == "all")
      {
        //console.log(struttura.Provincia)
        if(!listaComuni.includes(struttura.Comune))
          listaComuni.push(struttura.Comune)
      }
  }


  console.log(listaComuni)



  //creazione dell'opzione standard "tutti"
  let standard = document.createElement("option");
  standard.value = "all";
  standard.textContent = "--Seleziona comune della struttura--"
  selComune.appendChild(standard)

  for(const comune of listaComuni)
  {
    let opt = document.createElement("option")
    opt.value = comune
    opt.textContent = comune
    selComune.appendChild(opt);
  }
}



//da modificare

function loadStrutture(){
  tabella.innerHTML = ""
  listaStrutture = []
  let opzioneSelezionata
  for(let opzione of animaliAmmessi)
  {
    if(opzione.checked)
    {
      opzioneSelezionata = opzione;
    }
  }
  console.log(opzioneSelezionata.value)

  for(let struttura of strutture)
  {

    if(struttura.Provincia == selProvincia.value || selProvincia.value == "all")
    {
      if(struttura.Comune == selComune.value || selComune.value == "all")
      {
        let aggiungi = true;
        if(piscina.checked)
        {
          if(struttura.Piscina == "No")
            aggiungi=false;
        }
        if(ariaCondizionata.checked)
        {
          if(struttura.AriaCondizionata == "No")
          {
            aggiungi = false;
          }
        }
        switch(opzioneSelezionata.value)
        {
          case "Si" :
            if(struttura.AnimaliAmmessi == "No")
            {
              aggiungi = false;
            }
            break;

          case "No" :
            if(struttura.AnimaliAmmessi == "Si")
            {
              aggiungi = false;
            }
            break;
          case "Indifferente" :
            break;
        }
        if(aggiungi == true)
        {
          listaStrutture.push(struttura);
        }
      }
    }
    //console.log(opzioneSelezionata)
    switch(opzioneSelezionata.value)
    {
      case "Si":
        if(struttura.animaliAmmessi == "No")
          aggiungi = false;
        break;
      
      case "No":
        if(struttura.animaliAmmessi == "Si")
          aggiungi = false;
        break;
    }
    if(aggiungi)
      listaStrutture.push(struttura);
  }

//ora è necessario creare la tabella dinamica
for(let struttura of listaStrutture)
{
  let row = document.createElement("tr")
  let rigaNome = document.createElement("td")
  rigaNome.value = struttura.Denominazione;
  rigaNome.textContent = rigaNome.value = struttura.Denominazione;
  row.appendChild(rigaNome)
  let rigaComune = document.createElement("td")
  rigaComune.value = struttura.Comune;
  rigaComune.textContent = rigaComune.value = struttura.Comune;
  row.appendChild(rigaComune)
  
  let rigaSriaCondizionata = document.createElement("td")
  rigaSriaCondizionata.value = struttura.AriaCondizionata;
  rigaSriaCondizionata.textContent = rigaSriaCondizionata.value = struttura.AriaCondizionata;
  row.appendChild(rigaSriaCondizionata)
  
  let rigaAnimaliAmmessi = document.createElement("td")
  rigaAnimaliAmmessi.value = struttura.AnimaliAmmessi;
  rigaAnimaliAmmessi.textContent = rigaAnimaliAmmessi.value = struttura.AnimaliAmmessi;
  row.appendChild(rigaAnimaliAmmessi)

  let rigaPiscina = document.createElement("td")
  rigaPiscina.value = struttura.Piscina;
  rigaPiscina.textContent = rigaPiscina.value = struttura.Piscina;
  row.appendChild(rigaPiscina)
  
  
  tabella.appendChild(row)
}
let risultati = document.getElementById('risultati')
let numeroRisultati = document.getElementById('numeroRisultati')
risultati.style.display = "block"
numeroRisultati.innerHTML = listaStrutture.length
numeroRisultati.style.display = "inline"
if(listaStrutture.length == 0)
{
  risultati.style.color = "red"
}
else if(listaStrutture.length > 0)
{
  risultati.style.color = "green"
}
}






loadInitialData()