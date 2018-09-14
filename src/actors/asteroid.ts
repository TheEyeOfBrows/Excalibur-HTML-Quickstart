export default class Asteroid extends ex.Actor {
  public rotationVel: number;

  public onCollidesWith;
  private polyEdges: ex.Vector[];
  private poly: ex.Polygon;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.color = ex.Color.White;
    // this.on("initialize", this.onInitialize.bind(this));
  }

  public onInitialize(engine: ex.Engine) {
    this.rotationVel = Math.PI / 10;
    this.rotation = 0;
    this.polyEdges = [];
    const circleResolution = 10;
    const r = new ex.Vector(this.getWidth(), this.getHeight()).magnitude() / 2;
    const variance = r / 4;
    let current: ex.Vector;
    for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / circleResolution) {
      current = ex.Vector.fromAngle(i).scale(
        r + Math.random() * variance * 2 - variance
      );
      this.polyEdges.push(current);
    }
    this.poly = new ex.Polygon(this.polyEdges);
    this.poly.filled = false;
    this.poly.lineColor = this.color;
    this.poly.lineWidth = 2;

    this.collisionType = ex.CollisionType.Fixed;
    this.collisionArea.body.useCircleCollision(r);
  }

  public update(eng: ex.Engine, delta: number) {
    this.rotation += (this.rotationVel * delta) / 100;
    super.update(eng, delta);

    // if (!!this.poly) {
    this.poly.rotation = this.rotation;
    // }
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    // super.draw(ctx, delta);
    /*if (!this.poly) {
         this.onInitialize(null);
      }*/
    this.poly.draw(ctx, this.pos.x, this.pos.y);
    this.collisionArea.debugDraw(ctx, ex.Color.Green);
  }
}
