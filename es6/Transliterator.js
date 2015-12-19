
class XTransliterator { 
  constructor(alphabet, orthographies){
    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
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
         before = rule[0],
         after = rule[1];

      if(text.length && text.indexOf(before) > -1 ){ console.log(`${before} > ${after}`) };

      text = text.replace(before, after);
    })

    return text; 

  }
}

var escape = (raw) => {
  return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}

var descendingLength = (a,b) => {
  return a.length < b.length
}

var phonemize = (phonemes, text) => {
  var phonemes = phonemes.sort(descendingLength);
  phonemes = phonemes.map(escape);
  var pattern = `(${phonemes.join('|')})`;
  var splitter = new RegExp(pattern, 'g');

  return text.split(splitter).filter(x => x); 
}

var transliterate = (rules, from, to, text) =>  {
  var substitutions = rules.reduce((mapping, rule) => {
    mapping[rule[from]] = rule[to];  
    return mapping;
  }, {})


  var phonemes = rules.map(rule => rule[from]);
  var phonemized = phonemize(phonemes, text);

  return phonemized.reduce((transliterated, phoneme) => {
    if(phoneme in substitutions){
      transliterated += substitutions[phoneme];
    } else { 
      transliterated += phoneme;
    }
    return transliterated;
  }, '')
}


class Transliterator {

  constructor(alphabet, orthographies){
    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
  }

  escape(raw){
    return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }
  
  descendingLength(a,b){
    return a.length < b.length
  }

  phonemize(phonemes, text){
    var phonemes = phonemes.sort(descendingLength);
    phonemes = phonemes.map(escape);
    var pattern = `(${phonemes.join('|')})`;
    var splitter = new RegExp(pattern, 'g');
  
    return text.split(splitter).filter(x => x); 
  }

  transliterate(from, to, text){
    var rules = this.alphabet;
    var substitutions = rules.reduce((mapping, rule) => {
      mapping[rule[from]] = rule[to];  
      return mapping;
    }, {})
  
    var phonemes = rules.map(rule => rule[from]);
    var phonemized = this.phonemize(phonemes, text);
  
    return phonemized.reduce((transliterated, phoneme) => {
      if(phoneme in substitutions){
        transliterated += substitutions[phoneme];
      } else { 
        transliterated += phoneme;
      }
      return transliterated;
    }, '')
  }

}



