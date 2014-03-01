@echo off

:: Runs a simulated install and execution of the pylint task on windows
copy ..\testutils.js exampleProject
cd exampleProject
call npm install ..\..\..\
call npm install
call grunt pylint:exampleProject
virtualenv venv
call venv\Scripts\activate.bat
echo """venv exclusive module""" > venv\Lib\site-packages\venv_exclusive.py
call grunt pylint:virtualenv
del venv\Lib\site-packages\venv_exclusive.py
rmdir /s /q node_modules\grunt-pylint\task\lib\pylint
pip install pylint
call grunt pylint:externalPylint nodeunit

:: clean up
deactivate
rmdir /s /q node_modules reports venv
del testutils.js
cd ..
