var 
  before = document.body.querySelector('#before textarea'),
  beforeChooser = document.body.querySelector('#before div.chooser'),
  after = document.body.querySelector('#after textarea'),
  afterChooser = document.body.querySelector('#after div.chooser'),
  radios = document.body.querySelectorAll('input[type="radio"]');

var runTransliteration = () => {
  var from = beforeChooser.value;
  var to = afterChooser.value;
  var transliterated = transliterator.transliterate(from, to, before.value);
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

var renderChooser = (orthography, fromTo) => `
  <label>
    <input name="from" value="${orthography}" data-${fromTo}="${orthography}" type="radio">
    ${orthography}
  </label>
`

var renderEditor = transliterator => {
  
}

var renderChooser = (transliterator, fromTo) => {
  var orthographies = Object.keys(transliterator.alphabet[0]);
  var chooser = renderChooser(orthography, fromTo);
  return orthographies.map(orthography => ).join('\n')
}

var renderTable = (alphabet, columns) => { 
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
  document.querySelector('#orthography').appendChild(json2table(alphabet, columns));
}


