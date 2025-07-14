import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoverComponent } from './recover/recover.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LabelComponent } from '../../shared/components/label/label.component';
import { CardComponent } from '../../shared/components/card/card.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    LoginComponent,
    RegisterComponent,
    RecoverComponent,
    InputComponent,
    ButtonComponent,
    LabelComponent,
    CardComponent,
  ],
})
export class AuthModule {}
