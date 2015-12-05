# transliterate

A Javascript library for ordering and applying transliteration rules which look like this: 

    [
      {
        "practical": "a",
        "ipa": "a",
        "PDLMA": "a"
      },
      {
        "ipa": "ā",
        "PDLMA": "a_",
        "practical": "ā"
      },
      {
        "ipa": "á",
        "PDLMA": "a!",
        "practical": "á"
      },
      {
        "ipa": "ã",
        "PDLMA": "a&",
        "practical": "ą"
      },
      {
        "ipa": "ã̄",
        "PDLMA": "a_&",
        "practical": "ą̄"
      }
    ]

The library should handle ordering these rules correctly before applying them.

This is trickier than it might seem. 

Does not work yet. 
