#!/usr/bin/env python

import subprocess
import sys

# Versions here must match what is bundled with the package (see package.json)
packages = [
    'astroid-1.6.6.tar.gz',
    'backports.functools_lru_cache-1.5.tar.gz',
    'configparser-3.7.4.tar.gz',
    'isort-4.3.17.tar.gz',
    'lazy-object-proxy-1.3.1.tar.gz',
    'mccabe-0.6.1.tar.gz',
    'pylint-1.9.4.tar.gz',
    'singledispatch-3.4.0.3.tar.gz',
    'six-1.12.0.tar.gz',
    'wrapt-1.11.1.tar.gz',
]

py3_packages = [
    'enum34-1.1.6.tar.gz',
    'futures-3.2.0.tar.gz',
]


def main():
    if sys.version_info < (3, 0, 0):
        packages.extend(py3_packages)

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

    subprocess.check_call(install_cmd, cwd='tasks/lib')


if __name__ == '__main__':
    main()

