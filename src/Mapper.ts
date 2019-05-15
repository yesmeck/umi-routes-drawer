import { compact, flatten, capitalize } from 'lodash';
import { Block } from './types';
import extractOptionsAndBlock from './helpers/extractOptionsAntBlock';
import Scope from './Scope';
import normalizePath from 'normalize-path';
import Resource from './Resource';
import RouteSet from './RouteSet';
import Mapping from './Mapping';

type Action = 'index' | 'new' | 'show' | 'edit';

interface ResourcesOptions {
  only?: Action[];
}

export default class Mapper {
  static CANONICAL_ACTIONS = ['index', 'new', 'show'];

  set: RouteSet;
  currentScope: Scope;

  constructor(set: RouteSet) {
    this.set = set;
    this.currentScope = new Scope({ pathNames: set.resourcesPathNames });
  }

  static normalizePath(path: string) {
    path = normalizePath(path);
    return path[0] === '/' ? path : `/${path}`;
  }

  static normalizeName(name: string) {
    return Mapper.normalizePath(name)
      .slice(1)
      .replace(/\//g, '_');
  }

  resources(...args: any) {
    const resources = args.slice();
    const [options, block] = extractOptionsAndBlock<ResourcesOptions>(resources);
    if (this.applyCommonBehaviorFor('resources', resources, options, block)) {
      return;
    }

    this.withScopeLevel('resources', () => {
      this.resourceScope(new Resource(resources.pop(), options), () => {
        block();

        this.collection(() => {
          if (
            this.parentResource()
              .actions()
              .includes('index')
          ) {
            this.page('index', {});
          }
        });

        if (
          this.parentResource()
            .actions()
            .includes('new')
        ) {
          this.new(() => {
            this.page('new', {});
          });
        }

        this.setMemberMappingsForResource();
      });
    });
  }

  new(block: Block) {
    if (!this.currentScope.isResourceScope()) {
      throw new Error("can't use new outside resource(s) scope");
    }

    this.withScopeLevel('new', () => {
      this.pathScope(this.parentResource().newScope(this.actionPath('new')), block);
    });
  }

  scope(...args: any) {
    const resources = args.slice();
    const [options, block] = extractOptionsAndBlock<any>(resources);
    const scope: any = {};

    if (args) {
      options.path = flatten(args).join('/');
    }

    if (options.only || options.except) {
      scope.actionOptions = { only: options.only, except: options.except };
    }

    let value;
    this.currentScope.options().forEach(option => {
      if (option === 'options') {
        value = options;
      } else {
        value = options.option || null;
      }
      if (value !== null) {
        // scope[option] = (this as any)[`merge${capitalize(option)}Scope`]((this.currentScope as any)[option], value);
      }
    });
    this.currentScope = this.currentScope.new(scope);
    block();
    this.currentScope = this.currentScope.parent!;
  }

  member(block: Block) {
    if (!this.currentScope.isResourceScope()) {
      throw new Error("can't use member outside resource(s) scope");
    }

    this.withScopeLevel('member', () => {
      this.pathScope(this.parentResource().memberScope(), block);
    });
  }

  collection(block: Block) {
    if (!this.currentScope.isResourceScope()) {
      throw new Error("can't use collection outside resource(s) scope");
    }

    this.withScopeLevel('collection', () => {
      this.pathScope(this.parentResource().collectionScope(), block);
    });
  }

  nested(block: Block) {
    if (!this.currentScope.isResourceScope()) {
      throw new Error("can't use nested outside resource(s) scope");
    }

    this.withScopeLevel('nested', () => {
      this.pathScope(this.parentResource().nestedScope(), () => {
        this.scope(this.nestedOptions(), block);
      });
    });
  }

  page(path: string, options: any = {}) {
    this.match(path, options);
  }

  match(path: string, options: any) {
    const paths = [path];
    this.mapMatch(paths, options);
  }

  mapMatch(paths: string[], options: any) {
    const domain = this.currentScope.get('domain');
    const component = options.component;
    paths.forEach(action => {
      const routeOptions = { ...options };
      this.decomposedMatch(action, domain, routeOptions, component);
    });
  }

  decomposedMatch(action: string, domain: string, options: any, component: string) {
    switch (this.currentScope.scopeLevel) {
      case 'resources':
        break;
      case 'resource':
        break;
      default:
        this.addRoute(action, domain, options, component);
        break;
    }
  }

  addRoute(action: string | null, domain: string, options: any, component: string) {
    let path = this.pathForAction(action!);
    if (!path) {
      throw new Error('path is required');
    }
    let defaultAction = options.action || this.currentScope.get('action');

    if (/^[\w\-\/]+$/.test(action!)) {
      if (!action!.includes('/')) {
        defaultAction = defaultAction || action!.replace(/-/g, '_');
      }
    } else {
      action = null;
    }

    const as = this.nameForAction(options.as, action!);

    path = Mapper.normalizePath(path);
    const mapping = Mapping.build(this.currentScope, this.set, path, domain, defaultAction, '', options);
    this.set.addRoute(mapping, as!);
  }

  isCanonicalAction(action: string) {
    return this.currentScope.isResourceMethodScope() && Mapper.CANONICAL_ACTIONS.includes(action);
  }

  nameForAction(as: string, action: string) {
    const prefix = this.prefixNameForAction(as, action);

    let collectionName: string;
    let memberName: string;
    if (this.parentResource()) {
      if (!action) {
        return null;
      }
      collectionName = this.parentResource().collectionName();
      memberName = this.parentResource().memberName();
    }
    const actionName = this.currentScope.actionName(prefix!, collectionName!, memberName!);
    const candidate = compact(actionName).join('_');
    return candidate;
  }

  prefixNameForAction(as: string, action: string) {
    let prefix;
    if (as) {
      prefix = as;
    } else if (!this.isCanonicalAction(action)) {
      prefix = action;
    }

    if (prefix && prefix != '/' && prefix) {
      return Mapper.normalizeName(prefix.replace(/-/g, '_'));
    }
  }

  pathForAction(action: string, path?: string) {
    if (path) {
      return `${this.currentScope.get('path')}/${path}`;
    }

    return this.isCanonicalAction(action)
      ? this.currentScope.get('path')
      : `${this.currentScope.get('path')}/${this.actionPath(action)}`;
  }

  actionPath(action: string) {
    return this.currentScope.get('pathNames')[action] || action;
  }

  call(block: Block<any>) {
    block({
      scope: this.scope.bind(this),
      page: this.page.bind(this),
      resources: this.resources.bind(this),
      member: this.member.bind(this),
      collection: this.collection.bind(this)
    });
  }

  withScopeLevel(kind: any, block: Block) {
    this.currentScope = this.currentScope.newLevel(kind);
    block();
    this.currentScope = this.currentScope.parent!;
  }

  resourceScope(resource: Resource, block: Block) {
    this.currentScope = this.currentScope.new({ scopeLevelResource: resource });
    this.domain(resource.resourceScope(), block);
    this.currentScope = this.currentScope.parent!;
  }

  pathScope(path: string, block: Block) {
    this.currentScope = this.currentScope.new({ path: this.mergePathScope(this.currentScope.get('path'), path) });
    block();
    this.currentScope = this.currentScope.parent!;
  }

  domain(domain: string, block: Block) {
    this.currentScope = this.currentScope.new({ domain });
    block();
    this.currentScope = this.currentScope.parent!;
  }

  setMemberMappingsForResource() {
    this.member(() => {
      if (
        this.parentResource()
          .actions()
          .includes('edit')
      ) {
        this.page('edit');
      }

      if (
        this.parentResource()
          .actions()
          .includes('show')
      ) {
        this.page('show');
      }
    });
  }

  nestedOptions() {
    return { as: this.parentResource().memberName };
  }

  private parentResource(): Resource {
    return this.currentScope.get('scopeLevelResource');
  }

  private applyCommonBehaviorFor(method: string, resources: string[], options: any, block: Block) {
    if (resources.length > 1) {
      resources.forEach(r => (this as any)[method](r, options, block));
      return true;
    }
    if (this.currentScope.isResourceScope()) {
      this.nested(() => {
        (this as any)[method](resources.pop(), options, block);
      });
      return true;
    }
  }

  private mergePathScope(parent: string, child: string) {
    return Mapper.normalizePath(`${parent || ''}/${child}`);
  }
}
