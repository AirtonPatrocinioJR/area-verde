variable "app_name" {
  type        = string
  description = "Application display name"
  default     = "Área Verde"
}

variable "app_url" {
  type        = string
  description = "Public application URL (https://...)"
}

variable "app_key" {
  type        = string
  description = "Laravel APP_KEY (base64:...)"
  sensitive   = true
}

variable "db_database" {
  type        = string
  default     = "areaverde"
}

variable "db_username" {
  type        = string
  default     = "areaverde"
}

variable "db_password" {
  type        = string
  sensitive   = true
}

variable "http_port" {
  type        = string
  default     = "80"
}

variable "deploy_path" {
  type        = string
  description = "Absolute path on the VM where the app will live"
  default     = "/opt/area-verde"
}

variable "git_repo" {
  type        = string
  description = "Optional Git URL for cloud-init to clone before first compose up"
  default     = ""
}

variable "git_ref" {
  type        = string
  description = "Git branch or tag to checkout when git_repo is set"
  default     = "main"
}

variable "ssh_host" {
  type        = string
  description = "When set, Terraform deploys over SSH to this host"
  default     = ""
}

variable "ssh_user" {
  type        = string
  default     = "ubuntu"
}

variable "ssh_private_key_path" {
  type        = string
  description = "Path to SSH private key for deploy"
  default     = ""
}

variable "ssh_port" {
  type        = number
  default     = 22
}

# PHP patch level required for CVE-2026-109618 / CVE-2026-109619
variable "php_image_tag" {
  type        = string
  description = "Pinned PHP FPM image tag used in docker/php/Dockerfile"
  default     = "8.4.27"
}
