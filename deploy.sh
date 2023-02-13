set -e
source .env
[ -e ".env" ] && {
  source .env
  echo "Sourced from .env"
}
STAGE=${1:-$STAGE}

cdk synthesize --require-approval never \
    -c stage=${STAGE} \

cdk deploy -O aws_config.json \
    -c stage=${STAGE} \
    --all