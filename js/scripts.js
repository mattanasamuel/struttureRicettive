var strutture = [];
var listaProvincie = [];
var listaComuni = [];
var listaStrutture = []; //lista ottenuta dopo la filtratura per parametri di ricerca
selProvincia = document.getElementById('sel-provincia'); //elemento select campo provincia
selComune = document.getElementById('sel-comune'); //elemento select campo comune
selProvincia.addEventListener("change", loadComuni);
//selComune.addEventListener("change", loadStrutture);
let tabella = document.getElementById('tabella');
let carica = document.getElementById('btnLoad')
carica.addEventListener("click", loadStrutture)
let piscina = document.getElementById('esiste-piscina')
let ariaCondizionata = document.getElementById('aria-condizionata') //proprietà checked booleana
let animali = document.getElementsByName('animaliAmmessi') //ottengo una collezione di valori, tutti hanno nome "animali ammessi"

  




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
    if (!listaProvincie.includes(sr.Provincia)) { //riempimento arrayProvincie da array strutture
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


function loadComuni(){
  selComune.innerHTML = ""
  listaComuni = []
  listaComuni.push("tutti")
  for(const struttura of strutture)
  {
    //aggiunta dei comuni facenti parte della provincia su cui selectProvincia è valorizzato
      if(struttura.Provincia == selProvincia.value && !listaComuni.includes(struttura.Comune))
      {
        //console.log(struttura.Provincia)
        listaComuni.push(struttura.Comune)
      }
  }
  console.log(listaComuni)



  for(const comune of listaComuni)
  {
    let opt = document.createElement("option")
    opt.value = comune
    opt.textContent = comune
    selComune.appendChild(opt);
  }
}


function loadStrutture(){
  tabella.innerHTML = ""
  listaStrutture = []
  for(let struttura of strutture)
  {
    let aggiungi = true;
    if(selProvincia.value != struttura.Provincia && selProvincia.value != "tutte")
      aggiungi = false;
    if(selComune.value != struttura.Comune && selComune != "tutti")
      aggiungi = false;
    if(ariaCondizionata.checked == true && struttura.ariaCondizionata == "No")
      aggiungi = false;
    if(piscina.checked == true && struttura.piscina == "No")
      aggiungi = false;
    let opzioneSelezionata;
    for(let opzione of animali)
    {
      if(opzione.checked)
      {
        opzioneSelezionata = opzione;
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

  console.log(listaStrutture)



//ora è necessario creare la tabella dinamica
for(let struttura of listaStrutture)
{
  let row = document.createElement("tr")
  let rigaNome = document.createElement("td")
  rigaNome.value = struttura.Denominazione;
  rigaNome.textContent = rigaNome.value = struttura.Denominazione;
  row.appendChild(rigaNome)
  let rigaNumero = document.createElement("td")
  rigaNumero.value = struttura.Comune;
  rigaNumero.textContent = rigaNumero.value = struttura.Comune;
  row.appendChild(rigaNumero)
  let rigaIndirizzo = document.createElement("td")
  rigaIndirizzo.value = struttura.Indirizzo;
  rigaIndirizzo.textContent = rigaIndirizzo.value = struttura.Indirizzo;
  row.appendChild(rigaIndirizzo)
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