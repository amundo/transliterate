
class Transliterator { 
  constructor(alphabet){
    this.alphabet = alphabet;
  }

  // if a string to be transliterated contains any characters which have special
  // meaning in regular expressions, escape them
  escape(raw){
    return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }
  
  validate(){
    // check rules
  }

  transliterate(from, to, text){
    var rules = this.alphabet.map(grapheme => [grapheme[from], grapheme[to]]);

    rules.sort((a,b) => {

      if(a[1] == b[0]){  // feeding
        return -1 
      }
      if(a[0].length > b[0].length){  // longest input not first
        return -1 
      }
      return 1;

    })

    rules.forEach((rule,i) => {
      var 
         before = this.escape(rule[0]),
         after = this.escape(rule[1]),
         re = new RegExp(before, 'g');

      text = text.replace(re, rule[1]);
    })

    return text; 

  }
}

