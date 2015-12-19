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

  render(columns){ 
    var cmp = new Intl.Collator('es', { sensitivity: 'base'});
    var alphabet = this.transliterator.alphabet;
    var columns = columns || this.transliterator.orthographies;
    alphabet = alphabet.sort((a,b) => cmp.compare(a.practical, b.practical));

    alphabet = alphabet.filter(c => {
      var orthographies = this.transliterator.orthographies;
      var transliterations = Object.keys(c).map(k => c[k]);
      return new Set(transliterations).size != 1;
    })

    return this.json2table(alphabet, columns);
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
    var a = container.querySelector('.before input[name="from"]:last-child');
    var b = container.querySelector('.after  input[name="to"]:first-child');

    container.querySelector('.before label:first-child').querySelector('input').checked = true;
    container.querySelector('.after label:last-child').querySelector('input').checked = true;
    this.el = container;
    this.listen();
    return this.el;
  }

  runTransliteration(){
    var before = this.el.querySelector('.before textarea');
    var after = this.el.querySelector('.after textarea');
    var from   = this.el.querySelector('.before input[type="radio"]:checked').value;
    var to = this.el.querySelector('.after  input[type="radio"]:checked').value;
    var transliterated = this.transliterator.transliterate(from, to, before.value);
    after.value = transliterated;
  }

  listen(){
    var tas = [... this.el.querySelectorAll('textarea')];
    var radios = [... this.el.querySelectorAll('input[type="radio"]')];

    tas.forEach(ta => {
      ta.addEventListener('change', () => { this.runTransliteration() });
      ta.addEventListener('keyup',  () => { this.runTransliteration() });
    })

    radios.forEach(radio => {
      radio.addEventListener('change', ev => { this.runTransliteration() });
      radio.addEventListener('keyup',  ev => { this.runTransliteration() });
    })
  }
}

class TransliterationInputView {
  constructor(transliterator, input){
    this.input = input;
    this.transliterator = transliterator;
    this.listen();
  } 

  render(){
    [... document.querySelectorAll('p.transliterated')].forEach(p => {
      p.remove();
    })

    var orthographies = this.transliterator.orthographies;

    orthographies.forEach(o => {
      this.input.dataset[o] = this.transliterator.transliterate(this.input.lang, o, this.input.value)
    })
   
    orthographies.forEach(o => {
      if(o != this.input.lang){
        this.input.insertAdjacentHTML('afterend', `<p class=transliterated lang="${o}"><small>${o}</small> ${this.input.dataset[o]}</p>`)
      }
    })

  }

  listen(){
    this.input.addEventListener('keyup', ev => this.render());
  }

}

class TransliterationLayout {
  constructor(transliterator){
    this.transliterator = transliterator;
 
    this.table = new TransliterationTableView(this.transliterator);
    this.editor = new TransliterationEditorView(this.transliterator);

    this.container = document.createElement('section');
    this.container.classList.add('transliterationLayout')
  }

  render(){
    this.container.appendChild(this.table.render());
    this.container.appendChild(this.editor.render());
    return this.container;
  }
}
