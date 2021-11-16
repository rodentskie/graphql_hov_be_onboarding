terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  region = var.region
}

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

data "aws_availability_zones" "available" {
}

data "aws_route53_zone" "zenithpanel_com" {
  name = "zenithpanel.com."
}

resource "aws_route53_record" "rod_test" {
  zone_id = data.aws_route53_zone.zenithpanel_com.zone_id
  name    = "rod-test"
  type    = "CNAME"
  ttl     = "300"
  records = ["k8s-default-site-7bfff341a6-1326785313.ap-east-1.elb.amazonaws.com."]
}

resource "aws_security_group" "worker_group_mgmt_one" {
  name_prefix = "worker_group_mgmt_one"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    cidr_blocks = [
      "10.0.0.0/8",
    ]
  }
}


resource "aws_security_group" "all_worker_mgmt" {
  name_prefix = "all_worker_management"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    cidr_blocks = [
      "10.0.0.0/8",
      "172.16.0.0/12",
      "192.168.0.0/16",
    ]
  }
}


module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.7.0"

  name                 = "test-vpc"
  cidr                 = "10.0.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  private_subnets      = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  public_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }
}


data "aws_eks_cluster" "eks_cluster" {
  name = module.eks.cluster_id
}


module "eks" {
  source                          = "terraform-aws-modules/eks/aws"
  cluster_name                    = var.cluster_name
  cluster_version                 = "1.21"
  subnets                         = module.vpc.private_subnets
  version                         = "17.18.0"
  cluster_create_timeout          = "1h"
  cluster_endpoint_private_access = true

  vpc_id = module.vpc.vpc_id

  worker_additional_security_group_ids = [aws_security_group.all_worker_mgmt.id]
  map_roles                            = var.map_roles
  map_users                            = var.map_users
  map_accounts                         = var.map_accounts

  tags = {
    Terraform   = "true"
    Project     = "rod-test"
    Environment = var.environment

    "k8s.io/cluster-autoscaler/rod-${var.environment}-eks" = "owned"
    "k8s.io/cluster-autoscaler/enabled"                          = "TRUE"
  }

  workers_group_defaults = {
    root_volume_type = "gp2"
  }

  node_groups_defaults = {
    ami_type  = "AL2_x86_64"
    disk_size = var.disk_size
  }

  node_groups = {
    on-demand = {
      desired_capacity = var.on_demand_desired_capacity
      min_capacity     = var.on_demand_min_capacity
      max_capacity     = var.on_demand_max_capacity

      instance_types = var.on_demand_instance_types
      capacity_type  = "ON_DEMAND"
    }

    spot = {
      desired_capacity = var.spot_desired_capacity
      min_capacity     = var.spot_min_capacity
      max_capacity     = var.spot_max_capacity

      instance_types = var.spot_instance_types
      capacity_type  = "SPOT"
    }
  }

}


provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}
