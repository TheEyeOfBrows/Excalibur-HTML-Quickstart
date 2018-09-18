import AsteroidDispatcher from "../dispatcher/asteroidDispatcher";

/**
 * The asteroid actor has two properties:
 *    - randomized circle poligon shape
 *    - on collision with either a sword, or another asteroid,
 *         spawns smaller child asteroids moving in an escape direction
 */
export default class Asteroid extends ex.Actor {
  public rotationVel: number;

  private dispatcher: AsteroidDispatcher;
  private polyEdges: ex.Vector[];
  private poly: ex.Polygon;
  private radius: number;
  private variance: number;

  private breakCooldown: number;
  private shouldBreak: boolean;
  private breakTarget: ex.Actor;

  constructor(
    x: number,
    y: number,
    radius: number,
    variance: number,
    dispatcher: AsteroidDispatcher,
    breakCooldown = 1000
  ) {
    super(x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.variance = variance;
    this.color = ex.Color.White;
    this.dispatcher = dispatcher;
    this.breakCooldown = breakCooldown;
  }

  public onInitialize(engine: ex.Engine) {
    this.anchor.setTo(0.0, 0.0);
    this.rotationVel = ex.Util.randomInRange(-Math.PI / 10, Math.PI / 10, null);
    this.rotation = 0;
    this.polyEdges = [];
    const circleResolution = 8;

    let current: ex.Vector;
    let currentR: number;
    for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / circleResolution) {
      currentR =
        this.radius +
        ex.Util.randomInRange(-this.variance, this.variance, null);
      current = ex.Vector.fromAngle(i).scale(currentR);
      this.polyEdges.push(current);
    }
    this.poly = new ex.Polygon(this.polyEdges);
    this.poly.filled = false;
    this.poly.lineColor = this.color;
    this.poly.lineWidth = 2;

    this.addDrawing("poly", this.poly);
    this.currentDrawing = this.poly;

    this.collisionType = ex.CollisionType.Passive;
    this.collisionArea.body.useCircleCollision(this.radius);
    this.collisionGroups.push("asteroid");

    this.on("collisionstart", (ev?: ex.CollisionStartEvent) => {
      if (ev.other.collisionGroups.indexOf("asteroid") >= 0) {
        const ast = ev.other as Asteroid;
        if (!!ast) {
          ast.break(this);
          this.break(ast);
        }
      } else if (ev.other.collisionGroups.indexOf("sword") >= 0) {
        this.break(ev.other);
      }
    });
  }

  public update(eng: ex.Engine, delta: number) {
    this.rotation += (this.rotationVel * delta) / 100;
    super.update(eng, delta);
    this.breakCooldown -= delta;

    // kill offscreen asteroids which aren't heading towards onscreen
    if (this.isHeadingOffscreen(eng)) {
      this.visible = false;
      eng.remove(this);
      this.kill();
    }

    if (this.shouldBreak) {
      // Check that new asteroid's aren't too small
      if (this.radius / 2 > 2) {
        const numberOfChildren = ex.Util.randomIntInRange(1, 3, null);
        let current: Asteroid;
        let currentDir: ex.Vector;
        const escapeDir = this.pos.sub(this.breakTarget.pos).normalize();

        for (let i = 0; i < numberOfChildren; i++) {
          const newX = this.pos.x + ex.Util.randomInRange(-1, 1, null);
          const newY = this.pos.y + ex.Util.randomInRange(-1, 1, null);
          current = new Asteroid(
            newX,
            newY,
            (this.radius * 3) / 4,
            (this.variance * 3) / 4,
            this.dispatcher,
            2000
          );
          const angleAdjust = ex.Util.randomInRange(
            -(Math.PI / 5),
            Math.PI / 5,
            null
          );
          currentDir = escapeDir
            .rotate(angleAdjust)
            .scale(this.vel.magnitude());
          current.vel.setTo(currentDir.x, currentDir.y);
          eng.add(current);
          this.dispatcher.add(current);
        }
      }

      this.breakTarget = null;
      this.visible = false;
      eng.remove(this);
      this.kill();
    }
  }

  /**
   * Is both offscreen and is moving further offscreen.
   * @param eng
   */
  public isHeadingOffscreen(eng: ex.Engine) {
    return (
      (this.x < -this.radius * 2 && this.vel.x < 0) ||
      (this.x > eng.drawWidth + this.radius * 2 && this.vel.x > 0) ||
      (this.y < -this.radius * 2 && this.vel.y < 0) ||
      (this.y > eng.drawHeight + this.radius * 2 && this.vel.y > 0)
    );
  }

  /**
   * Trigger an asteroid breakup
   * @param whoBrokeMe used to set velocities away from actor
   */
  public break(whoBrokeMe: ex.Actor) {
    if (this.breakCooldown <= 0) {
      this.breakTarget = whoBrokeMe;
      this.shouldBreak = true;
    }
  }
}
