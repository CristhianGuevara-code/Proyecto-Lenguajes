const asignaturas = [
  { id: 1, titulo: 'Español', descripcion: '2 asignaciones pendientes por hacer', imagen: 'https://plus.unsplash.com/premium_photo-1666739032615-ecbd14dfb543?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 2, titulo: 'Matematicas', descripcion: '1 asignacion pendiente por hacer', imagen: 'https://plus.unsplash.com/premium_photo-1717972599101-33a39b433362?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWF0ZW1hdGljYXMlMjBwYXJhJTIwbmklQzMlQjFvc3xlbnwwfHwwfHx8MA%3D%3D' },
  { id: 3, titulo: 'Ciencias Naturales', descripcion: 'Sin asignaciones', imagen: 'https://plus.unsplash.com/premium_photo-1676325102346-7f0f536d1f2f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 4, titulo: 'Estudios Sociales', descripcion: 'Sin asignaciones', imagen: 'https://plus.unsplash.com/premium_photo-1661373619731-0d4ac1774f21?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 5, titulo: 'Arte', descripcion: '1 asignacion pendiente por hacer', imagen: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 6, titulo: 'Música', descripcion: 'Sin asignaciones', imagen: 'https://images.unsplash.com/photo-1575314113965-c6672a42b99c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 7, titulo: 'Educación Física', descripcion: 'Sin asignaciones', imagen: 'https://images.unsplash.com/photo-1494778696781-8f23fd5553c4?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 7, titulo: 'Tecnologia', descripcion: 'Sin asignaciones', imagen: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

export const HomePage = () => {
  return (
    <div className="p-6 bg-gray-100 bg-transparent min-h-screen">
      <h1 className="text-3xl font-bold text-platform-bluedark mb-6">Mis asignaturas:</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {asignaturas.map((asig) => (
          <div
            key={asig.id}
            className="w-full rounded-2xl overflow-hidden shadow-lg bg-platform-brightblue hover:shadow-xl transition duration-300"
          >
            <img
              className="w-full h-40 object-cover"
              src={asig.imagen}
              alt={asig.titulo}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{asig.titulo}</h2>
              <p className="text-sm text-gray-600 mt-2">{asig.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
