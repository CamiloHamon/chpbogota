const  calculateYearsCompany = (dateAniversary) => {
    const currentDate = new Date(); // Obtiene la fecha actual
    const aniversary = new Date(dateAniversary); // Convierte la fecha del aniversary a un objeto Date
    
    let years = currentDate.getFullYear() - aniversary.getFullYear(); // Calcula la diferencia en años
    
    // Verifica si ya pasó el aniversary este año
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    const monthAniversary = aniversary.getMonth();
    const dayAniversary = aniversary.getDate();
    
    // Si el aniversary aún no ha ocurrido este año, resta un año.
    if (month < monthAniversary || (month === monthAniversary && day < dayAniversary)) {
        years--;
    }
    
    return years;
}


export default calculateYearsCompany;