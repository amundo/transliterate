"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Transliterator = (function () {
  function Transliterator(alphabet, orthographies) {
    _classCallCheck(this, Transliterator);

    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
  }

  _createClass(Transliterator, {
    escape: {
      value: function escape(unescaped) {
        // do we really need this?
        return unescaped.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      }
    },
    phonemize: {
      value: function phonemize(phonemes, text) {
        phonemes.sort(function (a, b) {
          return a.length < b.length ? 1 : -1;
        });

        phonemes = phonemes.map(this.escape);

        var pattern = "(" + phonemes.join("|") + ")";
        var splitter = new RegExp(pattern, "g");

        return text.split(splitter).filter(function (x) {
          return x;
        });
      }
    },
    transliterate: {
      value: function transliterate(from, to, text) {
        var substitutions = {};

        this.alphabet.forEach(function (letter) {
          substitutions[letter[from]] = letter[to];
        });

        var phonemes = this.alphabet.map(function (letter) {
          return letter[from];
        });
        var phonemeList = this.phonemize(phonemes, text);

        return phonemeList.map(function (phoneme) {
          return substitutions[phoneme] ? substitutions[phoneme] : phoneme;
        }).join("");
      }
    }
  });

  return Transliterator;
})();