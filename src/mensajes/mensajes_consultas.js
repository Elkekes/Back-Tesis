//Muestra un mensage de error al ocurrir alguna falla en las consultas a la base de datos.
export const mensaje_error = (response, mensajePersonalizado, error) => {
    console.error(`❌ ${mensajePersonalizado}:`, error.message);
    response.status(500).json({
        error: mensajePersonalizado,
        detalle: error.message
    });
};

//Funcion que devuelve un mensaje de error o exíto al realizar las consultas "POST".
export const mensaje_POST = (response, resultado) => {
    const Consulta_SinExito= "No due posible agregar los datos a la tabla.";
    
    if (resultado.length === 0) { // Condicional en caso de no encontrar resultados.
        console.warn(`⚠️ ${Consulta_SinExito}`);
        return response.status(404).json({ message: Consulta_SinExito});
    }
    else{
        console.log("✅ Resultado consulta:", resultado); // Se muestra el resultado en consola
        return response.json(resultado); // Devuelve el resultado completo.
    }
    
};


//Funcion que devuelve un mensaje de error o exíto al realizar las consultas "GET".
export const mensaje_GET = (response, resultado) => {
    const Consulta_SinExito= "No se encontró información o indicador no encontrado.";
    
    if (resultado.length === 0) { // Condicional en caso de no encontrar resultados.
        console.warn(`⚠️ ${Consulta_SinExito}`);
        return response.status(404).json({ message: Consulta_SinExito});
    }
    else{
        console.log("✅ Resultado consulta:", resultado); // Se muestra el resultado en consola
        return response.json(resultado); // Devuelve el resultado completo.
    }
    
};

//Funcion que devuelve un mensaje de error o exíto al realizar una actualización "PUT".
export const mensaje_PUT = (response, resultado) => {
    const Consulta_SinExito= " No se pudo actualizar el anuncio (valide que el indicador exista).";
    
    if (resultado.affectedRows > 0) { // Condicional en caso de no encontrar resultados.
        console.warn(`⚠️ ${Consulta_SinExito}`);
        return response.status(404).json({ message: Consulta_SinExito});
    }
    else{
        console.log("✅ Anuncio actualizado correctamente:", resultado); // Se muestra el resultado en consola
        return response.status(200).json(resultado); // Devuelve el resultado completo.
    }
    
};

//Funcion que devuelve un mensaje de error o exíto al realizar una eliminación "DELETE".
export const mensaje_DELETE = (response, resultado) => {
    const Consulta_SinExito= "No se encontró el indicador a eliminar.";
    
    if (resultado.length === 0) { // Condicional en caso de no encontrar resultados.
        console.warn(`⚠️ ${Consulta_SinExito}`);
        return response.status(404).json({ message: Consulta_SinExito});
    }
    else{
        console.log("✅ Resultado de la eliminación:", resultado); // Se muestra el resultado en consola
        return response.json(resultado); // Devuelve el resultado completo.
    }
    
};