Umformung von XML in CSV, z.B. für OpenSpending.org

# Motivation

Guckt mal, in Moers gibts solche Daten schon maschinenlesbar:
https://twitter.com/derarndt/status/522290389467004928

# Benutzung

```
npm i
curl "http://www.moers.de/c125722e0057acf2/files/gesamt20130125062358_090_1.xml/\$file/gesamt20130125062358_090_1.xml?openelement" \
    | node xml2csv.js > haushalt.csv
```

# Ergebnis

http://astro.github.io/moers-haushalt/haushalt.csv
