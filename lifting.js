function tabLifting_update_display(){
	hide_dialogs();
	tabLifting_update_toolbar();
	// The above does not update selLifter; do that below
	state.current.lifters = [];

	// Update lifter set from current state
	var c = document.getElementById("selLifter");
	var c_count = c.options.length;
	for(var i = c_count-1; i >= 0; --i){
		c.removeChild(c.options[i]);
	}
	const m = state.lifter_info.length;
	for(var i = 0; i < m; ++i){
		if(state.lifter_info[i].flight != state.current.flight){ continue; }
		var doing_this_lift = events_contains(state.lifter_info[i].which_lifts, state.current.lift);
		if(!doing_this_lift){ continue; }
		state.current.lifters.push(i);
	}
	// sort lifters by weight of current attempt, then by lot number
	state.current.lifters.sort(sort_by_weight);

	var found = false;
	for(var i = 0; i < state.current.lifters.length; ++i){
		var id = state.current.lifters[i];
		var opt = document.createElement("option");
		var name = state.lifter_info[id].name;

		opt.appendChild(document.createTextNode(name));
		opt.value = id;
		c.appendChild(opt);
		/*
		// Set current lifter to lower weight that has not been attempted yet
		var lift_attempt_status = state.current.lift + "_" + state.current.attempt + "_state";
		if(!found && !state.lifter_info[id][lift_attempt_status]){
			state.current.lifter_id = id;
			c.selectedIndex = c.length - 1;
			found = true;
		}
		*/
		if(id == state.current.lifter_id){
			c.selectedIndex = c.length - 1;
			found = 1;
		}
	}
	if(!found){
		state.current.lifter_id = state.current.lifters[0];
		c.selectedIndex = 0;
	}


	// Update the display portion
	var curlifter = state.lifter_info[state.current.lifter_id];
	if(curlifter){
		var body_weight = curlifter.weight;
		/*
		if("KG" == state.body_weight_units){
			body_weight = curlifter.weight;
		}else{
			body_weight = Math.round(body_weight*22.0462)/10;
		}*/
		var curlift = '';
		switch(state.current.lift){
		case 'SQ': curlift = 'Squat'; break;
		case 'BP': curlift = 'Bench'; break;
		case 'DL': curlift = 'Deadlift'; break;
		default: break;
		}
		var cur_attempt_weight = curlifter[state.current.lift+"_"+state.current.attempt];
		var rack_height = '';
		if("DL" != state.current.lift){
			rack_height = curlifter[state.current.lift + "_rack"];
		}

		document.getElementById('curLifterName').innerHTML = textify(curlifter.name);
		document.getElementById('curLifterBodyWeight').innerHTML = textify(body_weight);
		document.getElementById('curLifterBodyWeight').className = 'weight' + state.body_weight_units;
		document.getElementById('curLifterWeightClass').innerHTML = textify(get_weight_class(curlifter));
		document.getElementById('curLifterWeightClass').className = 'weight' + state.weight_class_units;
		document.getElementById('curLifterAge').innerHTML = textify(curlifter.age);
		document.getElementById('curLifterDivision').innerHTML = textify(curlifter.division);
		document.getElementById('curLift').innerHTML = curlift + ' ' + state.current.attempt;
		document.getElementById('curWeight').innerHTML = cur_attempt_weight;
		document.getElementById('curWeight').className = 'weight' + state.weight_set_units;
		if('KG' == state.weight_set_units){
			document.getElementById('curWeightOtherUnit').innerHTML = Math.round(cur_attempt_weight*22.0462)/10 + ' ' + weight_unit_string('LB');
		}else{
			document.getElementById('curWeightOtherUnit').innerHTML = Math.round(cur_attempt_weight/0.220462)/10 + ' ' + weight_unit_string('KG');
		}
		document.getElementById('curRackHeight').innerHTML = textify(rack_height);
	}

	drawPlates(cur_attempt_weight);

	drawTable(state.current.lifters);
}
function get_column_header(colname){
	var ret = column_headers[colname];
	if(!ret){
		ret = colname;
	}
	return ret;
}


function get_weight_class(curlifter){
	const division = curlifter.division;
	var body_weight = Number(curlifter.weight);
	if('LB' == state.body_weight_units && 'KG' == state.weight_class_units){
		body_weight *= kilos_per_pound;
	}else if('KG' == state.body_weight_units && 'LB' == state.weight_class_units){
		body_weight /= kilos_per_pound;
	}
	var cls = [];
	if('M' == division.charAt(0)){
		cls = state.weight_classes.men;
	}else{
		cls = state.weight_classes.women;
	}
	const m = cls.length;
	var i = 0;
	var ret = '';
	for(i = 0; i < m; ++i){
		if(body_weight <= cls[i]){
			ret = cls[i];
			break;
		}else if("string" === typeof cls[i] && cls[i].match(/\+/)){
			ret = 'SHW';
			break;
		}
	}
	return ret;
}
function get_wilks(curlifter){
	return wilks_coefficient('M' != curlifter.division.charAt(0), curlifter.weight);
}
function get_age_coeff(curlifter){
	return age_coefficient(curlifter.age);
}
function display_wilks(curlifter){
	var wilks = get_wilks(curlifter);
	return textify(Math.round(wilks*10000)*1e-4).replace(/(\.....)0+[1-9]$/, "$1");
}
function get_best_by_lift(curlifter, lift){
	var best = 0;
	for(var iattempt = 1; iattempt <= 3; ++iattempt){
		var lift_attempt = lift + "_" + iattempt;
		if(curlifter[lift_attempt] > best){
			if(1 == curlifter[lift_attempt + "_state"]){
				best = curlifter[lift_attempt];
			}
		}
	}
	return best;
}
function get_best(curlifter){
	return get_best_by_lift(curlifter, state.current.lift);
}
function get_best_SQ(curlifter){
	return get_best_by_lift(curlifter, 'SQ');
}
function get_best_BP(curlifter){
	return get_best_by_lift(curlifter, 'BP');
}
function get_best_DL(curlifter){
	return get_best_by_lift(curlifter, 'DL');
}
function get_subtotal(curlifter){
	return Number(get_best_by_lift(curlifter, "SQ"))
	+ Number(get_best_by_lift(curlifter, "BP"))
	+ Number(get_best_by_lift(curlifter, "DL"));
}
function get_total(curlifter){
	return get_subtotal(curlifter);
}

function cell_clicked(ev, id, colname, row_index){
	hide_dialogs();
	document.getElementById('dlgEntryLabel').innerHTML = get_column_header(colname);
	var dlg = document.getElementById('dlgEntry');
	var existing_value = state.lifter_info[id][colname];
	if(existing_value){
		document.getElementById('txtEntry').value = existing_value;
	}else{
		document.getElementById('txtEntry').value = '';
	}
	document.getElementById('txtEntry').onkeydown = (function(){
		var my_id = id;
		var my_colname = colname;
		return function(ev){
			var code = (ev.charCode ? ev.charCode : ev.keyCode);
			if(13 == code){
				dlgEntrySave_clicked(my_id, my_colname);
				return false;
			}
			return true;
		}
	})();
	document.getElementById('btnEntrySave').onclick = (function(){
		var my_id = id;
		var my_colname = colname;
		return function(){ return dlgEntrySave_clicked(my_id, my_colname); }
	})();
	document.getElementById('txtEntry').focus();
	if(ev.stopPropagation){ ev.stopPropagation(); }

	var rect = show_row_indicator(row_index);
	var rect0 = document.getElementById('tabLifting_tabDisplay').getBoundingClientRect();
	dlg.style.display = "block";
	dlg.style.left = rect.right-rect0.left + "px";
	if(rect.top < 400){
		dlg.style.top = rect.top-rect0.top + "px";
	}else{
		var rect_dlg = dlg.getBoundingClientRect();
		dlg.style.top = rect.bottom-rect_dlg.height-rect0.top + "px";
	}

	return false;
}
function cell_attempt_clicked(ev, id, lift_attempt, row_index){
	hide_dialogs();
	document.getElementById('dlgEntryAttemptLabel').innerHTML = get_column_header(lift_attempt.replace('_',' '));
	var dlg = document.getElementById('dlgEntryAttempt');
	var existing_value = state.lifter_info[id][lift_attempt];
	if(existing_value > 0){
		document.getElementById('txtEntryAttempt').value = existing_value;
	}else{
		document.getElementById('txtEntryAttempt').value = "";
	}
	document.getElementById('txtEntryAttempt').onkeydown = (function(){
		var my_id = id;
		var my_lift_attempt = lift_attempt;
		return function(ev){
			var code = (ev.charCode ? ev.charCode : ev.keyCode);
			if(13 == code){
				dlgEntryAttemptSave_clicked(my_id, my_lift_attempt);
				return false;
			}
			return true;
		}
	})();
	var status = state.lifter_info[id][lift_attempt + "_state"];
	document.getElementById('radEntryAttemptStatusNotAttempted').checked = (!status);
	document.getElementById('radEntryAttemptStatusGood').checked = (1 == status);
	document.getElementById('radEntryAttemptStatusNoLift').checked = (-1 == status);
	document.getElementById('btnEntryAttemptSave').onclick = (function(){
		var my_id = id;
		var my_lift_attempt = lift_attempt;
		return function(){ return dlgEntryAttemptSave_clicked(my_id, my_lift_attempt); }
	})();
	document.getElementById('txtEntryAttempt').focus();
	if(ev.stopPropagation){ ev.stopPropagation(); }

	var rect = show_row_indicator(row_index);
	var rect0 = document.getElementById('tabLifting_tabDisplay').getBoundingClientRect();
	dlg.style.display = "block";
	dlg.style.left = rect.right-rect0.left + "px";
	if(rect.top < 400){
		dlg.style.top = rect.top-rect0.top + "px";
	}else{
		var rect_dlg = dlg.getBoundingClientRect();
		dlg.style.top = rect.bottom-rect_dlg.height-rect0.top + "px";
	}

	return false;
}

function show_row_indicator(idx){
	const m = document.getElementById('tabLifting_tabDisplay').rows.length;
	var rect0 = document.getElementById('tabLifting_tabDisplay').getBoundingClientRect();
	var rect = document.getElementById('tabLifting_tabDisplay').rows[idx].getBoundingClientRect();
	var ind = document.getElementById('dlgEntryRowIndicator');
	ind.style.display = "block";
	ind.style.left = rect.right-rect0.left + "px";
	ind.style.top = rect.top-rect0.top + "px";
	return ind.getBoundingClientRect();
}

function sort_by_weight(a,b){ // a and b are lifter id's
	var lift_attempt = state.current.lift + "_" + state.current.attempt;
	var lift_attempt_next = state.current.lift + "_" + (state.current.attempt+1);
	var awn = Number(state.lifter_info[a][lift_attempt_next]);
	var bwn = Number(state.lifter_info[b][lift_attempt_next]);
	var as = state.lifter_info[a][lift_attempt + "_state"];
	var bs = state.lifter_info[b][lift_attempt + "_state"];
	var aw = Number(state.lifter_info[a][lift_attempt]);
	var bw = Number(state.lifter_info[b][lift_attempt]);
	const tie_breaker = (Number(state.lifter_info[a].lot_number) - Number(state.lifter_info[b].lot_number));

	// partition by whether lifter is doing current lift
	var a_doing_this_lift = events_contains(state.lifter_info[a].which_lifts, state.current.lift);
	var b_doing_this_lift = events_contains(state.lifter_info[b].which_lifts, state.current.lift);
	if(a_doing_this_lift && !b_doing_this_lift){
		return -1;
	}else if(!a_doing_this_lift && b_doing_this_lift){
		return 1;
	}

	// partition by whether current lift has been performed
	if(!lift_state_completed(as) && lift_state_completed(bs)){
		return 1;
	}else if(lift_state_completed(as) && !lift_state_completed(bs)){
		return -1;
	}
	if(!lift_state_completed(as)){
		if(aw && !bw){ return -1; }
		else if(!aw && bw){ return 1; }
	}
	if(!lift_state_completed(as) || (!awn && !bwn)){ // both have yet to complete current lift, or both have no next attempts
		// put scratches at end
		if(LIFT_STATE.SCRATCH == as && LIFT_STATE.SCRATCH != bs){
			return 1;
		}else if(LIFT_STATE.SCRATCH != as && LIFT_STATE.SCRATCH == bs){
			return -1;
		}
		if(LIFT_STATE.SCRATCH != as){ // both not scratched
			if(aw == bw){ return tie_breaker; }
			return aw - bw;
		}else{
			return tie_breaker;
		}
	}else{ // both have completed current lift
		var asn = state.lifter_info[a][lift_attempt_next + "_state"];
		var bsn = state.lifter_info[b][lift_attempt_next + "_state"];
		// put scratches at end
		if(LIFT_STATE.SCRATCH == asn && LIFT_STATE.SCRATCH != bsn){
			return 1;
		}else if(LIFT_STATE.SCRATCH != asn && LIFT_STATE.SCRATCH == bsn){
			return -1;
		}
		// put those without next attempt later
		if(awn && !bwn){
			return -1;
		}else if(!awn && bwn){
			return 1;
		}
		if(LIFT_STATE.SCRATCH != asn){ // both not scratched
			if(awn == bwn){ return tie_breaker; }
			return awn - bwn;
		}else{
			return tie_breaker;
		}
	}
}

function drawPlates(weight){
	const plate_sizes = [
		{ name: 'bar'  , size: [ 4     ,1.1    ], color: "#DDDDDD", color2: "#888888" },
		{ name: '50'   , size: [ 1.875 ,17.75  ], color: "#00DD00", color2: "#008800" }, // green
		{ name: '45'   , size: [ 2     ,17.75  ], color: "#FFDD00", color2: "#AA8800" }, // gold
		{ name: '25'   , size: [ 1     ,17.75  ], color: "#EE0000", color2: "#880000" }, // red
		{ name: '20'   , size: [ 0.75  ,17.75  ], color: "#0000DD", color2: "#000088" }, // blue
		{ name: '15'   , size: [ 0.8125,15.375 ], color: "#DDDD00", color2: "#888800" }, // yellow
		{ name: '10'   , size: [ 0.8125,12.5   ], color: "#555555", color2: "#000000" }, // black
		{ name:  '5'   , size: [ 0.8125,8.875  ], color: "#555555", color2: "#000000" }, // black
		{ name:  '2.5' , size: [ 0.625 ,7.5    ], color: "#555555", color2: "#000000" }, // black
		{ name:  '1.25', size: [ 0.5   ,6.3125 ], color: "#555555", color2: "#000000" }, // black
		{ name:  '0.5' , size: [ 0.3125,5.3125 ], color: "#555555", color2: "#000000" }, // black
		{ name:  '0.25', size: [ 0.25  ,5      ], color: "#DDDDDD", color2: "#888888" }, //stainless
		{ name:  'collar', size: [ 2,4 ], color: "#FFFFFF", color2: "#BBBBBB" } // stainless
	];
	const margin = 15;
	const w_expansion = 1.5;
	var origin = [ 0, 118 ];
	var ps = 10; // plate scaling
	var h_max = 17.75*ps;

	var bar_weight = get_current_bar_weight();

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0,0,800,300);

	if(weight < base_weight()){ return; }
	var count = plate_count(weight);

	ctx.font = "20px Arial";
	var text_shift = 0;
	for(var i = 0; i < plate_sizes.length; ++i){
		var num_needed = 0;
		for(var j = 0; j < state.weight_set.length; ++j){
			if(state.weight_set[j].name == plate_sizes[i].name){
				num_needed = count[j];
				break;
			}
		}
		if(plate_sizes[i].name != 'bar'){
			num_needed /= 2;
		}
		if(num_needed < 1){ continue; }
		if(i > 7){ text_shift += 20; }
		var w = plate_sizes[i].size[0]*ps*w_expansion;
		var h = plate_sizes[i].size[1]*ps;
		var grd = ctx.createLinearGradient(0,0,0,h);
		grd.addColorStop(0, plate_sizes[i].color2);
		grd.addColorStop(0.5, plate_sizes[i].color);
		grd.addColorStop(1, plate_sizes[i].color2);
		for(var j = 0; j < num_needed; ++j){
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(origin[0],origin[1]-0.5*h,w,h);
			ctx.fillStyle = grd;
			ctx.fillRect(origin[0],origin[1]-0.5*h,w,h);
			if(i > 7){
				ctx.fillStyle = "#000000";
			}
			var displayed_name = plate_sizes[i].name;
			if(plate_sizes[i].name == 'bar'){
				displayed_name += " (" + bar_weight + ")";
			}else if(plate_sizes[i].name == 'collar'){
				displayed_name += " (" + get_collar_weight() + ")";
			}
			ctx.fillStyle = plate_sizes[i].color2;
			ctx.fillText(displayed_name, origin[0], 20 + text_shift);
			origin[0] += w+margin;
		}
		if(i == 3 && num_needed > 1){
			ctx.fillText(num_needed + ' reds', 350, 30);
		}
	}
	// draw the bar some more
	{
		var w = plate_sizes[0].size[1]*ps*w_expansion;
		var h = plate_sizes[0].size[1]*ps;
		var grd = ctx.createLinearGradient(0,0,0,h);
		grd.addColorStop(0, plate_sizes[0].color2);
		grd.addColorStop(0.5, plate_sizes[0].color);
		grd.addColorStop(1, plate_sizes[0].color2);
		ctx.fillStyle = grd;
		ctx.strokeStyle = "#000000";
		ctx.strokeRect(origin[0],origin[1]-0.5*h,w,h);
		ctx.fillRect(origin[0],origin[1]-0.5*h,w,h);
	}
	ctx.fillStyle = "#000000";
	ctx.fillText('Next load: ' +
		plate_count_to_string(
			plate_count(
				get_next_weight(state.current.lifter_id)
			)
		), 0, 226
	);
}

function drawTable(id_list){
	// generate header row
	var t = document.getElementById("thdLifterInfo");
	t.innerHTML = "";
	var header_row = t.insertRow(0);
	var icol = 0;
	var iattempt = 0;
	for(var i = 0; i < displayed_columns[state.current.lift].length; ++i){
		var colname = displayed_columns[state.current.lift][i];
		if("attempts" == colname){
			for(var j = 0; j < 4; ++j){
				iattempt++;
				var cell = header_row.insertCell(icol++);
				var header_text = state.current.lift + " " + iattempt;
				cell.innerHTML = header_text;
				if(iattempt == state.current.attempt){
					cell.className = "current";
				}
			}
		}else{
			var cell = header_row.insertCell(icol++);
			cell.innerHTML = get_column_header(colname);
		}
	}

	// generate body rows
	t = document.getElementById("tbdLifterInfo");
	t.innerHTML = "";

	var lifter_order = get_lifter_order();
	var ncol;

	const m = lifter_order.length;
	var row_index = 0;
	for(var i = 0; i < m; ++i){
		var id = lifter_order[i];

		var row = t.insertRow(-1);
		row_index++;
		if(state.current.lifter_id == id_list[i]){
			row.className = "current";
		}

		var icol = 0;
		var iattempt = 0;
		for(var j = 0; j < displayed_columns[state.current.lift].length; ++j){
			var colname = displayed_columns[state.current.lift][j];
			if("attempts" == colname){
				for(var k = 0; k < 4; ++k){
					iattempt++;
					var cell = row.insertCell(icol++);
					var lift_attempt = state.current.lift + "_" + iattempt;
					var attempt_weight = state.lifter_info[id][lift_attempt];
					if(attempt_weight){
						cell.innerHTML = attempt_weight;
						//cell.className += (' weight' + state.weight_set_units);
					}
					if(iattempt == state.current.attempt){
						cell.className += " current";
					}
					switch(state.lifter_info[id][lift_attempt + "_state"]){
					case 1: cell.className += " good"; break;
					case -1: cell.className += " nolift"; break;
					case -2: cell.className += " scratch"; break;
					default: break;
					}
					cell.onclick = (function(){
						var my_id = id; var my_lift_attempt = lift_attempt;
						var my_row_index = row_index;
						return function(ev){ cell_attempt_clicked(ev, my_id, my_lift_attempt, my_row_index); }
					})();
				}
			}else{
				var cell = row.insertCell(icol++);
				var cell_value = '';
				if("function" === typeof state.lifter_info[id][colname]){
					cell_value = state.lifter_info[id][colname](state.lifter_info[id]);
				}else{
					var text_to_display = state.lifter_info[id][colname];
					if(!text_to_display){
						text_to_display = '';
					}
					cell_value = text_to_display;
					cell.onclick = (function(){
						var my_id = id; var my_colname = colname;
						var my_row_index = row_index;
						return function(ev){ cell_clicked(ev, my_id, my_colname, my_row_index); }
					})();
				}
				cell.innerHTML = cell_value;
				if(cell_value && weight_columns[colname]){
					cell.className += (' weight' + state[weight_columns[colname]]);
				}
			}
		}
		ncol = icol;
		if(i+1 < m){
			if(state.lifter_info[lifter_order[i+1]].flight != state.lifter_info[id].flight){
				// Insert divider row
				var row = t.insertRow(-1);
				row_index++;
				var cell = row.insertCell(0);
				cell.colSpan = ncol;
				cell.className = "table_divider";
			}
		}
	}
}

function get_lifter_order(){
	// This function returns a permutation of indices of state.lifter_info.
	//   (I)  Lifters in the current flight
	//      (i)  Lifters who are doing the current lift
	//          (a) lifters who already completed current lift
	//              Sort by increasing next attempt, with scratches at end
	//          (b) lifters who have yet to complete current lift
	//              Sort by increasing attempt, with scratches at end
	//      (ii) Lifters who are not doing the current lift
	//   (II) Lifters in the next flight
	//      (i) Order same as in (i) above
	//   (III) etc.
	const flights = get_flight_list(state.current.flight);

	// Group lifters by flight first
	var per_flight = {};
	const m = state.lifter_info.length;
	for(var i = 0; i < m; ++i){
		const iflight = state.lifter_info[i].flight;
		if(!per_flight[iflight]){
			per_flight[iflight] = [];
		}
		per_flight[iflight].push(i);
	}

	// Perform the sort within each flight
	const n = flights.length;
	for(flight in per_flight){
		per_flight[flight].sort(sort_by_weight);
	}
	var ret = [];
	for(var i = 0; i < flights.length; ++i){
		ret = ret.concat(per_flight[flights[i]]);
	}
	return ret;
}



function tabLifting_update_toolbar(){
	// First update the controls
	//// Update flight dropdown
	var flights = get_flight_list();
	var c = document.getElementById("selFlight");
	var c_count = c.options.length;
	for(var i = c_count-1; i >= 0; --i){
		c.removeChild(c.options[i]);
	}
	for(var i = 0; i < flights.length; ++i){
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(flights[i]));
		opt.value = flights[i];
		c.appendChild(opt);
	}

	//// Check to see if current flight is valid, and select when found
	var c = document.getElementById("selFlight");
	var c_count = c.options.length;
	var found = false;
	for(var i = 0; i < c_count; ++i){
		if(state.current.flight == c.options[i].text){
			c.selectedIndex = i;
			found = true;
		}
	}
	if(!found){
		c.selectedIndex = 0;
		state.current.flight = c.options[0].value;
	}

	var c = document.getElementById("selLift");
	var c_count = c.options.length;
	var found = false;
	for(var i = 0; i < c_count; ++i){
		if(state.current.lift == c.options[i].value){
			c.selectedIndex = i;
			found = true;
		}
	}
	if(!found){
		c.selectedIndex = 0;
		state.current.lift = c.options[0].value;
	}

	var c = document.getElementById("selAttempt");
	var c_count = c.options.length;
	var found = false;
	for(var i = 0; i < c_count; ++i){
		if(state.current.attempt == c.options[i].value){
			c.selectedIndex = i;
			found = true;
		}
	}
	if(!found){
		c.selectedIndex = 0;
		state.current.attempt = c.options[0].value;
	}
}
function get_next_lifter(id_curr){
	const m = state.current.lifters.length;
	var current_attempt = state.current.attempt;
	var id_next = -1;
	var lift_attempt;
	do{
		if(current_attempt > 4){ return -1; }
		lift_attempt = state.current.lift + "_" + current_attempt;

		// advance
		for(var i = 0; i < m; ++i){
			if(id_curr == state.current.lifters[i]){
				if(i+1 == m){
					current_attempt++;
					id_next = state.current.lifters[0];
				}else{
					id_next = state.current.lifters[i+1];
				}
				break;
			}
		}
		// keep advancing if scratched
	}while(-1 != id_next && LIFT_STATE.SCRATCH == state.lifter_info[id_next][lift_attempt+"_state"]);
	return id_next;
}
function get_next_weight(id_curr){
	const m = state.current.lifters.length;
	var current_attempt = state.current.attempt;
	var id_next = -1;
	var lift_attempt;
	do{
		if(current_attempt > 4){ return -1; }
		lift_attempt = state.current.lift + "_" + current_attempt;

		// advance
		for(var i = 0; i < m; ++i){
			if(id_curr == state.current.lifters[i]){
				if(i+1 == m){
					current_attempt++;
					lift_attempt = state.current.lift + "_" + current_attempt;
					id_next = state.current.lifters[0];
				}else{
					id_next = state.current.lifters[i+1];
				}
				break;
			}
		}
		// keep advancing if scratched
	}while(-1 != id_next && LIFT_STATE.SCRATCH == state.lifter_info[id_next][lift_attempt+"_state"]);
	if(!state.lifter_info[id_next]){ return 0; }
	return state.lifter_info[id_next][lift_attempt];
}
function advance_lifter(){
	if(state.current.attempt > 4){ return; } // safeguard to prevent infinite loops
	const m = state.current.lifters.length;
	const lift_attempt = state.current.lift + "_" + state.current.attempt;

	// advance
	for(var i = 0; i < m; ++i){
		if(state.current.lifter_id == state.current.lifters[i]){
			if(i+1 == m){
				state.current.attempt++;
				tabLifting_update_display(); // call this to update current.lifters
				state.current.lifter_id = state.current.lifters[0];
			}else{
				state.current.lifter_id = state.current.lifters[i+1];
			}
			break;
		}
	}
	// keep advancing if scratched
	if(-2 == state.lifter_info[state.current.lifter_id][lift_attempt+"_state"]){
		advance_lifter();
	}
}
function set_lift_state(good_or_not){
	const lift_attempt = state.current.lift + "_" + state.current.attempt;
	if(!state.lifter_info[state.current.lifter_id][lift_attempt]){ return; }
	state.lifter_info[state.current.lifter_id][lift_attempt + "_state"] = good_or_not;
	advance_lifter();
	tabLifting_update_display();
}
function btnGOOD_clicked(){
	set_lift_state(1);
	return false;
}
function btnNOLIFT_clicked(){
	set_lift_state(-1);
	return false;
}
function selFlight_changed(){
	state.current.flight = document.getElementById("selFlight").value;
	tabLifting_update_display();
}
function selLift_changed(){
	state.current.lift = document.getElementById("selLift").value;
	tabLifting_update_display();
}
function selAttempt_changed(){
	state.current.attempt = document.getElementById("selAttempt").value;
	tabLifting_update_display();
}
function selLifter_changed(){
	state.current.lifter_id = document.getElementById("selLifter").value;
	tabLifting_update_display();
}

function dlgEntryCancel_clicked(){
	var dlg = document.getElementById('dlgEntry');
	dlg.style.display = 'none';
}
function dlgEntrySave_clicked(id, colname){
	var dlg = document.getElementById('dlgEntry');
	state.lifter_info[id][colname] = document.getElementById('txtEntry').value;
	dlg.style.display = 'none';
	tabLifting_update_display();
	return false;
}
function dlgEntryAttemptCancel_clicked(){
	var dlg = document.getElementById('dlgEntryAttempt');
	dlg.style.display = 'none';
}
function dlgEntryAttemptSave_clicked(id, lift_attempt){
	var dlg = document.getElementById('dlgEntryAttempt');
	state.lifter_info[id][lift_attempt] = document.getElementById('txtEntryAttempt').value;
	check_attempt_weight(state.lifter_info[id][lift_attempt]);
	if(document.getElementById('radEntryAttemptStatusNotAttempted').checked){
		state.lifter_info[id][lift_attempt + "_state"] = 0;
	}else if(document.getElementById('radEntryAttemptStatusGood').checked){
		state.lifter_info[id][lift_attempt + "_state"] = 1;
	}else if(document.getElementById('radEntryAttemptStatusNoLift').checked){
		state.lifter_info[id][lift_attempt + "_state"] = -1;
	}else if(document.getElementById('radEntryAttemptStatusScratch').checked){
		state.lifter_info[id][lift_attempt + "_state"] = -2;
		state.lifter_info[id][lift_attempt] = "--";
		if('2' == lift_attempt[lift_attempt.length-1]){
			var key = lift_attempt.substring(0, lift_attempt.length-1) + "3";
			state.lifter_info[id][key] = "--";
			state.lifter_info[id][key + "_state"] = -2;
		}
	}
	dlg.style.display = 'none';
	tabLifting_update_display();
	return false;
}

function hide_dialogs(){
	var dlg = document.getElementById('dlgEntry');
	dlg.style.display = 'none';
	var dlg = document.getElementById('dlgEntryAttempt');
	dlg.style.display = 'none';
	var dlg = document.getElementById('dlgEntryRowIndicator');
	dlg.style.display = 'none';
}
