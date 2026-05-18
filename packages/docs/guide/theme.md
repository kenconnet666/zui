# 主题与 schema

```ts
import { Theme, type ThemeSchema } from '@kenconnet666/zui-core'

interface MySchema extends ThemeSchema {
  color: { primary: string; danger: string; brand: string }
  spacing: { xs: string; sm: string; md: string; lg: string }
}

class MyTheme extends Theme<MySchema> {
  constructor() {
    super({
      color: { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    })
  }
}

const myTheme = new MyTheme()
myTheme.color.brand   // ✅ '#7c3aed'，IDE 补全
```
