  export const validateForm = (data) => {
    if (!data.name || data.name.length > 100) return 'Ingresa tu nombre completo';
        console.log('Pasa nombre')
    const age = getAge(data.dob);
    if (!data.dob || age < 18 || age > 65) return 'Edad invalida';
        console.log('Pasa edad')
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) return 'Correo electronico no válido';
        console.log('Pasa correo')
    if (parseInt(data.roleId) <= 0) return 'Debes escoger un rol';
            console.log('Pasa rol')
    return true;
  }

    const getAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
