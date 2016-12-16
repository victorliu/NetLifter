function tabWeighIn_update_display(){
	tabWeighIn_division_helper_dialog_toggle(false);
	tabWeighIn_update_listbox();

	document.getElementById('tabWeighIn_body_weight_holder').className = 'weight' + state.body_weight_units;
	document.getElementById('tabWeighIn_weight_class_holder').className = 'weight' + state.weight_class_units;
	var t = document.getElementById('tabWeighIn_division_helper_table');
	t.innerHTML = "";
	for(division in state.divisions){
		var row = t.insertRow(-1);
		var cell = row.insertCell(0);
		cell.innerHTML = division;
		cell = row.insertCell(1);
		cell.innerHTML = state.divisions[division];
	}

	// Update the card table
	const id = document.getElementById('selLifterCard').value;
	const curlifter = state.lifter_info[id];
	if(!curlifter){
		clear_lifter_card();
		return;
	}
	// populate fields
	document.getElementById("txtLifterCardFlight").value = curlifter.flight;
	document.getElementById("txtLifterCardLotNumber").value = curlifter.lot_number;
	document.getElementById("txtLifterCardName").value = curlifter.name;
	document.getElementById("txtLifterCardWeight").value = curlifter.weight;
	document.getElementById("txtLifterCardWeightClass").value = get_weight_class(curlifter);
	document.getElementById("txtLifterCardAge").value = curlifter.age;
	document.getElementById("txtLifterCardDOB").value = curlifter.dob;
	document.getElementById("txtLifterCardTeam").value = curlifter.team;
	document.getElementById("txtLifterCardState").value = curlifter.state;
	document.getElementById("txtLifterCardDivision").value = curlifter.division;
	document.getElementById("txtLifterCardSQ_rack").value = curlifter.SQ_rack;
	document.getElementById("txtLifterCardBP_rack").value = curlifter.BP_rack;

	document.getElementById("chkLifterCardEventsPL").checked = false;
	document.getElementById("chkLifterCardEventsBP").checked = false;
	document.getElementById("chkLifterCardEventsDL").checked = false;
	document.getElementById("chkLifterCardEventsPP").checked = false;
	var evlist = curlifter.which_lifts.split("+");
	for(var i = 0; i < evlist.length; ++i){
		switch(evlist[i]){
		case "PL": document.getElementById("chkLifterCardEventsPL").checked = true; break;
		case "BP": document.getElementById("chkLifterCardEventsBP").checked = false; break;
		case "DL": document.getElementById("chkLifterCardEventsDL").checked = false; break;
		case "PP": document.getElementById("chkLifterCardEventsPP").checked = false; break;
		default: break;
		}
	}
	var total = 0;
	for(liftkey in liftlist){
		var curlift = liftlist[liftkey];
		var best = 0;
		for(var iattempt = 1; iattempt <= 4; ++iattempt){
			var lift_attempt = curlift + "_" + iattempt;
			var lift_attempt_state = lift_attempt + "_state";
			var text_to_use = '';
			if(state.lifter_info[id][lift_attempt]){
				text_to_use = state.lifter_info[id][lift_attempt];
				if(state.lifter_info[id][lift_attempt] > best){
					if(1 == state.lifter_info[id][lift_attempt_state]){
						best = state.lifter_info[id][lift_attempt];
					}
				}
			}
			document.getElementById("radLifterCard" + lift_attempt + "_Good").checked = false;
			document.getElementById("radLifterCard" + lift_attempt + "_NotAttempted").checked = false;
			document.getElementById("radLifterCard" + lift_attempt + "_NoLift").checked = false;
			document.getElementById("radLifterCard" + lift_attempt + "_Scratch").checked = false;
			if(!state.lifter_info[id][lift_attempt_state]){
				document.getElementById("radLifterCard" + lift_attempt + "_NotAttempted").checked = true;
			}else{
				switch(state.lifter_info[id][lift_attempt_state]){
				case 1:
					document.getElementById("radLifterCard" + lift_attempt + "_Good").checked = true;
					console.log("Setting " + "radLifterCard" + lift_attempt + "_Good" + " to checked");
					break;
				case -1:
					text_to_use = "-" + text_to_use;
					document.getElementById("radLifterCard" + lift_attempt + "_NoLift").checked = true;
					break;
				case -2:
					text_to_use = "--";
					document.getElementById("radLifterCard" + lift_attempt + "_Scratch").checked = true;
					break;
				default:
					document.getElementById("radLifterCard" + lift_attempt + "_NotAttempted").checked = true;
					break;
				}
			}
			document.getElementById("txtLifterCard" + lift_attempt).value = text_to_use;
		}
		if(best > 0){
			document.getElementById("txtLifterCard" + curlift + "_best").value = best;
			total += best;
		}
	}
	if(total > 0){
		document.getElementById("txtLifterCard_total").value = total;
	}
	return false;
}

function tabWeighIn_update_listbox(){
	const m = state.lifter_info.length;
	var c = document.getElementById("selLifterCard");
	var prev_selected = c.selectedIndex;
	var c_count = c.options.length;
	for(var i = c_count-1; i > 0; --i){
		c.removeChild(c.options[i]);
	}
	var dropdown_ids = [];
	for(var i = 0; i < m; ++i){
		dropdown_ids.push(i);
	}
	dropdown_ids.sort(function(a,b){
		if(state.lifter_info[a].flight < state.lifter_info[b].flight){
			return -1;
		}else if(state.lifter_info[a].flight > state.lifter_info[b].flight){
			return  1;
		}else{
			if(state.lifter_info[a].name < state.lifter_info[b].name){
				return -1;
			}else if(state.lifter_info[a].name > state.lifter_info[b].name){
				return 1;
			}
		}
		return 0;
	});
	for(var i = 0; i < m; ++i){
		var opt = document.createElement("option");
		var id = dropdown_ids[i];
		var optname = state.lifter_info[id].flight + " " + state.lifter_info[id].name + " " + state.lifter_info[id].division;
		opt.appendChild(document.createTextNode(optname));
		opt.value = id;
		c.appendChild(opt);
		if(prev_selected == i){
			c.selectedIndex = i;
		}
	}
}

function selLifterCard_changed(){
	tabWeighIn_update_display();
}
function clear_lifter_card(){
	// clear all fields
	document.getElementById("txtLifterCardFlight").value = '';
	document.getElementById("txtLifterCardLotNumber").value = '';
	document.getElementById("txtLifterCardName").value = '';
	document.getElementById("txtLifterCardWeight").value = '';
	document.getElementById("txtLifterCardAge").value = '';
	document.getElementById("txtLifterCardTeam").value = '';
	document.getElementById("txtLifterCardState").value = '';
	document.getElementById("txtLifterCardDivision").value = '';
	document.getElementById("txtLifterCardSQ_rack").value = '';
	document.getElementById("txtLifterCardBP_rack").value = '';

	document.getElementById("chkLifterCardEventsPL").checked = false;
	document.getElementById("chkLifterCardEventsBP").checked = false;
	document.getElementById("chkLifterCardEventsDL").checked = false;
	document.getElementById("chkLifterCardEventsPP").checked = false;
	for(var iattempt = 1; iattempt <= 4; ++iattempt){
		for(liftkey in liftlist){
			var curlift = liftlist[liftkey];
			var lift_attempt = curlift + "_" + iattempt;
			document.getElementById("txtLifterCard" + curlift + "_" + iattempt).value = '';
			document.getElementById("radLifterCard" + lift_attempt + "_Good").checked = false;
			document.getElementById("radLifterCard" + lift_attempt + "_NotAttempted").checked = true;
			document.getElementById("radLifterCard" + lift_attempt + "_NoLift").checked = false;
			document.getElementById("radLifterCard" + lift_attempt + "_Scratch").checked = false;
		}
	}
}
function btnLifterCardDelete_clicked(){
	const id = document.getElementById('selLifterCard').value;
	if(state.lifter_info[id]){
		if(!window.confirm("Are you sure you want to delete this lifter card?")){
			return false;
		}else{
			state.lifter_info.splice(id, 1);
			tabWeighIn_update_display();
		}
	}
	clear_lifter_card();
	return false;
}
function btnLifterCardSave_clicked(){
	var id = document.getElementById('selLifterCard').value;
	if(id < 0){
		id = state.lifter_info.push({}) - 1;
		for(colname in computed_columns){
			state.lifter_info[id][colname] = computed_columns[colname];
		}
	}
	// clear all fields
	state.lifter_info[id].flight = document.getElementById("txtLifterCardFlight").value;
	state.lifter_info[id].lot_number = document.getElementById("txtLifterCardLotNumber").value;
	state.lifter_info[id].name = document.getElementById("txtLifterCardName").value;
	state.lifter_info[id].weight = document.getElementById("txtLifterCardWeight").value;
	state.lifter_info[id].age = document.getElementById("txtLifterCardAge").value;
	state.lifter_info[id].team = document.getElementById("txtLifterCardTeam").value;
	state.lifter_info[id].state = document.getElementById("txtLifterCardState").value;
	state.lifter_info[id].division = document.getElementById("txtLifterCardDivision").value;
	state.lifter_info[id].SQ_rack = document.getElementById("txtLifterCardSQ_rack").value;
	state.lifter_info[id].BP_rack = document.getElementById("txtLifterCardBP_rack").value;

	var evlist = [];
	if(document.getElementById("chkLifterCardEventsPL").checked){ evlist.push("PL"); }
	if(document.getElementById("chkLifterCardEventsBP").checked){ evlist.push("BP"); }
	if(document.getElementById("chkLifterCardEventsDL").checked){ evlist.push("DL"); }
	if(document.getElementById("chkLifterCardEventsPP").checked){ evlist.push("PP"); }
	state.lifter_info[id].which_lifts = evlist.join("+");
	for(var iattempt = 1; iattempt <= 4; ++iattempt){
		for(liftkey in liftlist){
			var curlift = liftlist[liftkey];
			var lift_attempt = curlift + "_" + iattempt;
			var lift_attempt_state = lift_attempt + "_state";
			var txt = document.getElementById("txtLifterCard" + lift_attempt).value;

			if(txt.match('^\-+$') || ('' == txt && document.getElementById("radLifterCard" + lift_attempt + "_Scratch").checked)){
				state.lifter_info[id][lift_attempt] = "--";
				state.lifter_info[id][lift_attempt_state] = -2;
				if(2 == iattempt){
					state.lifter_info[id][curlift + "_3"] = "--";
					state.lifter_info[id][curlift + "_3_state"] = -2;
					// we need to set the text and radio so that the next loop iteration doesn't trash it
					document.getElementById("txtLifterCard" + curlift + "_3").value = '';
					document.getElementById("radLifterCard" + curlift + "_3_Scratch").checked = true;
				}
			}else if('' == txt){
				state.lifter_info[id][lift_attempt] = "";
				state.lifter_info[id][lift_attempt_state] = 0;
			}else{
				var num = Number(txt);
				if(!isNaN(num)){
					check_attempt_weight(Math.abs(num));
					if(num < 0 || document.getElementById("radLifterCard" + lift_attempt + "_NoLift").checked){
						state.lifter_info[id][lift_attempt] = Math.abs(num);
						state.lifter_info[id][lift_attempt_state] = -1;
					}else{
						state.lifter_info[id][lift_attempt] = num;
						if(document.getElementById("radLifterCard" + lift_attempt + "_Good").checked){
							state.lifter_info[id][lift_attempt_state] = 1;
						}else{
							state.lifter_info[id][lift_attempt_state] = 0;
						}
					}
				}
			}
		}
	}
	tabWeighIn_update_display();
	return false;
}

function radLifterCard_Good_clicked(lift, attempt){
	var txtid = "txtLifterCard" + lift + "_" + attempt;
	var num = Number(document.getElementById(txtid).value);
	if(!isNaN(num)){
		document.getElementById(txtid).value = Math.abs(num);
	}else{
		document.getElementById(txtid).value = '';
	}
}
function radLifterCard_NotAttempted_clicked(lift, attempt){
	var txtid = "txtLifterCard" + lift + "_" + attempt;
	var num = Number(document.getElementById(txtid).value);
	if(!isNaN(num)){
		document.getElementById(txtid).value = Math.abs(num);
	}else{
		document.getElementById(txtid).value = '';
	}
}
function radLifterCard_NoLift_clicked(lift, attempt){
	var txtid = "txtLifterCard" + lift + "_" + attempt;
	var num = Number(document.getElementById(txtid).value);
	if(!isNaN(num)){
		document.getElementById(txtid).value = -Math.abs(num);
	}else{
		document.getElementById(txtid).value = '';
	}
}
function radLifterCard_Scratch_clicked(lift, attempt){
	var txtid = "txtLifterCard" + lift + "_" + attempt;
	document.getElementById(txtid).value = '--';
}

function tabWeighIn_division_helper_dialog_toggle(want_toggle){
	var d = document.getElementById('tabWeighIn_division_helper_dialog');
	if(d.style.display != 'none' && want_toggle){
		d.style.display = 'fixed';
		d.style.left = 0;
		d.style.top = 0;
	}else{
		d.style.display = 'none';
	}
}
function btnLifterCardDivisionHelper_clicked(){
	tabWeighIn_division_helper_dialog_toggle(true);
}


//// Import
function import_download_template(){
	var csv = '';
	for(colidx in import_columns){
		csv += get_column_header(import_columns[colidx]) + ',';
	}
	const charset = document.getElementById('selWeighIn_ImportCharset');
	var blob = new Blob([csv], {type: "text/csv;charset="+charset});
	saveAs(blob, "netlifter_import_template.csv");
}
function import_upload_lifters(){
	var fileToLoad = document.getElementById("fileImportLifters").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var textFromFileLoaded = fileLoadedEvent.target.result;
		import_parse_csv(textFromFileLoaded);
		add_computed_columns();
		tabWeighIn_update_display();
	};
	const charset = document.getElementById('selWeighIn_ImportCharset');
	fileReader.readAsText(fileToLoad, charset);
}
function import_parse_csv(txt){
	var tab = text_to_table(txt, ',');
	const m = tab.length;
	const n = import_columns.length;

	state.lifter_info = [];
	for(var i = 0; i+1 < m; ++i){
		state.lifter_info.push({});
		for(var j = 0; j < n; ++j){
			state.lifter_info[i][import_columns[j]] = tab[i+1][j];
		}
	}

	var flights = get_flight_list();
	state.current.flight = flights[0];
	state.current.lift = 'SQ';
	state.current.attempt = 1;
	state.current.lifter_id = -1;
}
