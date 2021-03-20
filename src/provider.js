import { configSchema, getConfig } from './config';
import { EventEmitter } from 'events';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import { spawnSync } from 'child_process';
import { which } from './util';
import meta from '../package.json';

export { configSchema as config };

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
      if (getConfig('alwaysEligible') === true) {
        return true;
      }

      const cmd = spawnSync(which(), ['stylus']);
      if (!cmd.stdout.toString()) {
        return false;
      }

      return true;
    }

    settings() {
      const errorMatch = [
        '(?<message>.*Error): (?<file>.+):(?<line>\\d+):(?<col>\\d+)\\n'
      ];

      // User settings
      const customArguments = getConfig('customArguments').trim().split(' ');

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

// This package depends on build, make sure it's installed
export function activate() {
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies(meta.name);
  }
}
