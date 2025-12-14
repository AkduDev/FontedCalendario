import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from '../../services/api.service';

interface EventDetailData {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  completada: boolean;
  notificar: boolean;
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css'],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    Checkbox,
    DatePicker,
    Textarea,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class EventDetail implements OnInit {
  eventId: number = 0;
  event: EventDetailData | null = null;
  loading: boolean = false;
  editMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.loadEventDetail();
    });
  }

  loadEventDetail() {
    this.loading = true;
    this.apiService.get(`tareas/ObtenerTareaPorId/${this.eventId}`).subscribe({
      next: (response: any) => {
        this.event = {
          ...response,
          fecha: new Date(response.fecha)
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el detalle de la tarea.'
        });
        this.loading = false;
        this.router.navigate(['/events']);
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    if (!this.event) return;

    const payload = {
      id: this.event.id,
      titulo: this.event.titulo,
      descripcion: this.event.descripcion,
      completada: this.event.completada,
      notificar: this.event.notificar
    };

    this.apiService.put(`tareas/ActualizarTarea/${this.event.id}`, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Tarea actualizada correctamente.'
        });
        this.editMode = false;
        this.loadEventDetail();
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la tarea.'
        });
      }
    });
  }

  toggleComplete() {
    if (!this.event) return;

    const wasCompleted = this.event.completada;
    
    this.apiService.put(`tareas/${this.event.id}/completar`, {}).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: wasCompleted ? 'Tarea marcada como pendiente.' : 'Tarea marcada como completada.'
        });
        this.loadEventDetail();
      },
      error: (error) => {
        console.error('Error al completar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado de la tarea.'
        });
      }
    });
  }

  deleteEvent() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.apiService.delete(`tareas/EliminarTarea/${this.eventId}`).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Tarea eliminada correctamente.'
            });
            this.router.navigate(['/events']);
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la tarea.'
            });
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}
