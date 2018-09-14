import Sword from "./actors/sword.js";
import AsteroidDispatcher from "./dispatcher/asteroidDispatcher.js";

const eng = new ex.Engine({
  width: 600,
  height: 400,
  backgroundColor: ex.Color.fromRGB(51, 51, 51)
});
eng.canvas.id = "excalibur-canvas";

const txSword = new ex.Texture("../asset/sword.png");
const loader = new ex.Loader([txSword]);

let sword: Sword;
let dispatcher: AsteroidDispatcher;

eng.start(loader).then(() => {
  sword = new Sword(eng.drawWidth / 2, eng.drawHeight / 2, txSword.asSprite());
  eng.add(sword);

  dispatcher = new AsteroidDispatcher(6, 1000, 8, 2, 100);
  eng.add(dispatcher);

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
