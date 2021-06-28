# build-stylus

[![apm](https://flat.badgen.net/apm/license/build-homebrew)](https://atom.io/packages/build-homebrew)
[![apm](https://flat.badgen.net/apm/v/build-homebrew)](https://atom.io/packages/build-homebrew)
[![apm](https://flat.badgen.net/apm/dl/build-homebrew)](https://atom.io/packages/build-homebrew)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/atom-build-homebrew)](https://circleci.com/gh/idleberg/atom-build-homebrew)
[![David](https://flat.badgen.net/david/dev/idleberg/atom-build-homebrew)](https://david-dm.org/idleberg/atom-build-homebrew?type=dev)


[Atom Build](https://atombuild.github.io/) provider for `stylus`, compiles Stylus into CSS.

![Screenshot](https://raw.githubusercontent.com/idleberg/atom-build-stylus/master/screenshot.png)

*See the linter in action*

## Installation

### apm

Install `build-stylus` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-stylus`

### Using Git

Change to your Atom packages directory:

**Windows**

```powershell
# Powershell
$ cd $Env:USERPROFILE\.atom\packages
```

```cmd
:: Command Prompt
$ cd %USERPROFILE%\.atom\packages
```

**Linux & macOS**

```bash
$ cd ~/.atom/packages/
```

Clone repository as `build-stylus`:

```bash
$ git clone https://github.com/idleberg/atom-build-stylus build-stylus
```

Inside the cloned directory, install Node dependencies:

```bash
$ yarn || npm install
```

You should now be setup to build the package:

```bash
$ yarn build || npm run build
```

## Usage

### Build

Before you can build, select an active target with your preferred build option.

Available targets:

* `Stylus [compress|sourcemap|user]`
* `Watch Stylus [compress]`

### Shortcuts

Here's a reminder of the default shortcuts you can use with this package:

**Select active target**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> or <kbd>F7</kbd>

**Build script**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> or <kbd>F9</kbd>

**Jump to error**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> or <kbd>F4</kbd>

**Toggle build panel**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd> or <kbd>F8</kbd>

## License

This work is licensed under the [The MIT License](LICENSE).
