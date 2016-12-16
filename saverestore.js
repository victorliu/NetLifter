function tabSaveRestore_update_display(){
//
}

function btnLoadState_clicked(){
	var fileToLoad = document.getElementById("fileLoadState").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var textFromFileLoaded = fileLoadedEvent.target.result;
		state = JSON.parse(textFromFileLoaded);
		add_computed_columns();
		update_display();
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}
function btnSaveState_clicked(){
	var blob = new Blob([JSON.stringify(state)], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "netlifter_" + get_timestamp() + ".json");
}

// Autosave feature:
//   Every five minutes, this will autosave to a cookie.
//   You can delete the last autosave.
//   When reloading, the last autosave is loaded.
//   Autosaves last for 2 days.

function autosave(){
	if(typeof(Storage) === "undefined"){ return; }
	localStorage.setItem("state", JSON.stringify(state));
}
function autoload(){
	if(typeof(Storage) === "undefined"){ return; }
	var statestr = localStorage.getItem("state");
	if(statestr){
		state = JSON.parse(statestr);
	}
	add_computed_columns();
}
function btnAutosave_clicked(){
	autosave();
}
function btnLoadAutosave_clicked(){
	autoload();
	update_display();
}
function btnClearAutosave_clicked(){
	localStorage.removeItem("state");
}



//// Export

function sort_results(a,b){ // a and b are lifter id's
	// Sort by weight class first
	var awc = weight_class_number(state.lifter_info[a].weight_class(state.lifter_info[a]));
	var bwc = weight_class_number(state.lifter_info[b].weight_class(state.lifter_info[b]));
	if(awc < bwc){ return -1; }
	if(awc > bwc){ return 1; }

	// Sort by total
	var atot = state.lifter_info[a].total(state.lifter_info[a]);
	var btot = state.lifter_info[b].total(state.lifter_info[b]);
	return atot - btot;
}

function export_download(){
	var csv = '';
	for(colidx in export_columns){
		csv += get_column_header(export_columns[colidx]) + ',';
	}
	csv += '\n';
	const m = state.lifter_info.length;

	var ids_by_division = {};
	for(var i = 0; i < m; ++i){
		var divs = state.lifter_info[i].division.split(',');
		for(var j = 0; j < divs.length; ++j){
			var div = divs[j].trim();
			if(!ids_by_division[div]){
				ids_by_division[div] = [ i ];
			}else{
				ids_by_division[div].push(i);
			}
		}
	}
	// Sort each division
	for(division in ids_by_division){
		ids_by_division[division].sort(sort_results);
		csv += (division + ':,\n');
		for(var i = 0; i < ids_by_division[division].length; ++i){
			var id = ids_by_division[division][i];
			for(colidx in export_columns){
				const colname = export_columns[colidx];
				if("function" === typeof state.lifter_info[id][colname]){
					csv += (state.lifter_info[id][colname](state.lifter_info[id]) + ',');
				}else{
					field = '';
					if(-1 == (state.lifter_info[id][colname + '_state'])){
						field = ('-' + state.lifter_info[id][colname] + ',');
					}else{
						if(state.lifter_info[id][colname]){
							field = state.lifter_info[id][colname];
						}
					}
					csv += escape_Excel(field) + ',';
				}
			}
			csv += "\n";
		}
	}
	var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
	saveAs(blob, "netlifter_export_" + get_timestamp() + ".csv");
}

function lifter_info_from_text(text){
	arr = text_to_table(document.getElementById('txtWeightClassesMen').value, ',');
	state.weight_classes.men = [];
	for(var i = 0; i < arr.length; ++i){
		state.weight_classes.men[i] = arr[i][0];
	}
	arr = text_to_table(document.getElementById('txtWeightClassesWomen').value, ',');
	state.weight_classes.women = [];
	for(var i = 0; i < arr.length; ++i){
		state.weight_classes.women[i] = arr[i][0];
	}


	var lines = text.split(/\r\n|\n/);
	//console.log("Parsing " + lines.length + " lines...");
	for(var i = 0; i < lines.length; ++i){
		if(lines[i].match(/^\s*$/)){ break; }
		var fields = lines[i].split(/,|\t/);
		state.lifter_info[i] = {};
		for(var j = 0; j < fields.length; ++j){
			if(j >= text_columns.length){ break; }
			state.lifter_info[i][text_columns[j]] = fields[j].trim();
		}
	}
	add_computed_columns();
}
function lifter_info_to_text(delim){
	var str = '';
	const m = state.lifter_info.length; // m rows
	for(var i = 0; i < m; ++i){
		const n = state.lifter_info[i].length; // n cols
		var j = 0;
		for(j = 0; j+1 < text_columns.length; ++j){
			str += state.lifter_info[i][text_columns[j]] + delim;
		}
		str += state.lifter_info[i][text_columns[j]] + '\n';
	}
	return str;
}
