import { IRoute } from 'umi-types';

type Block = () => void;

interface PageOptions {
  component: string;
  redirect?: string;
}

let routes: IRoute[] = [];
let currentRoutes = routes;

function reset() {
  routes = [];
  currentRoutes = routes;
}

export function draw(block: Block) {
  reset();
  block();
  return routes;
}

export function page(path: string, options: PageOptions) {
  currentRoutes.push({
    path,
    ...options
  });
}

export function resources(resources: string, options?: {}, block?: Block) {
  currentRoutes.push(
    {
      path: `/${resources}`,
      component: `/pages/${resources}/index`
    },
    {
      path: `/${resources}/new`,
      component: `/pages/${resources}/new`
    },
    {
      path: `/${resources}/:id`,
      component: `/pages/${resources}/show`
    },
    {
      page: `/${resources}/:id/edit`,
      component: `/pages/${resources}/edit`
    }
  );

  if (block) {
    block();
  }
}
