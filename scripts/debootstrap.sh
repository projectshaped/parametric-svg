#! /bin/bash -e

project_root="$(dirname "$(readlink -f $0)")"/..
cd "$project_root"

echo; echo 'Unlinking our packages…'
rm -f node_modules/@parametric-svg
echo '…done.'

echo; echo 'Unlinking node_modules folders…'
for package in packages/*/; do
  rm -f $package/node_modules
done
echo '…done.'
