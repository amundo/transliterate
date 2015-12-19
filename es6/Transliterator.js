
class Transliterator { 
  constructor(alphabet, orthographies){
    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
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
         before = String.raw`${rule[0]}`,
         after = String.raw`${rule[1]}`;

      text = text.replace(before, after);
    })

    return text; 

  }
}

