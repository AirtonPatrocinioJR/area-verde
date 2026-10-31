# Terraform — produção Área Verde

Sobe o bootstrap de produção (Docker + Compose) numa VM existente, com **PHP 8.4.27** (correção de [CVE-2026-109618](https://www.php.net/archive/2026.php#2026-10-21-5) e CVE-2026-109619).

Este módulo **não** cria a VM no provedor de cloud. Ele gera `cloud-init` e, opcionalmente, faz deploy via SSH.

## Pré-requisitos

- Terraform >= 1.5
- Docker na máquina de build (para o deploy SSH)
- `APP_KEY` Laravel (`php artisan key:generate --show`)

## Uso rápido

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# edite terraform.tfvars com segredos reais

terraform init
terraform apply
```

Sem `ssh_host`, o apply só gera:

- `generated/cloud-init.yaml` — user-data da VM
- `generated/.env.production` — env da stack

Com `ssh_host` + `ssh_private_key_path`, o apply também empacota o código, envia por SSH, valida o pin `php:8.4.27-fpm` no Dockerfile e sobe `docker compose -f docker-compose.prod.yml`.

## Stack

| Serviço  | Imagem / papel                          |
|----------|-----------------------------------------|
| app      | `php:8.4.27-fpm-bookworm` (Laravel)     |
| queue    | mesmo image, `artisan queue:work`       |
| nginx    | proxy HTTP                              |
| postgres | Postgres 16                             |

## Segurança PHP

Não use tags flutuantes (`php:8.4`, `latest`). A imagem de app é `area-verde-app:8.4.27` e o Dockerfile começa com:

```dockerfile
FROM php:8.4.27-fpm-bookworm
```
