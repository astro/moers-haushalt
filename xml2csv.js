var stringify = require('csv-stringify');
var ltx = require('ltx');


var saxJs = ltx.availableSaxParsers.filter(function(func) {
    return /^function SaxSaxjs/.test(func.toString());
})[0];
if (!saxJs) throw "No SaxJS!";

var parser = new ltx.Parser(saxJs);
process.stdin
    .pipe(parser);

parser.on('tree', function transform(xml) {
    var headers = ['typ', 'u1_nr', 'u1_bezeichnung', 'u2_nr', 'u2_bezeichnung', 'u3_nr', 'u3_bezeichnung'];
    function seeHeader(h) {
        if (headers.indexOf(h) < 0)
            headers.push(h);
    }
    var rows = [];
    function handleModul(modulEl) {
        var ueberschriften = {
            typ: modulEl.attrs.typ
        };
        var i = 0;
        modulEl.getChild('ueberschriften').getChildren('uberschrift').forEach(function(ueberschriftEl) {
            i++;
            seeHeader('u' + i + '_nr');
            ueberschriften['u' + i + '_nr'] = ueberschriftEl.getChildText('nr');
            seeHeader('u' + i + '_bezeichnung');
            ueberschriften['u' + i + '_bezeichnung'] = ueberschriftEl.getChildText('bezeichnung');
        });

        forEachRecursive(modulEl, 'positionen', function(positionenEl) {
            positionenEl.getChildren('position').forEach(function(positionEl) {
                if (positionEl.attrs.subheading == 'true') return;

                var row = Object.create(ueberschriften);
                positionEl.getChildElements().forEach(function(el) {
                    seeHeader(el.name);
                    row[el.name] = el.getText();
                });
                rows.push(row);
            });
        });
        // Recurse:
        forEachRecursive(modulEl, 'modul', handleModul);
    }
    forEachRecursive(xml, 'modul', handleModul);

    stringify([headers], function(err, data) {
        if (err) throw err;
        console.log(data);
    });
    stringify(rows.map(function(row) {
        return headers.map(function(h) {
            return row[h];
        });
    }), function(err, data) {
        if (err) throw err;
        console.log(data);
    });
});

function forEachRecursive(el, name, iter) {
    el.getChildElements().forEach(function(child) {
        if (child.name === name) {
            // Callback
            iter(child);
        } else {
            // Recurse
            forEachRecursive(child, name, iter);
        }
    });
}
