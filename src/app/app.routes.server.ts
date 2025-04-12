import { RenderMode, ServerRoute } from '@angular/ssr';

// todo create a full lyst of routes
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
