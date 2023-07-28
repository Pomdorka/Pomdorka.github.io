var EMPTY = '&nbsp;',
    turn = 'X';

function init() {
    var parentTable = document.getElementById('parentTable');
    parentTable.innerHTML = "";
    turn = 'X';

    for (var pi = 0; pi < 3; pi++) {
        var parentRow = document.createElement('tr');
        parentTable.appendChild(parentRow);
        for (var pj = 0; pj < 3; pj++) {
            var parentCell = document.createElement('td');
            parentCell.classList.add("parentTd", 'pi' + pi, 'pj' + pj, "enabled");
            parentRow.appendChild(parentCell);

            var table = document.createElement('table');
            for (var i = 0; i < 3; i++) {
                var row = document.createElement('tr');
                table.appendChild(row);
                for (var j = 0; j < 3; j++) {
                    var cell = document.createElement('td');
                    cell.classList.add("childTd", 'i' + i, 'j' + j);
                    cell.addEventListener('click', clickEvent);
                    cell.innerHTML = EMPTY;
                    row.appendChild(cell);
                }
            }
            parentCell.appendChild(table);
        }
    }
}

function win(table) {
    return (table.rows[0].cells[0].innerHTML == turn && table.rows[0].cells[1].innerHTML == turn && table.rows[0].cells[2].innerHTML == turn) ||
           (table.rows[1].cells[0].innerHTML == turn && table.rows[1].cells[1].innerHTML == turn && table.rows[1].cells[2].innerHTML == turn) ||
           (table.rows[2].cells[0].innerHTML == turn && table.rows[2].cells[1].innerHTML == turn && table.rows[2].cells[2].innerHTML == turn) ||
           (table.rows[0].cells[0].innerHTML == turn && table.rows[1].cells[0].innerHTML == turn && table.rows[2].cells[0].innerHTML == turn) ||
           (table.rows[0].cells[1].innerHTML == turn && table.rows[1].cells[1].innerHTML == turn && table.rows[2].cells[1].innerHTML == turn) ||
           (table.rows[0].cells[2].innerHTML == turn && table.rows[1].cells[2].innerHTML == turn && table.rows[2].cells[2].innerHTML == turn) ||
           (table.rows[0].cells[0].innerHTML == turn && table.rows[1].cells[1].innerHTML == turn && table.rows[2].cells[2].innerHTML == turn) ||
           (table.rows[0].cells[2].innerHTML == turn && table.rows[1].cells[1].innerHTML == turn && table.rows[2].cells[0].innerHTML == turn);
}

function draw(table) {
    var isDraw = true;
    Array.from(table.getElementsByTagName("td")).forEach(function (td) {
        if (td.innerHTML == EMPTY || td.getElementsByTagName("table")) {
            isDraw = false;
        }
    });
    return isDraw;
}

function clickEvent() {
    handleClick(this)
}

function handleClick(childTd) {
    var parentTd = childTd.parentNode.parentNode.parentNode;
    var parentTable = parentTd.parentNode.parentNode;

    if (childTd.innerHTML !== EMPTY) {
        return;
    }
    if (parentTd.classList.contains("disabled")) {
        return;
    }

    childTd.innerHTML = turn;

    if (win(childTd.parentNode.parentNode)) {
        parentTd.innerHTML = turn;
    } else if (draw(childTd.parentNode.parentNode)) {
        parentTd.innerHTML = "-";
    }
    if (win(parentTable)) {
        document.getElementById('turn').textContent = "Выиграл: " + turn;
        Array.from(document.getElementsByClassName("parentTd")).forEach(function (parentTd) {
            parentTd.classList.add("disabled");
            parentTd.classList.remove("enabled");
        });
        return;
    } else if (draw(parentTable)) {
        document.getElementById('turn').textContent = "Ничья: " + turn;
        Array.from(document.getElementsByClassName("parentTd")).forEach(function (parentTd) {
            parentTd.classList.add("disabled");
            parentTd.classList.remove("enabled");
        });
        return;
    }

    var pi, pj;
    var classes = childTd.className.split(/\s+/);
    for (var k = 0; k < classes.length; k++) {
        if (classes[k].startsWith('i')) {
            pi = 'pi' + classes[k].substr(1);
        } else if (classes[k].startsWith('j')) {
            pj = 'pj' + classes[k].substr(1);
        }
    }

    var isTargetCompleted = document.getElementsByClassName(pi + " " + pj)[0].innerHTML.length == 1;
    Array.from(document.getElementsByClassName("parentTd")).forEach(function (parentTd) {
        if (parentTd.innerHTML.length > 1 && ((parentTd.classList.contains(pi) && parentTd.classList.contains(pj)) || isTargetCompleted)) {
            parentTd.classList.add("enabled");
            parentTd.classList.remove("disabled");
        } else {
            parentTd.classList.add("disabled");
            parentTd.classList.remove("enabled");
        }
    });

    if (turn === 'X') {
        turn = 'O';
        var cTd = randomTurn();
        var pTd = cTd.parentNode.parentNode.parentNode;
        cTd.style = "animation: blinkChildTd 1s";
        pTd.style = "animation: blinkParentTd 1s";
        handleClick(cTd);
    } else {
        turn = 'X';
    }

    document.getElementById('turn').textContent = 'Ход: ' + turn;
}

function randomTurn() {
    var parentArr = [];
    Array.from(document.getElementsByClassName("parentTd enabled")).forEach(function (parentTd) {
        parentArr.push(parentTd);
    });
    parentTd = parentArr[Math.floor(Math.random() * parentArr.length)];

    var childArr = [];
    Array.from(parentTd.getElementsByTagName("td")).forEach(function (td) {
        if (td.innerHTML == EMPTY)
            childArr.push(td);
    });
    childTd = childArr[Math.floor(Math.random() * childArr.length)];

    return childTd;
}