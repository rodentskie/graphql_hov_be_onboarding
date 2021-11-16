#! /bin/sh
set -e

# REGION="ap-east-1"
# ENVIRONMENT="test"

# aws eks --region $REGION update-kubeconfig --name rod-$ENVIRONMENT --alias rod-$ENVIRONMENT
# aws eks --region ap-east-1 update-kubeconfig --name rod-test-eks --alias rod-test-eks

kubectl apply -f ./mongo-secret.yaml
kubectl apply -f ./mongo.yaml
kubectl apply -f ./graphql-onboarding.yaml
kubectl apply -f ./site.yaml

# Create an IAM role and annotate the Kubernetes service account named aws-load-balancer-controller in the kube-system namespace for the AWS Load Balancer Controller
kubectl apply -f ./alb-ingress-irsa.yaml

# Install cert-manager to inject certificate configuration into the webhooks.
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.0.2/cert-manager.yaml

# Install the controller.
# Download the controller specification. For more information about the controller, see the documentation on GitHub.
# https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.1.2/docs/install/v2_1_2_full.yaml
kubectl apply -f ./alb-ingress.yaml

# Install Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/aws/deploy.yaml

# delete below because of https://github.com/kubernetes/ingress-nginx/issues/5968
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

