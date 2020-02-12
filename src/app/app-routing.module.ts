import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AProposComponent } from './component/apropos/apropos.component';
import { InfoNuanceComponent } from './component/info-nuance/info-nuance.component';


const routes: Routes = [
  { path: '', redirectTo: 'a-propos', pathMatch: 'full' },
  { path: 'a-propos', component: AProposComponent },
  { path: 'info-nuance', component: InfoNuanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
