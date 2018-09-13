
export default class Sword extends ex.Actor {

   public get ShouldRotate(): boolean  {
      return this.shouldRotate;
   }
   public set ShouldRotate(value: boolean ) {
      this.shouldRotate = value;
   }
   private shouldRotate: boolean = true;

   /** Auto rotation speed (in Radians/second) */
   public get RotationSpeed(): number  {
      return this.rotationSpeed;
   }
   /** Auto rotation speed (in Radians/second) */
   public set RotationSpeed(value: number ) {
      this.rotationSpeed = value;
   }
   /** Auto rotation speed (in Radians/second) */
   private rotationSpeed: number = 0.25;

   constructor(x: number = 0, y: number = 0) {
      super(x, y, 100, 100);
      this.color = ex.Color.White;
      this.collisionType = ex.CollisionType.Fixed;
   }

   public update(eng: ex.Engine, delta: number) {
      if (this.shouldRotate) {
         this.rotation += Math.PI / delta * this.rotationSpeed;
      }
   }
}
