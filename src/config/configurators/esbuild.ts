/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import deepMerge from 'deepmerge'
import { BuildOptions } from 'esbuild'
import nodeModule from 'module'
import path from 'path'

import { Target, TypeConfig } from '../enums'
import { ItemConfig } from '../types'
import { isMain } from '../utils'
import { Configurator } from './base'

export class EsbuildConfigurator extends Configurator<TypeConfig.Esbuild> {
  public type = TypeConfig.Esbuild

  constructor(private config: ItemConfig) {
    super()
  }

  load(partial: Partial<BuildOptions>, userConfig: BuildOptions, target: Target): BuildOptions {
    const additional: Partial<BuildOptions> = {}
    const out = path.resolve(process.cwd(), this.config.output, isMain(target) ? 'main.js' : 'index.js')

    if (userConfig.entryPoints?.length ?? 1 > 1) {
      additional.outdir = path.dirname(out)
    } else {
      additional.outfile = out
    }

    return deepMerge(
      deepMerge(
        partial,
        { external: [...(partial.external ?? []), 'electron', ...nodeModule.builtinModules] },
        { clone: false },
      ),
      additional,
      { clone: false },
    )
  }
}
