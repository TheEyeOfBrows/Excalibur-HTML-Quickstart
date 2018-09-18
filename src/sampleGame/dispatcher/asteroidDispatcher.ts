import Asteroid from "../actor/asteroid.js";

/**
 * Keeps a list of all asteroids which exist, and spawns in new ones at the screen's edge
 */
export default class AsteroidDispatcher extends ex.Actor {
  private bumper = 40;
  private wiggle = 10;

  private asteroids: Asteroid[];
  private currentDelay: number;
  private maxLength: number;
  private delay: number;
  private asteroidRadius: number;
  private asteroidVariance: number;
  private asteroidSpeed: number;

  /**
   *
   * @param max Soft maximum number of asteroids. Won't create more if at or over this limit
   * @param cooldownInMs How long between asteroid spawns
   * @param asteroidRadius Template radius
   * @param asteroidVariance Template radius variance
   * @param asteroidSpeed Template speed
   */
  constructor(
    max: number,
    cooldownInMs: number,
    asteroidRadius: number,
    asteroidVariance: number,
    asteroidSpeed: number
  ) {
    super();
    this.maxLength = max;
    this.delay = cooldownInMs;
    this.asteroidRadius = asteroidRadius;
    this.asteroidVariance = asteroidVariance;
    this.asteroidSpeed = asteroidSpeed;
  }

  public onInitialize() {
    this.asteroids = [];
    this.currentDelay = 0;
  }

  public update(eng: ex.Engine, delta: number) {
    super.update(eng, delta);
    this.currentDelay += delta;

    // clean up asteroids
    let current: Asteroid;
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      current = this.asteroids[i];
      if (!current || current.isKilled()) {
        this.asteroids.splice(i, 1);
      }
    }

    // add new asteroids
    if (
      this.asteroids.length < this.maxLength &&
      this.currentDelay > this.delay
    ) {
      this.currentDelay -= this.delay;
      const pos = this.generateOffScreenPos(eng);
      const vel = this.generateVelocity(eng, pos);
      current = new Asteroid(
        pos.x,
        pos.y,
        this.asteroidRadius,
        this.asteroidVariance,
        this
      );
      current.vel.setTo(vel.x, vel.y);
      this.asteroids.push(current);
      eng.add(current);
    }
  }

  /**
   * Add an asteroid to track from outside of the dispatcher context
   * @param asteroid
   */
  public add(asteroid: Asteroid) {
    this.asteroids.push(asteroid);
  }

  /**
   * Create a position just outside of the engine's drawing area
   * @param eng current engine
   */
  public generateOffScreenPos(eng: ex.Engine): ex.Vector {
    let pos: ex.Vector;
    switch (Math.floor(Math.random() * 4)) {
      // top
      case 0:
        pos = new ex.Vector(Math.random() * eng.drawWidth, -this.bumper);
        break;
      // bottom
      case 1:
        pos = new ex.Vector(
          Math.random() * eng.drawWidth,
          eng.drawHeight + this.bumper
        );
        break;
      // left
      case 2:
        pos = new ex.Vector(-this.bumper, Math.random() * eng.drawHeight);
        break;
      // right
      case 3:
        pos = new ex.Vector(
          eng.drawWidth + this.bumper,
          Math.random() * eng.drawHeight
        );
        break;
    }
    return pos;
  }

  /**
   * Generate a vector in the direction towards the middle of the engine's drawing
   * @param eng
   * @param pos
   */
  public generateVelocity(eng: ex.Engine, pos: ex.Vector): ex.Vector {
    const diff = new ex.Vector(
      eng.halfDrawWidth +
        ex.Util.randomInRange(-this.wiggle, this.wiggle, null),
      eng.halfDrawHeight +
        ex.Util.randomInRange(-this.wiggle, this.wiggle, null)
    ).sub(pos);
    return diff.normalize().scale(this.asteroidSpeed);
  }
}
