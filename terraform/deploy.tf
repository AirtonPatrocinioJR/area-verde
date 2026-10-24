resource "null_resource" "deploy" {
  count = var.ssh_host != "" ? 1 : 0

  triggers = {
    dockerfile = filesha256("${local.project_root}/docker/php/Dockerfile")
    compose    = filesha256("${local.project_root}/docker-compose.prod.yml")
    nginx_conf = filesha256("${local.project_root}/docker/nginx/default.conf")
    env_hash   = sha256(local.env_file)
    php_tag    = var.php_image_tag
  }

  connection {
    type        = "ssh"
    host        = var.ssh_host
    user        = var.ssh_user
    port        = var.ssh_port
    private_key = file(var.ssh_private_key_path)
  }

  provisioner "local-exec" {
    working_dir = local.project_root
    interpreter = ["bash", "-c"]
    command     = <<-EOT
      set -euo pipefail
      mkdir -p terraform/generated
      tar \
        --exclude='./node_modules' \
        --exclude='./vendor' \
        --exclude='./.git' \
        --exclude='./terraform/generated' \
        --exclude='./public/hot' \
        --exclude='./database/*.sqlite' \
        --exclude='./.env' \
        -czf terraform/generated/app.tgz .
    EOT
  }

  provisioner "remote-exec" {
    inline = [
      "sudo mkdir -p ${var.deploy_path}",
      "sudo chown ${var.ssh_user}:${var.ssh_user} ${var.deploy_path}",
      "if ! command -v docker >/dev/null 2>&1; then curl -fsSL https://get.docker.com | sudo sh; sudo systemctl enable --now docker; fi",
      "id -nG ${var.ssh_user} | grep -qw docker || sudo usermod -aG docker ${var.ssh_user}",
    ]
  }

  provisioner "file" {
    source      = "${path.module}/generated/app.tgz"
    destination = "/tmp/area-verde.tgz"
  }

  provisioner "file" {
    source      = "${path.module}/generated/.env.production"
    destination = "/tmp/area-verde.env"
  }

  provisioner "remote-exec" {
    inline = [
      "tar -xzf /tmp/area-verde.tgz -C ${var.deploy_path}",
      "install -m 600 /tmp/area-verde.env ${var.deploy_path}/.env.production",
      "rm -f /tmp/area-verde.tgz /tmp/area-verde.env",
      "grep -q 'php:${var.php_image_tag}-fpm' ${var.deploy_path}/docker/php/Dockerfile",
      "cd ${var.deploy_path} && docker compose -f docker-compose.prod.yml --env-file .env.production build",
      "cd ${var.deploy_path} && docker compose -f docker-compose.prod.yml --env-file .env.production up -d",
      "docker image inspect area-verde-app:${var.php_image_tag} >/dev/null",
    ]
  }

  depends_on = [
    local_file.env_production,
  ]
}
