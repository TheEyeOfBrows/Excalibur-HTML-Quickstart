// Import from .js files.
// Using the .js extension is required when using module loading in the browser,
// and the typescript compiler is smart enough to find the .ts files.
import Sword from "./sampleGame/actor/sword.js";
import AsteroidDispatcher from "./sampleGame/dispatcher/asteroidDispatcher.js";

// Create a new engine instance, creating a new canvas in the process
const eng = new ex.Engine({
  width: 600,
  height: 400,
  backgroundColor: ex.Color.fromRGB(51, 51, 51)
});

// Assign the new canvas an element id, for CSS styling purposes
eng.canvas.id = "excalibur-canvas";

// Define the sword texture file, and assign it to a loader
const txSword = new ex.Texture("../asset/sword.png");
const loader = new ex.Loader([txSword]);

let sword: Sword;
let dispatcher: AsteroidDispatcher;

// Start the engine, and make it wait for the loader to finish loading before starting the engine code
eng.start(loader).then(() => {
  // Create the sword actor at the middle of the draw area, and assign it it's sprite
  sword = new Sword(eng.drawWidth / 2, eng.drawHeight / 2, txSword.asSprite());
  eng.add(sword);

  // Add the asteroid dispatcher, which will manage the spawning of asteroid actors
  dispatcher = new AsteroidDispatcher(6, 1000, 8, 2, 100);
  eng.add(dispatcher);

  // Add a mouse move event listner, which relays the event to the sword actor
  eng.input.pointers.primary.on("move", (evt: ex.Input.PointerEvent) =>
    sword.onMouseMove(evt, eng.drawWidth, eng.drawHeight)
  );
});
