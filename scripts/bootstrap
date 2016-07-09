#! /bin/bash -e

project_root="$(dirname "$(readlink -f $0)")"/..
cd "$project_root"

echo; echo 'Linking our packages…'
ln -sf ../packages node_modules/@parametric-svg
echo '…done.'

echo; echo 'Linking node_modules folders…'
for package in packages/*/; do
  ln -sf ../../node_modules $package/node_modules
done
echo '…done.'
