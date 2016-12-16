// Called when setup tab is shown, and when info is updated on it
function tabSetup_update_display(){
	update_display_setup_platform_weight_set();
	update_display_setup_bar_weight();
	update_display_setup_units();
	update_display_setup_divisions();
	update_display_setup_weight_classes();
}

function tabSetup_radPlatformWeightUnitChanged(){
	if(document.getElementById('radPlatformWeightUnitKG').checked){
		state.weight_set_units = 'KG';
	}else if(document.getElementById('radPlatformWeightUnitLB').checked){
		state.weight_set_units = 'LB';
	}
	update_display_setup_platform_weight_set();
	update_display_setup_bar_weight();
}
function tabSetup_radBodyWeightUnitChanged(){
	if(document.getElementById('radBodyWeightUnitKG').checked){
		state.body_weight_units = 'KG';
	}else if(document.getElementById('radBodyWeightUnitLB').checked){
		state.body_weight_units = 'LB';
	}
}
function tabSetup_radWeightClassUnitChanged(){
	if(document.getElementById('radWeightClassUnitKG').checked){
		state.weight_class_units = 'KG';
	}else if(document.getElementById('radWeightClassUnitLB').checked){
		state.weight_class_units = 'LB';
	}
	update_display_setup_weight_classes();
}

function update_display_setup_platform_weight_set(){
	var ws_headings = [];
	ws_headings.push({ name: "name", label: "Name", datatype: "string", editable: true});
	ws_headings.push({ name: "weight", label:"Weight", datatype: "double(" + weight_unit_string(state.weight_set_units) + ", , dot, comma, 0)", editable: true});
	ws_headings.push({ name: "quantity", label: "Quantity", datatype: "integer", editable: true});

	var ws_data = [];
	const m = state.weight_set.length;
	var i;
	for(i = 0; i < m; ++i){
		ws_data.push({id: i, values: state.weight_set[i] });
	}

	var grid_ws = new EditableGrid("PlatformWeightSet", { enableSort:false } );
	grid_ws.load({"metadata": ws_headings, "data": ws_data});
	grid_ws.renderGrid("tabSetup_tabPlatformWeightSet", "");
	grid_ws.modelChanged = tabSetup_onPlatformWeightSetEdit;
}
function update_display_setup_units(){
	if('KG' == state.weight_set_units){
		document.getElementById('radPlatformWeightUnitKG').checked = true;
	}else{
		document.getElementById('radPlatformWeightUnitLB').checked = true;
	}
	if('KG' == state.body_weight_units){
		document.getElementById('radBodyWeightUnitKG').checked = true;
	}else{
		document.getElementById('radBodyWeightUnitLB').checked = true;
	}
	if('KG' == state.weight_class_units){
		document.getElementById('radWeightClassUnitKG').checked = true;
	}else{
		document.getElementById('radWeightClassUnitLB').checked = true;
	}
}
function update_display_setup_bar_weight(){
	var bw_headings = [];
	bw_headings.push({ name: "flight", label: "Flight", datatype: "string", editable: false});
	bw_headings.push({ name: "SQ", label: "Squat", datatype: "double(" + weight_unit_string(state.weight_set_units) + ", , dot, comma, 0)", editable: true});
	bw_headings.push({ name: "BP", label: "Bench", datatype: "double(" + weight_unit_string(state.weight_set_units) + ", , dot, comma, 0)", editable: true});
	bw_headings.push({ name: "DL", label: "Deadlift", datatype: "double(" + weight_unit_string(state.weight_set_units) + ", , dot, comma, 0)", editable: true});

	// get list of flights
	var flights = get_flight_list();
	var bw_data = [];
	const w = state.weight_set[0].weight;
	for(i = 0; i < flights.length; ++i){
		var iflight = flights[i];
		if(state.bar_weight[iflight]){
			bw_data.push({ id: iflight, values: [
				iflight,
				state.bar_weight[iflight].SQ ? state.bar_weight[iflight].SQ : w,
				state.bar_weight[iflight].BP ? state.bar_weight[iflight].BP : w,
				state.bar_weight[iflight].DL ? state.bar_weight[iflight].DL : w
			] });
		}else{
			bw_data.push({ id: iflight, values: [iflight,w,w,w] });
		}
	}

	var grid_ws = new EditableGrid("BarWeight", { enableSort:false } );
	grid_ws.load({"metadata": bw_headings, "data": bw_data});
	grid_ws.renderGrid("tabSetup_tabBarWeight", "");
	grid_ws.modelChanged = tabSetup_onBarWeightEdit;
}
function update_display_setup_divisions(){
	var headings = [];
	headings.push({ name: "division", label: "Division", datatype: "string", editable: true});
	headings.push({ name: "description", label: "Description", datatype: "string", editable: true});

	var data = [];
	if(state.divisions){
		for(division in state.divisions){
			data.push({ id: division, values: [ division, state.divisions[division] ] });
		}
	}
	var grid = new EditableGrid("Division", { enableSort:true } );
	grid.load({"metadata": headings, "data": data});
	grid.renderGrid("tabSetup_tabDivisions", "");
	grid.modelChanged = tabSetup_onDivisionsEdit;

	c = document.getElementById('tabSetup_selPredefinedDivisions');
	var c_count = c.options.length;
	for(var i = c_count-1; i >= 0; --i){
		c.removeChild(c.options[i]);
	}
	for(federation in divisions){
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(federation));
		opt.value = federation;
		c.appendChild(opt);
	}
}
function update_display_setup_weight_classes(){
	var men_headings = [];
	//men_headings.push({ name: "weight", label: "Men", datatype: "double(" + weight_unit_string(state.weight_class_units) + ", , dot, comma, 0)", editable: true});
	men_headings.push({ name: "weight", label: "Men (" + weight_unit_string(state.weight_class_units) + ")", datatype: "number", editable: true});

	var men_data = [];
	for(i = 0; i < state.weight_classes.men.length; ++i){
		var w = state.weight_classes.men[i];
		men_data.push({ id: i, values: [ w ] });
	}

	var grid_men = new EditableGrid("WeightClassesMen", { enableSort:false } );
	grid_men.load({"metadata": men_headings, "data": men_data});
	grid_men.renderGrid("tabSetup_tabWeightClassesMen", "");
	grid_men.modelChanged = tabSetup_onWeightClassesMenEdit;


	var women_headings = [];
	//women_headings.push({ name: "weight", label: "Women", datatype: "double(" + weight_unit_string(state.weight_class_units) + ", , dot, comma, 0)", editable: true});
	women_headings.push({ name: "weight", label: "Women (" + weight_unit_string(state.weight_class_units) + ")", datatype: "number", editable: true});

	var women_data = [];
	for(i = 0; i < state.weight_classes.women.length; ++i){
		var w = state.weight_classes.women[i];
		women_data.push({ id: i, values: [ w ] });
	}

	var grid_women = new EditableGrid("WeightClassesWomen", { enableSort:false } );
	grid_women.load({"metadata": women_headings, "data": women_data});
	grid_women.renderGrid("tabSetup_tabWeightClassesWomen", "");
	grid_women.modelChanged = tabSetup_onWeightClassesWomenEdit;


	c = document.getElementById('tabSetup_selPredefinedWeightClasses');
	var c_count = c.options.length;
	for(var i = c_count-1; i >= 0; --i){
		c.removeChild(c.options[i]);
	}
	for(federation in weight_classes){
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(federation));
		opt.value = federation;
		c.appendChild(opt);
	}
}

function tabSetup_onPlatformWeightSetEdit(rowIndex, columnIndex, oldValue, newValue, row){
	//console.log("Value for '" + this.getColumnName(columnIndex) + "' in row " + rowIndex + " has changed from '" + oldValue + "' to '" + newValue + "'");
	state.weight_set[rowIndex][this.getColumnName(columnIndex)] = newValue;
}


function tabSetup_onBarWeightEdit(rowIndex, columnIndex, oldValue, newValue, row){
//console.log("Value for '" + this.getColumnName(columnIndex) + "' in row " + rowIndex + " has changed from '" + oldValue + "' to '" + newValue + "'");
	const colname = this.getColumnName(columnIndex);
	const flight = row.id.replace('BarWeight_', '');
	if(state.bar_weight[flight]){
		state.bar_weight[flight][colname] = Number(newValue);
	}else{
		state.bar_weight[flight] = {};
		state.bar_weight[flight][colname] = Number(newValue);
	}
}

function tabSetup_onDivisionsEdit(rowIndex, columnIndex, oldValue, newValue, row){
//console.log("Value for '" + this.getColumnName(columnIndex) + "' in row " + rowIndex + " has changed from '" + oldValue + "' to '" + newValue + "'");
}


function tabSetup_onWeightClassesMenEdit(rowIndex, columnIndex, oldValue, newValue, row){
//console.log("Value for '" + this.getColumnName(columnIndex) + "' in row " + rowIndex + " has changed from '" + oldValue + "' to '" + newValue + "'");
	const i = row.id.replace('WeightClassesMen_', '');
	if(state.weight_classes.men[i]){
		state.weight_classes.men[i] = Number(newValue);
	}else{
		state.weight_classes.men[i] = Number(newValue);
	}
}
function tabSetup_onWeightClassesWomenEdit(rowIndex, columnIndex, oldValue, newValue, row){
//console.log("Value for '" + this.getColumnName(columnIndex) + "' in row " + rowIndex + " has changed from '" + oldValue + "' to '" + newValue + "'");
	const i = row.id.replace('WeightClassesWomen_', '');
	if(state.weight_classes.women[i]){
		state.weight_classes.women[i] = Number(newValue);
	}else{
		state.weight_classes.women[i] = Number(newValue);
	}
}

function tabSetup_import_divisions(){
	var c = document.getElementById('tabSetup_selPredefinedDivisions');
	var federation = c.value;
	if(!divisions[federation]){ return; }
	state.divisions = {};
	for(division in divisions[federation]){
		state.divisions[division] = divisions[federation][division];
	}
	update_display_setup_divisions();
}

function tabSetup_import_weight_classes(){
	var c = document.getElementById('tabSetup_selPredefinedWeightClasses');
	var federation = c.value;
	if(!weight_classes[federation][state.weight_class_units]){ return; }
	state.weight_classes.men = [];
	var m;
	m = weight_classes[federation][state.weight_class_units].men.length;
	for(i = 0; i < m; ++i){
		state.weight_classes.men.push(weight_classes[federation][state.weight_class_units].men[i]);
	}
	state.weight_classes.women = [];
	m = weight_classes[federation][state.weight_class_units].women.length;
	for(i = 0; i < m; ++i){
		state.weight_classes.women.push(weight_classes[federation][state.weight_class_units].women[i]);
	}
	update_display_setup_weight_classes();
}

function tabSetup_use_standard_plates_onclick(){
	var unit = document.getElementById('tabSetup_selPredefinedWeightSets').value;
	if('KG' == unit || 'LB' == unit){
		state.weight_set = [];
		state.bar_weight = {};
		var m = standard_weight_sets[unit].length;
		for(var i = 0; i < m; ++i){
			state.weight_set.push({
				name: standard_weight_sets[unit][i].name,
				weight: standard_weight_sets[unit][i].weight,
				quantity: standard_weight_sets[unit][i].quantity
			});
		}
		for(var i = 0; i < standard_flights.length; ++i){
			state.bar_weight[standard_flights[i]] = {};
			state.bar_weight[standard_flights[i]].SQ = standard_bar_weights[unit].SQ;
			state.bar_weight[standard_flights[i]].BP = standard_bar_weights[unit].BP;
			state.bar_weight[standard_flights[i]].DL = standard_bar_weights[unit].DL;
		}
	}
	update_display_setup_platform_weight_set();
	update_display_setup_bar_weight();
}
