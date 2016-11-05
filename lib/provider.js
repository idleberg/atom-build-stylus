'use babel';

import { EventEmitter } from 'events';
import { install } from 'atom-package-deps';
import { spawnSync } from 'child_process';

// Package settings
import meta from '../package.json';

this.config = {
  customArguments: {
    title: "Custom Arguments",
    description: "Specify your preferred arguments for `stylus`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders",
    type: "string",
    "default": "{FILE_ACTIVE} --out {FILE_ACTIVE_NAME_BASE}.css",
    order: 0
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class StylusProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-stylus.customArguments', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'Stylus';
    }

    isEligible() {
      try {
        spawnSync('stylus --version');
      } catch (error) {
        if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
        return false;
      }

      return true;
    }

    settings() {
      const errorMatch = [
        '(?<message>.*Error): (?<file>.+):(?<line>\\d+):(?<col>\\d+)\\n'
      ];

      // User settings
      let customArguments = atom.config.get('build-stylus.customArguments').trim().split(" ");

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
          name: 'Stylus (user)',
          exec: 'stylus',
          args: customArguments,
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
