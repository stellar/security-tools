#!/bin/bash

# redirect stdout/stderr to a file and still show them on terminal 
exec &> >(tee $1/log_fuzz.txt; exit)

# exit when any command fails
set -e
# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
#echo an arror message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

rust_nightly_channel="nightly-2023-12-31"

wget https://github.com/stellar/rs-soroban-env/archive/refs/tags/$2.tar.gz

mkdir rs-soroban-env_extracted
tar -xvzf $2.tar.gz -C rs-soroban-env_extracted

soroban_dir=$(ls rs-soroban-env_extracted)

rm -r rs-soroban-env_extracted/$soroban_dir/soroban-env-host/fuzz || true

mkdir rs-soroban-env_extracted/$soroban_dir/soroban-env-host/fuzz

cp -R host_env/. rs-soroban-env_extracted/$soroban_dir/soroban-env-host/fuzz

sed -i 's/channel = "stable"/channel = "'$rust_nightly_channel'"/' rs-soroban-env_extracted/$soroban_dir/rust-toolchain.toml

if cd rs-soroban-env_extracted/$soroban_dir/soroban-env-host/fuzz && cargo fuzz run $3 ; then
    :
else
    echo "Fuzzer found a crash"
    curl -H "Content-type: application/json" -X POST -d '{"text": "Fuzzer found a crash"}' $4
    exit 1
fi
