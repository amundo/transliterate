"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var XTransliterator = (function () {
  function XTransliterator(alphabet, orthographies) {
    _classCallCheck(this, XTransliterator);

    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
  }

  _createClass(XTransliterator, {
    validate: {
      value: function validate() {}
    },
    transliterate: {
      value: function transliterate(from, to, text) {
        var rules = this.alphabet.map(function (grapheme) {
          return [grapheme[from], grapheme[to]];
        });

        rules.sort(function (a, b) {

          if (a[1] == b[0]) {
            // feeding
            return -1;
          }
          if (a[0].length > b[0].length) {
            // longest input not first
            return -1;
          }
          return 1;
        });

        rules.forEach(function (rule, i) {
          var before = rule[0],
              after = rule[1];

          if (text.length && text.indexOf(before) > -1) {
            console.log("" + before + " > " + after);
          };

          text = text.replace(before, after);
        });

        return text;
      }
    }
  });

  return XTransliterator;
})();

var escape = function (raw) {
  return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
};

var descendingLength = function (a, b) {
  return a.length < b.length;
};

var phonemize = function (phonemes, text) {
  var phonemes = phonemes.sort(descendingLength);
  phonemes = phonemes.map(escape);
  var pattern = "(" + phonemes.join("|") + ")";
  var splitter = new RegExp(pattern, "g");

  return text.split(splitter).filter(function (x) {
    return x;
  });
};

var transliterate = function (rules, from, to, text) {
  var substitutions = rules.reduce(function (mapping, rule) {
    mapping[rule[from]] = rule[to];
    return mapping;
  }, {});

  var phonemes = rules.map(function (rule) {
    return rule[from];
  });
  var phonemized = phonemize(phonemes, text);

  return phonemized.reduce(function (transliterated, phoneme) {
    if (phoneme in substitutions) {
      transliterated += substitutions[phoneme];
    } else {
      transliterated += phoneme;
    }
    return transliterated;
  }, "");
};

var Transliterator = (function () {
  function Transliterator(alphabet, orthographies) {
    _classCallCheck(this, Transliterator);

    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
  }

  _createClass(Transliterator, {
    escape: {
      value: function escape(raw) {
        return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      }
    },
    descendingLength: {
      value: function descendingLength(a, b) {
        return a.length < b.length;
      }
    },
    phonemize: {
      value: function phonemize(phonemes, text) {
        var phonemes = phonemes.sort(descendingLength);
        phonemes = phonemes.map(escape);
        var pattern = "(" + phonemes.join("|") + ")";
        var splitter = new RegExp(pattern, "g");

        return text.split(splitter).filter(function (x) {
          return x;
        });
      }
    },
    transliterate: {
      value: function transliterate(from, to, text) {
        var rules = this.alphabet;
        var substitutions = rules.reduce(function (mapping, rule) {
          mapping[rule[from]] = rule[to];
          return mapping;
        }, {});

        var phonemes = rules.map(function (rule) {
          return rule[from];
        });
        var phonemized = this.phonemize(phonemes, text);

        return phonemized.reduce(function (transliterated, phoneme) {
          if (phoneme in substitutions) {
            transliterated += substitutions[phoneme];
          } else {
            transliterated += phoneme;
          }
          return transliterated;
        }, "");
      }
    }
  });

  return Transliterator;
})();

// check rules