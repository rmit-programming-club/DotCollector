zip -r bundle.zip api/src
TIME=$(date +"%T")
aws s3 cp bundle.zip s3://dotcollectordev-ap-southeast-2-659023026482/bundle/lambda.zip
aws s3 cp api/template.yaml s3://dotcollectordev-ap-southeast-2-659023026482/template-$TIME.yaml
VERSION=$(aws s3api list-object-versions --bucket dotcollectordev-ap-southeast-2-659023026482 --prefix bundle/lambda.zip | node getLastVersionId.js)
aws cloudformation update-stack --template-body "$(cat api/template.yaml)" --stack-name dotcollector --parameters "ParameterKey=CodeVersion,ParameterValue=$VERSION,UsePreviousValue=false"
