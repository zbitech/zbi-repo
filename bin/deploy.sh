
# install operator
helm install community-operator --namespace mongodb --dry-run --debug mongodb/community-operator --create-namespace --set operator.watchNamespace='*'

# generate jwt keys
ssh-keygen -t rsa -b 4096 -m PEM -f accessToken.key
openssl rsa -in accessToken.key -pubout -outform PEM -out accessToken.key.pub

