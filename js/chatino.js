"use strict";

var before = document.body.querySelector("#before textarea"),
    after = document.body.querySelector("#after textarea");

var transliterate = function () {
  var from = document.body.querySelector("#before input[type=\"radio\"]:checked").value;
  var to = document.body.querySelector("#after input[type=\"radio\"]:checked").value;

  var transliterated = chatino.transliterate(from, to, before.value);
  after.value = transliterated;
};

before.addEventListener("keyup", transliterate);
after.addEventListener("keyup", transliterate);

var radios = document.body.querySelectorAll("input[type=\"radio\"]");

[].forEach.call(radios, function (radio) {
  radio.addEventListener("change", transliterate);
});

before.addEventListener("change", transliterate);
after.addEventListener("change", transliterate);

var renderTable = function (language) {
  var json2table = function (data, columns) {
    var table = document.createElement("table");

    var headers = columns || Object.keys(data[0]);
    var thead = "<thead><tr><th>" + headers.join("</th><th>") + "</th></tr></thead>";
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
  };

  var cmp = new Intl.Collator("es", { sensitivity: "base" });
  language.alphabet = language.alphabet.sort(function (a, b) {
    return cmp.compare(a.practical, b.practical);
  });
  language.alphabet.forEach(function (c) {
    delete c.ipa;
  });
  document.querySelector("#orthography").appendChild(json2table(language.alphabet, ["PDLMA", "practical"]));
};