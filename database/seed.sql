-- ============================================================================
-- Maranatha Kids · Datos Iniciales (seed)
-- ----------------------------------------------------------------------------
-- Ejecutar DESPUÉS de schema.sql. Idempotente:
--   · salones usan ON CONFLICT (PK de texto).
--   · servidores se insertan solo si la tabla está vacía.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SALONES
-- ----------------------------------------------------------------------------
insert into public.salones (id, seccion, nombre, clase, orden) values
  ('cuna',          'Maternal',   'Cuna y Gateo', '1 MES-11 MESES', 1),
  ('sala1',         'Maternal',   'Sala 1',       '1 AÑO',          2),
  ('sala2',         'Maternal',   'Sala 2',       '2 AÑOS',         3),
  ('b',             'Maternal',   'B',            '2 AÑOS',         4),
  ('sala3',         'Maternal',   'Sala 3',       '3 AÑOS',         5),
  ('c',             'Maternal',   'C',            '3 AÑOS',         6),
  ('d',             'Maternal',   'D',            '4 AÑOS',         7),
  ('e',             'Maternal',   'E',            '4 AÑOS',         8),
  ('recepcion_mat', 'Maternal',   'Recepción',    'RECEPCION',      9),
  ('f',             'Infantil',   'F',            '5 AÑOS',         1),
  ('g',             'Infantil',   'G',            '5 AÑOS',         2),
  ('h',             'Infantil',   'H',            '6 AÑOS',         3),
  ('i',             'Infantil',   'I',            '6 AÑOS',         4),
  ('j',             'Infantil',   'J',            '7 AÑOS',         5),
  ('k',             'Infantil',   'K',            '7 AÑOS',         6),
  ('l',             'Infantil',   'L',            '7 AÑOS',         7),
  ('recepcion_inf', 'Infantil',   'Recepción',    'RECEPCION',      8),
  ('comedor',       'Prejuvenil', 'Comedor',      '8 Y 11 AÑOS',    1),
  ('multiple',      'Prejuvenil', 'Múltiple',     '12-17 AÑOS',     2)
on conflict (id) do update
  set seccion = excluded.seccion,
      nombre  = excluded.nombre,
      clase   = excluded.clase,
      orden   = excluded.orden;

-- ----------------------------------------------------------------------------
-- SERVIDORES (solo si la tabla está vacía, para no duplicar)
-- ----------------------------------------------------------------------------
insert into public.servidores (nombre, grupo, funcion)
select * from (values
  ('Nairovis Romero',     'Maternal',               'Servidor'),
  ('Katherine Ariza',     'Maternal',               'Servidor'),
  ('Dana Jimenez',        'Maternal',               'Servidor'),
  ('Ysbeth Tovar',        'Maternal',               'Servidor'),
  ('Antonela Aponte',     'Maternal',               'Servidor'),
  ('Marianny Conde',      'Maternal',               'Servidor'),
  ('Dilin Vezga',         'Maternal',               'Servidor'),
  ('Williamny Nuñez',     'Maternal',               'Servidor'),
  ('Aisbel Medosa',       'Maternal',               'Servidor'),
  ('Sofia Gonzalez',      'Maternal',               'Servidor'),
  ('Elazai Rodriguez',    'Maternal',               'Servidor'),
  ('Mirian Ortega',       'Maternal',               'Servidor'),
  ('Marta Rivero',        'Maternal',               'Capitán'),
  ('Roxany Rodriguez',    'Infantil',               'Servidor'),
  ('Rosmary',             'Infantil',               'Servidor'),
  ('Maria Ponte',         'Infantil',               'Servidor'),
  ('Rebeca Izaguirre',    'Infantil',               'Servidor'),
  ('Estefany Villanueva', 'Infantil',               'Servidor'),
  ('Maria Esquivel',      'Infantil',               'Servidor'),
  ('Victoria Cedeño',     'Infantil',               'Servidor'),
  ('Alba Freites',        'Infantil',               'Servidor'),
  ('Raquel Izaguirre',    'Infantil',               'Servidor'),
  ('Karem Cedeño',        'Infantil',               'Servidor'),
  ('Karina Solis',        'Infantil',               'Servidor'),
  ('Reina Torres',        'Infantil',               'Capitán'),
  ('Yenife Sambrano',     'Prejuvenil',             'Servidor'),
  ('Jenis Flores',        'Prejuvenil',             'Servidor'),
  ('Abdiel Infante',      'Prejuvenil',             'Servidor'),
  ('Darialin Flores',     'Prejuvenil',             'Servidor'),
  ('Elisa Jorge',         'Prejuvenil',             'Servidor'),
  ('Leonardo Roa',        'Prejuvenil',             'Servidor'),
  ('Fernando Salazar',    'Prejuvenil',             'Servidor'),
  ('Benjamín Rondón',     'Prejuvenil',             'Servidor'),
  ('Yenifer Zambrano',    'Prejuvenil',             'Servidor'),
  ('Eyder Hernandez',     'Prejuvenil',             'Servidor'),
  ('Rosana Zumeta',       'Prejuvenil',             'Capitán'),
  ('David Garcia',        'Logística Operativa',    'Capitán Área'),
  ('Aminta Gallego',      'Logística Operativa',    'Mano Derecha'),
  ('Alvaro Panqueva',     'Logística Operativa',    'Servidor'),
  ('Rosmari Rodriguez',   'Logística Operativa',    'Servidor'),
  ('Valeria Panqueva',    'Logística Operativa',    'Servidor'),
  ('Enyelit Jimenez',     'Logística Operativa',    'Servidor'),
  ('Jesús Yaguaran',      'Logística Operativa',    'Servidor'),
  ('Crisalida Rojas',     'Almacén',                'Capitán Área'),
  ('Oscar Fuente',        'Almacén',                'Servidor'),
  ('Marcos Jimenez',      'Secretaría',             'Capitán'),
  ('Gabriel Araujo',      'Secretaría',             'Mano Derecha'),
  ('Leonardo Ramos',      'Secretaría',             'Servidor'),
  ('Richard Jimenez',     'Distribución Alimentos', 'Capitán'),
  ('Crisve Rojas',        'Distribución Alimentos', 'Mano Derecha'),
  ('Amarilis Carrero',    'Distribución Alimentos', 'Servidor'),
  ('Edwin Ramos',         'Distribución Alimentos', 'Servidor'),
  ('Valentina Rivero',    'Distribución Alimentos', 'Servidor'),
  ('Cristian Montaño',    'Distribución Alimentos', 'Servidor'),
  ('Yoelly Jimenez',      'Distribución Alimentos', 'Servidor'),
  ('Yeminy Martinez',     'Distribución Alimentos', 'Servidor'),
  ('Nelly Tovar',         'Distribución Alimentos', 'Servidor'),
  ('Zulay Leon',          'Distribución Alimentos', 'Servidor')
) as nuevos(nombre, grupo, funcion)
where not exists (select 1 from public.servidores);
