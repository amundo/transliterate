"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TransliterationTableView = (function () {
  function TransliterationTableView(transliterator) {
    _classCallCheck(this, TransliterationTableView);

    this.transliterator = transliterator;
  }

  _createClass(TransliterationTableView, {
    json2table: {
      value: function json2table(data, columns) {
        var table = document.createElement("table");

        var headers = columns || Object.keys(data[0]);
        var ths = headers.map(function (h) {
          return "<th>" + h + "</th>";
        }).join("");
        var thead = "<thead><tr>" + ths + "</tr></thead>";
        table.insertAdjacentHTML("afterbegin", thead);
        var tbody = table.appendChild(document.createElement("tbody"));

        data.forEach(function (d) {
          var tr = document.createElement("tr");
          headers.forEach(function (header) {
            var td = document.createElement("td");
            td.textContent = d[header];
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        return table;
      }
    },
    render: {
      value: function render(alphabet, columns) {

        var cmp = new Intl.Collator("es", { sensitivity: "base" });
        alphabet = alphabet.sort(function (a, b) {
          return cmp.compare(a.practical, b.practical);
        });

        listen();
        return json2table(alphabet, columns);
      }
    },
    listen: {
      value: function listen() {}
    }
  });

  return TransliterationTableView;
})();

var TransliterationEditorView = (function () {
  function TransliterationEditorView(transliterator) {
    _classCallCheck(this, TransliterationEditorView);

    this.transliterator = transliterator;
  }

  _createClass(TransliterationEditorView, {
    renderChooser: {
      value: function renderChooser(orthography) {
        return "<label>\n      <input name=\"from\" value=\"" + orthography + "\" type=\"radio\">\n      " + orthography + "\n    </label>\n    ";
      }
    },
    template: {
      value: function template() {
        return "\n      <section class=before>\n        <div class=chooser>" + this.transliterator.orthographies.map(function (fromOrthography) {
          return "\n          <label><input name=\"from\" value=\"" + fromOrthography + "\" type=\"radio\" />" + fromOrthography + "</label>\n        ";
        }).join("\n") + "\n        </div>\n        <textarea spellcheck=\"false\"></textarea>\n      </section>\n\n      <section class=after>\n        <div class=chooser>" + this.transliterator.orthographies.map(function (toOrthography) {
          return "\n          <label><input name=\"to\" value=\"" + toOrthography + "\" type=\"radio\" />" + toOrthography + "</label>\n        ";
        }).join("\n") + "\n        </div>\n        <textarea spellcheck=\"false\"></textarea>\n      </section>\n    ";
      }
    },
    render: {
      value: function render() {
        var container = document.createElement("section");
        container.classList.add("transliterationEditor");
        container.innerHTML = this.template();
        this.el = container;
        this.listen();
        return this.el;
      }
    },
    runTransliteration: {
      value: function runTransliteration() {
        var before = this.el.querySelector(".before textarea");
        var after = this.el.querySelector(".after textarea");
        var to = this.el.querySelector(".before input[type=\"radio\"]:checked").value;
        var from = this.el.querySelector(".after  input[type=\"radio\"]:checked").value;
        console.log([to, from, before.value]);
        console.log("transliterated: " + this.transliterator.transliterate([to, from, before.value]));
        var transliterated = this.transliterator.transliterate(from, to, before.value);
        after.value = transliterated;
      }
    },
    listen: {
      value: function listen() {
        var _this = this;

        var tas = [].concat(_toConsumableArray(this.el.querySelectorAll("textarea")));
        var radios = [].concat(_toConsumableArray(this.el.querySelectorAll("input[type=\"radio\"]")));

        tas.forEach(function (ta) {
          ta.addEventListener("change", function () {
            _this.runTransliteration();
          });
          ta.addEventListener("keyup", function () {
            _this.runTransliteration();
          });
        });

        radios.forEach(function (radio) {
          radio.addEventListener("change", function (ev) {
            _this.runTransliteration();
          });
          radio.addEventListener("keyup", function (ev) {
            _this.runTransliteration();
          });
        });
      }
    }
  });

  return TransliterationEditorView;
})();

var TransliteratorLayout = (function () {
  function TransliteratorLayout(transliterator) {
    _classCallCheck(this, TransliteratorLayout);

    this.transliterator = transliterator;

    this.table = new TransliterationTableView(this.transliterator);
    this.editor = new TransliterationEditorView(this.transliterator);
  }

  _createClass(TransliteratorLayout, {
    template: {
      value: function template() {}
    },
    render: {
      value: function render() {
        return this.template();
      }
    }
  });

  return TransliteratorLayout;
})();