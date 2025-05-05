import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  nom: string;
  prenom: string;
  role: string;
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Ajout d'une propriété pour basculer entre mock et vrai backend
  useMockData: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;

    if (this.useMockData) {
      // Données mockées pour tester sans backend
      this.users = [
        { id: '1', nom: 'Dupont', prenom: 'Jean', role: 'ADMIN' },
        { id: '2', nom: 'Martin', prenom: 'Sophie', role: 'USER' },
        { id: '3', nom: 'Bernard', prenom: 'Pierre', role: 'MODERATOR' },
        { id: '4', nom: 'Petit', prenom: 'Marie', role: 'USER' },
        { id: '5', nom: 'Leroy', prenom: 'Thomas', role: 'ADMIN' }
      ];
      this.loading = false;

      setTimeout(() => {
        this.loading = false;
      }, 500);
    } else {
      // Vraie requête HTTP vers le backend
      this.http.get<User[]>('http://localhost:8084/api/users') 
        .subscribe({
          next: (data) => {
            this.users = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Erreur lors du chargement des utilisateurs';
            this.loading = false;
            console.error('Erreur:', err);
          }
        });
    }
  }

  toggleDataSource(): void {
    this.useMockData = !this.useMockData;
    this.fetchUsers();
  }
}
