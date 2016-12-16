function escape_Excel(val){
	if(val.indexOf('-') > 0){
		return '"=""' + val.replace('"','""') + '"""';
	}
	return '' + val;
}
function escale_CSV(val){
	if(val.indexOf('-') > 0){
		return '"' + val.replace('"','""') + '"';
	}
	return '' + val;
}
function textify(stuff){
	if(stuff){ return '' + stuff; }
	return '';
}
function get_timestamp(){
	var today = new Date();
	var dd = today.getDate();
	if(dd < 10){ dd = '0' + dd; }else{ dd = '' + dd; }
	var mm = today.getMonth()+1;
	if(mm < 10){ mm = '0' + mm; }else{ mm = '' + mm; }
	var yyyy = today.getFullYear();
	var hh = '' + today.getHours();
	var mn = '' + today.getMinutes();
	return ('' + yyyy + mm + dd + '-' + hh + mn);
}

function text_to_table(str, delim){
	var tab = [];
	var lines = str.split(/\r\n|\n|\r/);
	for(var i = 0; i < lines.length; ++i){
		if(lines[i].match(/^\s*$/)){ break; } // skip blank lines
		var re = new RegExp(delim);
		var fields = lines[i].split(re);
		tab[i] = [];
		for(var j = 0; j < fields.length; ++j){
			tab[i][j] = fields[j].trim();
		}
	}
	return tab;
}
function table_to_text(tab, delim){
	var str = '';
	const m = tab.length; // m rows
	for(var i = 0; i < m; ++i){
		const n = tab[i].length; // n cols
		for(var j = 0; j+1 < n; ++j){
			str += tab[i][j] + delim;
		}
		str += tab[i][j] + '\n';
	}
	return str;
}

//// Powerlifting functions

function weight_unit_string(unit){
	return unit.toLowerCase();
}
function is_SHW(weight_class){
	if(typeof weight_class === 'number'){ return false; }
	return weight_class.indexOf('+') >= 0;
}
function weight_class_string(weight_class){
	if(is_SHW(weight_class)){
		return 'SHW';
	}else{
		return '' + weight_class;
	}
}
function weight_class_number(weight_class){
	if(is_SHW(weight_class)){
		return 9999;
	}else{
		return Number(weight_class);
	}
}
function check_attempt_weight(weight){
	// weight must be multiple of 2.5 except for record setters
	var x = weight/2.5
	if(Math.abs(x - Math.round(x)) > 1e-6){
		alert("Weight must be a multiple of 2.5 unless this is a record attempt");
	}
}

function wilks_coefficient(is_female, weight){
	const x = weight;
	const c = {
		men: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863E-06, -1.291E-08],
		women: [ 594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582E-05, -9.054E-08 ]
	};
	var coeffs;
	if(is_female){
		coeffs = c.women;
	}else{
		coeffs = c.men;
	}
	var sum = coeffs[5];
	sum *= x; sum += coeffs[4];
	sum *= x; sum += coeffs[3];
	sum *= x; sum += coeffs[2];
	sum *= x; sum += coeffs[1];
	sum *= x; sum += coeffs[0];
	return 500/sum;
}
function age_coefficient(age){
	age = Number(age);
	if(age_coefficients.Foster[age]){
		return age_coefficients.Foster[age];
	}
	if(age_coefficients.McCulloch[age]){
		return age_coefficients.McCulloch[age];
	}
	return 1;
}

function get_flight_list(first_flight){
	var flights = [];
	const nlifters = state.lifter_info.length;
	for(i = 0; i < nlifters; ++i){
		var iflight = state.lifter_info[i].flight;
		var j = flights.indexOf(iflight);
		if(j < 0){
			flights.push(iflight);
		}
	}
	flights.sort();
	const n = flights.length;
	var icur = 0;
	for(i = 1; i < n; ++i){
		if(flights[i] == first_flight){
			icur = i;
			break;
		}
	}
	if(0 == icur){ return flights; }
	// rotate list
	flights.unshift.apply(flights, flights.splice(icur, n));
	return flights;
}

function events_contains(event_str, liftstr){
	const evtab = {
		PL: ["SQ", "BP", "DL"],
		BP: [      "BP"      ],
		DL: [            "DL"],
		PP: [      "BP", "DL"]
	};
	var evlist = event_str.split("+");
	for(var i = 0; i < evlist.length; ++i){
		var ev = evlist[i];
		if(!evtab[ev]){ continue; }
		for(var j = 0; j < evtab[ev].length; ++j){
			if(evtab[ev][j] == liftstr){
				return true;
			}
		}
	}
	return false;
}

function get_current_bar_weight(){
	var bar_weight = state.weight_set[0].weight;
	if(state.bar_weight[state.current.flight]){
		var specific_weight = state.bar_weight[state.current.flight][state.current.lift];
		if(specific_weight){
			bar_weight = specific_weight;
		}
	}
	return bar_weight;
}
function get_collar_weight(){
	return state.weight_set[1].weight;
}

function plate_count(weight){
	const n = state.weight_set.length;
	var remaining_weight_4 = Math.round(weight*4);
	var counts = [];
	for(var i = 0; i < n; ++i){
//console.log('Plate: ' + state.weight_set[i].name + ', weight: ' + state.weight_set[i].weight + ', count: ' + state.weight_set[i].count);
		counts[i] = 0;
		var curcount = state.weight_set[i].quantity;
		var num_to_use_at_a_time = 2;
		var cur_weight_4 = Math.round(state.weight_set[i].weight*4);
		if(state.weight_set[i].name == 'bar'){
			num_to_use_at_a_time = 1;
			cur_weight_4 = Math.round(get_current_bar_weight()*4);
		}
//console.log(remaining_weight_4/4 + ' ' + cur_weight_4/4);
		while(remaining_weight_4 >= num_to_use_at_a_time*cur_weight_4 && curcount > 0){
			counts[i] += num_to_use_at_a_time;
			remaining_weight_4 -= num_to_use_at_a_time*cur_weight_4;
			curcount -= num_to_use_at_a_time;
		}
	}
	return counts;
}

function plate_count_to_string(counts){
	var str = '';
	for(var i = 2; i < counts.length; ++i){
		var curstr = '';
		var single_side_count = counts[i]/2;
		if(single_side_count > 1){
			curstr = (single_side_count + 'x' + state.weight_set[i].name);
		}else if(single_side_count > 0){
			curstr = state.weight_set[i].name;
		}
		if(curstr){
			if(str){
				str += ', ';
			}
			str += curstr;
		}
	}
	return str;
}

function base_weight(){
	var weight = 0;
	/*
	for(var i = 0; i < state.weight_set.length; ++i){
		if(state.weight_set[i].name == 'bar'){ weight += Number(state.weight_set[i].weight); break; }
		if(state.weight_set[i].name == 'collar'){ weight += 2*Number(state.weight_set[i].weight); break; }
	}*/
	weight += get_current_bar_weight();
	weight += 2*Number(state.weight_set[1].weight);
	return weight;
}
