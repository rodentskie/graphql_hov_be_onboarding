variable "region" {
  default     = "ap-east-1"
  description = "AWS region"
}

variable "cluster_name" {
  default = "rod-test-eks"
}

variable "map_accounts" {
  description = "Additional AWS account numbers to add to the aws-auth configmap."
  type        = list(string)

  default = [
    "777777777777",
    "888888888888",
  ]
}

variable "map_roles" {
  description = "Additional IAM roles to add to the aws-auth configmap."
  type = list(object({
    rolearn  = string
    username = string
    groups   = list(string)
  }))

  default = [
    {
      rolearn  = "arn:aws:iam::66666666666:role/role1"
      username = "role1"
      groups   = ["system:masters"]
    },
  ]
}

variable "map_users" {
  description = "Additional IAM users to add to the aws-auth configmap."
  type = list(object({
    userarn  = string
    username = string
    groups   = list(string)
  }))

  default = [
    {
      userarn  = "arn:aws:iam::66666666666:user/user1"
      username = "user1"
      groups   = ["system:masters"]
    },
    {
      userarn  = "arn:aws:iam::66666666666:user/user2"
      username = "user2"
      groups   = ["system:masters"]
    },
  ]
}


variable "environment" {
  type    = string
  default = "test"
}


variable "disk_size" {
  type = number
}

variable "on_demand_desired_capacity" {
  type = number
}

variable "on_demand_min_capacity" {
  type = number
}

variable "on_demand_max_capacity" {
  type = number
}

variable "on_demand_instance_types" {
  type = list(string)
}

variable "spot_desired_capacity" {
  type = number
}

variable "spot_min_capacity" {
  type = number
}

variable "spot_max_capacity" {
  type = number
}

variable "spot_instance_types" {
  type = list(string)
}
