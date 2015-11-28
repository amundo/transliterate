
class Transliterator { 
  constructor(alphabet){
    this.alphabet = alphabet;
  }

  // if a string to be transliterated contains any characters which have special
  // meaning in regular expressions, escape them
  escape(raw){
      return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }

  transliterate(from, to, text){
    if(!this.alphabet) return text;

    var rules = this.alphabet.map(grapheme => {
      return [grapheme[from], grapheme[to]];
    })

    //console.log(rules.map(r => `${r[0]} ${r[1]}`).join('\n'));

    rules.sort((a,b) => {

      var feeding = (a,b) => a[1] == b[0];

      return feeding || (a[0].length < b[0].length) ? -1 : 1;
    })

    rules.forEach(rule => {
      var 
        before = this.escape(rule[0]),
         after = this.escape(rule[1]),
            re = new RegExp(before, 'g');

      text = text.replace(re, rule[1]);
    })

    return text; 
  }
}

