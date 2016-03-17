var menuState = {

	create: function() {

		game.add.image(0,0, 'sprites', 'background');

		// Logo
		var logo = game.add.image(game.world.centerX, -50, 'sprites', 'logo');
		logo.anchor.setTo(0.5, 0.5);

		game.add.tween(logo).to({y:120}, 1000).easing(Phaser.Easing.Bounce.Out).start();

		// Sounds
		this.audio = game.add.audioSprite('sounds');
		this.audio.play('menu');

		// Play Button
		var btnPlay  = game.add.button(-200 , game.world.centerY -100, 'sprites', function() {
			game.state.start('play');
		}, this);

		btnPlay.frameName = 'btnPlay';

		btnPlay.anchor.setTo(0.5, 0.5);
		btnPlay.input.useHandCursor = true;

		game.add.tween(btnPlay).to({x:game.world.centerY - 150}, 500).easing(Phaser.Easing.Linear.None).start();

		// Scores
		if (!localStorage.getItem('bestScore')) {
			localStorage.setItem('bestScore', 0);
		}

		if (game.global.score > localStorage.getItem('bestScore')) {
			localStorage.setItem('bestScore', game.global.score);
		}

    	if (game.global.changed) {
			var msgShare = 'Made a score of ' + game.global.score + ' in Flappy Bounce!';
    	} else {
			var msgShare = 'Made a score of ' + localStorage.getItem('bestScore') + ' in Flappy Bounce';
    	}

    	var scores = 'Best: ' + localStorage.getItem('bestScore') + '\n';

		if (game.global.changed) {
			scores += 'Score: ' + game.global.score;
		}

    	this.scoreLabel = game.add.text(game.world.centerX, game.world.centerY + 150, scores, 
											{font: '30px Arial',  align: "center", fill: '#414141'});

		this.scoreLabel.anchor.setTo(0.5, 0.5);

    	// Share Button
		var btnShare  = game.add.button(game.world.width + 200, game.world.centerY, 'sprites', function() {
									window.open('https://twitter.com/intent/tweet?text=' + msgShare, "_blank");
		}, this);
		btnShare.anchor.setTo(0.5, 0.5);
		btnShare.frameName = 'btnShare';
		btnShare.input.useHandCursor = true;
		
		game.add.tween(btnShare).to({x:game.world.centerY - 150}, 500).easing(Phaser.Easing.Linear.None).start();

		// Mute
		this.muteButton = game.add.button(game.world.width -60, game.world.height -60, 'sprites', this.toggleSound, this);
		this.muteButton.anchor.setTo(0.5, 0.5);
		
		this.muteButton.frameName = game.sound.mute ? 'mute' : 'audio';
		this.muteButton.input.useHandCursor = true;


		// Credits
		var credits = game.add.text(10, game.world.height -30, 'By @dobladov',
								{font: '15px Arial', fill: '#414141'});

		credits.inputEnabled = true;
		credits.input.useHandCursor = true;

		credits.events.onInputDown.add(function() {
			window.open('https://twitter.com/dobladov', "_blank");
		}, this);

		// Raven
		this.raven = game.add.sprite(game.world.width -57, game.world.height -99, 'sprites', 'stand1');
		this.raven.animations.add('move', ['stand1','stand2','stand3','stand4','stand2','stand1']);
		this.raven.animations.add('push', ['stand1','fly4','fly2','fly3','stand1']);
		this.raven.animations.play('move', 2, true);
		this.raven.anchor.setTo(0.5, 0.5);
		this.raven.scale.x *= -1;

	},

	toggleSound: function() {
		game.sound.mute = !game.sound.mute;
		this.muteButton.frameName = game.sound.mute ? 'mute' : 'audio';

		this.raven.animations.play('push', 7, false);
		this.raven.animations.currentAnim.onComplete.add(function () {
			this.raven.animations.play('move', 2, true);
		}, this);
	}

}