# 卡片

提供各种样式的卡片

## 示例

### 实例
使用下面列出的类可以创建不同尺寸的卡片。中尺寸卡片`.por-card-m`没有华为线。

```html
<div class="por-row">
    <div class="por-col-6">
        <div class="por-card por-card-m">
            <div class="por-card-content">
                <h3 class="por-text-title-t3">卡片标题</h3>
                <div class="por-text-body-t1">
                    文本正文内容...
                </div>
            </div>
        </div>
    </div>
    <div class="por-col-6">
        <div class="por-card por-card-l">
            <!-- ... -->
        </div>
    </div>
    <div class="por-col-6">
        <div class="por-card por-card-xl">
            <!-- ... -->
        </div>
    </div>
</div>
```

### 卡片指针规则
可跳转的卡片样式。

```html
<a href="#" class="por-card por-card-l">
    <div class="por-card-content">
        <h3 class="por-text-title-t3">可跳转，不带按钮卡片</h3>
        <div class="por-text-body-t1">
            文本正文内容...
        </div>
    </div>
</a>
```

### 其他类型卡片
带图标、左对齐、面板卡片、带副标题、带图片等。

```html
<div class="por-card por-card-l">
    <div class="por-card-icon">
        <span class="icons-product-md ecs"></span>
    </div>
    <div class="por-card-content">
        <h3 class="por-text-title-t3">带图标的卡片</h3>
        <!-- ... -->
    </div>
</div>

<div class="por-card por-card-panel">
    <!-- 面板卡片内容 -->
</div>
```

### 不同皮肤
前景色为light，背景色为dark或transparent。

```html
<div class="por-card por-card-l por-card-light-dark">
    <!-- ... -->
</div>
<div class="por-card por-card-l por-card-light-transparent">
    <!-- ... -->
</div>
```

## API 指导

### class

| class | 描述 |
| --- | --- |
| por-card | 卡片最外层class |
| por-card-xl | 特大尺寸卡片 |
| por-card-l | 大尺寸卡片 |
| por-card-m | 中尺寸卡片 |
| por-card-align-left | 卡片内容居左 |
| por-card-panel | 面板形式卡片 |
| por-card-icon | 卡片上的图标区域 |
| por-card-icon-left | 卡片上的图标居左 |
| por-card-light-dark | 前景色light，背景色dark的卡片 |
| por-card-light-transparent | 前景色light，背景色transparent的卡片 |
| por-card-content | 卡片文本区域 |
| por-text-title-t3 | 卡片文本区域-标题 |
| por-text-body-t1 | 卡片文本区域-正文内容 |
| por-text-body-t1-textOverflow | 文字单行显示，溢出显示省略号 |




