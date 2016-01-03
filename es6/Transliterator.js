class Transliterator {

  constructor(alphabet, orthographies){
    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
  }

  escape(unescaped){ // do we really need this?
    return unescaped.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }

  phonemize(phonemes, text){
    phonemes.sort((a,b) => (a.length < b.length) ? 1 : -1);

    phonemes = phonemes.map(this.escape);

    var pattern = `(${phonemes.join('|')})`;
    var splitter = new RegExp(pattern, 'g');
  
    return text.split(splitter).filter(x => x); 
  }

  transliterate(from, to, text){
    var substitutions = {};

    this.alphabet.forEach(letter => {
      substitutions[letter[from]] = letter[to];
    })
  
    var phonemes = this.alphabet.map(letter => letter[from]);
    var phonemeList = this.phonemize(phonemes, text);

    return phonemeList.map(phoneme => {
      return substitutions[phoneme] ? substitutions[phoneme] : phoneme;
    }).join('');
  }
}


