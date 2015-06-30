var playState = {

  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //add background
    sky = game.add.sprite(0,0,'sky');
    game.add.sprite(0,5820,'grass');
    game.add.sprite(200,0,'tree');
    game.add.sprite(1160,300,'window');
    //add tree barriers
    barriers = game.add.group();
    barriers.enableBody = true;
    var leftBar = barriers.create(200, 0, 'barrier');
    leftBar.body.immovable = true;
    var rightBar = barriers.create(2200, 0, 'barrier');
    rightBar.body.immovable = true;
    //set the boundry of the movable world
    game.world.setBounds(0, 0, 2400, 6000);
    //add the player
    player = game.add.sprite(1000, 6000, 'squirrel');
    game.physics.arcade.enable(player);
    //add the level exit
    home = game.add.sprite( 1200, 300, 'home');
    game.physics.arcade.enable(home);

    acorns = game.add.group()
    acorns.enableBody = true;
    for (var i = 0; i < 40; i++){
      var acorn = acorns.create(Math.random()*2200, Math.random()*2200, 'acorn');
    }

    player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();

    moveUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
    moveDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
    moveRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    player.animations.add('up', [1, 2, 3, 4], 15, true);
    player.animations.add('down', [5, 6, 7, 8], 15, true);
    player.animations.add('right', [9, 10, 11, 12], 15, true);
    player.animations.add('left', [13, 14, 15, 16], 15, true);

    game.camera.follow(player);

    acornCountText = game.add.text(16,16, '0', {fontSize: '32px', fill: 'blue'});
    acornCountText.fixedToCamera = true;

    weapons.push(new Weapon.SingleBullet(this.game));
  },

  update: function () {
    var scrollBackgroundX = function (background) {
      if (background.x > 2000) {
        background.x = -2000;
      }
        background.x -= .1;
    }
    scrollBackgroundX(sky);


    game.physics.arcade.overlap(player, home, this.gameOver);
    game.physics.arcade.collide(player, barriers);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if (moveRight.isDown && moveUp.isDown) {
      player.animations.play('up');
      player.body.velocity.x = 300;
      player.body.velocity.y = -300;
    } else if (moveRight.isDown && moveDown.isDown) {
      player.animations.play('down');
      player.body.velocity.x = 300;
      player.body.velocity.y = 300;
    } else if (moveLeft.isDown && moveUp.isDown) {
      player.animations.play('up');
      player.body.velocity.x = -300;
      player.body.velocity.y = -300;
    } else if (moveLeft.isDown && moveDown.isDown) {
      player.animations.play('down');
      player.body.velocity.x = -300;
      player.body.velocity.y = 300;
    } else if (moveRight.isDown) {
      player.animations.play('right');
      player.body.velocity.x = 300;
    } else if (moveDown.isDown) {
      player.animations.play('down');
      player.body.velocity.y = 300;
    } else if (moveUp.isDown) {
      player.animations.play('up');
      player.body.velocity.y = -300;
    } else if (moveLeft.isDown) {
      player.body.velocity.x = -300;
      player.animations.play('left');
    }
    else {
      player.animations.stop();
    }
    //fire acorns
    if (cursors.down.isDown && cursors.right.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 45);
    } else if (cursors.down.isDown && cursors.left.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 135);
    } else if (cursors.up.isDown && cursors.left.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 225);
    } else if (cursors.up.isDown && cursors.right.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 315);
    } else if (cursors.down.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 90);
    } else if (cursors.right.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 0);
    } else if (cursors.up.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 270);
    } else if (cursors.left.isDown && acornCount > 0) {
      weapons[currentWeapon].fire(player, 180);
    }
    game.physics.arcade.overlap(player, acorns, this.collectAcorn)

  },

  gameOver: function() {
    game.state.start('win');
  },

  collectAcorn: function(player, acorn) {
    acorn.kill();
    acornCount += 1;
    acornCountText.text = String(acornCount);
  }
}
