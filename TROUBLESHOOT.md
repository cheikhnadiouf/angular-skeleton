TROUBLESHOOTS
===

# Table of Contents

- [MODULE ERRORS: CJS module vs ES modules,  REQUIRE vs IMPORT, CommonJS vs EcmaScript](#module-errors-cjs-module-vs-es-modules--require-vs-import-commonjs-vs-ecmascript)
- [When i refresh a remote page i get error 404 or page not found](#when-i-refresh-a-remote-page-i-get-error-404-or-page-not-found)
- [Ts-node Tsconfig.json extends not working](#ts-node-tsconfigjson-extends-not-working)
- [NPM last package versions](#npm-last-package-versions)
- [RXjs Debugger tool on chrome browser](#rxjs-debugger-tool-on-chrome-browser)
- [Env-cmd issues: env variables are undefined](#env-cmd-issues-env-variables-are-undefined)
- [Jest setup](#Jest-setup)
- [Jest conflict with Cypress](#Jest-conflict-with-cypress)
- [NGRX Signal setup](#ngrx-signal-setup)

# MODULE ERRORS: CJS module vs ES modules,  REQUIRE vs IMPORT, CommonJS vs EcmaScript

`Uncaught Error: Dynamic require of "..." is not supported` when module is CJS  Vs `Error: "Cannot use import statement outside a module"` when module is ES. 


## Use Case Examples of Node.js with node-fetch v3

This Problem seems to occur more frequently since more packages are switching over to be distributed as ES module.

- **Summary:**

  - ES Modules can import CommonJS modules
  - CommonJS modules cannot import ES Modules synchronously
  - Some framework like NestJS does currently no support to compile to ESM.
  - CJS modules don't need to be converted to ESM, as they can be imported into ESM using the import ... from ... syntax without any modifications to the CJS module.
  - When using TypeScript, you may be writing import in your code, but it's getting compiled to require() behind the scenes.
  - However, it's advisable to write new modules using ECMAScript Module syntax, as it is the standard for both web and server-side applications and enables seamless use of the same code on both sides the browser/client-side and node/server-side.

1. `node-fetch v3` recently stopped support for the require way of importing it in favor of ES Modules. You'll need to use ESM imports now, at the top of your file, like:
`import fetch from "node-fetch";`

2. The node-fetch latest version doesn't use the require() syntax to import the package. You need to go to your `package.json` and type
```json
 { 
   "type": "module",
 }
```
to use the import syntax and import node-fetch, **but then you can't use require for any other packages**. **You need to work with import statement only**.
Or you can use other packages, such as Got or Axios, which can be imported by the require() syntax.
Doesn't work with require(), you have to use import. "This package is native ESM and no longer provides a CommonJS export. If your project uses CommonJS, you'll have to convert to ESM (Ecmascript module) or use the dynamic import() function."

See more details here: https://stackoverflow.com/questions/69081410/error-err-require-esm-require-of-es-module-not-supported/69089164#69089164


## Solutions

1. **Your package is written using CommonJS (CJS) module loading**
This means your package uses require() to load dependencies. For this kind of package no special work is needed to support loading the package in both ES and CJS modules. ES modules are able to load CJS modules via the import statement, with the minor caveat that **only default-import syntax is supported**. And CJS modules are able to load other CJS modules via the require() function. So both ES modules and CJS modules are able to load CJS modules.


2. **Your package is written using ES module loading**
This means your package uses import to load dependencies. But don't be fooled - sometimes, especially when using TypeScript, you may be writing import in your code, but it's getting compiled to require() behind the scenes.
Unfortunately, CommonJS modules do not support loading ES modules except (in Node.js) by using the import() function (which is a bit painful and not a great solution).
In order to support CommonJS in this case, your best bet is to transpile your package into a CommonJS module, and ship both CommonJS and ESM versions of your package.
I do this in a number of my own packages mostly by using Rollup, which makes it relatively easy.
The basic concept is this:

Write your package as an ES module.
Install rollup: npm i -D rollup
Run npx rollup index.js --file index.cjs --format cjs to convert your code into a CJS module.
Export both from your package.json:
```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {
    "import": "./index.js",
    "require": "./index.cjs"
  }
}
```
This way, the CJS module loader knows to load your index.cjs file, while the ESM loader knows to load your index.js file, and both are happy.

Source: https://stackoverflow.com/questions/74937600/how-to-support-es-modules-and-commonjs-modules-at-the-same-time




3. **Support for require()**
If you want to support `require()` for your package, you must provide a CommonJS module.
`require() `can, by default, only be used in CommonJS Modules. The built in method to import ECMAScript modules into CommonJS is using `import(pathToFile).then(module => { }).`

Here's a functioning example that demonstrates when and how to utilize require() or import(). There are some small differences how import() of a CommonJS module works compared to a ECMAScript Module. Especially that only the default property on the module object is available, when import() is used on a CommonJS file that exported something with module.exports.

index.js which imports different module types (from the demo above):
(In case the stackblitz demo will be deleted:)

// executed as CommonJS module
console.time('');
import('./lib/example.cjs').then(({ default: example }) => {
  console.timeLog('', 'import cjs', example() == 'Foo'); // true
});
import('./lib/index.mjs').then(({ example }) => {
  console.timeLog('', 'import mjs', example() == 'Foo'); // true
});
try {
  const example = require('./lib/example.cjs');
  console.timeLog('', 'require cjs', example() == 'Foo'); // true
} catch (e) {
  console.timeLog('', 'require cjs', '\n' + e.message);
}
try {
  const example = require('./lib/index.mjs');
  console.timeLog('', 'require mjs', example() == 'Foo');
} catch (e) {
  console.timeLog('', 'require mjs', '\n' + e.message); // Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/lib/index.mjs not supported.
}
lib/example.cjs

module.exports = function example() {
  return 'Foo';
};

lib/index.mjs

import example from './example.cjs';
export { example };
export default example;

4. **Conditional Export for Packages**

A conditional export can be supplied for packages to support require(), for example in a case where the CommonJS require() is no longer supported by your package. Refer to this link for more information.

The "exports" field allows defining the entry points of a package when imported by name loaded either via a node_modules lookup or a self-reference to its own name. It is supported in Node.js 12+ as an alternative to the "main" that can support defining subpath exports and conditional exports while encapsulating internal unexported modules.

package.json (example from the nodejs docs)

{
  "exports": {
    "import": "./index-import.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
If so, you have to provide two scripts: one for the CommonJS ("require": "filename") and one for the ECMAScript module ("import": "filename").

While index-require.js must provide the script via exports = ... or module.exports = ..., index-import.js must provide the script with export default.

5. **Keyword CommonJS Modules**

module.exports is used to define the values that a module exports and makes available for other modules to require. It can be set to any value, including an object, function, or a simple data type like a string or number.
exports, module
If you use them inside an ECMAScript module you'll get an undefined Error.
require()
require() inside ECMAScript modules is possible, but you have to use a workaround as mentioned in this answer or take a look at the docs for module.createRequire(fileName):

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const siblingModule = require('./sibling-module');
If you call require() from within a CommonJS on an ECMAScript module, it throws a not supported Error:

Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/script.mjs not supported.
With a more detailed error message depending on the situation:

Instead change the require of script.mjs in /path/to/app.js to a dynamic import() which is available in all CommonJS modules.

Or:

/path/to/script.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules.

Instead rename /path/to/script.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in /path/to/package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).

6. **Keyword ECMAScript Moduls (ESM)**

export default is used to export a single value as the default export of a module. This allows for a more concise way to import values, as the import statement can omit the curly braces when importing the default export.
Named exports, on the other hand, allow multiple values to be exported from a module. Named exports use the export keyword followed by an identifier and a value. (export const foo = "bar")
import ... from ...
It can handle CommonJS files and interprets them as if you would've used require().

Example based on express:

import express, { Route, Router } from 'express'; // EJS
// is similar to:
var express = require("express"), { Route, Router } = express; // CJS
Both CommonJS and ECMAScript modules support the import() function, but the returned object can have more properties on ESM files.


## Case When the framework is only CJS module. example with Nest.js

Source: https://stackoverflow.com/questions/74830166/unable-to-import-esm-module-in-nestjs


### Import package asynchronously using the dynamic import() function

The instruction to use import() for ES modules in CommonJS can be found everywhere. But when using typescript the additional hint is missing how to prevent the compiler to transform the import() call to a require(). I found two options for this:

set moduleResolution to nodenext or node16 in your tsconfig.json (Variant 1)
use the eval workaround - this is based on the section "Solution 2: Workaround using eval" from answer https://stackoverflow.com/a/70546326/13839825 (Variant 2 & 3)
Variant 1: await import() whenever needed
This solution is often suggested on the official NestJS Discord

add "moduleResolution": "nodenext" or "moduleResolution": "node16" to your tsconfig.json
use an await import() call when needed
simple and straight forward
package is not listed on top with other imports
you cannot import/use types from the imported ES module (at least I found no possibility so far)
only works in async context
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const random = (await import('random')).default;
    return 'Hello World! ' + random.int(1, 10);
  }
}
Variant 2: Helper Function
Note: Importing a type from a ES module will not result in an require call, since it's only used by the typescript compiler and not the runtime environment.

a bit messy because package is always hidden behind an extra function call
only works in async context
you can import/use types
import { Injectable } from '@nestjs/common';
import { type Random } from 'random';

async function getRandom(): Promise<Random> {
  const module = await (eval(`import('random')`) as Promise<any>);
  return module.default;
}

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World! ' + (await getRandom()).int(1, 10);
  }
}

Variant 3: Import and save to local variable
no extra function call needed
imported module can be undefined at runtime (unlikely but still bad practice)
you can import/use types
import { Injectable } from '@nestjs/common';
import { type Random } from 'random';

let random: Random;
eval(`import('random')`).then((module) => {
  random = module.default;
});


@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World! ' + random.int(1, 10);
  }
}

### Convert your NestJS project to ES modules (not recommended)

Although not supported, it seems possible to setup NestJS to compile to ESM. This Guide has good instructions how to do this for any typescript project.

I tested it with NestJS and found these steps sufficient:

add "type": "module" to your package.json
change module to NodeNextin your compilerOptions in tsconfig.json
add the .js extension to all of your relative imports
Now the import should work as expected.

import { Injectable } from '@nestjs/common';
import random from 'random';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World! ' + random.int(1, 10);
  }
}
What did not work so far were the unit tests with jest. I got other import errors there and I bet there are more problems down the road. I would avoid this approach and wait until NestJS officially supports ES modules.


# When i refresh a remote page i get error 404 or page not found

Edit host `.htaccess` or NGINX default.conf file to redirect to SPA index.html

Source: https://forum.ionicframework.com/t/when-i-refresh-a-page-i-get-error-404/223605/2


# Ts-node Tsconfig.json extends not working

I solved this by modifying my tsconfig as per the docs
```ts
{
  "compilerOptions": {
     // stuff
  }
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS",
      "target": "ESNext",
      "esModuleInterop": true,
      "moduleResolution": "node",
      "verbatimModuleSyntax": false
    }
  },
}
```

Use this command line to check which tsconfig file is used and its details:

`npx tsc --showConfig`

# NPM last package versions
It looks like npm-check-updates is the only way to make this happen now.

```sh
npm i -g npm-check-updates
ncu -u
npm install
```

Or using npx (so you don't have to install a global package):

```sh
npx npm-check-updates -u
npm install 
```

- if dependency issues:
remove package-lock and node_modules folder then type
npm cache clean --force

**On npm <3.11:**
---

Simply change every dependency's version to *, then run `npm update --save`. (Note: broken in recent (3.11) versions of npm).

**Alert note:**
---
If conflict dependency versions
Fix the upstream dependency conflict, or retry this command with `--force` or `--legacy-peer-deps` to accept an incorrect (and potentially broken) dependency resolution.

```sh
npm update --save --legacy-peer-deps 
```

Before:
```json
  "dependencies": {
    "express": "*",
    "mongodb": "*",
    "underscore": "*",
    "rjs": "*",
    "jade": "*",
    "async": "*"
  }
```

After:

```json
  "dependencies": {
    "express": "~3.2.0",
    "mongodb": "~1.2.14",
    "underscore": "~1.4.4",
    "rjs": "~2.10.0",
    "jade": "~0.29.0",
    "async": "~0.2.7"
  }
```


# RXjs Debugger tool on chrome browser

https://github.com/ksz-ksz/rxjs-insights/blob/master/docs/instrumentation/setup/angular.md

```sh
npm install --save-dev @rxjs-insights/rxjs7 --legacy-peer-deps

npm install --save-dev @rxjs-insights/plugin-webpack5  --legacy-peer-deps

npm install --save-dev @angular-builders/custom-webpack@16  --legacy-peer-deps

npm install --save-dev @rxjs-insights/devtools --legacy-peer-deps
```


# Env-cmd issues: env variables are undefined

See https://www.digitalocean.com/community/tutorials/nodejs-take-command-with-env-cmd

+ install dotenv  and use in ts files:
`import 'dotenv/config';`

# Jest setup


- Error: Schema validation failed with the following errors:
  Data path "/inlineStyleLanguage" must be array.
- Error: Schema validation failed with the following errors:
  Data path "/assets/0" must be string.

- Solution: 
Make sure to update the "test" entry in your angular.json file to reflect the following 
(note that we have turned assets into an array of strings):

```json
"test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "inlineStyleLanguage": ["scss"],
            "assets": [
              "public/favicon.ico", "public/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          }
        }
```

# Jest conflict with Cypress

Cypress causing type errors in jest assertions (like TobeTrupohy())

If you are using Jest and Cypress types in the same project, they might conflict because both test runners use globals like expect. This project shows how to isolate Cypress TypeScript definitions from Jest TS definitions in the same project.


- Use this as a workaround:
`import { expect } from '@jest/globals';`

- Or follow the full code example and description
https://github.com/cypress-io/cypress-and-jest-typescript-example

- or follow the official tutorial:
https://docs.cypress.io/guides/tooling/typescript-support#Configure-tsconfigjson

- Do not add anything related to cypress in your root tsconfig
- Create new tsconfig in cypress folder as shown in the tutorial (copy-paste)


# NGRX Signal setup

ERESOLVE unable to resolve dependency tree
# We're waiting to release @ngrx/signals@18.0.0 
# Currently, you can use release candidate with Angular 18 apps
`ng add @ngrx/signals@next`
