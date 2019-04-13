#!/usr/bin/env python

import os
import subprocess
import sys

# Versions here must match what is bundled with the package (see package.json)
packages = [
    'astroid-2.2.5.tar.gz',
    'isort-4.3.17.tar.gz',
    'lazy-object-proxy-1.3.1.tar.gz',
    'mccabe-0.6.1.tar.gz',
    'pylint-2.3.1.tar.gz',
    'six-1.12.0.tar.gz',
    'typed-ast-1.3.1.tar.gz',
    'wrapt-1.11.1.tar.gz',
]

py34_packages = [
    'typing-3.6.6.tar.gz',
]


def main():
    if os.environ.get('GRUNT_PYLINT_SKIP_POSTINSTALL', 'no').lower().startswith('y'):
        return

    if sys.version_info < (3, 5, 0):
        packages.extend(py34_packages)

    install_cmd = [
        'pip',
        'install',
        '--no-index',
        '--no-deps',
        '--ignore-installed',
        '--target', '.',
    ]

    for package in packages:
        install_cmd.append('./' + package)

    try:
        subprocess.check_call(install_cmd, cwd='tasks/lib')
    except subprocess.CalledProcessError as e:
        if e.returncode != 2:
            raise e

        # Try to work around a faulty patch applied by debian to pip
        # https://github.com/pypa/pip/issues/3826
        sys.stderr.write('Installing pylint dependencies failed, retrying with --system\n')
        install_cmd.append('--system')
        subprocess.check_call(install_cmd, cwd='tasks/lib')


if __name__ == '__main__':
    main()

