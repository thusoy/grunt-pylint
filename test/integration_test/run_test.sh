#!/bin/sh

# Runs a simulated install and execution of the pylint task on bash systems
cp ../testutils.js exampleProject
cd exampleProject
npm install ../../../
npm install
grunt pylint:exampleProject
virtualenv venv -p `which python`
. venv/bin/activate
python_version=`python -c "import sys; print('python%d.%d' % (sys.version_info.major, sys.version_info.minor))"`
echo "'''venv exclusive module'''" > venv/lib/$python_version/site-packages/venv_exclusive.py
grunt pylint:virtualenv
rm venv/lib/python2.7/site-packages/venv_exclusive.py
rm -rf node_modules/grunt-pylint/task/lib/pylint
pip install pylint
grunt pylint:externalPylint nodeunit

# clean up
deactivate
rm -rf node_modules reports venv
rm testutils.js
cd ..
