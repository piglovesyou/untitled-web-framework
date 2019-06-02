export default async function defaultRouteAction({ next }: any) {
  // Execute each child route until one of them return the result
  const route = await next();

  if (!route) return;

  // Provide default values for title, description etc.
  route.title = `${route.title || 'Untitled Page'} - www.reactstarterkit.com`;
  route.description = route.description || '';

  return route;
}
