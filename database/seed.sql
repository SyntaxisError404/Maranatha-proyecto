-- ============================================================================
-- Maranatha Kids - Datos iniciales (seed)
-- ============================================================================
-- Ejecutar DESPUÉS de schema.sql (y functions.sql).
-- Idempotente: usa ON CONFLICT DO NOTHING.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SALONES
-- ----------------------------------------------------------------------------
insert into salones (id, seccion, clase, nombre, orden) values
  ('cuna',          'Maternal',   '1 MES-11 MESES', 'Cuna y Gateo', 1),
  ('sala1',         'Maternal',   '1 AÑO',          'Sala 1',       2),
  ('sala2',         'Maternal',   '2 AÑOS',         'Sala 2',       3),
  ('b',             'Maternal',   '2 AÑOS',         'B',            4),
  ('sala3',         'Maternal',   '3 AÑOS',         'Sala 3',       5),
  ('c',             'Maternal',   '3 AÑOS',         'C',            6),
  ('d',             'Maternal',   '4 AÑOS',         'D',            7),
  ('e',             'Maternal',   '4 AÑOS',         'E',            8),
  ('recepcion_mat', 'Maternal',   'RECEPCION',      'Recepción',    9),
  ('f',             'Infantil',   '5 AÑOS',         'F',            1),
  ('g',             'Infantil',   '5 AÑOS',         'G',            2),
  ('h',             'Infantil',   '6 AÑOS',         'H',            3),
  ('i',             'Infantil',   '6 AÑOS',         'I',            4),
  ('j',             'Infantil',   '7 AÑOS',         'J',            5),
  ('k',             'Infantil',   '7 AÑOS',         'K',            6),
  ('l',             'Infantil',   '7 AÑOS',         'L',            7),
  ('recepcion_inf', 'Infantil',   'RECEPCION',      'Recepción',    8),
  ('comedor',       'Prejuvenil', '8 Y 11 AÑOS',    'Comedor',      1),
  ('multiple',      'Prejuvenil', '12-17 AÑOS',     'Múltiple',     2)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- SERVIDORES (58, desde data/mockData.js)
-- ----------------------------------------------------------------------------
insert into servidores (id, nombre, grupo, funcion_default) values
  (1,  'Nairovis Romero',    'Maternal',   'Servidor'),
  (2,  'Katherine Ariza',    'Maternal',   'Servidor'),
  (3,  'Dana Jimenez',       'Maternal',   'Servidor'),
  (4,  'Ysbeth Tovar',       'Maternal',   'Servidor'),
  (5,  'Antonela Aponte',    'Maternal',   'Servidor'),
  (6,  'Marianny Conde',     'Maternal',   'Servidor'),
  (7,  'Dilin Vezga',        'Maternal',   'Servidor'),
  (8,  'Williamny Nuñez',    'Maternal',   'Servidor'),
  (9,  'Aisbel Medosa',      'Maternal',   'Servidor'),
  (10, 'Sofia Gonzalez',     'Maternal',   'Servidor'),
  (11, 'Elazai Rodriguez',   'Maternal',   'Servidor'),
  (12, 'Mirian Ortega',      'Maternal',   'Servidor'),
  (13, 'Marta Rivero',       'Maternal',   'Capitán'),
  (14, 'Roxany Rodriguez',   'Infantil',   'Servidor'),
  (15, 'Rosmary',            'Infantil',   'Servidor'),
  (16, 'Maria Ponte',        'Infantil',   'Servidor'),
  (17, 'Rebeca Izaguirre',   'Infantil',   'Servidor'),
  (18, 'Estefany Villanueva','Infantil',   'Servidor'),
  (19, 'Maria Esquivel',     'Infantil',   'Servidor'),
  (20, 'Victoria Cedeño',    'Infantil',   'Servidor'),
  (21, 'Alba Freites',       'Infantil',   'Servidor'),
  (22, 'Raquel Izaguirre',   'Infantil',   'Servidor'),
  (23, 'Karem Cedeño',       'Infantil',   'Servidor'),
  (24, 'Karina Solis',       'Infantil',   'Servidor'),
  (25, 'Reina Torres',       'Infantil',   'Capitán'),
  (26, 'Yenife Sambrano',    'Prejuvenil', 'Servidor'),
  (27, 'Jenis Flores',       'Prejuvenil', 'Servidor'),
  (28, 'Abdiel Infante',     'Prejuvenil', 'Servidor'),
  (29, 'Darialin Flores',    'Prejuvenil', 'Servidor'),
  (30, 'Elisa Jorge',        'Prejuvenil', 'Servidor'),
  (31, 'Leonardo Roa',       'Prejuvenil', 'Servidor'),
  (32, 'Fernando Salazar',   'Prejuvenil', 'Servidor'),
  (33, 'Benjamín Rondón',    'Prejuvenil', 'Servidor'),
  (34, 'Yenifer Zambrano',   'Prejuvenil', 'Servidor'),
  (35, 'Eyder Hernandez',    'Prejuvenil', 'Servidor'),
  (36, 'Rosana Zumeta',      'Prejuvenil', 'Capitán'),
  (37, 'David Garcia',       'Logística Operativa',    'Capitán Área'),
  (38, 'Aminta Gallego',     'Logística Operativa',    'Mano Derecha'),
  (39, 'Alvaro Panqueva',    'Logística Operativa',    'Servidor'),
  (40, 'Rosmari Rodriguez',  'Logística Operativa',    'Servidor'),
  (41, 'Valeria Panqueva',   'Logística Operativa',    'Servidor'),
  (42, 'Enyelit Jimenez',    'Logística Operativa',    'Servidor'),
  (43, 'Jesús Yaguaran',     'Logística Operativa',    'Servidor'),
  (44, 'Crisalida Rojas',    'Almacén',    'Capitán Área'),
  (45, 'Oscar Fuente',       'Almacén',    'Servidor'),
  (46, 'Marcos Jimenez',     'Secretaría', 'Capitán'),
  (47, 'Gabriel Araujo',     'Secretaría', 'Mano Derecha'),
  (48, 'Leonardo Ramos',     'Secretaría', 'Servidor'),
  (49, 'Richard Jimenez',    'Distribución Alimentos', 'Capitán'),
  (50, 'Crisve Rojas',       'Distribución Alimentos', 'Mano Derecha'),
  (51, 'Amarilis Carrero',   'Distribución Alimentos', 'Servidor'),
  (52, 'Edwin Ramos',        'Distribución Alimentos', 'Servidor'),
  (53, 'Valentina Rivero',   'Distribución Alimentos', 'Servidor'),
  (54, 'Cristian Montaño',   'Distribución Alimentos', 'Servidor'),
  (55, 'Yoelly Jimenez',     'Distribución Alimentos', 'Servidor'),
  (56, 'Yeminy Martinez',    'Distribución Alimentos', 'Servidor'),
  (57, 'Nelly Tovar',        'Distribución Alimentos', 'Servidor'),
  (58, 'Zulay Leon',         'Distribución Alimentos', 'Servidor')
on conflict (id) do nothing;

-- Reajustar la secuencia de id para que los próximos inserts no colisionen
select setval(
  pg_get_serial_sequence('servidores', 'id'),
  (select coalesce(max(id), 1) from servidores)
);

-- ----------------------------------------------------------------------------
-- NIÑOS de ejemplo (con código QR para probar el escáner)
-- ----------------------------------------------------------------------------
insert into ninos (nombre, genero, salon_id, codigo_qr, representante, telefono) values
  ('Samuel Pérez',    'M', 'sala2', 'MK-0001', 'Ana Pérez',       '0412-0000001'),
  ('Valentina López',  'F', 'd',     'MK-0002', 'Luis López',      '0414-0000002'),
  ('Mateo Rodríguez', 'M', 'f',     'MK-0003', 'Carla Rodríguez', '0416-0000003'),
  ('Isabella Gómez',  'F', 'h',     'MK-0004', 'Pedro Gómez',     '0424-0000004'),
  ('Daniel Suárez',   'M', 'comedor','MK-0005', 'Rosa Suárez',    '0426-0000005')
on conflict (codigo_qr) do nothing;
