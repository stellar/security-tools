#!/bin/bash

# redirect stdout/stderr to a file and still show them on terminal 
exec &> >(tee $RESULT_DIR/log_fuzz.txt; exit)

# exit when any command fails
set -e
# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
#echo an arror message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

echo "Starting fuzzing script"

#Check that both commit hash and branch parameters are specified if running against a fork
if [[ $BASE_SOROBAN_REPO == "https://github.com/stellar/rs-soroban-env.git" ]]; then
	:
else
	if [[ $COMMIT_HASH == "" ]] || [[ $BRANCH == "" ]]; then
		echo "Both commit hash and branch parameters are required if you want to fuzz against a fork"
		exit 1
	else
		:
	fi
fi


#Use commit hash from specified branch if provided, otherwise use provided/latest version
if [[ $COMMIT_HASH == "" ]] && [[ $BRANCH == "" ]]; then
	if [[ $VERSION == "" ]] ; then
		# Get latest version to fuzz on
		echo "Getting latest version to fuzz on"
		VERSION=$(curl -sI https://github.com/stellar/rs-soroban-env/releases/latest | awk -F '/' '/^location/ {print  substr($NF, 1, length($NF)-1)}')
	else
		echo "Version is supplied through pipeline config"
	fi
	echo "Using version $VERSION to fuzz on"

	wget https://github.com/stellar/rs-soroban-env/archive/refs/tags/$VERSION.tar.gz

	mkdir rs-soroban-env_extracted
	tar -xvzf $VERSION.tar.gz -C rs-soroban-env_extracted
else
	if [[ $COMMIT_HASH == "" ]] || [[ $BRANCH == "" ]]; then
		echo "Both commit hash and branch parameters are required if you want to fuzz against a specific commit in a branch"
		exit 1
	else
		echo "Using commit hash $COMMIT_HASH from branch $BRANCH and repo $BASE_SOROBAN_REPO"
		git clone -b $BRANCH $BASE_SOROBAN_REPO
		cd rs-soroban-env && git checkout $COMMIT_HASH && cd ..
	fi
fi

if [ -d "rs-soroban-env_extracted" ]; then
  soroban_dir=$(ls rs-soroban-env_extracted)
  dir_path=rs-soroban-env_extracted/$soroban_dir
 else
 	dir_path=rs-soroban-env
fi

rm -r $dir_path/soroban-env-host/fuzz || true

mkdir $dir_path/soroban-env-host/fuzz

cp -R /security/. $dir_path/soroban-env-host/fuzz

sed -i 's/channel = "stable"/channel = "'$RUST_NIGHTLY_CHANNEL'"/' $dir_path/rust-toolchain.toml

if cd $dir_path/soroban-env-host/fuzz && cargo fuzz run $FUZZ_SCRIPT ; then
    :
else
    echo "Fuzzer found a crash"
    curl -H "Content-type: application/json" -X POST -d '{"text": "Fuzzer found a crash"}' $SLACK_WEBHOOK_URL
    exit 1
fi