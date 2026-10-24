output "php_image" {
  description = "Pinned PHP image required for CVE-2026-109618 / CVE-2026-109619"
  value       = "php:${var.php_image_tag}-fpm-bookworm"
}

output "cloud_init_path" {
  description = "Generated cloud-init user-data to attach to a new VM"
  value       = local_file.cloud_init.filename
}

output "env_production_path" {
  description = "Generated .env.production (sensitive values; keep private)"
  value       = local_file.env_production.filename
  sensitive   = true
}

output "deploy_path" {
  value = var.deploy_path
}

output "ssh_deploy_enabled" {
  value = var.ssh_host != ""
}

output "next_steps" {
  value = var.ssh_host != "" ? "SSH deploy ran against ${var.ssh_host}. Open ${var.app_url}." : "Paste terraform/generated/cloud-init.yaml as VM user-data (or set ssh_host + ssh_private_key_path and re-apply)."
}
