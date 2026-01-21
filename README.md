# Ponto de Aula Mobile

Aplicativo mobile em React Native (Expo + Expo Router) para a plataforma de blogging
educacional. O app consome a API REST ja existente e aplica regras de autenticacao e
permissao (RBAC) conforme o backend.

## Visao geral

O app oferece:

- Feed de posts com busca e filtros
- Leitura completa de posts (HTML + midia)
- Criacao/edicao/exclusao de posts para usuarios autorizados
- Gestao de usuarios (professores/alunos) por perfis administrativos
- Autenticacao com sessao persistida
- Perfil: visualizacao/edicao de dados (nome/email) e troca de senha na mesma tela

A implementacao segue a regra de negocio do backend legado:

- Usuarios com permissao de criacao gerenciam apenas seus proprios posts
- Admin/Secretary gerenciam usuarios (professores e alunos)
- A "pagina administrativa" do enunciado foi mapeada para o fluxo "Meus Posts"
- Perfil proprio: usuario edita apenas nome/email; senha inicial vem do admin e pode ser alterada pelo proprio usuario em fluxo separado

## Requisitos

- Node.js 18+
- Expo CLI (opcional): `npm install -g expo-cli`
- Android Studio ou Xcode (para emuladores), ou app Expo Go no dispositivo

## Setup

```bash
npm install
```

## Variaveis de ambiente

A base URL da API vem de EXPO_PUBLIC_API_URL.
Crie um arquivo .env na raiz do projeto:

```
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

Observacoes:

- Android emulator usa http://10.0.2.2:3000
- iOS simulator/web usa http://127.0.0.1:3000
- Dispositivo fisico precisa do IP da sua maquina na rede local
- O backend deve estar ouvindo em 0.0.0.0

## Rodando o app

npm run start

Outros comandos:
npm run android
npm run ios
npm run web

## Arquitetura

Estrutura principal:

app/ # Rotas e layouts (Expo Router)
components/ # UI e componentes de dominio
core/
api/ # Cliente Axios e interceptors
auth/ # AuthProvider, RBAC, permissoes
services/ # Chamadas para API REST
validation/ # Zod schemas
constants/ # Cores e configuracoes
types/ # Tipos compartilhados

Pontos tecnicos:

- Navegacao: Expo Router + Tabs
- Estado de servidor: React Query
- Formularios: React Hook Form + Zod
- Persistencia de sessao: AsyncStorage
- Estilo: NativeWind (Tailwind CSS)
- Feedback: Toast

## Fluxos e telas

- Login: app/(auth)/index.tsx
- Feed/Home (lista + busca/filtros): app/(app)/(tabs)/index.tsx
- Detalhe do post: app/(app)/posts/[id].tsx
- Criar/Editar post: app/(app)/posts/manage/[id].tsx
- Meus Posts (gestao de posts proprios): app/(app)/(tabs)/my-posts.tsx
- Usuarios (lista/CRUD): app/(app)/(tabs)/users.tsx
- Perfil/Meus dados (autoedicao + troca de senha): app/(app)/(tabs)/my-profile.tsx

## Permissoes (RBAC)

Roles: ADMIN, SECRETARY, TEACHER, STUDENT

Regras principais:

- STUDENT: leitura de posts
- TEACHER/SECRETARY: criam posts e gerenciam apenas os proprios (conferir com backend)
- ADMIN: pode criar/excluir posts; edicao conforme backend (geralmente qualquer)
- ADMIN/SECRETARY: gerenciam usuarios (professores e alunos); secretary cria apenas TEACHER/STUDENT
- Autoedicao: qualquer usuario pode alterar nome/email; senha via fluxo separado

Implementacao:

- core/auth/rbac.ts
- core/auth/permissions.ts

## Integracao com API

Principais endpoints utilizados:

- Auth: POST /auth/login
- Posts: GET /posts/search, GET /posts/:id, POST /posts, PUT /posts/:id, DELETE /
  posts/:id, GET /posts/mine
- Usuarios: GET /users, POST /users, GET /users/:id, PATCH /users/:id, DELETE /
  users/:id
- Perfil: GET /users/me, PATCH /users/me (nome/email), PUT /users/me/password

Cliente HTTP:

- core/api/client.ts (Axios + token Bearer)
- Backend utilizado: https://github.com/RafaelVsc/ponto-de-aula-api

## Observacoes e decisoes

- O cadastro de professores por professores nao foi adotado para manter coerencia
  com o backend legado.
- A pagina administrativa do enunciado foi mapeada para "Meus Posts".
- Tela de perfil consolidada: cards para dados pessoais e troca de senha; UserForm refatorado em hook + campos reutilizaveis

## Scripts

- npm run start - inicia o Expo
- npm run android - build/exec Android
- npm run ios - build/exec iOS
- npm run web - roda no navegador

```

```
