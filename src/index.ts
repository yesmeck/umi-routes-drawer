import { IRoute } from 'umi-types';

const routes: IRoute[] = [];
const currentRoutes = routes;

export function draw(block: () => void) {
  block();
  return routes;
}

export function page(path: string, options: { component: string; redirect?: string }) {
  currentRoutes.push({
    path,
    ...options
  });
}
