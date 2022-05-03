create database dindin


create table if not exists usuarios (
  id serial primary key,
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  senha text NOT NULL
)

create table if not exists categorias (
  id serial primary key,
  descricao text NOT NULL
)


create table if not exists transacoes (
  id serial primary key,
  descricao text NOT NULL,
  valor int NOT NULL,
  data date default now(),
  categoria_id int NOT NULL references categorias(id),
  usuario_id int NOT NULL references usuarios(id),
  tipo text NOT NULL
)