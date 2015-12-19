class TransliterationTableView  {
  constructor(transliterator){
    this.transliterator = transliterator;
  }

  json2table(data, columns){
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

  render(alphabet, columns){ 

    var cmp = new Intl.Collator('es', { sensitivity: 'base'});
    alphabet = alphabet.sort((a,b) => cmp.compare(a.practical, b.practical));

    listen();
    return json2table(alphabet, columns);
  }

  listen(){

  }
}

class TransliterationEditorView  {
  constructor(transliterator){
    this.transliterator = transliterator;
  }

  renderChooser(orthography){
    return `<label>
      <input name="from" value="${orthography}" type="radio">
      ${orthography}
    </label>
    `
  }

  template(){
     return `
      <section class=before>
        <div class=chooser>${this.transliterator.orthographies.map(fromOrthography => `
          <label><input name="from" value="${fromOrthography}" type="radio" />${fromOrthography}</label>
        `).join('\n')}
        </div>
        <textarea spellcheck="false"></textarea>
      </section>

      <section class=after>
        <div class=chooser>${this.transliterator.orthographies.map(toOrthography => `
          <label><input name="to" value="${toOrthography}" type="radio" />${toOrthography}</label>
        `).join('\n')}
        </div>
        <textarea spellcheck="false"></textarea>
      </section>
    `
  }

  render(){
    var container = document.createElement('section');
    container.classList.add('transliterationEditor');
    container.innerHTML = this.template();
    this.el = container;
    this.listen();
    return this.el;
  }

  runTransliteration(){
    var before = this.el.querySelector('.before textarea');
    var after = this.el.querySelector('.after textarea');
    var to   = this.el.querySelector('.before input[type="radio"]:checked').value;
    var from = this.el.querySelector('.after  input[type="radio"]:checked').value;
console.log([to, from]);
    var transliterated = this.transliterator.transliterate(from, to, before.value);
    after.value = transliterated;
  }

  listen(){
    var tas = [... this.el.querySelectorAll('textarea')];
    var radios = [... this.el.querySelectorAll('input[type="radio"]')];

    tas.forEach(ta => {
      ta.addEventListener('change', this.runTransliteration);
      ta.addEventListener('keyup', () => { console.log('ohai'); this.runTransliteration() });
    })

    radios.forEach(radio => {
      radio.addEventListener('change', this.runTransliteration);
    })
  }
}

class TransliteratorLayout {
  constructor(transliterator){
    this.transliterator = transliterator;
 
    this.table = new TransliterationTableView(this.transliterator);
    this.editor = new TransliterationEditorView(this.transliterator);
  }

  template(){
  }
 
  render(){
    return this.template()
  }
}
