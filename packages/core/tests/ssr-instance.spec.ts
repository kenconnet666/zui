import { describe, expect, it } from 'vitest'
import createEmotion from '@emotion/css/create-instance'
import { createIcssInstance, defaultLight } from '../src'

describe('W5.1 — createIcssInstance', () => {
  it('icss 输出走自定义 instance 的 css', () => {
    const emotion = createEmotion({ key: 'zuit' })
    const { icss } = createIcssInstance(emotion)
    const cls = icss(defaultLight, s => { s.color._primary })
    // emotion key 'zuit' → className 前缀
    expect(cls).toMatch(/^zuit-/)
  })

  it('chain factory 构造的 Chain 也用 instance.css', () => {
    const emotion = createEmotion({ key: 'foo' })
    const { chain } = createIcssInstance(emotion)
    const c = chain(defaultLight)
    c.color._primary
    expect(c.toString()).toMatch(/^foo-/)
  })

  it('ikeyframes 用 instance.keyframes', () => {
    const emotion = createEmotion({ key: 'kf' })
    const { ikeyframes } = createIcssInstance(emotion)
    const name = ikeyframes(k => {
      k.from({ opacity: 0 })
      k.to({ opacity: 1 })
    })
    expect(typeof name).toBe('string')
    expect(name.length).toBeGreaterThan(0)
  })

  it('registerAnimation / injectPreflight / registerCustomProperty 不抛错', () => {
    const emotion = createEmotion({ key: 'side' })
    const inst = createIcssInstance(emotion)
    expect(() => {
      inst.registerAnimation('fadeIn', { '0%': { opacity: 0 }, '100%': { opacity: 1 } })
      inst.injectPreflight()
      inst.registerCustomProperty('--my-x', { syntax: '<length>', inherits: false, initialValue: '0px' })
      inst.injectLayerOrder(['a', 'b'])
      inst.injectLayer('b', { '.foo': { color: 'red' } })
      inst.registerFont('Inter', [{ src: '/i.woff2', format: 'woff2', weight: 400 }])
    }).not.toThrow()
  })

  it('cx 透传 instance.cx', () => {
    const emotion = createEmotion({ key: 'cxtest' })
    const { cx } = createIcssInstance(emotion)
    expect(cx('a', false, undefined, 'b')).toBe('a b')
  })
})
