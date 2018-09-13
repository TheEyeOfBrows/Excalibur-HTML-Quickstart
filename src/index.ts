import Sword from "./actors/sword.js";

const eng = new ex.Engine({
   width: 600,
   height: 400,
   backgroundColor: ex.Color.fromRGB(51, 51, 51),
});
eng.canvas.id = "excalibur-canvas";

const sword = new Sword(eng.drawWidth / 2, eng.drawHeight / 2);
eng.add(sword);

eng.input.pointers.primary.on("move", (evt: ex.Input.PointerEvent) => {
   if (evt.screenPos.x >= 0 &&
      evt.screenPos.x < eng.drawWidth &&
      evt.screenPos.y >= 0 &&
      evt.screenPos.y < eng.drawHeight) {
         const diff = evt.worldPos.sub(sword.pos);
         sword.rotation = diff.toAngle();
         sword.ShouldRotate = false;
   } else {
      sword.ShouldRotate = true;
   }
});

eng.start();
