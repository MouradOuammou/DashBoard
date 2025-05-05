import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface User {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  email: string;
  phone: string; 
}

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  useMockData: boolean = true;

  // Pour les modals et formulaires
  userForm!: FormGroup;
  isEditMode: boolean = false;
  userToDelete: User | null = null;
  selectedUser: User | null = null;
  userModal: any;
  deleteModal: any;
  detailsModal: any;
  nextId: number = 8; // Pour générer de nouveaux IDs

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [''],
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9+\\s-]{8,15}$')]
    });
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;

    if (this.useMockData) {
      // Données mockées plus complètes
      this.users = [
        { id: '1', nom: 'Benali', prenom: 'Hicham', role: 'ADMIN', email: 'hicham.benali@example.com', phone: '+212 612345678' },
        { id: '2', nom: 'Mourad', prenom: 'Ahmed', role: 'USER', email: 'ahmed.mourad@example.com', phone: '+212 623456789' },
        { id: '3', nom: 'Walid', prenom: 'Karim', role: 'MODERATOR', email: 'karim.walid@example.com', phone: '+212 634567890' },
        { id: '4', nom: 'Anas', prenom: 'Mehdi', role: 'USER', email: 'mehdi.anas@example.com', phone: '+212 645678901' },
        { id: '5', nom: 'Berrada', prenom: 'Youssef', role: 'ADMIN', email: 'youssef.berrada@example.com', phone: '+212 656789012' },
        { id: '6', nom: 'Essaidi', prenom: 'Amine', role: 'USER', email: 'amine.essaidi@example.com', phone: '+212 667890123' },
        { id: '7', nom: 'Tazi', prenom: 'Hamza', role: 'USER', email: 'hamza.tazi@example.com', phone: '+212 678901234' },
        { id: '8', nom: 'Alaoui', prenom: 'Othman', role: 'USER', email: 'othman.alaoui@example.com', phone: '+212 689012345' }
      ];
      // Simule un délai de chargement
      setTimeout(() => {
        this.loading = false;
      }, 800);
    } else {
      this.http.get<User[]>('http://localhost:8080/api/users')
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

  // Fonctions pour les modals
  openAddUserModal(): void {
    this.isEditMode = false;
    this.userForm.reset();
    this.userForm.get('role')?.setValue('');

    // Utiliser Bootstrap 5 Modal
    this.userModal = new bootstrap.Modal(document.getElementById('userModal'));
    this.userModal.show();
  }

  viewUserDetails(user: User): void {
    this.selectedUser = {...user};

    // Ouvrir le modal de détails
    this.detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    this.detailsModal.show();
  }

  editUser(user: User): void {
    this.isEditMode = true;
    this.userForm.patchValue({
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
      email: user.email,
      phone: user.phone
    });

    // Fermer le modal de détails s'il est ouvert
    if (this.detailsModal) {
      this.detailsModal.hide();
    }

    // Ouvrir le modal d'édition
    this.userModal = new bootstrap.Modal(document.getElementById('userModal'));
    this.userModal.show();
  }

  deleteUser(userId: string): void {
    this.userToDelete = this.users.find(user => user.id === userId) || null;

    // Ouvrir le modal de confirmation de suppression
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    this.deleteModal.hide();
    this.deleteModal.show();
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      if (this.useMockData) {
        // Supprimer localement
        this.users = this.users.filter(user => user.id !== this.userToDelete?.id);
        this.deleteModal.hide();
      } else {
        // Appel API pour supprimer
        this.http.delete(`http://localhost:8084/api/users/${this.userToDelete.id}`)
          .subscribe({
            next: () => {
              this.users = this.users.filter(user => user.id !== this.userToDelete?.id);
              this.deleteModal.hide();
            },
            error: (err) => {
              console.error('Erreur lors de la suppression:', err);
              this.error = 'Erreur lors de la suppression de l\'utilisateur';
            }
          });
      }
    }
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEditMode) {
      // Mise à jour d'un utilisateur existant
      if (this.useMockData) {
        // Mise à jour locale
        const index = this.users.findIndex(u => u.id === userData.id);
        if (index !== -1) {
          this.users[index] = {...userData};
          this.userModal.hide();
        }
      } else {
        // Appel API pour mettre à jour
        this.http.put<User>(`http://localhost:8084/api/users/${userData.id}`, userData)
          .subscribe({
            next: (updatedUser) => {
              const index = this.users.findIndex(u => u.id === updatedUser.id);
              if (index !== -1) {
                this.users[index] = updatedUser;
              }
              this.userModal.hide();
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour:', err);
              this.error = 'Erreur lors de la mise à jour de l\'utilisateur';
            }
          });
      }
    } else {
      // Ajout d'un nouvel utilisateur
      const newUser: User = {
        ...userData,
        id: this.useMockData ? (this.nextId++).toString() : ''
      };

      if (this.useMockData) {
        this.users.push(newUser);
        this.userModal.hide();
      } else {
        // Appel API pour ajouter
        this.http.post<User>('http://localhost:8080/api/users', newUser)
          .subscribe({
            next: (createdUser) => {
              this.users.push(createdUser);
              this.userModal.hide();
            },
            error: (err) => {
              console.error('Erreur lors de l\'ajout:', err);
              this.error = 'Erreur lors de l\'ajout de l\'utilisateur';
            }
          });
      }
    }
  }

  // Formatage du numéro de téléphone pour l'affichage
  formatPhoneNumber(phone: string): string {
    if (!phone) return '-';

    // Garder le format tel quel pour l'instant
    return phone;
  }
}
