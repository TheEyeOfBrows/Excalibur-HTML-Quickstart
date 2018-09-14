import Asteroid from "./asteroid";

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
    this.collisionType = ex.CollisionType.Fixed;

    this.body.usePolygonCollision(
      [
        new ex.Vector(20, -8),
        new ex.Vector(50, -39),
        new ex.Vector(39, -50),
        new ex.Vector(8, -20)
      ],
      ex.Vector.Zero.clone()
    );

    this.on("collisionstart", (ev?: ex.CollisionStartEvent) => {
      const ast = ev.other as Asteroid;
      if (!!ast) {
        // tslint:disable-next-line:no-console
        console.log("collision");
      }
    });
  }

  public update(eng: ex.Engine, delta: number) {
    if (this.shouldRotate) {
      this.rotation += (Math.PI / delta) * this.rotationSpeed;
    }
    super.update(eng, delta);
  }
  public draw(ctx, delta: number) {
    super.draw(ctx, delta);
    this.collisionArea.debugDraw(ctx, ex.Color.Green);
  }
}
