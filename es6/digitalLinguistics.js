var show = o => JSON.stringify(o, null, 2)

var where = (collection, criteria) => {
  var
    attrs = Object.keys(criteria)

  return collection.filter(function(item){
    return attrs.every(function(attr){
      var value = criteria[attr];
      return item[attr] == value;
    })
  })
}

var frequency = sequence => {
  return sequence.reduce((tally, item) => {
    item in tally ? tally[item] += 1 : tally[item] = 1;
    return tally;
  }, {})
}

class Phonology {
  constructor(){
    fetch('http://glyph.local/~pat/Phonology/ipatable/ipa.json')
      .then(response => response.json())
      .then(data => this.ipa = data)
  }

  lookup(query){
    return where(this.ipa, query)
  }
}

class Language {
  constructor(data){
    Object.assign(this, data);
  }

  phonemize(text){
    //var ipaText = this.transliterate(this.transliteration, 'ipa', text); 
    var phonemeList = this.alphabet.map(c => c.ipa);
    var phonemeListByLength = phonemeList.sort((a,b) => a.length>b.length).reverse();
    var phonemeRE = new RegExp(`${phonemeListByLength.join('|')}`, 'g');
    return text.match(phonemeRE).map(c => c.normalize('NFC')).filter(c=>c);
  }

  // if a string to be transliterated contains any characters which have special
  // meaning in regular expressions, escape them
  escape(raw){
      return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }

  depunctuate(text, punctuation='.?!'){
    var re = new RegExp(`[${punctuation}]`, 'g');
    return text.replace(re, '');
  }

  segment(plainText, sentenceDelimiters='!.?'){
    var sentenceDelimiterRE = new RegExp(`[${sentenceDelimiters}]`,'g');

    var transcriptions = plainText
      .trim()
      .split(sentenceDelimiterRE)
      .map(phrase => this.depunctuate(phrase))
      .filter(t => t);
    
    this.phrases = transcriptions.map(t => {
      return new Phrase({transcription: t})
    }) 
  }

  transliterate(from, to, text){
    if(!this.alphabet) return text;

    var rules = this.alphabet.map(grapheme => {
      return [grapheme[from], grapheme[to]];
    })

    rules.sort((a,b) => {
      var left = rules.map(rule => rule[0]);

      var feeding = (left.indexOf(b[1]) > -1) && (left.indexOf(b[1]) < left.indexOf(a[1]));

      return feeding || (a[0].length > b[0].length) ? -1 : 1;
      //return  (a[0].length > b[0].length) ? -1 : 1;
    })

    console.log('\n');
    rules.forEach(rule =>  {
      var 
        before = this.escape(rule[0]),
        after = this.escape(rule[1]),
        re = new RegExp(before, 'g');

      if(text.indexOf(before) > -1){ console.log(`${before} → ${after}`) };
      text = text.replace(re, rule[1]);
    })

    return text; 
  }
}


class Word { 
  constructor(data){
    Object.assign(this,data)
  }

  distance(rules){
  }

  same(other){
    return Object.keys(this)
      .every(key => other[key] == this[key])
  }

  tag(rules){
    rules.forEach(rule => {
      var pattern = rule[0], wordClass = rule[1];
      var plain = this.token.replace(/-/g, '');
      if(plain.match(new RegExp(pattern))){
        this.wordClass = wordClass;
      }
    })
  }

  get phonemes(){
    if(this.language){
      return this.language.phonemize(this.token)
    } else {
      return this.token.split('');
    }
  }
}

class Phrase {
  constructor(data){
    this.transcription = data.transcription;
    this.translation = data.translation;
    this.words = this.tokenize(data.transcription);
  }

  tokenize(){
    var tokens = this.transcription
      .toLowerCase()
      .trim()
      .replace(/[ \.\?]+/g, ' ') 
      .split(/[ ]+/g)

    return tokens.map(token =>  {
      return new Word({token: token})
    })
  }
}

class FormatParser {
  
  constructor(text, parse){
    return this.parse(text);
  }

  read(plainText){
    this.segment(plainText); 
    return this;
  }
}

var parseMonolingual = text => {
  return text
    .trim()
    .split(/\n\n/g)
    .map(p => p.split(/\n/g).map(String.trim))
    .map(pair => {
      return {
        transcription: pair[0], 
        translation: pair[1]
      }
    }) 
}

var parseBilingual = text => {
  return text
    .trim()
    .split(/\n\n/g)
    .map(p => p.split(/\n/g).map(String.trim))
    .map(p => {
      return {
        transcription: pair[0], 
        translation: pair[1]
      }
    }) 
}

/*

  Text - text object

  data: {
    metadata? {
      language!
      title!
    }
    phrases? [
     
    ]
  }

*/
class Text {
  constructor(data){
    this.initialize(data);
    var defaults = {
      metadata: {
        title: "",
        language: "",
      },
      phrases: []
    }
  }

  initialize(data){
    if(data){ 
      Object.assign(this, data);
    } 
  }

  get allWords(){
    return this.phrases.reduce((words, phrase) => {
       words = words.concat(phrase.words);
       return words;
    }, [])
  }
}

class Corpus {
  constructor(data){
    this.texts = [];
  }

  load(urls){
    var promises = urls.map((url,i) => {
      return fetch(url)
        .then(resp => resp.json())
    })

    return Promise.all(promises)
      .then(fetched => fetched.forEach(text => {
        this.texts.push(new Text(text))
        return this.texts;
      }))
  }

  get allWords(){
    return this.texts.reduce((words, text) => {
      words = text.allWords.concat(text.words);
      return words;
    }, [])
  }
}

class Lexicon {
  constructor(data){
    this.words = data.words;
    this.title = data.title;
  }

  add(word){
  }

  lookup(query){
    var attrs = Object.keys(query);
    
    return this.words.filter(function(word){
      return attrs.every(function(key){

        var pattern = query[key];
        if(pattern instanceof RegExp) { 
          return  word[key].match(pattern);
        } else { 
          return  pattern == word[key];
        }

      })
    })
  }
}

// classify(datum){
//     if(datum instanceof Phrase){
//       return 'Phrase' 
//     } else if (datum instanceof Word) {
//       return 'Word'
//     }
// }

