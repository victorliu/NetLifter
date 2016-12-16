function WeightCellRenderer(config) { this.init(config); }
WeightCellRenderer.prototype = new CellRenderer();
WeightCellRenderer.prototype.render = function(element, value)
{
	var unit = this.unit;
	if('KG' == unit){
		element.className += " weightKG";
	}else{
		element.className += " weightLB";
	}
};
