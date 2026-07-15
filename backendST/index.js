import app from "./app.js";
import "./database.js";

// #1 Función asíncrona para inicializar el servidor
async function main() {
    try {
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor escuchando en el puerto ${PORT} en todas las interfaces de red`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

main();
