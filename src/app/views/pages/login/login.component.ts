import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgStyle, NgIf } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,

} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../service/Authentification/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule,
    NgIf,

  ]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    // Simulation d'un délai pour la requête
    setTimeout(() => {
      if (this.auth.login(this.username, this.password)) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Identifiants incorrects. Utilisez admin/123 pour le test';
      }
      this.isLoading = false;
    }, 500);
  }
}
