"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var show = function (o) {
  return JSON.stringify(o, null, 2);
};

var where = function (collection, criteria) {
  var attrs = Object.keys(criteria);

  return collection.filter(function (item) {
    return attrs.every(function (attr) {
      var value = criteria[attr];
      return item[attr] == value;
    });
  });
};

var frequency = function (sequence) {
  return sequence.reduce(function (tally, item) {
    item in tally ? tally[item] += 1 : tally[item] = 1;
    return tally;
  }, {});
};

var Phonology = (function () {
  function Phonology() {
    var _this = this;

    _classCallCheck(this, Phonology);

    fetch("http://glyph.local/~pat/Phonology/ipatable/ipa.json").then(function (response) {
      return response.json();
    }).then(function (data) {
      return _this.ipa = data;
    });
  }

  _createClass(Phonology, {
    lookup: {
      value: function lookup(query) {
        return where(this.ipa, query);
      }
    }
  });

  return Phonology;
})();

var Language = (function () {
  function Language(data) {
    _classCallCheck(this, Language);

    Object.assign(this, data);
  }

  _createClass(Language, {
    phonemize: {
      value: function phonemize(text) {
        //var ipaText = this.transliterate(this.transliteration, 'ipa', text);
        var phonemeList = this.alphabet.map(function (c) {
          return c.ipa;
        });
        var phonemeListByLength = phonemeList.sort(function (a, b) {
          return a.length > b.length;
        }).reverse();
        var phonemeRE = new RegExp("" + phonemeListByLength.join("|"), "g");
        return text.match(phonemeRE).map(function (c) {
          return c.normalize("NFC");
        }).filter(function (c) {
          return c;
        });
      }
    },
    escape: {

      // if a string to be transliterated contains any characters which have special
      // meaning in regular expressions, escape them

      value: function escape(raw) {
        return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      }
    },
    depunctuate: {
      value: function depunctuate(text) {
        var punctuation = arguments[1] === undefined ? ".?!" : arguments[1];

        var re = new RegExp("[" + punctuation + "]", "g");
        return text.replace(re, "");
      }
    },
    segment: {
      value: function segment(plainText) {
        var _this = this;

        var sentenceDelimiters = arguments[1] === undefined ? "!.?" : arguments[1];

        var sentenceDelimiterRE = new RegExp("[" + sentenceDelimiters + "]", "g");

        var transcriptions = plainText.trim().split(sentenceDelimiterRE).map(function (phrase) {
          return _this.depunctuate(phrase);
        }).filter(function (t) {
          return t;
        });

        this.phrases = transcriptions.map(function (t) {
          return new Phrase({ transcription: t });
        });
      }
    },
    transliterate: {
      value: function transliterate(from, to, text) {
        var _this = this;

        if (!this.alphabet) {
          return text;
        }var rules = this.alphabet.map(function (grapheme) {
          return [grapheme[from], grapheme[to]];
        });

        rules.sort(function (a, b) {
          var left = rules.map(function (rule) {
            return rule[0];
          });

          var feeding = left.indexOf(b[1]) > -1 && left.indexOf(b[1]) < left.indexOf(a[1]);

          return feeding || a[0].length > b[0].length ? -1 : 1;
          //return  (a[0].length > b[0].length) ? -1 : 1;
        });

        console.log("\n");
        rules.forEach(function (rule) {
          var before = _this.escape(rule[0]),
              after = _this.escape(rule[1]),
              re = new RegExp(before, "g");

          if (text.indexOf(before) > -1) {
            console.log("" + before + " → " + after);
          };
          text = text.replace(re, rule[1]);
        });

        return text;
      }
    }
  });

  return Language;
})();

var Word = (function () {
  function Word(data) {
    _classCallCheck(this, Word);

    Object.assign(this, data);
  }

  _createClass(Word, {
    distance: {
      value: function distance(rules) {}
    },
    same: {
      value: function same(other) {
        var _this = this;

        return Object.keys(this).every(function (key) {
          return other[key] == _this[key];
        });
      }
    },
    tag: {
      value: function tag(rules) {
        var _this = this;

        rules.forEach(function (rule) {
          var pattern = rule[0],
              wordClass = rule[1];
          var plain = _this.token.replace(/-/g, "");
          if (plain.match(new RegExp(pattern))) {
            _this.wordClass = wordClass;
          }
        });
      }
    },
    phonemes: {
      get: function () {
        if (this.language) {
          return this.language.phonemize(this.token);
        } else {
          return this.token.split("");
        }
      }
    }
  });

  return Word;
})();

var Phrase = (function () {
  function Phrase(data) {
    _classCallCheck(this, Phrase);

    this.transcription = data.transcription;
    this.translation = data.translation;
    this.words = this.tokenize(data.transcription);
  }

  _createClass(Phrase, {
    tokenize: {
      value: function tokenize() {
        var tokens = this.transcription.toLowerCase().trim().replace(/[ \.\?]+/g, " ").split(/[ ]+/g);

        return tokens.map(function (token) {
          return new Word({ token: token });
        });
      }
    }
  });

  return Phrase;
})();

var FormatParser = (function () {
  function FormatParser(text, parse) {
    _classCallCheck(this, FormatParser);

    return this.parse(text);
  }

  _createClass(FormatParser, {
    read: {
      value: function read(plainText) {
        this.segment(plainText);
        return this;
      }
    }
  });

  return FormatParser;
})();

var parseMonolingual = function (text) {
  return text.trim().split(/\n\n/g).map(function (p) {
    return p.split(/\n/g).map(String.trim);
  }).map(function (pair) {
    return {
      transcription: pair[0],
      translation: pair[1]
    };
  });
};

var parseBilingual = function (text) {
  return text.trim().split(/\n\n/g).map(function (p) {
    return p.split(/\n/g).map(String.trim);
  }).map(function (p) {
    return {
      transcription: pair[0],
      translation: pair[1]
    };
  });
};

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

var Text = (function () {
  function Text(data) {
    _classCallCheck(this, Text);

    this.initialize(data);
    var defaults = {
      metadata: {
        title: "",
        language: "" },
      phrases: []
    };
  }

  _createClass(Text, {
    initialize: {
      value: function initialize(data) {
        if (data) {
          Object.assign(this, data);
        }
      }
    },
    allWords: {
      get: function () {
        return this.phrases.reduce(function (words, phrase) {
          words = words.concat(phrase.words);
          return words;
        }, []);
      }
    }
  });

  return Text;
})();

var Corpus = (function () {
  function Corpus(data) {
    _classCallCheck(this, Corpus);

    this.texts = [];
  }

  _createClass(Corpus, {
    load: {
      value: function load(urls) {
        var _this = this;

        var promises = urls.map(function (url, i) {
          return fetch(url).then(function (resp) {
            return resp.json();
          });
        });

        return Promise.all(promises).then(function (fetched) {
          return fetched.forEach(function (text) {
            _this.texts.push(new Text(text));
            return _this.texts;
          });
        });
      }
    },
    allWords: {
      get: function () {
        return this.texts.reduce(function (words, text) {
          words = text.allWords.concat(text.words);
          return words;
        }, []);
      }
    }
  });

  return Corpus;
})();

var Lexicon = (function () {
  function Lexicon(data) {
    _classCallCheck(this, Lexicon);

    this.words = data.words;
    this.title = data.title;
  }

  _createClass(Lexicon, {
    add: {
      value: function add(word) {}
    },
    lookup: {
      value: function lookup(query) {
        var attrs = Object.keys(query);

        return this.words.filter(function (word) {
          return attrs.every(function (key) {

            var pattern = query[key];
            if (pattern instanceof RegExp) {
              return word[key].match(pattern);
            } else {
              return pattern == word[key];
            }
          });
        });
      }
    }
  });

  return Lexicon;
})();

// classify(datum){
//     if(datum instanceof Phrase){
//       return 'Phrase'
//     } else if (datum instanceof Word) {
//       return 'Word'
//     }
// }