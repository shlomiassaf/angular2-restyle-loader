import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';



export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
