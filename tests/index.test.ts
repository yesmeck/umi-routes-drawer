import { draw, page, resources } from '../src';

describe('drawer', () => {
  it('path', () => {
    const routes = draw(() => {
      page('/', { component: '/pages/index' });
    });
    expect(routes).toMatchInlineSnapshot(`
      Array [
        Object {
          "component": "/pages/index",
          "path": "/",
        },
      ]
    `);
  });

  describe('resouces', () => {
    const routes = draw(() => {
      resources('posts');
    });

    expect(routes).toMatchInlineSnapshot(`
            Array [
              Object {
                "component": "/pages/posts/index",
                "path": "/posts",
              },
              Object {
                "component": "/pages/posts/new",
                "path": "/posts/new",
              },
              Object {
                "component": "/pages/posts/show",
                "path": "/posts/:id",
              },
              Object {
                "component": "/pages/posts/edit",
                "page": "/posts/:id/edit",
              },
            ]
        `);
  });
});
