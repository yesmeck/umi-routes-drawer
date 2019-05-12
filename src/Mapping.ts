import Scope from './Scope';
import RouteSet from './RouteSet';
import Route from './Route';

export default class Mapping {
  set: RouteSet;
  path: string;
  defaultDomain: string;
  defaultAction: string;

  static build(
    scope: Scope,
    set: RouteSet,
    path: string,
    domain: string,
    defaultAction: string,
    component: string,
    options: any
  ) {
    options = { ...scope.get('options'), ...options };
    return new Mapping(scope, set, path, domain, defaultAction, component, options);
  }

  constructor(
    scope: Scope,
    set: RouteSet,
    path: string,
    domain: string,
    defaultAction: string,
    component: string,
    options: any
  ) {
    this.set = set;
    this.path = path;
    this.defaultDomain = domain;
    this.defaultAction = defaultAction;
  }

  makeRoute(name: string, precedence: number) {
    return new Route(name, this.path, precedence);
  }
}
