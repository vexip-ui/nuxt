import minimist from 'minimist'
import { logger, release, run } from '@vexip-ui/scripts'
import { rootDir } from './constant'

const args = minimist<{
  d?: boolean,
  dry?: boolean,
  p: string,
  preid?: string
}>(process.argv.slice(2))

const isDryRun = args.dry || args.d

release({
  pkgDir: rootDir,
  isDryRun,
  preId: args.preid,
  runTest: () => run('pnpm', ['test']),
  runBuild: async () => {
    await run('pnpm', ['dev:prepare'])
    await run('pnpm', ['build'])
  },
  runChangelog: () => run('pnpm', ['changelog'])
}).catch(error => {
  logger.error(error)
  process.exit(1)
})
