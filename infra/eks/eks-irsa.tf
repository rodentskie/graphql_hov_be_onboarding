resource "aws_iam_openid_connect_provider" "oidc_provider" {
  url             = data.aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da2b0ab7280"]
  client_id_list  = ["sts.amazonaws.com"]
}

# EBS CSI Service Role

data "aws_iam_policy_document" "iam_policy_document_trust_ebs_csi" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.oidc_provider.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(data.aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
    }
  }
}

resource "aws_iam_role" "iam_role_ebs_csi" {
  name = "rod-ebs-csi-role-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.iam_policy_document_trust_ebs_csi.json
}


# Auto Scaling Group Service Role

data "aws_iam_policy_document" "iam_policy_document_trust_asg" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.oidc_provider.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(data.aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:cluster-autoscaler"]
    }
  }
}

resource "aws_iam_role" "iam_role_asg" {
  name = "rod-asg-role-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.iam_policy_document_trust_asg.json
}

# ALB Ingress Service Role

data "aws_iam_policy_document" "iam_policy_document_trust_alb" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.oidc_provider.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(data.aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
    }
  }
}

resource "aws_iam_role" "iam_role_alb" {
  name = "rod-alb-ingress-role-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.iam_policy_document_trust_alb.json
}