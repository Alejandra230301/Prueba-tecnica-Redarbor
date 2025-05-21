const apiGetEmployees = (employees) => { //Simula un GET
  return new Promise(resolve => {
    setTimeout(() => resolve([...employees]), 300);
  });
}

const apiAddEmployee = (emp, employees) => { //Simula un POST
  return new Promise(resolve => {
    setTimeout(() => {
      const maxId = employees.reduce((max, e) => e.id > max ? e.id : max, 0);
      emp.id = maxId + 1;
      employees.push(emp);
      resolve(emp);
    }, 300);
  });
};


const apiUpdateEmployee = (emp, employees) => { //Simula un PUT
  return new Promise(resolve => {
    setTimeout(() => {
      const index = employees.findIndex(e => e.id === emp.id);
      if (index !== -1) {
        employees[index] = emp;
      }
      resolve(emp);
    }, 300);
  });
}

const apiDeleteEmployee = (id, employees) => { //Simula un DELETE
  return new Promise(resolve => {
    setTimeout(() => {
      const index = employees.findIndex(e => e.id === id);
      if (index !== -1) {
        employees.splice(index, 1); 
      }
      resolve();
    }, 300);
  });
}

const apiDeleteManyEmployees = (ids, employees) => { //Simula un DELETE
  return new Promise(resolve => {
    setTimeout(() => {
      for (let i = employees.length - 1; i >= 0; i--) {
        if (ids.includes(employees[i].id)) {
          employees.splice(i, 1); // elimina del array original
        }
      }
      resolve();
    }, 300);
  });
}

export  {
apiGetEmployees,
apiAddEmployee,
apiUpdateEmployee,
apiDeleteEmployee,
apiDeleteManyEmployees
}