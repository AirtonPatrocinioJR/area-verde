# Área Verde

Carteira monetária em recicláveis. A moeda do sistema é a **Semente**.

Clientes doam recicláveis, acumulam Semente e resgatam brindes. Operadores gerenciam cadastros e registram créditos e débitos.

## Stack

- Laravel 12
- Inertia.js + React + Vite
- Tailwind CSS 4
- SQLite (padrão local)

## Pré-requisitos (Windows)

- PHP 8.2+ com extensões: `pdo_sqlite`, `sqlite3`, `mbstring`, `fileinfo`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`
- [Composer](https://getcomposer.org/)
- Node.js 20+ e npm

Verifique no PowerShell ou Git Bash:

```bash
php -v
composer -V
node -v
npm -v
```

## Instalação

No diretório do projeto:

```bash
composer install
copy .env.example .env
php artisan key:generate
```

Crie o arquivo SQLite (Git Bash / PowerShell):

```bash
# Git Bash
touch database/database.sqlite

# PowerShell
New-Item -ItemType File -Path database\database.sqlite -Force
```

Confirme no `.env`:

```env
DB_CONNECTION=sqlite
# DB_DATABASE pode ficar comentado; o Laravel usa database/database.sqlite
```

Em seguida:

```bash
php artisan migrate --seed
npm install
npm run build
php artisan serve
```

Abra [http://localhost:8000](http://localhost:8000).

Para desenvolvimento com hot reload, em outro terminal:

```bash
npm run dev
```

## Credenciais (seed)

| Papel    | Acesso                                      |
|----------|---------------------------------------------|
| Operador | e-mail `operador@areaverde.local` / senha `senha123` |
| Cliente  | telefone `11987654321` (Maria Exemplo)      |

- Login do operador: [http://localhost:8000/admin/login](http://localhost:8000/admin/login)
- Cadastro público de cliente: [http://localhost:8000/cadastro](http://localhost:8000/cadastro)
- Login do cliente: [http://localhost:8000/entrar](http://localhost:8000/entrar)

## Fluxo resumido

1. Cliente cria carteira em `/cadastro` (nome + telefone).
2. Operador cadastra recicláveis e brindes.
3. Operador busca o cliente em **Admin → Clientes** e registra:
   - **Crédito:** doação de reciclável → credita Semente
   - **Débito:** resgate de brinde → debita Semente e baixa estoque
4. Cliente vê saldo e extrato em `/carteira`.

## Usar MySQL (opcional)

No `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=area_verde
DB_USERNAME=root
DB_PASSWORD=
```

Crie o banco no MySQL e rode:

```bash
php artisan migrate --seed
```

## Testes

```bash
php artisan test
```

## Limitação conhecida

O login do cliente é feito apenas pelo telefone (conforme escopo atual). Quem souber o número pode acessar a carteira. Em versões futuras, recomenda-se PIN ou senha.

## Fora de escopo (por enquanto)

- PIX / pagamentos externos
- App mobile nativo
- OAuth, 2FA e auth avançada
