import { Body } from 'detect-collisions';

export default interface Collidable {
  get collisionBody() : Body;
}
