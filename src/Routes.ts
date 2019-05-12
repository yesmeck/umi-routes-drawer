import Mapping from './Mapping';
import Route from './Route';

export default class Routes {
  routes: Route[] = [];

  addRoute(name: string, mapping: Mapping) {
    const route = mapping.makeRoute(name, this.routes.length);
    this.routes.push(route);
    return route;
  }
}
