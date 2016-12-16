function editable_table_build(table_id, headings, data, callback){
	var t = document.getElementById(table_id);
	var header = t.createTHead();
	var row = header.insertRow(0);
	const n = headings.length;
	const m = data.length;
	console.log(n);
	console.log(m);
	var i, j;
	for(j = 0; j < n; ++j){
		var cell = row.insertCell(j);
		cell.innerHTML = headings[j];
	}

	var body = t.createTBody();
	for(i = 0; i < m; ++i){
		row = body.insertRow(i);
		for(j = 0; j < n; ++j){
			var cell = row.insertCell(j);
			cell.innerHTML = data[i][j];
			cell.onclick = (function(){
				var row = i;
				var col = j;
				var my_data = data[i][j];
				var my_cell = cell;
				var myc = callback;
				return function(evt){ return editable_table_onclick(evt, my_data, row, col, my_cell, myc); }
			})();
		}
	}
}

function editable_table_onclick(evt, data, i, j, cell, callback){
	var elem = document.createElement('input');
	elem.type = 'input';
	elem.value = data;
	cell.innerHTML = '';
	cell.appendChild(elem);
	elem.select();
	elem.style.width = cell.style.width;
	elem.onkeypress = (function(){
		var row = i;
		var col = j;
		var my_elem = elem;
		var my_data = data;
		var myc = callback;
		return function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
			if(13 == code){
				cell.removeChild(my_elem);
				cell.innerHTML = myc(i, j, my_elem.value);
				return false;
			}else if(27 == code){
				cell.removeChild(my_elem);
				cell.innerHTML = my_data;
				return false;
			}
			return true;
		}
	})();
}
