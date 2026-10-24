resource "local_file" "cloud_init" {
  filename        = "${path.module}/generated/cloud-init.yaml"
  file_permission = "0600"
  content         = local.cloud_init
}

resource "local_file" "env_production" {
  filename        = "${path.module}/generated/.env.production"
  file_permission = "0600"
  content         = local.env_file
}
