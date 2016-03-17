var bootState = {

	preload: function() {
		game.load.image('progressBar', 'assets/progressBar.png');
	},

	create: function() {
		game.stage.backgroundColor = '#CDBCB2';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}

}