set -e
[ -e ".env" ] && {
  source .env
  echo "Sourced from .env"
}
STAGE=${1:-$STAGE}

cdk destroy --force \
    -c stage=${STAGE} \
    --all
