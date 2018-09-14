import Asteroid from "./actors/asteroid.js";
import Sword from "./actors/sword.js";

const eng = new ex.Engine({
  width: 600,
  height: 400,
  backgroundColor: ex.Color.fromRGB(51, 51, 51)
});
eng.canvas.id = "excalibur-canvas";

const txSword = new ex.Texture("../asset/sword.png");
const loader = new ex.Loader([txSword]);
// tslint:disable-next-line:no-var-keyword
var sword: Sword;
// tslint:disable-next-line:no-var-keyword
var ast: Asteroid;

eng.start(loader).then(() => {
  // ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.RigidBody;

  sword = new Sword(eng.drawWidth / 2, eng.drawHeight / 2, txSword.asSprite());
  eng.add(sword);

  ast = new Asteroid(0, 0, 10, 10);
  ast.vel = new ex.Vector(eng.canvasWidth, eng.canvasHeight)
    .normalize()
    .scale(100);
  eng.add(ast);

  (window as any).ast = ast;

  eng.input.pointers.primary.on("move", (evt: ex.Input.PointerEvent) => {
    if (
      evt.screenPos.x >= 0 &&
      evt.screenPos.x < eng.drawWidth &&
      evt.screenPos.y >= 0 &&
      evt.screenPos.y < eng.drawHeight
    ) {
      const diff = evt.worldPos.sub(sword.pos);
      sword.rotation = diff.toAngle() + Math.PI / 4;
      sword.ShouldRotate = false;
    } else {
      sword.ShouldRotate = true;
    }
  });
});
