require('source-map-support').install()

import tap from 'tap-lite-tester'
import cps_context from '../dist'

cps_context.install()

tap.start()

tap.test @ `Example with async/await and setImmediate`, async t => ::

  const s1 = Symbol('S1')
  Object.assign @ cps_context(), @: a: s1, v: 'a'

  const s2 = Symbol('S2')
  await null
  Object.assign @ cps_context(), @: b: s2

  await null
  const ctx_1 = cps_context()
  ::
    t.strictEqual @ ctx_1.a, s1
    t.strictEqual @ ctx_1.b, s2
    t.strictEqual @ ctx_1.v, 'a'

  await new Promise @ resolve => ::
    setImmediate @ () => ::
      const s3 = Symbol('S3')
      Object.assign @ cps_context(), @: c: s3

      const ctx_2 = cps_context()
      ::
        t.notStrictEqual @ ctx_2, ctx_1

        t.strictEqual @ ctx_2.a, s1
        t.strictEqual @ ctx_2.b, s2
        t.strictEqual @ ctx_2.c, s3
        t.strictEqual @ ctx_2.v, 'a'

        ctx_2.v = 'c'
        t.strictEqual @ ctx_2.v, 'c'

      resolve()

  ::
    const ctx_3 = cps_context()
    t.strictEqual @ ctx_3, ctx_1

    t.strictEqual @ ctx_3.a, s1
    t.strictEqual @ ctx_3.b, s2
    t.strictEqual @ ctx_3.c, undefined
    t.strictEqual @ ctx_3.v, 'a'

tap.finish()

