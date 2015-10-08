#!/bin/sh

set -e

# Runs a simulated install and execution of the pylint task on bash systems
cp test/testutils.js test/integration_test/exampleProject
cp -r test/integration_test/exampleProject ../
cd ../exampleProject
npm install

# Test that the example project works
grunt pylint:exampleProject -v

# Test that virtualenvs works
virtualenv venv -p `which python`
. venv/bin/activate
python_version=`python -c "import sys; print('python%d.%d' % (sys.version_info.major, sys.version_info.minor))"`
echo "'''venv exclusive module'''" > venv/lib/$python_version/site-packages/venv_exclusive.py
grunt pylint:virtualenv -v
deactivate

# Test running with external pylint
rm -rf node_modules/grunt-pylint/tasks/lib/*
pip install pylint
grunt pylint:externalPylint nodeunit -v

# clean up
cd ../grunt-pylint
rm -rf ../exampleProject
