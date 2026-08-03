# Design Tokens 系统文档

本文档整理了 `baseui` 的设计变量 (Design Tokens)，旨在为开发提供参考，并辅助 AI 进行样式检索与建议。

## 核心规范
- **禁止直接使用基础变量**: 以 `--por-base-` 开头的变量为底层基础变量，不建议在业务组件中直接引用。
- **优先使用语义变量**: 应优先选择具有语义含义的变量（如 `--por-color-text-primary`），这有助于保证设计的一致性。
- **关联关系**: 语义变量通常引用基础变量，文档中已标注其映射关系。

---

## 1. 颜色系统 (Colors)

### 基础调色板 (Base Palette)
*注：仅供内部引用，不建议直接用于业务代码。*

| 变量名 | 颜色值 | 说明 |
| :--- | :--- | :--- |
| `--por-base-color-transparent` | `transparent` | 透明 |
| `--por-base-color-rgb-black` | `0,0,0` | 黑色 RGB |
| `--por-base-color-rgb-white` | `255,255,255` | 白色 RGB |
| `--por-base-color-gray-0` | `#fff` | 白色 |
| `--por-base-color-gray-5` | `#fafafa` | 极浅灰 |
| `--por-base-color-gray-10` | `#f5f5f5` | 浅灰 1 |
| `--por-base-color-gray-20` | `#ebebeb` | 浅灰 2 |
| `--por-base-color-gray-30` | `#dbdbdb` | 浅灰 3 |
| `--por-base-color-gray-40` | `#c2c2c2` | 中灰 1 |
| `--por-base-color-gray-50` | `grey` | 中灰 2 |
| `--por-base-color-gray-60` | `#595959` | 深灰 1 |
| `--por-base-color-gray-70` | `#333` | 深灰 2 |
| `--por-base-color-gray-80` | `#262626` | 深灰 3 |
| `--por-base-color-gray-90` | `#191919` | 极深灰 |
| `--por-base-color-gray-100` | `#000` | 黑色 |
| `--por-base-color-red-20` | `#faa9a5` | 浅红 |
| `--por-base-color-red-40` | `#f76360` | 亮红 |
| `--por-base-color-red-50` | `#f23030` | 基础红 |
| `--por-base-color-orange-50` | `#f80` | 基础橙 |
| `--por-base-color-lemon-50` | `#f7d916` | 基础柠檬黄 |
| `--por-base-color-kelly-50` | `#5cb300` | 基础绿 |
| `--por-base-color-blue-50` | `#1476ff` | 基础蓝 |
| `--por-base-color-red-huawei` | `#c7000b` | 华为红 |
| `--por-base-color-disabled` | `#adb0b8` | 禁用态置灰 |
| `--por-base-color-divider-light` | `#eee` | 浅色分割线 |
| `--por-base-color-divider-normal` | `rgba(0,0,0,.078)` | 常规分割线 |
| `--por-base-color-divider-dark` | `#dfe1e6` | 深色分割线 |

### 文字颜色 (Text Colors)

| 变量名 | 默认值 / 映射 | 说明 |
| :--- | :--- | :--- |
| `--por-color-text-primary` | `var(--por-base-color-gray-90)` | 主要文字 |
| `--por-color-text-secondary` | `var(--por-base-color-gray-60)` | 次要文字 |
| `--por-color-text-weak` | `var(--por-base-color-gray-50)` | 弱提示文字 |
| `--por-color-text-disabled` | `var(--por-base-color-gray-40)` | 禁用文字 |
| `--por-color-text-white` | `var(--por-base-color-gray-0)` | 白色文字 |
| `--por-color-text-black` | `var(--por-base-color-gray-100)` | 黑色文字 |
| `--por-color-text-button` | `var(--por-base-color-blue-50)` | 按钮文字色 |
| `--por-color-text-huawei` | `var(--por-base-color-red-huawei)` | 品牌强调色文字 |
| `--por-color-text-link-default` | `var(--por-base-color-gray-90)` | 链接默认色 |
| `--por-color-text-link-active` | `var(--por-base-color-gray-60)` | 链接点击/激活色 |

### 背景颜色 (Background Colors)

| 变量名 | 默认值 / 映射 | 说明 |
| :--- | :--- | :--- |
| `--por-color-background-white` | `var(--por-base-color-gray-0)` | 白色背景 |
| `--por-color-background-black` | `var(--por-base-color-gray-100)` | 黑色背景 |
| `--por-color-background-primary` | `var(--por-base-color-gray-90)` | 主要背景色 |
| `--por-color-background-gray-1` | `var(--por-base-color-gray-5)` | 浅灰色背景 1 |
| `--por-color-background-gray-2` | `var(--por-base-color-gray-10)` | 浅灰色背景 2 |
| `--por-color-background-disabled` | `rgba(var(--por-base-color-rgb-black),0.05)` | 禁用态背景 |
| `--por-color-background-transparent` | `var(--por-base-color-transparent)` | 透明背景 |

### 边框颜色 (Border Colors)

| 变量名 | 默认值 / 映射 | 说明 |
| :--- | :--- | :--- |
| `--por-color-border-primary` | `var(--por-base-color-gray-90)` | 主要边框色 |
| `--por-color-border-secondary` | `var(--por-base-color-gray-60)` | 次要边框色 |
| `--por-color-border-input` | `var(--por-base-color-gray-40)` | 输入框默认边框 |
| `--por-color-border-input-active` | `var(--por-base-color-gray-90)` | 输入框激活边框 |
| `--por-color-border-disabled` | `var(--por-base-color-gray-40)` | 禁用态边框 |
| `--por-color-border-white` | `var(--por-base-color-gray-0)` | 白色边框 |

### 功能色 (Functional Colors)

| 变量名 | 默认值 / 映射 | 说明 |
| :--- | :--- | :--- |
| `--por-color-function-error` | `var(--por-base-color-red-50)` | 错误状态色 |
| `--por-color-function-warning` | `var(--por-base-color-orange-50)` | 警告状态色 |
| `--por-color-function-success` | `var(--por-base-color-kelly-50)` | 成功状态色 |
| `--por-color-function-info` | `var(--por-base-color-blue-50)` | 信息提示色 |

---

## 2. 字体与文本 (Typography)

| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `--por-base-font-family` | `-apple-system, HuaweiSans, ...` | 默认字体栈 |
| `--por-base-font-family-ja-jp` | `-apple-system, "メイリオ", ...` | 日语字体栈 |
| `--por-base-font-family-ar-mena` | `Manrope, -apple-system, ...` | 中东/阿拉伯字体栈 |
| `--por-base-font-weight-lighter` | `lighter` | 较细字重 |
| `--por-base-font-weight-normal` | `normal` | 常规字重 |
| `--por-base-font-weight-bold` | `bold` | 加粗字重 |
| `--por-base-font-weight-bolder` | `bolder` | 更粗字重 |

---

## 3. 圆角与尺寸 (Radius & Sizes)

| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `--por-radius-xs` | `0px` | 无圆角 |
| `--por-radius-s` | `2px` | 小圆角 (标签等) |
| `--por-radius-m` | `4px` | 中圆角 (按钮等) |
| `--por-radius-l` | `6px` | 大圆角 (通用组件) |
| `--por-radius-l-1` | `8px` | 大圆角 1 |
| `--por-radius-l-2` | `12px` | 大圆角 2 |
| `--por-radius-xl` | `16px` | 超大圆角 (卡片) |
| `--por-radius-xl-1` | `24px` | 超大圆角 1 |
| `--por-radius-xxl` | `32px` | 超大圆角 2 |
| `--por-radius-xxxl` | `48px` | 超大圆角 3 |
| `--por-radius-xxxxl` | `100px` | 极大圆角 |
| `--por-radius-circle` | `var(--por-base-size-percent-middle)` | 圆形 (50%) |

### 尺寸百分比 (Sizes)
| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `--por-base-size-percent-small` | `25%` | 1/4 |
| `--por-base-size-percent-middle` | `50%` | 1/2 |
| `--por-base-size-percent-large` | `75%` | 3/4 |
| `--por-base-size-percent-extra-large` | `100%` | 全宽 |

---

## 4. 阴影 (Shadows)

| 变量名 | 映射 / 值 | 说明 |
| :--- | :--- | :--- |
| `--por-shadow-card-normal` | `none` | 卡片正常阴影 |
| `--por-shadow-card-active` | `0 2px 12px rgba(0,0,0,.08)` | 卡片激活阴影 |
| `--por-shadow-tips` | `var(--por-base-box-shadow-normal)` | 提示框阴影 |
| `--por-shadow-modal` | `var(--por-base-box-shadow-dark)` | 弹窗阴影 |

---

## 5. 层级 (Z-Index)

| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `--por-base-zindex-content` | `1` | 内容层 |
| `--por-base-zindex-dropdown` | `1000` | 下拉层 |
| `--por-base-zindex-mask` | `1040` | 蒙层 |
| `--por-base-zindex-modal` | `1050` | 弹窗层 |
| `--por-base-zindex-tooltip` | `1060` | 工具提示层 |

