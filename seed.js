const mongoose = require('mongoose');

// Importar modelos
const Usuario = require('./modules/Usuario');
const Producto = require('./modules/Producto');
const Reseña = require('./modules/Reseña');
const Comentario = require('./modules/Comentario');
const Reaccion = require('./modules/Reaccion');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/DB_Caso_Hiraoka')
  .then(async () => {
    console.log('Conectado a MongoDB');

    // Datos de usuarios actuales
    const usuarios = [
      {
        nombre_usuario: "Camila",
        email: "camila@gmail.com",
        hash_password: "$2b$10$Rrqjc1n1lsVWsBKO5Vvm9eJ.cOlynkeL6k4d1Gl1YwfEvRQd5GE92",
        fecha_registro: new Date("2025-11-25T04:58:41Z"),
        lista_deseos: []
      },
      {
        nombre_usuario: "Daniela",
        email: "daniela@gmail.com",
        hash_password: "$2b$10$xqg8Op5BzElynOqkxTxwWug79YKBmzhQ/i08rWFFT/di2YuFWogy2",
        fecha_registro: new Date("2025-11-28T06:33:57Z"),
        lista_deseos: []
      },
      {
        nombre_usuario: "Manuelito",
        email: "manuel.ito@gmail.com",
        hash_password: "$2b$10$EpRXcOM9.S5PcMeKn6g8KuMOoWoKv2mNu6jKOjKSwJs0XQSg5c2aW",
        fecha_registro: new Date("2025-11-28T06:37:56Z"),
        lista_deseos: []
      },
      {
        nombre_usuario: "Camilo",
        email: "camiloxd@gmail.com",
        hash_password: "$2b$10$orVgLD1hL0SQugtpi5/AzeF/C1S8mVXQ.X9a0W84QY5dnCDT8LDsO",
        fecha_registro: new Date("2025-11-28T06:40:38Z"),
        lista_deseos: []
      },
      {
        nombre_usuario: "Santiago",
        email: "santia@gmail.com",
        hash_password: "$2b$10$h6uZ/mtq3BxAztPc4QFtveeXA3T.VAAXRB4jko7sg.vAmZXbfZSiS",
        fecha_registro: new Date("2025-11-28T06:45:49Z"),
        lista_deseos: []
      }
    ];

    const productos = [
      { nombre: "Televisor Samsung", marca: "Samsung", categoria: "Entretenimiento", precio: 800, descripcion: "Televisor 55\" 4K UHD, Smart TV, con acceso a aplicaciones de streaming" },
      { nombre: "Lavadora Whirlpool", marca: "Whirlpool", categoria: "Hogar", precio: 450, descripcion: "Lavadora automática de 10 kg con 6 programas de lavado" },
      { nombre: "Laptop Dell", marca: "Dell", categoria: "Electrónica", precio: 1200, descripcion: "Laptop con procesador Intel Core i7, 16GB de RAM y 512GB SSD" },
      { nombre: "Aire Acondicionado Panasonic", marca: "Panasonic", categoria: "Climatización", precio: 800, descripcion: "Aire acondicionado de 12,000 BTU, con tecnología inverter" },
      { nombre: "Extractor de Jugos Philips", marca: "Philips", categoria: "Cocina", precio: 90, descripcion: "Extractor de jugos con 700W de potencia, incluye 2 velocidades" }
    ];

    // Limpieza
    await Usuario.deleteMany({});
    await Producto.deleteMany({});
    await Reseña.deleteMany({});
    await Comentario.deleteMany({});
    await Reaccion.deleteMany({});

    // Inserción
    const usuariosGuardados = await Usuario.insertMany(usuarios);
    const productosGuardados = await Producto.insertMany(productos);

    // Mapear usuarios y productos
    const camila = usuariosGuardados.find(u => u.nombre_usuario === "Camila");
    const daniela = usuariosGuardados.find(u => u.nombre_usuario === "Daniela");
    const manuelito = usuariosGuardados.find(u => u.nombre_usuario === "Manuelito");
    const camilo = usuariosGuardados.find(u => u.nombre_usuario === "Camilo");
    const santiago = usuariosGuardados.find(u => u.nombre_usuario === "Santiago");

    const laptop = productosGuardados.find(p => p.nombre.includes("Laptop Dell"));
    const extractor = productosGuardados.find(p => p.nombre.includes("Extractor de Jugos"));
    const lavadora = productosGuardados.find(p => p.nombre.includes("Lavadora Whirlpool"));

    // Reseñas
    const reseñas = [
      {
        producto_id: laptop._id,
        usuario_id: camila._id,
        calificacion: 5,
        titulo: "¡La mejor laptop para la universidad!",
        texto: "Es súper rápida, la batería dura todo el día. Perfecta para mis clases y trabajos.",
        imagenes: ["https://i.redd.it/7ceesiep8gd31.jpg"],
        fecha_creacion: new Date("2025-11-01T10:00:00Z")
      },
      {
        producto_id: extractor._id,
        usuario_id: daniela._id,
        calificacion: 4.2,
        titulo: "Bueno, pero algo ruidoso",
        texto: "Funciona muy bien, saca bastante jugo. El único detalle es que es más ruidoso de lo que esperaba.",
        imagenes: [],
        fecha_creacion: new Date("2025-11-03T15:20:00Z")
      },
      {
        producto_id: lavadora._id,
        usuario_id: manuelito._id,
        calificacion: 3,
        titulo: "Es funcional, pero...",
        texto: "Lava bien la ropa, pero los ciclos son muy largos y a veces la ropa sale demasiado húmeda.",
        imagenes: [
          "https://ugc-user-content.pccomponentes.com/IMG_654cd981dde62_20231109130713908897.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxtF3C00lZewswNhwVL8aizwkOcKfcwEHgufeVMFNyX1JXvLSVq8iEvE5anOiuJ9RYrsE&usqp=CAU"
        ],
        fecha_creacion: new Date("2025-11-05T18:00:00Z")
      }
    ];

    const reseñasGuardadas = await Reseña.insertMany(reseñas);

    // Comentarios
    const comentarios = [
      { reseña_id: reseñasGuardadas[0]._id, usuario_id: daniela._id, texto: "Gracias por la reseña, Camila. ¿Has probado correr juegos en esa laptop?", fecha_creacion: new Date("2025-11-01T12:00:00Z") },
      { reseña_id: reseñasGuardadas[0]._id, usuario_id: camilo._id, texto: "Yo también la tengo y confirmo, es excelente para la universidad.", fecha_creacion: new Date("2025-11-02T09:30:00Z") },
      { reseña_id: reseñasGuardadas[0]._id, usuario_id: camila._id, texto: "Hola Daniela sí, probé algunos juegos ligeros y va perfecto.", fecha_creacion: new Date("2025-11-02T11:00:00Z") },
      { reseña_id: reseñasGuardadas[1]._id, usuario_id: santiago._id, texto: "¿Es muy difícil de limpiar?", fecha_creacion: new Date("2025-11-04T10:00:00Z") },
      { reseña_id: reseñasGuardadas[1]._id, usuario_id: daniela._id, texto: "Para nada, se desarma fácil y las piezas van al lavavajillas.", fecha_creacion: new Date("2025-11-04T14:15:00Z") }
    ];

    const comentariosGuardados = await Comentario.insertMany(comentarios);

        // Reacciones
    const reacciones = [
      { usuario_id: camilo._id, elemento_id: comentariosGuardados[1]._id, elemento_tipo: "comentario", tipo: "like" },
      { usuario_id: santiago._id, elemento_id: comentariosGuardados[4]._id, elemento_tipo: "comentario", tipo: "like" },
      { usuario_id: daniela._id, elemento_id: comentariosGuardados[2]._id, elemento_tipo: "comentario", tipo: "like" },
      { usuario_id: camila._id, elemento_id: comentariosGuardados[3]._id, elemento_tipo: "comentario", tipo: "dislike" }
    ];

    await Reaccion.insertMany(reacciones);

    console.log('Datos iniciales insertados con usuarios actuales y referencias válidas');
    mongoose.connection.close();
})
.catch(err => console.error('Error al conectar a MongoDB', err));