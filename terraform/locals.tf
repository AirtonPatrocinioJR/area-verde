locals {
  env_file = <<-EOT
    APP_NAME=${var.app_name}
    APP_ENV=production
    APP_KEY=${var.app_key}
    APP_DEBUG=false
    APP_URL=${var.app_url}
    APP_LOCALE=pt_BR
    APP_FALLBACK_LOCALE=pt_BR
    LOG_LEVEL=warning
    DB_CONNECTION=pgsql
    DB_DATABASE=${var.db_database}
    DB_USERNAME=${var.db_username}
    DB_PASSWORD=${var.db_password}
    SESSION_DRIVER=database
    BROADCAST_CONNECTION=reverb
    QUEUE_CONNECTION=database
    CACHE_STORE=database
    FILESYSTEM_DISK=local
    REVERB_APP_ID=${var.reverb_app_id}
    REVERB_APP_KEY=${var.reverb_app_key}
    REVERB_APP_SECRET=${var.reverb_app_secret}
    REVERB_HOST=${var.reverb_host}
    REVERB_PORT=${var.reverb_port}
    REVERB_SCHEME=${var.reverb_scheme}
    HTTP_PORT=${var.http_port}
  EOT

  cloud_init = templatefile("${path.module}/templates/cloud-init.yaml.tftpl", {
    deploy_path   = var.deploy_path
    git_repo      = var.git_repo
    git_ref       = var.git_ref
    php_image_tag = var.php_image_tag
    env_file_b64  = base64encode(local.env_file)
  })

  project_root = abspath("${path.module}/..")
}
