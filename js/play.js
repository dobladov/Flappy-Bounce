var playState = {

	create: function() {

		game.add.image(0,0, 'sprites', 'background');

		// Score
		game.global.score = 0;
		game.global.changed = true;
		this.scoreLabel = game.add.text(game.world.centerX, 100, game.global.score,
                  							{font: '50px Arial', fill: '#ffffff'});
		this.scoreLabel.anchor.setTo(0.5, 0.5);

		// Game Over
		this.gameOverLabel = game.add.text(game.world.centerX, game.world.height + 100, 'Game\nOver',
                  							{font: '70px Arial',  align: "center", fill: '#212121'});
		this.gameOverLabel.anchor.setTo(0.5, 0.5);

		// Player
		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'sprites', 'fly4');
		this.player.animations.add('fly', ['fly2','fly1','fly3','fly4'], 10);
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.gravity.y = 0;
		game.input.onDown.add(this.fly, this);

		// Bars 
		this.createWorld();

		// Particles
		var bmd = game.add.bitmapData(5,5);
		bmd.ctx.beginPath();
    	bmd.ctx.rect(0,0,5,5);
    	bmd.ctx.fillStyle = '#212121';
    	bmd.ctx.fill();

    	this.emmiter = game.add.emitter(0,0,15);
    	this.emmiter.makeParticles(bmd);
    	this.emmiter.setYSpeed(-100,100);
    	this.emmiter.setXSpeed(-100,100);
    	this.emmiter.gravity = 500;

    	// Sounds
    	this.audio = game.add.audioSprite('sounds');
        this.audio.allowMultiple = true;

	},

	update: function() {

		game.physics.arcade.overlap(this.player, this.walls, this.playerDie, null, this);
		this.checkOut();
	    this.moveLeftBar();
	    this.moveRightBar();
	},

	fly: function() {

		if (!this.player.alive) {
	      return;
	    }

		if (this.player.body.gravity.y == 0) {
			this.player.body.gravity.y = 800;
			this.player.body.velocity.x = 300;			
		}

		this.audio.play('wings', 2);

		this.player.body.velocity.y = -500;
		this.player.animations.play('fly');

	},

	checkOut: function() {

		if (this.player.body.x <= 0 || this.player.body.x + this.player.body.width >= game.world.width ) {
			this.player.body.velocity.x = -this.player.body.velocity.x;
			this.player.scale.x *= -1;
			this.updateScore();

			if (this.player.body.x <= game.world.centerX) {
				this.getNewBarY('right');
			} else {
				this.getNewBarY('left');
			}
		}

	},

	playerDie: function() {

	    if (!this.player.alive) {
	      return;
	    }

	    this.player.kill();
	    this.audio.play('dead');

	    game.add.tween(this.gameOverLabel).to({y:game.world.centerY}, 1500).easing(Phaser.Easing.Elastic.InOut).start();

	    // Particles
	    this.emmiter.x = this.player.x;
	    this.emmiter.y = this.player.y;
	    this.emmiter.start(true, 700, null, 15);
		
		this.targetLeftY = game.world.height + this.leftBar.height;
		this.targetRightY = game.world.height + this.rightBar.height;

		game.time.events.add(1600, function() {
			game.state.start('menu');
		}, this);

	},


	updateScore: function() {

		if (!this.player.alive) {
	      return;
	    }

		game.global.score++;
		this.scoreLabel.text = game.global.score;
		this.audio.play('coin', 0.3);

	},


	createWorld: function() {

		var vBoxHeight  = this.cache.getFrameData('sprites').getFrameByName('verticalBar').height;
		var paddingV = 15;
		var paddingH = 2;
		
		this.walls = game.add.group();
		this.walls.enableBody = true;

		this.leftBar = game.add.sprite(paddingV, game.world.height + vBoxHeight, 'sprites', 'verticalBar');
		this.leftBar.anchor.setTo(0.5, 0.5);
		this.walls.add(this.leftBar);
		
		this.rightBar = game.add.sprite(game.world.width - paddingV, game.world.height + vBoxHeight, 'sprites', 'verticalBar');
		this.rightBar.anchor.setTo(0.5, 0.5);
		this.rightBar.scale.x *= -1;
		this.walls.add(this.rightBar);

		this.walls.create(paddingH, paddingH, 'sprites', 'horizontalBar');
		this.walls.create(paddingH, game.world.height - paddingH, 'sprites', 'horizontalBar').scale.y *= -1;

		this.walls.setAll('body.immovable', true);

	},

	moveLeftBar: function() {

		// If value is near, correct the derivation because velocity and stuff
		if (this.leftBar.body.y < this.targetLeftY + 10  && this.leftBar.body.y > this.targetLeftY - 10 ) {
			return;
		}

		if (Phaser.Math.roundAwayFromZero(this.leftBar.body.y) < this.targetLeftY) {
	    	this.leftBar.body.y += 10;
	    } else if (Phaser.Math.roundAwayFromZero(this.leftBar.body.y) > this.targetLeftY) {
	    	this.leftBar.body.y -= 10;
	    }	    

	},


	moveRightBar: function() {

		if (this.rightBar.body.y < this.targetRightY + 10  && this.rightBar.body.y > this.targetRightY - 10 ) {
			return;
		}

		if (Phaser.Math.roundAwayFromZero(this.rightBar.body.y) < this.targetRightY) {
	    	this.rightBar.body.y += 10;
	    } else if (Phaser.Math.roundAwayFromZero(this.rightBar.body.y) > this.targetRightY) {
	    	this.rightBar.body.y -= 10;
	    }	    

	},

	getNewBarY: function(bar) {
	
		var newY = game.rnd.integerInRange(30, game.world.height - (this.leftBar.height + 30)) ;

		if (bar === 'left') {

			this.targetLeftY = newY;			

		} else {

			this.targetRightY = newY;			
		}

	}//,

	// // Debug
	// render: function() {
	// 	// game.debug.body(this.player);
	// 	game.debug.geom(this.line);
	// 	game.debug.geom(this.rect);
	// 	// game.debug.text( this.player.body.x, 10, 58 );
	// 	// game.debug.text( this.player.body.x + this.player.body.width, 10, 38 );
	// 	// game.debug.text( game.world.width, 10, 38 );
	// 	// game.debug.text( this.player.body.x == 0 || this.player.body.x + this.player.body.width == game.world.width, 100, 380 );
	// }

};