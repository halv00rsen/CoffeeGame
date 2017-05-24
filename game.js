
let pos_kopp = 200;
let accell = 1


const move_left = () => {
	if (accell > 0) {
		accell = -1
	} else if (accell > -10) {
		accell--;
	}
	pos_kopp += accell;
	$("#kopp").css("margin-left", pos_kopp);
}

const move_right = () => {
	if (accell < 0) {
		accell = 1;
	} else if (accell < 10) {
		accell++;
	}
	pos_kopp += accell;
	$("#kopp").css("margin-left", pos_kopp);
}

let box1 = 0;
let stop_game = false;

const do_game = () => {
	if (stop_game) {
		return;
	}
	box1 += 5;
	$(".coffee").css("margin-top", box1);
}

const speed = () => {

}

const toggle_game = () => {
	stop_game = !stop_game;
}

$("body").keypress(function(e){
	if (e.which === 104) {
		console.log("venstre");
		move_left();
	} else if (e.which === 108) {
		console.log("høyre");
		move_right();
	}
});

setInterval(do_game, 300);
