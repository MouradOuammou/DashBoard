import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';

interface User {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  email: string;
  phone: string;
  permissions?: string[]; // Ajout des permissions
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  useMockData: boolean = true;
  selectedUserForRules: User | null = null; // Pour gérer les règles

  // Pour les modals et formulaires
  userForm!: FormGroup;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  userToDelete: User | null = null;
  selectedUser: User | null = null;
  userModal: any;
  deleteModal: any;
  detailsModal: any;
  nextId: number = 8; // Pour générer de nouveaux IDs
  showAddUserModal = false;
  newUser: User = { id: '', nom: '', prenom: '', role: '', email: '', phone: '' };

  // Rôles et permissions
  showAddRoleModal = false;
  showViewRolesModal = false;
  newRoleName = '';
  roles: string[] = ['ADMIN', 'USER'];

  // Définition des règles disponibles
  adminRules = [
    'gestion_utilisateurs',
    'gestion_contenu',
    'moderation',
    'configuration_systeme'
  ];

  userRules = [
    'lecture_contenu',
    'creation_contenu',
    'edition_propre_contenu'
  ];

  editRoleIndex: number | null = null;
  editRoleValue: string = '';

  // Add a permissions list for roles
  permissionsList: string[] = [
    'dashboard',
    'analytics',
    'store',
    'users',
    'settings'
  ];

  // Track permissions for new/edit role
  newRolePermissions: string[] = [];
  viewRolePermissions: string[] = [];

  // Add state for the view permissions modal
  showViewRolePermissionsModal: boolean = false;
  selectedRoleName: string = '';

  // Success message state
  showSuccessMsg = false;

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
      // Données mockées avec permissions
      this.users = [
        {
          id: '1', nom: 'Benali', prenom: 'Hicham', role: 'ADMIN',
          email: 'hicham.benali@example.com', phone: '+212 612345678',
          permissions: this.adminRules
        },
        {
          id: '2', nom: 'Mourad', prenom: 'Ahmed', role: 'USER',
          email: 'ahmed.mourad@example.com', phone: '+212 623456789',
          permissions: this.userRules
        },
        {
          id: '3', nom: 'Walid', prenom: 'Karim', role: 'USER',
          email: 'karim.walid@example.com', phone: '+212 634567890',
          permissions: [...this.adminRules, ...this.userRules]
        },
        {
          id: '4', nom: 'Anas', prenom: 'Mehdi', role: 'USER',
          email: 'mehdi.anas@example.com', phone: '+212 645678901',
          permissions: this.userRules
        },
        {
          id: '5', nom: 'Berrada', prenom: 'Youssef', role: 'ADMIN',
          email: 'youssef.berrada@example.com', phone: '+212 656789012',
          permissions: this.adminRules
        },
        {
          id: '6', nom: 'Essaidi', prenom: 'Amine', role: 'USER',
          email: 'amine.essaidi@example.com', phone: '+212 667890123',
          permissions: this.userRules
        },
        {
          id: '7', nom: 'Tazi', prenom: 'Hamza', role: 'USER',
          email: 'hamza.tazi@example.com', phone: '+212 678901234',
          permissions: this.userRules
        },
        {
          id: '8', nom: 'Alaoui', prenom: 'Othman', role: 'USER',
          email: 'othman.alaoui@example.com', phone: '+212 689012345',
          permissions: this.userRules
        }
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
    this.showAddUserModal = true;
    this.newUser = { id: '', nom: '', prenom: '', role: '', email: '', phone: '' };
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
  }

  addUser(): void {
    if (!this.newUser.nom || !this.newUser.prenom || !this.newUser.email || !this.newUser.phone || !this.newUser.role) {
      return;
    }
    // Find the max numeric id in the current users list
    const maxId = this.users.reduce((max, u) => {
      const idNum = parseInt(u.id, 10);
      return !isNaN(idNum) && idNum > max ? idNum : max;
    }, 0);
    const newId = (maxId + 1).toString();
    const user: User = { ...this.newUser, id: newId };
    this.users.push(user);
    this.closeAddUserModal();
    // Show success message with delay
    setTimeout(() => {
      this.showSuccessMsg = true;
      setTimeout(() => this.showSuccessMsg = false, 2500);
    }, 400);
  }

  // Unified modal logic
  openUserModal(user: User, mode: 'view' | 'edit') {
    this.selectedUser = { ...user };
    this.userForm.patchValue({
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
      email: user.email,
      phone: user.phone
    });
    this.isViewMode = mode === 'view';
    this.isEditMode = mode === 'edit';
    this.userModal = new bootstrap.Modal(document.getElementById('userModal'));
    this.userModal.show();
  }

  closeUserModal() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.selectedUser = null;
    this.userForm.reset();
    if (this.userModal) {
      this.userModal.hide();
    }
  }

  switchToEditMode() {
    this.isViewMode = false;
    this.isEditMode = true;
  }

  // Refactor view/edit actions to use unified modal
  viewUserDetails(user: User): void {
    this.openUserModal(user, 'view');
  }

  editUser(user: User): void {
    this.openUserModal(user, 'edit');
  }

  deleteUser(userId: string): void {
    this.userToDelete = this.users.find(user => user.id === userId) || null;

    // Ouvrir le modal de confirmation de suppression
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
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
        id: this.useMockData ? (this.nextId++).toString() : '',
        permissions: userData.role === 'ADMIN' ? this.adminRules : this.userRules
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
    return phone;
  }

  // Méthodes pour gérer les règles
  openAddRulesModal(user: User): void {
    this.selectedUserForRules = {...user};
    const rulesModal = new bootstrap.Modal(document.getElementById('rulesModal'));
    rulesModal.show();
  }

  addAdminRules(event: Event): void {
    event.preventDefault();
    if (!this.selectedUserForRules) return;

    if (confirm(`Ajouter les règles Admin à ${this.selectedUserForRules.prenom} ${this.selectedUserForRules.nom}?`)) {
      if (this.useMockData) {
        // Mise à jour locale
        const user = this.users.find(u => u.id === this.selectedUserForRules?.id);
        if (user) {
          user.role = 'ADMIN';
          user.permissions = [...this.adminRules];
        }
      } else {
        // Appel API
        this.http.patch<User>(`http://localhost:8080/api/users/${this.selectedUserForRules.id}/permissions`, {
          role: 'ADMIN',
          permissions: this.adminRules
        }).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour des règles:', err);
            this.error = 'Erreur lors de l\'ajout des règles Admin';
          }
        });
      }
    }
    this.selectedUserForRules = null;
  }

  addUserRules(event: Event): void {
    event.preventDefault();
    if (!this.selectedUserForRules) return;

    if (confirm(`Ajouter les règles User à ${this.selectedUserForRules.prenom} ${this.selectedUserForRules.nom}?`)) {
      if (this.useMockData) {
        // Mise à jour locale
        const user = this.users.find(u => u.id === this.selectedUserForRules?.id);
        if (user) {
          user.role = 'USER';
          user.permissions = [...this.userRules];
        }
      } else {
        // Appel API
        this.http.patch<User>(`http://localhost:8080/api/users/${this.selectedUserForRules.id}/permissions`, {
          role: 'USER',
          permissions: this.userRules
        }).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour des règles:', err);
            this.error = 'Erreur lors de l\'ajout des règles User';
          }
        });
      }
    }
    this.selectedUserForRules = null;
  }

  getUserPermissions(user: User): string {

    return user.permissions ? user.permissions.join(', ') : 'Aucune permission définie';
  }
  addModeratorRules(event: Event) {
  event.preventDefault();
}

viewAllRoles(event: Event) {
  event.preventDefault();
}

openAddRoleDialog(): void {
  this.showAddRoleModal = true;
  this.newRoleName = '';
}
closeAddRoleDialog(): void {
  this.showAddRoleModal = false;
}
addRole(): void {
  if (this.newRoleName && !this.roles.includes(this.newRoleName)) {
    this.roles.push(this.newRoleName);
    // Here you would save the permissions for the role (e.g., in a map/object or backend)
    // For demo, just log them
    console.log('Role:', this.newRoleName, 'Permissions:', this.newRolePermissions);
  }
  this.closeAddRoleDialog();
  this.newRolePermissions = [];
}
openViewRolesDialog(): void {
  this.showViewRolesModal = true;
}
closeViewRolesDialog(): void {
  this.showViewRolesModal = false;
}
closeDropdown(): void {
    // Close the Bootstrap dropdown programmatically
    const dropdown = document.getElementById('manageRolesDropdown');
    if (dropdown) {
      const instance = (window as any).bootstrap?.Dropdown?.getOrCreateInstance(dropdown);
      if (instance) {
        instance.hide();
      }
    }
  }

  onManageRoleSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.openAddRoleDialog();
    } else if (value === 'view') {
      this.openViewRolesDialog();
    }
    // Reset select to placeholder
    setTimeout(() => {
      (event.target as HTMLSelectElement).value = '';
    }, 200);
  }

  // Gestion de l'édition et de la suppression des rôles
  startEditRole(index: number, value: string): void {
    this.editRoleIndex = index;
    this.editRoleValue = value;
  }
  saveEditRole(index: number): void {
    if (this.editRoleValue.trim() && !this.roles.includes(this.editRoleValue.trim())) {
      this.roles[index] = this.editRoleValue.trim();
    }
    this.cancelEditRole();
  }
  cancelEditRole(): void {
    this.editRoleIndex = null;
    this.editRoleValue = '';
  }
  deleteRole(index: number): void {
    this.roles.splice(index, 1);
    this.cancelEditRole();
  }

  // Add a method to open the view permissions modal for a role
  viewRolePermissionsDialog(role: string): void {
    // For demo, assign some permissions based on role name (customize as needed)
    if (role === 'ADMIN') {
      this.viewRolePermissions = [...this.permissionsList];
    } else if (role === 'USER') {
      this.viewRolePermissions = ['dashboard', 'store'];
    } else {
      // For custom roles, you may want to store permissions in a map/object
      this.viewRolePermissions = [];
    }
    this.selectedRoleName = role;
    this.showViewRolePermissionsModal = true;
  }

  closeViewRolePermissionsDialog(): void {
    this.showViewRolePermissionsModal = false;
    this.selectedRoleName = '';
    this.viewRolePermissions = [];
  }

  // Add a handler for permission checkbox changes
  onPermissionCheckboxChange(event: Event, perm: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.newRolePermissions.includes(perm)) {
        this.newRolePermissions.push(perm);
      }
    } else {
      const idx = this.newRolePermissions.indexOf(perm);
      if (idx > -1) {
        this.newRolePermissions.splice(idx, 1);
      }
    }
  }
}
