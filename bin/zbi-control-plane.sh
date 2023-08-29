
# generate jwt keys
ssh-keygen -t rsa -b 4096 -m PEM -N '' -f jwtAccessToken.key
openssl rsa -in jwtAccessToken.key -pubout -outform PEM -out jwtAccessToken.key.pub

# generate jwt keys
ssh-keygen -t rsa -b 4096 -m PEM -N '' -f jwtRefreshToken.key
openssl rsa -in jwtRefreshToken.key -pubout -outform PEM -out jwtRefreshToken.key.pub

helm upgrade -i zbi-control-plane --namespace zbi-test --debug deploy/charts/zbi-control-plane --create-namespace \
            --set-file=jwtKeys.accessToken.private=./jwtAccessToken.key,jwtKeys.accessToken.public=./jwtAccessToken.key.pub,jwtKeys.refreshToken.private=./jwtRefreshToken.key,jwtKeys.refreshToken.public=./jwtRefreshToken.key.pub

rm jwt*Token*