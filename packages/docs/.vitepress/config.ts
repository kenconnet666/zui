import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'zui',
  description: 'Framework-agnostic CSS-in-JS toolkit on @emotion/css.',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '示例', link: '/examples/button' },
      { text: 'API', link: '/api/theme' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '主题与 schema', link: '/guide/theme' },
            { text: 'Chain 四态访问', link: '/guide/chain' },
          ],
        },
        {
          text: '框架集成',
          items: [
            { text: 'Vue', link: '/guide/integration-vue' },
            { text: 'React', link: '/guide/integration-react' },
          ],
        },
      ],
      '/api/': [
        { text: 'Theme', link: '/api/theme' },
        { text: 'Chain', link: '/api/chain' },
        { text: '工具函数', link: '/api/helpers' },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/kenconnet666/zui' }],
  },
})
