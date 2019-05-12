import Mapping from './Mapping';
import Routes from './Routes';
import Route from './Route';

export default class RouteSet {
  set: Routes;

  namedRoutes: { [name: string]: Route } = {};

  resourcesPathNames: any;

  constructor() {
    this.set = new Routes();
    this.resourcesPathNames = RouteSet.defaultResourcesPathNames();
  }

  static defaultResourcesPathNames() {
    return { new: 'new', edit: 'edit' };
  }

  addRoute(mapping: Mapping, name: string) {
    if (!name || !name.match(/^[_a-z]\w*$/i)) {
      throw new Error(`Invalid route name: '${name}'`);
    }

    if (name && this.namedRoutes[name]) {
      throw new Error(
        `Invalid route name, already in use: '${name}'
         You may have defined two routes with the same name using the \`:as\` option, or
         you may be overriding a route already defined by a resource with the same naming.
         For the latter, you can restrict the routes created with \`resources\` as explained here:
         "https://guides.rubyonrails.org/routing.html#restricting-the-routes-created`
      );
    }

    const route = this.set.addRoute(name, mapping);
    if (name) {
      this.namedRoutes[name] = route;
    }
  }

  toJSON() {
    return this.set.routes;
  }
}
