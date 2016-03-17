var loadState =  {

	preload: function() {

		var loadingLabel = game.add.text(game.world.centerX, game.world.centerY - 50, 'Loading...', 
											{font: '30px Arial', fill: '#fffff'});

		loadingLabel.anchor.setTo(0.5, 0.5);

		var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		game.load.atlas('sprites', 'assets/atlas/spritesheet.png', 'assets/atlas/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.audiosprite('sounds', ['assets/sound/sprite/sounds.ogg', 'assets/sound/sprite/sounds.mp3'], 'assets/sound/sprite/sounds.json');

	},

	update: function() {
		game.state.start('menu');
	}

}