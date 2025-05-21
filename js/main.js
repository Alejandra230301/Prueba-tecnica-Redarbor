import { validateForm } from "./validations.js";
import { EMPLOYEES } from "../constants/employees.js";
import { apiGetEmployees, apiAddEmployee, apiDeleteEmployee, apiUpdateEmployee, apiDeleteManyEmployees } from "../services/employee.js";

let employees = EMPLOYEES;
let employeeIdCounter =   EMPLOYEES.length;

$(document).ready(function () {
  function renderTable(data) {
    const tbody = $('#employeeTable tbody');
    tbody.empty();
    data.forEach(emp => {
      tbody.append(`
        <tr>
          <td><input type="checkbox" class="selectCheckbox" data-id="${emp.id}"/></td>
          <td data-label="Name">${emp.name}</td>
          <td data-label="Surname">${emp.surname || ''}</td>
          <td data-label="Date of birth">${emp.dateOfBirth}</td>
          <td data-label="Email">${emp.email}</td>
          <td data-label="Role">${getRoleName(emp.roleId)}</td>
          <td>
            <button class="primaryButton" id="editBtn" data-id="${emp.id}">Editar</button>
            <button class="secondaryButton" id="deleteBtn" data-id="${emp.id}">Eliminar</button>
          </td>
        </tr>
      `);
    });
    $('#deleteSelectedBtn').prop('disabled', true);
  }

  function getRoleName(id) {
    return {
      1: "Desarrollador 🧑‍💻",
      2: "Team Leader 👨‍🏫",
      3: "CTO 🧠"
    }[id] || '';
  }

  function showModal(isEdit = false, data = {}) {
    $('#formTitle').text(isEdit ? 'Editar Empleado' : 'Agregar Empleado');
    $('#employeeId').val(data.id || '');
    $('#name').val(data.name || '');
    $('#surname').val(data.surname || '');
    $('#dob').val(data.dateOfBirth || '');
    $('#email').val(data.email || '');
    $('#roleId').val(data.roleId || 0);
    $('#employeeModal').removeClass('hidden');
  }

  $('#employeeForm').submit(async function (e) {
    e.preventDefault();
    const id = $('#employeeId').val();
    const data = {
      id: id ? parseInt(id) : null,
      name: $('#name').val().trim(),
      surname: $('#surname').val().trim(),
      dateOfBirth: $('#dob').val(),
      email: $('#email').val().trim(),
      roleId: parseInt($('#roleId').val())
    };

    const dataValidation = validateForm(data)
    console.log(dataValidation)

    if (!dataValidation) {
      alert(dataValidation);
      return;
    }

    const existingEmployees = await apiGetEmployees(employees);
    const isDuplicate = existingEmployees.some(e => e.email === data.email && e.id !== data.id);

    if (isDuplicate) {
      alert("Ya existe un empleado con ese email.");
      return;
    }

    if (data.id) {
      await apiUpdateEmployee(data, employees);
    } else {
      await apiAddEmployee(data, employees);
    }

    $('#employeeModal').addClass('hidden');
    const updated = await apiGetEmployees(employees);
    renderTable(updated);
  });

  $('#cancelBtn').click(() => $('#employeeModal').addClass('hidden'));

  $('#addEmployeeBtn').click(() => showModal());

  $(document).on('click', '#editBtn', async function () {
    const id = $(this).data('id');
    const list = await apiGetEmployees(employees);
    const emp = list.find(e => e.id === id);
    showModal(true, emp);
  });

  $(document).on('click', '#deleteBtn', async function () {
    const id = $(this).data('id');
    if (confirm("¿Eliminar este empleado?")) {
      await apiDeleteEmployee(id, employees);
      const updated = await apiGetEmployees(employees);
      renderTable(updated);
    }
  });

  $('#selectAll').on('change', function () {
    $('.selectCheckbox').prop('checked', $(this).is(':checked'));
    $('#deleteSelectedBtn').prop('disabled', !$(this).is(':checked'));
  });

  $(document).on('change', '.selectCheckbox', function () {
    const anyChecked = $('.selectCheckbox:checked').length > 0;
    $('#deleteSelectedBtn').prop('disabled', !anyChecked);
  });

  $('#deleteSelectedBtn').click(async () => {
    const selected = $('.selectCheckbox:checked').map(function () {
      return $(this).data('id');
    }).get();

    if (confirm(`¿Eliminar ${selected.length} empleados?`)) {
      await apiDeleteManyEmployees(selected, employees);
      const updated = await apiGetEmployees(employees);
      renderTable(updated);
    }
  });

  // Carga inicial
  apiGetEmployees(employees).then(renderTable);
});
