# 图片查看器

主要用于放大图片查看细节，目前支持img标签图片和dom背景图放大。

## 示例

### 实例
使用 `class="por-img-viewer"` 类名和 `data-show="imgViewer"` 属性。背景图需要 `data-src`。

```html
<!-- img 标签 -->
<img class="por-img-viewer" src="img_url.svg" data-show="imgViewer"/>

<!-- 背景图 -->
<div class="por-img-viewer" data-src="img_url.svg" style="background: url('img_url.svg') no-repeat; ..." data-show="imgViewer"></div>
```

## API 指导

### 属性 (Attributes)

| 属性 | 描述 |
| --- | --- |
| class="por-img-viewer" | 标识为图片查看器元素 |
| data-show="imgViewer" | 触发查看器功能 |
| data-src | 背景图模式下的原图路径 |




