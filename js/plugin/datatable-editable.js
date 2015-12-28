$(document).ready(function() {
    function restoreRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
            oTable.fnUpdate(aData[i], nRow, i, false);
        }

        oTable.fnDraw();
    }

    function editRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" value="' + aData[0] + '">';
        jqTds[1].innerHTML = '<input type="text" value="' + aData[1] + '">';
        jqTds[2].innerHTML = '<input type="text" value="' + aData[2] + '">';
        jqTds[3].innerHTML = '<input type="text" value="' + aData[3] + '">';
        jqTds[4].innerHTML = '<input type="text" value="' + aData[4] + '">';
        jqTds[5].innerHTML = '<a class="edit-row" href="javascript:void(0)">Save</a>';
    }

    function saveRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
        oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
        oTable.fnUpdate('<a class="edit-row" href="javascript:void(0)">Edit</a>', nRow, 5, false);
        oTable.fnDraw();
    }


    var dataSet = [
        ['Trident', 'Internet Explorer 4.0', 'Win 95+', '4', 'X', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Trident', 'Internet Explorer 5.0', 'Win 95+', '5', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Trident', 'Internet Explorer 5.5', 'Win 95+', '5.5', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Trident', 'Internet Explorer 6', 'Win 98+', '6', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Trident', 'Internet Explorer 7', 'Win XP SP2+', '7', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Trident', 'AOL browser (AOL desktop)', 'Win XP', '6', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Firefox 1.0', 'Win 98+ / OSX.2+', '1.7', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Firefox 1.5', 'Win 98+ / OSX.2+', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Firefox 2.0', 'Win 98+ / OSX.2+', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Firefox 3.0', 'Win 2k+ / OSX.3+', '1.9', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Camino 1.0', 'OSX.2+', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Camino 1.5', 'OSX.3+', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Netscape 7.2', 'Win 95+ / Mac OS 8.6-9.2', '1.7', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Netscape Browser 8', 'Win 98SE+', '1.7', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Netscape Navigator 9', 'Win 98+ / OSX.2+', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.0', 'Win 95+ / OSX.1+', 1, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.1', 'Win 95+ / OSX.1+', 1.1, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.2', 'Win 95+ / OSX.1+', 1.2, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.3', 'Win 95+ / OSX.1+', 1.3, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.4', 'Win 95+ / OSX.1+', 1.4, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.5', 'Win 95+ / OSX.1+', 1.5, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.6', 'Win 95+ / OSX.1+', 1.6, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.7', 'Win 98+ / OSX.1+', 1.7, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Mozilla 1.8', 'Win 98+ / OSX.1+', 1.8, 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Seamonkey 1.1', 'Win 98+ / OSX.2+', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Gecko', 'Epiphany 2.20', 'Gnome', '1.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'Safari 1.2', 'OSX.3', '125.5', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'Safari 1.3', 'OSX.3', '312.8', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'Safari 2.0', 'OSX.4+', '419.3', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'Safari 3.0', 'OSX.4+', '522.1', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'OmniWeb 5.5', 'OSX.4+', '420', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'iPod Touch / iPhone', 'iPod', '420.1', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Webkit', 'S60', 'S60', '413', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 7.0', 'Win 95+ / OSX.1+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 7.5', 'Win 95+ / OSX.2+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 8.0', 'Win 95+ / OSX.2+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 8.5', 'Win 95+ / OSX.2+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 9.0', 'Win 95+ / OSX.3+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 9.2', 'Win 88+ / OSX.3+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera 9.5', 'Win 88+ / OSX.3+', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Opera for Wii', 'Wii', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Nokia N800', 'N800', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Presto', 'Nintendo DS browser', 'Nintendo DS', '8.5', 'C/A<sup>1</sup>', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['KHTML', 'Konqureror 3.1', 'KDE 3.1', '3.1', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['KHTML', 'Konqureror 3.3', 'KDE 3.3', '3.3', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['KHTML', 'Konqureror 3.5', 'KDE 3.5', '3.5', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Tasman', 'Internet Explorer 4.5', 'Mac OS 8-9', '-', 'X', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Tasman', 'Internet Explorer 5.1', 'Mac OS 7.6-9', '1', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Tasman', 'Internet Explorer 5.2', 'Mac OS 8-X', '1', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'NetFront 3.1', 'Embedded devices', '-', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'NetFront 3.4', 'Embedded devices', '-', 'A', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'Dillo 0.8', 'Embedded devices', '-', 'X', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'Links', 'Text only', '-', 'X', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'Lynx', 'Text only', '-', 'X', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'IE Mobile', 'Windows Mobile 6', '-', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Misc', 'PSP browser', 'PSP', '-', 'C', '<a class="edit-row" href="#">Edit</a>', 'Delete'],
        ['Other browsers', 'All others', '-', '-', 'U', '<a class="edit-row" href="#">Edit</a>', 'Delete']
    ];
    var oTable = $("#datatable-editable").dataTable({
        aoColumnDefs: [{
            bSortable: false,
            aTargets: [-2, -1]
        }],
        "aaData": dataSet,
        "aoColumns": [{
            "sTitle": "Engine"
        }, {
            "sTitle": "Browser"
        }, {
            "sTitle": "Platform",
            "sClass": "hidden-xs"
        }, {
            "sTitle": "Version",
            "sClass": "hidden-xs"
        }, {
            "sTitle": "Grade",
            "sClass": "hidden-xs"
        }, {
            "sTitle": "",
            "bSortable": false
        }, {
            "sTitle": "",
            "bSortable": false,
            "fnCreatedCell": function(a, b) {
                $(a).html('<a class="delete-row" href="#">' + b + '</a>');
            }
        }],
        "sPaginationType": "full_numbers"
    });
    var nEditing = null;

    $('#add-row').click(function(e) {
        e.preventDefault();

        var aiNew = oTable.fnAddData(['', '', '', '', '',
            '<a class="edit-row" href="javascript:void(0)">Edit</a>', '<a class="delete-row" href="javascript:void(0)">Delete</a>'
        ]);
        var nRow = oTable.fnGetNodes(aiNew[0]);
        editRow(oTable, nRow);
        nEditing = nRow;
    });

    $('#datatable-editable').on('click', 'a.delete-row', function(e) {
        e.preventDefault();

        var nRow = $(this).parents('tr')[0];
        oTable.fnDeleteRow(nRow);
    });

    $('#datatable-editable').on('click', 'a.edit-row', function(e) {
        e.preventDefault();

        /* Get the row as a parent of the link that was clicked on */
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
            /* Currently editing - but not this row - restore the old before continuing to edit mode */
            restoreRow(oTable, nEditing);
            editRow(oTable, nRow);
            nEditing = nRow;
        } else if (nEditing == nRow && this.innerHTML == "Save") {
            /* Editing this row and want to save it */
            saveRow(oTable, nEditing);
            nEditing = null;
        } else {
            /* No edit in progress - let's start one */
            editRow(oTable, nRow);
            nEditing = nRow;
        }
    });
});