// Registro centralizado de colisiones y overlaps (Arcade Physics).
// Los "overlap" actúan como triggers: detectan el contacto sin empujar los cuerpos.
// La lógica de qué pasa en cada contacto vive en GameScene (onBulletHitEnemy, etc.).
export function registerCollisions(scene) {
  const { physics, player, playerBullets, enemyBullets, enemies, powerUps } = scene;

  physics.add.overlap(playerBullets, enemies, (bullet, enemy) => scene.onBulletHitEnemy(bullet, enemy));
  physics.add.overlap(player, enemies, (p, enemy) => scene.onPlayerHitEnemy(p, enemy));
  physics.add.overlap(player, enemyBullets, (p, bullet) => scene.onPlayerHitBullet(p, bullet));
  physics.add.overlap(player, powerUps, (p, powerUp) => scene.onCollectPowerUp(p, powerUp));
}
