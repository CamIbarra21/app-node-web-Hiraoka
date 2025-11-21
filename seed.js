const mongoose = require('mongoose');

// Importar modelos
const Usuario = require('./modules/Usuario');
const Producto = require('./modules/Producto');
const Reseña = require('./modules/Reseña');
const Comentario = require('./modules/Comentario');
const Reaccion = require('./modules/Reaccion');

// Conexión a MongoDB (ajusta si usas Docker: "mongodb://mongo:27017/DB_Caso_Hiraoka")
mongoose.connect('mongodb://localhost:27017/DB_Caso_Hiraoka')
  .then(async () => {
    console.log('Conectado a MongoDB');

    //Datos de usuarios y productos
    const usuarios = [
      {
        nombre_usuario: "ana_gomez_92",
        email: "ana.gomez@gmail.com",
        hash_password: "hash_del_password_de_ana",
        fecha_registro: new Date("2025-01-15T14:30:00Z"),
        lista_deseos: []
      },
      {
        nombre_usuario: "carlos_reyes_tec",
        email: "c.reyes@hotmail.com",
        hash_password: "hash_del_password_de_carlos",
        fecha_registro: new Date("2025-05-20T09:15:00Z"),
        lista_deseos: []
      },
      {
        nombre_usuario: "usuario_extra",
        email: "extra@example.com",
        hash_password: "hash_del_password_extra",
        fecha_registro: new Date("2025-06-01T09:00:00Z"),
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

    //Limpieza
    await Usuario.deleteMany({});
    await Producto.deleteMany({});
    await Reseña.deleteMany({});
    await Comentario.deleteMany({});
    await Reaccion.deleteMany({});

    //Inserción
    const usuariosGuardados = await Usuario.insertMany(usuarios);
    const productosGuardados = await Producto.insertMany(productos);

    //Mapear usuarios y productos para referencias
    const ana = usuariosGuardados.find(u => u.nombre_usuario === "ana_gomez_92");
    const carlos = usuariosGuardados.find(u => u.nombre_usuario === "carlos_reyes_tec");
    const extra = usuariosGuardados.find(u => u.nombre_usuario === "usuario_extra");

    const laptop = productosGuardados.find(p => p.nombre.includes("Laptop Dell"));
    const extractor = productosGuardados.find(p => p.nombre.includes("Extractor de Jugos"));
    const lavadora = productosGuardados.find(p => p.nombre.includes("Lavadora Whirlpool"));

    //Reseñas
    const reseñas = [
      {
        producto_id: laptop._id,
        usuario_id: ana._id,
        calificacion: 5,
        titulo: "¡La mejor laptop para la universidad!",
        texto: "Es súper rápida, la batería dura todo el día. Perfecta para mis clases y trabajos.",
        imagenes: ["https://i.redd.it/7ceesiep8gd31.jpg"],
        fecha_creacion: new Date("2025-11-01T10:00:00Z")
      },
      {
        producto_id: extractor._id,
        usuario_id: carlos._id,
        calificacion: 4.2,
        titulo: "Bueno, pero algo ruidoso",
        texto: "Funciona muy bien, saca bastante jugo. El único detalle es que es más ruidoso de lo que esperaba.",
        imagenes: [],
        fecha_creacion: new Date("2025-11-03T15:20:00Z")
      },
      {
        producto_id: lavadora._id,
        usuario_id: ana._id,
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

    //Comentarios
    const comentarios = [
      { reseña_id: reseñasGuardadas[0]._id, usuario_id: carlos._id, texto: "Gracias por la reseña, Ana. ¿Has probado correr juegos en esa laptop?", fecha_creacion: new Date("2025-11-01T12:00:00Z") },
      { reseña_id: reseñasGuardadas[0]._id, usuario_id: extra._id, texto: "Yo también la tengo y confirmo, es excelente para la universidad.", fecha_creacion: new Date("2025-11-02T09:30:00Z") },
      { reseña_id: reseñasGuardadas[0]._id, usuario_id: ana._id, texto: "Hola Carlos sí, probé algunos juegos ligeros y va perfecto.", fecha_creacion: new Date("2025-11-02T11:00:00Z") },
      { reseña_id: reseñasGuardadas[1]._id, usuario_id: extra._id, texto: "¿Es muy difícil de limpiar?", fecha_creacion: new Date("2025-11-04T10:00:00Z") },
      { reseña_id: reseñasGuardadas[1]._id, usuario_id: carlos._id, texto: "Para nada, se desarma fácil y las piezas van al lavavajillas.", fecha_creacion: new Date("2025-11-04T14:15:00Z") }
    ];

    const comentariosGuardados = await Comentario.insertMany(comentarios);

    //Reacciones
    const reacciones = [
      { usuario_id: extra._id, elemento_id: comentariosGuardados[1]._id, elemento_tipo: "comentario", tipo: "like" },
      { usuario_id: extra._id, elemento_id: comentariosGuardados[4]._id, elemento_tipo: "comentario", tipo: "like" },
      { usuario_id: carlos._id, elemento_id: comentariosGuardados[2]._id, elemento_tipo: "comentario", tipo: "like" },
      { usuario_id: ana._id, elemento_id: comentariosGuardados[3]._id, elemento_tipo: "comentario", tipo: "dislike" }
    ];

    await Reaccion.insertMany(reacciones);

    console.log('Datos iniciales insertados con ObjectId automáticos');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error al conectar a MongoDB', err));