
var getTable = function(selectedTable){

//Get the table

//Get the Column IDs
var columns = selectedTable.columns;
//Variable where table contents will be copied
var contents = [];

//Variables for storing the table data for binding
var columnHeaders = [];
var columnDetails = {};

//Load the table headers and also the binding properties
for (var i = 0; i < columns.length; i++){
	if (columns.elementAt(i).visible === true){
		columnDetails.title = columns.elementAt(i).title;
		columnDetails.name = columns.elementAt(i).name
		columnHeaders.push(columnDetails);
		columnDetails = {};
	}
	
}

if (selectedTable.rowCount > 0) {
    //Set the visible row to 0
    selectedTable.firstVisibleRow = 0;
    //Get the Max visible row number
    var topRow = selectedTable.visibleRowCount - 1;
    //Loop through all the rows
    for (var rowIndex = 0; rowIndex < selectedTable.rowCount; rowIndex++) {
        var row = {};
        if (rowIndex > topRow) {
            // Set the first visible row to the next set of rows. If the next set goes beyond the maximum rows,
            // adjust it so that the set's last row is the table's last row.
            if (topRow + selectedTable.visibleRowCount > selectedTable.rowCount) {
                selectedTable.firstVisibleRow = selectedTable.rowCount - selectedTable.visibleRowCount;
            } else {
                selectedTable.firstVisibleRow = topRow + 1;
            }
            topRow += selectedTable.visibleRowCount;
        }
        // Populate the row information.
        for (var i = 0; i < columns.length; i++) {
            var colName = columns.elementAt(i).name;
            row[colName] = selectedTable.getCellValue(rowIndex, colName);
        }
        // Break after the first blank row - the values usually contain all underscores like "____" for a 4 character column.
        if (!row[columns.elementAt(3).name].replace(/_/g, "")) {
            break;
        }
		
        contents.push(row);
    }
}

var tableHTML = '<html> <head> \
<script src="/sap/public/bc/ui5_ui5/1/resources/sap-ui-cachebuster/sap-ui-core.js" \
    id="sap-ui-bootstrap" \
    data-sap-ui-libs="sap.ui.core,sap.m,sap.ui.table" \
    data-sap-ui-theme="sap_bluecrystal"> </script> \
<script>';
 
tableHTML += '\
var oTable2 = new sap.ui.table.Table({ \
     visibleRowCount: ' +contents.length +', \
                columnHeaderHeight: 30, \
     selectionMode: sap.ui.table.SelectionMode.Single, \
                rowSelectionChange: function(oEvent){ parent.postMessage(oEvent.getParameter("rowIndex"), "*")\
                }, \
		width: "'+selectedTable.width +'px"\
});';

//Add the columns to the table.
for (var i = 0; i < columnHeaders.length; i++){
	tableHTML += 'oTable2.addColumn(new sap.ui.table.Column({ \
     label: new sap.m.Label({text: "' +columnHeaders[i].title +'"}), \
     template: new sap.m.Text().bindProperty("text", "' +columnHeaders[i].name +'"), \
     sortProperty: "' +columnHeaders[i].name +'", \
     filterProperty: "' +columnHeaders[i].name +'", \
	}));';
}


//Create a model and bind the table rows to this model
 
tableHTML += 'var oModel2 = new sap.ui.model.json.JSONModel(); \
oModel2.setData({modelData: ' +JSON.stringify(contents)  +'}); \
oTable2.setModel(oModel2); \
oTable2.bindRows("/modelData"); \
';
 
tableHTML += 'oTable2.placeAt("content");';
tableHTML += '</script>';
tableHTML += '</head>';
tableHTML += '<body>';
tableHTML += '<div id="content"> </div>'
tableHTML += '</body></html>';
	
	return tableHTML;
};
