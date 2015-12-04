var 
  before = document.body.querySelector('#before textarea'),
  radios = document.body.querySelectorAll('input[type="radio"]'),
  after = document.body.querySelector('#after textarea');

var runTransliteration = () => {
  var from = document.body.querySelector('#before input[type="radio"]:checked').value;
  var to = document.body.querySelector('#after input[type="radio"]:checked').value;

  var transliterated = chatino.transliterate(from, to, before.value);
  after.value = transliterated;

}

var listen = () => {
  before.addEventListener( 'keyup',  runTransliteration);
  after.addEventListener(  'keyup',  runTransliteration);
  before.addEventListener( 'change', runTransliteration);
  after.addEventListener(  'change', runTransliteration);
  
  [].forEach.call(radios, function(radio){
    radio.addEventListener('change', runTransliteration);
  })
}

var renderTable = alphabet => { 
  var json2table = (data, columns) => {
    var table = document.createElement('table');
    
    var headers = columns || Object.keys(data[0]);
    var ths = headers.map(h => `<th>${h}</th>`).join('');
    var thead = `<thead><tr>${ths}</tr></thead>`;
    table.insertAdjacentHTML('afterbegin', thead);
    var tbody = table.appendChild(document.createElement('tbody'));
    
    data.forEach(d => {
      var tr = document.createElement('tr');
      headers.forEach(header => {
        var td = document.createElement('td');
        td.textContent = d[header];
        tr.appendChild(td)
      })
      tbody.appendChild(tr);
    });
    
    return table;
  }

  var cmp = new Intl.Collator('es', { sensitivity: 'base'});
  alphabet = alphabet.sort((a,b) => cmp.compare(a.practical, b.practical));
  //language.alphabet.forEach(c => { delete c.ipa })

  listen();
  document.querySelector('#orthography').appendChild(json2table(alphabet));
}


