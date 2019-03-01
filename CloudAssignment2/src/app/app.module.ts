import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { VmManagerComponent } from './vm-manager/vm-manager.component';
import { NewVMFormComponent } from './new-vm-form/new-vm-form.component';
import { VMListComponent } from './vm-list/vm-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VmManagerComponent,
    NewVMFormComponent,
    VMListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
