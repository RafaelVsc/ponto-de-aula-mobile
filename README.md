# Ponto de Aula - Mobile

Aplicativo mobile da plataforma Ponto de Aula, feito em React Native com Expo e Expo Router. O app consome a API REST existente e aplica RBAC no frontend para melhorar a UX, com a validacao final no backend.

📺 Vídeo de apresentação: [https://youtu.be/wZFh_yyBmes](https://youtu.be/wZFh_yyBmes)

![Thumbnail do vídeo](https://img.youtube.com/vi/wZFh_yyBmes/0.jpg)

## Funcionalidades

- Autenticacao com sessao persistida.
- Feed de posts com busca e filtros.
- Leitura detalhada de posts.
- Criacao e gestao de posts conforme permissoes.
- Gestao de usuarios conforme permissoes.
- Perfil do usuario com edicao de dados pessoais e troca de senha.
- Persistencia de tema.

## Guia de Uso Basico

1. **Login:** Acesse a tela inicial e utilize suas credenciais. Usuarios nao autenticados sao redirecionados automaticamente.
2. **Visualizar Posts:** Navegue pela aba "Inicio" para ver todos os posts. Utilize o campo de busca e filtros para refinar a listagem.
3. **Criar um Post (Professores/Admins/Secretaria):** Na aba "Meus Posts", toque no botao flutuante (+) no canto inferior direito. Preencha o formulario e salve.
4. **Editar um Post:** Na aba "Meus Posts", encontre seu post e toque no icone de edicao. Faca as alteracoes e salve.
5. **Gerenciar Usuarios (Admins/Secretaria):** Acesse a aba "Usuarios" para visualizar, criar ou gerenciar contas, conforme suas permissoes.
6. **Editar Perfil:** Na aba "Meu Perfil", voce pode atualizar seus dados pessoais (nome, email) e alterar sua senha.

## Regras de Permissao (RBAC) - backend

- ADMIN:
  - Posts: pode criar; pode editar apenas seus proprios posts; pode deletar qualquer post.
  - Usuarios: pode criar, editar e deletar qualquer usuario.
  - Dados pessoais: pode editar seus proprios dados, exceto username.
- SECRETARY:
  - Posts: pode criar; pode editar e deletar apenas seus proprios posts.
  - Usuarios: pode criar usuarios do tipo STUDENT e TEACHER.
  - Usuarios visiveis: apenas STUDENT e TEACHER.
  - Nao pode editar ou deletar usuarios.
  - Dados pessoais: pode editar seus proprios dados, exceto username.
- TEACHER:
  - Posts: pode criar; pode editar e deletar apenas seus proprios posts.
  - Dados pessoais: pode editar seus proprios dados, exceto username.
- STUDENT:
  - Posts: apenas leitura.
  - Dados pessoais: pode editar seus proprios dados, exceto username.

Observacao: o username e imutavel para todos os perfis.

## Tech Stack

- React Native + Expo
- Expo Router
- TypeScript
- NativeWind (Tailwind CSS)
- React Query (TanStack Query)
- Axios
- React Hook Form + Zod
- Expo SecureStore (sessao/token)
- AsyncStorage (preferencias, como tema)

## Estrutura do Projeto

Documentacao complementar (arquitetura, desafios e diagramas):

- [Arquitetura, Desafios e Diagramas](docs/ARQUITETURA_E_DESAFIOS.md)

A pasta `app/` eh a raiz do roteamento (Expo Router) e esta dividida da seguinte forma:

- `app/`: rotas e layouts (Expo Router)
- `components/`: componentes de UI e dominio
- `core/`:
  - `api/`: cliente HTTP e interceptors
  - `auth/`: AuthProvider, RBAC, roles e storage de sessao
  - `services/`: integracao com API
  - `validation/`: schemas Zod
  - `constants/`: env e configuracoes
  - `types/`: tipos compartilhados
- `assets/`: imagens, icones e fontes
- `lib/`: utilitarios

## Rotas Principais

- `/` (tabs): feed de posts
- `/my-posts`: posts do usuario logado
- `/my-profile`: perfil do usuario
- `/users`: gestao de usuarios (restrito por permissao)
- `/posts/[id]`: detalhe do post
- `/posts/manage/[id]`: criacao/edicao de post
- `/users/manage/[id]`: criacao/edicao de usuario

## Setup

1. Instale dependencias:

```
npm install
```

2. Configure variaveis de ambiente:
   Crie um arquivo `.env` na raiz:

```
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

Observacoes:

- Android emulator usa `http://10.0.2.2:3000`
- iOS simulator/web usa `http://127.0.0.1:3000`
- Em dispositivo fisico, use o IP da sua maquina na rede local

3. Rode o app:

```
npm run start
```

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`

## Backend

Este app integra com a API do projeto Ponto de Aula. Certifique-se de que o backend esteja rodando e com autenticacao JWT ativa.

- Repo da API: https://github.com/RafaelVsc/ponto-de-aula-api
- URL base padrao: `http://localhost:3000` (Android emulador: `http://10.0.2.2:3000`; iOS/web: `http://127.0.0.1:3000`; device fisico: IP da maquina)
- Credenciais seed: consulte o README do backend para a lista atualizada de usuários e senhas.
