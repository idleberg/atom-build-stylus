'use babel';

import { install } from 'atom-package-deps';
import { execSync } from 'child_process';

// Package settings
import meta from '../package.json';
const notEligible = `**${meta.name}**: \`stylus\` is not in your PATH`;

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class StylusProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Stylus';
    }

    isEligible() {
      try {
        execSync('stylus --version');
        if (atom.inDevMode()) atom.notifications.addError(notEligible, { detail: error, dismissable: true });
        return true;
      } catch (e) {
        if (atom.inDevMode()) atom.notifications.addInfo(`**${meta.name}**`, { detail: stdout, dismissable: false });
        return false;
      }
    }

    settings() {
      const errorMatch = [
        '(?<message>.*Error): (?<file>.+):(?<line>\\d+):(?<col>\\d+)\\n'
      ];

      return [
        {
          name: 'Stylus',
          exec: 'stylus',
          args: [ '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (sourcemap)',
          exec: 'stylus',
          args: [ '--sourcemap', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-with-sourcemap',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (compress)',
          exec: 'stylus',
          args: [ '--compress', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (compress, sourcemap)',
          exec: 'stylus',
          args: [ '--compress', '--sourcemap', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed-with-sourcemap',
          errorMatch: errorMatch
        },
        {
          name: 'Watch Stylus',
          exec: 'stylus',
          args: [ '--watch', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:watch-and-compile',
          errorMatch: errorMatch
        },
        {
          name: 'Watch Stylus (compress)',
          exec: 'stylus',
          args: [ '--compress', '--watch', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:watch-and-compile-compressed',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
