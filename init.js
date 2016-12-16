const kilos_per_pound = 0.45359237;
const LIFT_STATE = {
	GOOD: 1,
	NOT_ATTEMPTED: 0,
	NO_LIFT: -1,
	SCRATCH: -2
};
function lift_state_completed(lift_state){
	return (LIFT_STATE.GOOD == lift_state || LIFT_STATE.NO_LIFT == lift_state);
}

const liftlist = [ "SQ", "BP", "DL" ];

const standard_flights = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' ];

const column_headers = {
	flight: "Flight",
	name: "Name",
	division: "Div",
	weight: "Wt",
	age: "Age",
	dob: "DOB",
	which_lifts: "Events",
	SQ_rack: "RH SQ",
	BP_rack: "RH BP",
	state: "State",
	team: "Team",
	lot_number: "lot#",
	wilks: "Wilks",
	age_coeff: "Age Coeff",
	weight_class: "WtCls",
	SQ_best: "Best SQ",
	BP_best: "Best BP",
	DL_best: "Best DL",
	SQ_1: "SQ 1",
	SQ_2: "SQ 2",
	SQ_3: "SQ 3",
	SQ_4: "SQ 4",
	BP_1: "BP 1",
	BP_2: "BP 2",
	BP_3: "BP 3",
	BP_4: "BP 4",
	DL_1: "DL 1",
	DL_2: "DL 2",
	DL_3: "DL 3",
	DL_4: "DL 4",
	SQ_best: "Best SQ",
	BP_best: "Best BP",
	DL_best: "Best DL",
	best: "Best",
	subtotal: "Subtotal",
	total: "Total"
};
const computed_columns = {
	wilks: display_wilks,
	age_coeff: get_age_coeff,
	weight_class: get_weight_class,
	best: get_best,
	SQ_best: get_best_SQ,
	BP_best: get_best_BP,
	DL_best: get_best_DL,
	subtotal: get_subtotal,
	total: get_total
};
const import_columns = [
	'flight',
	'name',
	'division',
	'weight',
	'age',
	'dob',
	'which_lifts',
	'SQ_rack','BP_rack',
	'state','team','lot_number',
	'SQ_1','BP_1','DL_1'
];
const export_columns = [
	'flight',
	'name',
	'division',
	'weight_class',
	'weight',
	'age',
	'dob',
	'which_lifts',
	'SQ_rack','BP_rack',
	'state',
	'team',
	'lot_number',
	'wilks',
	'age_coeff',
	'weight_class',
	'SQ_1','SQ_2','SQ_3', 'SQ_best',
	'BP_1','BP_2','BP_3', 'BP_best',
	'DL_1','DL_2','DL_3', 'DL_best',
	'total',
	'SQ_4','BP_4','DL_4'
];
const displayed_columns = {
	SQ: [
		"flight", "name", "division", "weight", "weight_class", "SQ_rack", "attempts"
	],
	BP: [
		"flight", "name", "division", "weight", "weight_class", "SQ_best", "BP_rack", "attempts", "subtotal"
	],
	DL: [
		"flight", "name", "division", "weight", "weight_class", "SQ_best", "BP_best", "attempts", "total"
	]
};
const weight_columns = {
	weight: 'body_weight_units',
	weight_class: 'weight_class_units',
	SQ_1: 'weight_set_units',
	SQ_2: 'weight_set_units',
	SQ_3: 'weight_set_units',
	SQ_4: 'weight_set_units',
	SQ_best: 'weight_set_units',
	BP_1: 'weight_set_units',
	BP_2: 'weight_set_units',
	BP_3: 'weight_set_units',
	BP_4: 'weight_set_units',
	BP_best: 'weight_set_units',
	DL_1: 'weight_set_units',
	DL_2: 'weight_set_units',
	DL_3: 'weight_set_units',
	DL_4: 'weight_set_units',
	DL_best: 'weight_set_units',
	subtotal: 'weight_set_units',
	total: 'weight_set_units'
};
const text_columns = [
	"flight",
	"name",
	"division",
	"weight",
	"age",
	"dob",
	"which_lifts",
	"SQ_rack",
	"BP_rack",
	"state",
	"team",
	"lot_number",
	"SQ_1", "SQ_1_state",
	"BP_1", "BP_1_state",
	"DL_1", "DL_1_state",
	"SQ_2", "SQ_2_state",
	"BP_2", "BP_2_state",
	"DL_2", "DL_2_state",
	"SQ_3", "SQ_3_state",
	"BP_3", "BP_3_state",
	"DL_3", "DL_3_state",
	"SQ_4", "SQ_4_state",
	"BP_4", "BP_4_state",
	"DL_4", "DL_4_state"
];

const divisions = {
	USAPL: {
		"FR-Y1": "Raw Women (8-9)",
		"FR-Y2": "Raw Women (10-11)",
		"FR-Y3": "Raw Women (12-13)",
		"FR-T1": "Raw Women (14-15)",
		"FR-T2": "Raw Women (16-17)",
		"FR-T3": "Raw Women (18-19)",
		"FR-JR": "Raw Women (20-23)",
		"FR-O": "Raw Women",
		"FR-M1a": "Raw Women (40-44)",
		"FR-M1b": "Raw Women (45-49)",
		"FR-M2a": "Raw Women (50-54)",
		"FR-M2b": "Raw Women (55-59)",
		"FR-M3a": "Raw Women (60-64)",
		"FR-M3b": "Raw Women (65-69)",
		"FR-M4a": "Raw Women (70-74)",
		"FR-M4b": "Raw Women (75-79)",
		"FR-M5a": "Raw Women (80-84)",
		"FR-M5b": "Raw Women (85-89)",
		"FR-M6": "Raw Women (90+)-",
		"MR-Y1": "Raw Men (8-9)",
		"MR-Y2": "Raw Men (10-11)",
		"MR-Y3": "Raw Men (12-13)",
		"MR-T1": "Raw Men (14-15)",
		"MR-T2": "Raw Men (16-17)",
		"MR-T3": "Raw Men (18-19)",
		"MR-JR": "Raw Men (20-23)",
		"MR-O": "Raw Men",
		"MR-M1a": "Raw Men (40-44)",
		"MR-M1b": "Raw Men (45-49)",
		"MR-M2a": "Raw Men (50-54)",
		"MR-M2b": "Raw Men (55-59)",
		"MR-M3a": "Raw Men (60-64)",
		"MR-M3b": "Raw Men (65-69)",
		"MR-M4a": "Raw Men (70-74)",
		"MR-M4b": "Raw Men (75-79)",
		"MR-M5a": "Raw Men (80-84)",
		"MR-M5b": "Raw Men (85-89)",
		"MR-M6": "Raw Men (90+)-",
		"F-T1": "Women (14-15)",
		"F-T2": "Women (16-17)",
		"F-T3": "Women (18-19)",
		"F-JR": "Women (20-23)",
		"F-O": "Women",
		"F-M1a": "Women (40-44)",
		"F-M1b": "Women (45-49)",
		"F-M2a": "Women (50-54)",
		"F-M2b": "Women (55-59)",
		"F-M3a": "Women (60-64)",
		"F-M3b": "Women (65-69)",
		"F-M4a": "Women (70-74)",
		"F-M4b": "Women (75-79)",
		"F-M5a": "Women (80-84)",
		"F-M5b": "Women (85-89)",
		"F-M6": "Women (90+)-",
		"M-T1": "Men (14-15)",
		"M-T2": "Men (16-17)",
		"M-T3": "Men (18-19)",
		"M-JR": "Men (20-23)",
		"M-O": "Men",
		"M-M1a": "Men (40-44)",
		"M-M1b": "Men (45-49)",
		"M-M2a": "Men (50-54)",
		"M-M2b": "Men (55-59)",
		"M-M3a": "Men (60-64)",
		"M-M3b": "Men (65-69)",
		"M-M4a": "Men (70-74)",
		"M-M4b": "Men (75-79)",
		"M-M5a": "Men (80-84)",
		"M-M5b": "Men (85-89)",
		"M-M6": "Men (90+)-"
	},
	IPF: {
		"FR-SJr": "Raw Women (14-18)",
		"FR-Jr": "Raw Women (19-23)",
		"FR-O": "Raw Women",
		"FR-M1": "Raw Women (40-49)",
		"FR-M2": "Raw Women (50-59)",
		"FR-M3": "Raw Women (60-69)",
		"FR-M4": "Raw Women (70+)-",
		"MR-SJr": "Raw Men (14-18)",
		"MR-Jr": "Raw Men (19-23)",
		"MR-O": "Raw Men",
		"MR-M1": "Raw Men (40-49)",
		"MR-M2": "Raw Men (50-59)",
		"MR-M3": "Raw Men (60-69)",
		"MR-M4": "Raw Men (70+)-",
		"F-SJr": "Women (14 -18)",
		"F-Jr": "Women (19 -23)",
		"F-O": "Women",
		"F-M1": "Women (40 -49)",
		"F-M2": "Women (50 -59)",
		"F-M3": "Women (60 -69)",
		"F-M4": "Women (70+) -",
		"M-SJr": "Men (14 -18)",
		"M-Jr": "Men (19 -23)",
		"M-O": "Men",
		"M-M1": "Men (40 -49)",
		"M-M2": "Men (50 -59)",
		"M-M3": "Men (60 -69)",
		"M-M4": "Men (70+) -"
	}
};

const weight_classes = {
	IPF: {
		KG: {
			men: [ 30, 35, 40, 44, 48, 53, 59, 66, 74, 83, 93, 105, 120, '120+' ],
			women: [ 30, 35, 40, 43, 47, 52, 57, 63, 72, 84, '84+' ]
		},
		LB: {
			men: [ 66, 77, 88, 97, 105, 116, 130, 145, 163, 183, 205, 231, 264, '264+' ],
			women: [ 66, 77, 88, 94, 103, 114, 125, 138, 158, 185, '185+' ]
		}
	},
	"High School": {
		KG: {
			men: [ 52, 56, 60, 67.5, 75, 82.5, 90, 100, 125, '125+' ],
			women: [ 44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, '90+' ]
		},
		LB: {
			men: [ 114, 123, 132, 148, 165, 181, 198, 220, 242, 275, '275+' ],
			women: [ 97, 105, 114, 123, 132, 148, 165, 181, 198, '198+' ]
		}
	}
};

const age_coefficients = {
	Foster: {
		14: 1.23,
		15: 1.18,
		16: 1.13,
		17: 1.08,
		18: 1.06,
		19: 1.04,
		20: 1.03,
		21: 1.02,
		22: 1.01,
		23: 1.00
	},
	McCulloch: {
		40: 1,
		41: 1.01,
		42: 1.02,
		43: 1.031,
		44: 1.043,
		45: 1.055,
		46: 1.068,
		47: 1.082,
		48: 1.097,
		49: 1.113,
		50: 1.13,
		51: 1.147,
		52: 1.165,
		53: 1.184,
		54: 1.204,
		55: 1.225,
		56: 1.246,
		57: 1.258,
		58: 1.292,
		59: 1.315,
		60: 1.34,
		61: 1.366,
		62: 1.393,
		63: 1.421,
		64: 1.45,
		65: 1.48,
		66: 1.511,
		67: 1.543,
		68: 1.578,
		69: 1.61,
		70: 1.645,
		71: 1.681,
		72: 1.718,
		73: 1.756,
		74: 1.795,
		75: 1.835,
		76: 1.876,
		77: 1.918,
		78: 1.961,
		79: 2.005,
		80: 2.05,
		81: 2.096,
		82: 2.143,
		83: 2.19,
		84: 2.238,
		85: 2.287,
		86: 2.337,
		87: 2.388,
		88: 2.44,
		89: 2.494,
		90: 2.549
	}
};
const standard_bar_weights = {
	KG: { SQ: 25, BP: 20, DL: 20 },
	LB: { SQ: 55, BP: 45, DL: 45 }
};
const standard_weight_sets = {
	KG: [
		{
			name: "bar",
			weight: 20,
			quantity: 1
		},
		{
			name: "collar",
			weight: 2.5,
			quantity: 2
		},
		{
			name: "50",
			weight: 50,
			quantity: 0
		},
		{
			name: "45",
			weight: 45,
			quantity: 0
		},
		{
			name: "25",
			weight: 25,
			quantity: 14
		},
		{
			name: "20",
			weight: 20,
			quantity: 2
		},
		{
			name: "15",
			weight: 15,
			quantity: 2
		},
		{
			name: "10",
			weight: 10,
			quantity: 2
		},
		{
			name: "5",
			weight: 5,
			quantity: 2
		},
		{
			name: "2.5",
			weight: 2.5,
			quantity: 2
		},
		{
			name: "1.25",
			weight: 1.25,
			quantity: 2
		},
		{
			name: "0.5",
			weight: 0.5,
			quantity: 2
		},
		{
			name: "0.25",
			weight: 0.25,
			quantity: 2
		}
	],
	LB: [
		{
			name: "bar",
			weight: 45,
			quantity: 1
		},
		{
			name: "collar",
			weight: 5,
			quantity: 2
		},
		{
			name: "110",
			weight: 110,
			quantity: 0
		},
		{
			name: "100",
			weight: 100,
			quantity: 0
		},
		{
			name: "55",
			weight: 55,
			quantity: 0
		},
		{
			name: "45",
			weight: 45,
			quantity: 16
		},
		{
			name: "35",
			weight: 35,
			quantity: 2
		},
		{
			name: "25",
			weight: 25,
			quantity: 2
		},
		{
			name: "10",
			weight: 10,
			quantity: 4
		},
		{
			name: "5",
			weight: 5,
			quantity: 2
		},
		{
			name: "2.5",
			weight: 2.5,
			quantity: 2
		},
		{
			name: "1.25",
			weight: 1.25,
			quantity: 4
		},
		{
			name: "0.5",
			weight: 0.5,
			quantity: 2
		}
	]
};
var state = {
	weight_set: [
		{
			name: "bar",
			weight: 20,
			quantity: 1
		},
		{
			name: "collar",
			weight: 2.5,
			quantity: 2
		},
		{
			name: "50",
			weight: 50,
			quantity: 0
		},
		{
			name: "45",
			weight: 45,
			quantity: 0
		},
		{
			name: "25",
			weight: 25,
			quantity: 14
		},
		{
			name: "20",
			weight: 20,
			quantity: 2
		},
		{
			name: "15",
			weight: 15,
			quantity: 2
		},
		{
			name: "10",
			weight: 10,
			quantity: 2
		},
		{
			name: "5",
			weight: 5,
			quantity: 2
		},
		{
			name: "2.5",
			weight: 2.5,
			quantity: 2
		},
		{
			name: "1.25",
			weight: 1.25,
			quantity: 2
		},
		{
			name: "0.5",
			weight: 0.5,
			quantity: 2
		},
		{
			name: "0.25",
			weight: 0.25,
			quantity: 2
		}
	],
	bar_weight: {
		A: { SQ: 25, BP: 20, DL: 20 },
		B: { SQ: 25, BP: 20, DL: 20 },
		C: { SQ: 25, BP: 20, DL: 20 },
		D: { SQ: 25, BP: 20, DL: 20 },
		E: { SQ: 25, BP: 20, DL: 20 },
		F: { SQ: 25, BP: 20, DL: 20 },
		G: { SQ: 25, BP: 20, DL: 20 },
		H: { SQ: 25, BP: 20, DL: 20 },
		I: { SQ: 25, BP: 20, DL: 20 },
		J: { SQ: 25, BP: 20, DL: 20 },
		K: { SQ: 25, BP: 20, DL: 20 },
		L: { SQ: 25, BP: 20, DL: 20 }
	},
	weight_set_units: "KG",
	weight_classes: {
		women: [
			43, 47, 52, 57, 63, 72, 84, "84+"
		],
		men: [
			53, 59, 66, 74, 83, 93, 105, 120, "120+"
		]
	},
	body_weight_units: "KG",
	weight_class_units: "KG",
	divisions: {
	},
	lifter_info: [
		{
			flight: "A",
			name: "First Last",
			age: 32,
			dob: "",
			state: "",
			team: "",
			division: "M-OR",
			weight: 154,
			lot_number: 1,
			which_lifts: "PL",
			SQ_rack: "6-2",
			SQ_1: 150,
			SQ_1_state: 0, // 0 = not attempted, 1 = good, -1 = nolift
			// ...
			SQ_4_state: 0,
			BP_rack: "5-2",
			BP_1: 130,
			BP_1_state: 0,
			// ...
			DL_1: 200,
			DL_1_state: 0
		}
	],
	current: {
		flight: "A",
		lift: "SQ",
		attempt: 1,
		lifter_id: -1,
		lifters: []
	}
};

function add_computed_columns(){
	const m = state.lifter_info.length;
	for(var i = 0; i < m; ++i){
		for(colname in computed_columns){
			state.lifter_info[i][colname] = computed_columns[colname];
		}
	}
}

var records = {};
var record_getter = {
	USAPL: get_records_USAPL
};

function get_records_USAPL(){
	// Download xlsx from "http://usapl.liftingdatabase.com/records-excelnextlifter" + "?state=" + "CA"
	// Two sheets: KG Records, LB Records
	// First row headings: Division
	// First col headings: weight class and lift, first half men, second half women
	//
	// records.USAPL = { men: {}, women: {} };
}
