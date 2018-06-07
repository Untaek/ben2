import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js'
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js'
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js'
import phaser from 'phaser-ce'

import GameManager from './class/GameManager'

const parent = document.getElementById('game')

/** @type {phaser.Game} */
const game = new Phaser.Game({
  renderer: Phaser.CANVAS,
  width: 800,
  height: 600,
  parent: parent,
  antialias: true
})

const gameManager = new GameManager(game)
