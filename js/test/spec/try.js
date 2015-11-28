var render = rules => {
  var t = new Transliterator(rules);

  console.log(t.transliterate('PDLMA', 'ipa','y' ));
  
}
var url = 'http://glyph.local/~pat/Transliterate/transliterate/js/chatino-alphabet.json';

fetch(url)
  .then(r => r.json())
  .then(render)
  .catch(e => console.log(e))

