import Mapper from './Mapper';
import { Block } from './types';
import RouteSet from './RouteSet';

export function draw(block: Block<any>) {
  const routeSet = new RouteSet;
  const mapper = new Mapper(routeSet);
  mapper.call(block);
  return routeSet.toJSON();
}
