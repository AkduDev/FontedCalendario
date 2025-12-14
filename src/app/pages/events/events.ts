import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { Checkbox } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  completada: boolean;
  notificar: boolean;
}

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.html',
  styleUrls: ['./events.css'],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    Textarea,
    DatePicker,
    Checkbox,
    TooltipModule
  ],
})
export class Events implements OnInit {

  events: Evento[] = [];
  loading: boolean = false;
  displayModal: boolean = false;
  
  // Paginación del lado del servidor
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  
  // Modelo para nueva tarea
  newEvent = {
    titulo: '',
    descripcion: '',
    notificar: false,
    fecha: new Date()
  };

  constructor(private apiService: ApiService, private messageService: MessageService, private router: Router) {}

  ngOnInit() {}

  loadEvents(page: number, pageSize: number) {
    this.loading = true;
    
    this.apiService.get(`tareas/ObtenerTareasPaginadas?page=${page}&pageSize=${pageSize}`).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la API:', response);
        console.log('Propiedades del objeto:', Object.keys(response));
        
        if (Array.isArray(response)) {
          this.events = response;
          this.totalRecords = response.length < pageSize 
            ? (page - 1) * pageSize + response.length 
            : page * pageSize + 1;
        } else {
          this.events = response?.data || response?.items || response?.tareas || response?.results || [];
          this.totalRecords = response?.totalRecords || response?.total || response?.count || response?.totalCount || 0;
        }
        
        console.log('Eventos:', this.events.length, '| Total:', this.totalRecords);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al cargar los eventos.' 
        });
        this.events = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  onLazyLoad(event: any) {
    const page = (event.first / event.rows) + 1;
    const pageSize = event.rows;
    this.loadEvents(page, pageSize);
  }

  deleteEvent(eventId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.apiService.delete(`tareas/EliminarTarea/${eventId}`).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Tarea eliminada correctamente.' 
          });
          this.loadEvents(1, this.rows);
          this.first = 0;
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo eliminar la tarea.' 
          });
        }
      });
    }
  }

  viewDetail(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }

  showCreateDialog() {
    this.displayModal = true;
    this.resetForm();
  }

  hideDialog() {
    this.displayModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newEvent = {
      titulo: '',
      descripcion: '',
      notificar: false,
      fecha: new Date()
    };
  }

  createEvent() {
    // Validar campos requeridos
    if (!this.newEvent.titulo || !this.newEvent.descripcion) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'Por favor complete todos los campos requeridos.' 
      });
      return;
    }

    // Preparar el payload en formato ISO para la API
    const payload = {
      titulo: this.newEvent.titulo,
      descripcion: this.newEvent.descripcion,
      notificar: this.newEvent.notificar,
      fecha: this.newEvent.fecha.toISOString()
    };

    this.apiService.post('tareas/CrearTarea', payload).subscribe({
      next: (response) => {
        console.log('Tarea creada:', response);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Tarea creada correctamente.' 
        });
        this.hideDialog();
        // Recargar desde la primera página
        this.first = 0;
        this.loadEvents(1, this.rows);
      },
      error: (error) => {
        console.error('Error al crear tarea:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo crear la tarea. Intente nuevamente.' 
        });
      }
    });
  }
}