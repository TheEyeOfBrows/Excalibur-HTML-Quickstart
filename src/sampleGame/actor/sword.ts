/**
 * The sword is a rotationg sprite with a custom polygon hitbox.
 */
export default class Sword extends ex.Actor {
  public get ShouldRotate(): boolean {
    return this.shouldRotate;
  }
  public set ShouldRotate(value: boolean) {
    this.shouldRotate = value;
  }
  private shouldRotate: boolean = true;

  /** Auto rotation speed (in Radians/second) */
  public get RotationSpeed(): number {
    return this.rotationSpeed;
  }
  /** Auto rotation speed (in Radians/second) */
  public set RotationSpeed(value: number) {
    this.rotationSpeed = value;
  }
  /** Auto rotation speed (in Radians/second) */
  private rotationSpeed: number = 0.25;

  constructor(x: number = 0, y: number = 0, sprite: ex.Sprite) {
    super(x, y, sprite.width, sprite.height);
    this.addDrawing(sprite);
    this.anchor.setTo(0.15, 0.85);
  }

  public onInitialize(eng: ex.Engine) {
    this.body.collider.type = ex.CollisionType.Passive;

    // custom polygon collision to match visual area in sprite
    this.body.usePolygonCollider(
      [
        new ex.Vector(20, -8),
        new ex.Vector(50, -39),
        new ex.Vector(39, -50),
        new ex.Vector(8, -20)
      ],
      ex.Vector.Zero.clone()
    );
  }

  public onMouseMove(
    evt: ex.Input.PointerEvent,
    viewWidth: number,
    viewHeight: number
  ) {
    if (
      evt.screenPos.x >= 0 &&
      evt.screenPos.x < viewWidth &&
      evt.screenPos.y >= 0 &&
      evt.screenPos.y < viewHeight
    ) {
      const diff = evt.worldPos.sub(this.pos);
      this.rotation = diff.toAngle() + Math.PI / 4;
      this.ShouldRotate = false;
    } else {
      this.ShouldRotate = true;
    }
  }

  public update(eng: ex.Engine, delta: number) {
    if (this.shouldRotate) {
      this.rotation += (Math.PI / delta) * this.rotationSpeed;
    }
    super.update(eng, delta);
  }
}
