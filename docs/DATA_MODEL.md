# 本地数据

localStorage 键：`wuhan-bu-ji-v1`。

```json
{"version":1,"popped":["river"],"saved":["river"]}
```

场景 ID：river、tea、tree、breakfast。saved 是 popped 的子集，两个列表都唯一。移出收藏不复原泡泡。不记录身份、访问日志或音频开关。

新增场景 ID：cloud、book、swing、noodles、hanriver、shade、sunset、alley、window、rain、bench、home。旧四个 ID 不变，已有收藏无需迁移。

## 下午存根

独立键：`wuhan-bu-ji-note-v1`，只保留最近保存的一张：

```json
{"version":1,"text":"把下午留给江风。","date":"2026-11-02","tag":"ferry"}
```

text 最多 120 个 UTF-16 单元，与输入框 maxlength 一致；清理控制字符和首尾空白。date 取保存时浏览器本地日期，恢复时校验真实日历日期；tag 限 ferry、breakfast、teahouse、courtyard。标签不要求与当时播放的底噪相同，而是保存时随机选定。导出使用保存快照，编辑但未保存不会改变存根。

烦恼历史只在内存保留，最多五条，每条文字最多 80 个 UTF-16 单元，不写入 localStorage。不会与收藏键相互覆盖。

浏览器清理站点数据会清空收藏；不同浏览器不互通。存储被阻止或空间不足时，当前页面保留内存状态并明确提示刷新后可能丢失。

## 静态地标关联

SCENES 的 artwork 字段关联 LANDMARKS：river→clock、tea→old_lane、tree→lake、breakfast→breakfast、cloud→bridge、book→bookshop、swing→park、noodles→noodles、hanriver→pavilion、shade→riverside、sunset→tower、alley→courtyard、window→street、rain→factory、bench→lakeside、home→hill。location 保存所在三镇与街区的静态说明。该关联只存在源码中，不写入 localStorage；原 ID、version 与 popped/saved 格式不变，旧收藏无须迁移。地点名与动作标题分行显示。

region 为汉口、武昌或汉阳；themes 为看江湖、吃过早、逛街巷、走公园、看建筑中的一项或多项；start 与 duration 为静态出行建议，可选 source 包含地点资料的 url 和 label。筛选选择仅在页面内存中保留，不写入 localStorage。实景照片及其许可元数据保存在 LANDMARKS，不进入用户收藏数据。
