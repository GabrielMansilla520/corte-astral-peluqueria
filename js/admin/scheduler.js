import { format, parse, isValid } from 'https://cdn.skypack.dev/date-fns';
import { openDB } from 'https://cdn.skypack.dev/idb';

export class Scheduler {
  constructor() {
    this.db = null;
    this.appointments = [];
    this.init();
  }

  async init() {
    await this.initDB();
    this.loadAppointments();
    this.setupListeners();
  }

  async initDB() {
    this.db = await openDB('schedulerDB', 1, {
      upgrade(db) {
        const store = db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });
        store.createIndex('createdAt', 'createdAt');
      }
    });
  }

  async loadAppointments() {
    try {
      const tx = this.db.transaction('appointments', 'readonly');
      const store = tx.objectStore('appointments');
      this.appointments = await store.getAll();

      this.appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      this.renderSchedule();
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  }

  setupListeners() {
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-appointment-btn');
      const deleteBtn = e.target.closest('.delete-appointment');
      const editBtn = e.target.closest('.edit-appointment');
      const toggleBtn = e.target.closest('.toggle-status');

      if (addBtn) {
        this.showAppointmentForm();
        return;
      }
      if (deleteBtn) {
        this.handleRemoveAppointmentEvent(deleteBtn);
        return;
      }
      if (editBtn) {
        this.handleEditAppointmentEvent(editBtn);
        return;
      }
      if (toggleBtn) {
        this.handleToggleStatusEvent(toggleBtn);
        return;
      }
    });
  }

  showAppointmentForm(existingAppointment = null) {
    const formModal = document.createElement('div');
    formModal.className = 'modal appointment-form-modal active';
    
    formModal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h3>${existingAppointment ? 'Editar Cita' : 'Nueva Cita'}</h3>
        <form id="appointmentForm" class="appointment-form">
          <div class="form-group">
            <label for="clientName">Nombre del Cliente</label>
            <input type="text" id="clientName" value="${existingAppointment?.client || ''}" required>
          </div>
          <div class="form-group">
            <label for="appointmentDate">Fecha</label>
            <input type="date" id="appointmentDate" value="${existingAppointment?.date || ''}" required>
          </div>
          <div class="form-group">
            <label for="appointmentTime">Hora</label>
            <input type="time" id="appointmentTime" value="${existingAppointment?.time || ''}" required>
          </div>
          <div class="form-group">
            <label for="appointmentService">Servicio</label>
            <input type="text" id="appointmentService" value="${existingAppointment?.service || ''}" required>
          </div>
          <button type="submit" class="submit-btn gradient-bg">
            ${existingAppointment ? 'Actualizar' : 'Crear'} Cita
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(formModal);

    const form = formModal.querySelector('#appointmentForm');
    const closeBtn = formModal.querySelector('.modal-close');

    closeBtn.addEventListener('click', () => {
      formModal.remove();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const appointmentData = {
        client: form.clientName.value,
        date: form.appointmentDate.value,
        time: form.appointmentTime.value,
        service: form.appointmentService.value,
        status: existingAppointment?.status || 'pending',
        createdAt: existingAppointment?.createdAt || new Date().toISOString()
      };

      if (existingAppointment) {
        await this.updateAppointment(existingAppointment.id, appointmentData);
      } else {
        await this.saveAppointment(appointmentData);
      }

      formModal.remove();
      this.loadAppointments();
    });
  }

  async handleEditAppointmentEvent(element) {
    const card = element.closest('.appointment-card');
    if (!card) return;
    const appointmentId = parseInt(card.dataset.id);
    const appointment = this.appointments.find(a => a.id === appointmentId);
    
    if (appointment) {
      this.showAppointmentForm(appointment);
    }
  }

  async updateAppointment(id, appointmentData) {
    try {
      await this.db.put('appointments', { ...appointmentData, id });
      this.showNotification('Cita actualizada correctamente');
    } catch (error) {
      console.error('Error updating appointment:', error);
      this.showNotification('Error al actualizar la cita', 'error');
    }
  }

  async handleRemoveAppointmentEvent(element) {
    const card = element.closest('.appointment-card');
    if (!card) return;
    const appointmentId = parseInt(card.dataset.id);

    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      await this.removeAppointment(appointmentId);
      this.loadAppointments();
    }
  }

  async saveAppointment(appointment) {
    try {
      await this.db.add('appointments', appointment);
      this.showNotification('Cita guardada correctamente');
    } catch (error) {
      console.error('Error saving appointment:', error);
      this.showNotification('Error al guardar la cita', 'error');
    }
  }

  async removeAppointment(id) {
    try {
      await this.db.delete('appointments', id);
      this.showNotification('Cita eliminada correctamente');
    } catch (error) {
      console.error('Error removing appointment:', error);
      this.showNotification('Error al eliminar la cita', 'error');
    }
  }

  async handleToggleStatusEvent(element) {
    const card = element.closest('.appointment-card');
    if (!card) return;
    const appointmentId = parseInt(card.dataset.id);
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      const newStatus = appointment.status === 'pending' ? 'completed' : 'pending';
      appointment.status = newStatus;
      try {
        await this.db.put('appointments', appointment);
        this.showNotification('Cita actualizada correctamente');
        this.loadAppointments();
      } catch (error) {
        console.error('Error updating appointment status', error);
        this.showNotification('Error al actualizar la cita', 'error');
      }
    }
  }

  showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }

  renderSchedule() {
    const scheduleContainer = document.querySelector('.schedule-container');
    if (!scheduleContainer) return;

    scheduleContainer.innerHTML = `
      <div class="schedule-header">
        <h3>Próximas Citas</h3>
        <button class="add-appointment-btn gradient-bg hover-lift">
          <i class="fas fa-plus"></i> Nueva Cita
        </button>
      </div>
      <div class="appointments-container">
        ${this.appointments.map(appointment => `
          <div class="appointment-card ${appointment.status}" data-id="${appointment.id}">
            <div class="appointment-header">
              <h4>${appointment.client}</h4>
              <span class="status-badge">${appointment.status === 'pending' ? 'Pendiente' : 'Completado'}</span>
            </div>
            <div class="appointment-details">
              <p><i class="far fa-calendar"></i> ${appointment.date}</p>
              <p><i class="far fa-clock"></i> ${appointment.time}</p>
              <p><i class="fas fa-cut"></i> ${appointment.service}</p>
            </div>
            <div class="appointment-actions">
              <button class="edit-appointment hover-lift" title="Editar cita">
                <i class="fas fa-edit"></i>
              </button>
              <button class="toggle-status hover-lift" title="Cambiar estado">
                <i class="fas fa-check"></i>
              </button>
              <button class="delete-appointment hover-lift" title="Eliminar cita">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}
