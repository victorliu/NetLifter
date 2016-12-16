// timer sits on the lifting tab
var timer_sec = 60;
var timer_interval;
function update_timer_display(){
	var min = Math.floor(timer_sec / 60);
	var sec = timer_sec - min*60;
	if(sec < 10){ sec = '0' + sec; }
	document.getElementById('timer').innerHTML = min+":"+sec;
}
function parse_timer(){
	timer_sec = 0;
	if(document.getElementById('txtTimerMin').value){
		timer_sec += 60*parseInt(document.getElementById('txtTimerMin').value);
	}
	if(document.getElementById('txtTimerSec').value){
		timer_sec += parseInt(document.getElementById('txtTimerSec').value);
	}
}
function btnTimerReset_clicked(){
	if(timer_interval){
		clearInterval(timer_interval);
		timer_interval = null;
		document.getElementById('btnTimerStartStop').value = 'Start';
	}
	parse_timer();
	update_timer_display();
}

function btnTimerStartStop_clicked(){
	if(!timer_interval){
		update_timer_display();
		if(timer_sec <= 0){ return; }
		timer_interval = setInterval(function(){
			timer_sec--;
			update_timer_display();
			if(timer_sec <= 0){
				clearInterval(timer_interval);
		timer_interval = null;
				document.getElementById('timer').innerHTML = "<blink>0:00</blink>";
				document.getElementById('btnTimerStartStop').value = 'Start';
			}
		}, 1000);
		document.getElementById('btnTimerStartStop').value = 'Stop';
	}else{
		clearInterval(timer_interval);
		timer_interval = null;
		document.getElementById('btnTimerStartStop').value = 'Start';
	}
}
