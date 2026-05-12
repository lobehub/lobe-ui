// "中国近代历史时间线" — the canonical "slow-model + large head" case.
// The ~5 KB inline `<style>` block at the top is what makes Phase 1 of
// streaming last long enough to be worth showing the user real progress:
// at DeepSeek's typical 30 tps (~150 cps) it takes 30+ seconds for
// `</style>` to arrive, which is why `HtmlPreview` now streams the
// source through the loading placeholder instead of a static spinner.
export const chinaTimelineHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>中国近代历史时间线 (1840–1949)</title>
    <style>
        :root {
            --bg: #fdf6ee;
            --card-bg: #fffef9;
            --line: #8b1a1a;
            --dot: #b22222;
            --text: #2c1810;
            --muted: #5c4033;
            --shadow: 0 2px 12px rgba(0,0,0,.06);
            --border: #e0d5c1;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: var(--bg);
            font-family: "Noto Serif SC", "Songti SC", "SimSun", "STSong", serif;
            color: var(--text);
            display: flex;
            justify-content: center;
            padding: 40px 16px 80px;
            line-height: 1.75;
        }

        .container {
            max-width: 720px;
            width: 100%;
        }

        h1 {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: .08em;
            color: #6b1d1d;
            margin-bottom: 4px;
        }

        .subtitle {
            text-align: center;
            font-size: .95rem;
            color: var(--muted);
            margin-bottom: 48px;
            letter-spacing: .04em;
        }

        .timeline {
            position: relative;
            padding-left: 48px;
        }

        .timeline::before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 23px;
            width: 2px;
            background: var(--line);
            opacity: .5;
            border-radius: 1px;
        }

        .era {
            position: relative;
            margin-bottom: 48px;
        }

        .era:last-child {
            margin-bottom: 0;
        }

        .era-dot {
            position: absolute;
            top: 8px;
            left: -48px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--dot);
            border: 3px solid var(--bg);
            box-shadow: 0 0 0 2px var(--dot);
            z-index: 1;
        }

        .era-dot.major {
            width: 22px;
            height: 22px;
            left: -51px;
            top: 5px;
            background: #8b0000;
            box-shadow: 0 0 0 3px #8b0000;
        }

        .era-year {
            display: inline-block;
            background: #8b1a1a;
            color: #fff;
            font-size: .85rem;
            font-weight: 600;
            padding: 2px 14px;
            border-radius: 20px;
            letter-spacing: .04em;
            margin-bottom: 10px;
        }

        .era-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 20px 24px;
            box-shadow: var(--shadow);
            transition: box-shadow .2s;
        }

        .era-card:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,.1);
        }

        .era-card h2 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #6b1d1d;
            margin-bottom: 8px;
            letter-spacing: .03em;
        }

        .era-card .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }

        .tag {
            font-size: .75rem;
            background: #f3e8db;
            color: #7a5230;
            padding: 2px 10px;
            border-radius: 12px;
            letter-spacing: .03em;
        }

        .era-card p {
            font-size: .95rem;
            color: #3d2b1f;
            margin: 0;
        }

        .era-card .detail {
            margin-top: 8px;
            font-size: .88rem;
            color: #6b5445;
            border-left: 3px solid #d4b896;
            padding-left: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>中国近代历史时间线</h1>
        <p class="subtitle">1840 · 鸦片战争 ～ 1949 · 中华人民共和国成立</p>

        <div class="timeline">
            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">1840 — 1842</span>
                <div class="era-card">
                    <h2>第一次鸦片战争</h2>
                    <div class="tags">
                        <span class="tag">清 · 道光</span>
                        <span class="tag">中英冲突</span>
                    </div>
                    <p>英国以虎门销烟为借口发动战争。清政府战败，中国开始沦为半殖民地半封建社会。</p>
                    <p class="detail">1842 年签订《南京条约》：割让香港岛，开放五口通商，赔款 2100 万银元。这是中国近代第一个不平等条约。</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">1851 — 1864</span>
                <div class="era-card">
                    <h2>太平天国运动</h2>
                    <div class="tags">
                        <span class="tag">清 · 咸丰 / 同治</span>
                        <span class="tag">农民起义</span>
                    </div>
                    <p>洪秀全领导的反清运动，定都天京（南京），席卷大半个中国。最终被曾国藩的湘军等镇压，伤亡数千万。</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">1894 — 1895</span>
                <div class="era-card">
                    <h2>甲午中日战争</h2>
                    <div class="tags">
                        <span class="tag">中日对决</span>
                        <span class="tag">北洋水师覆灭</span>
                    </div>
                    <p>日本蓄意挑起战争，清军陆海皆败。签订《马关条约》：割让台湾及澎湖列岛，赔款 2 亿两白银。</p>
                    <p class="detail">此战彻底暴露清朝腐朽，列强掀起瓜分中国狂潮，民族危机空前严重。</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">1911</span>
                <div class="era-card">
                    <h2>辛亥革命</h2>
                    <div class="tags">
                        <span class="tag">武昌起义</span>
                        <span class="tag">孙中山</span>
                    </div>
                    <p>10 月 10 日武昌起义爆发，各省纷纷响应。1912 年 1 月 1 日中华民国成立，孙中山任临时大总统，清帝退位，两千余年帝制终结。</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">1919</span>
                <div class="era-card">
                    <h2>五四运动</h2>
                    <div class="tags">
                        <span class="tag">新文化运动</span>
                        <span class="tag">巴黎和会</span>
                    </div>
                    <p>巴黎和会上中国外交失败，北京学生掀起反帝爱国运动，迅速扩展至全国。标志着新民主主义革命的开端。</p>
                    <p class="detail">口号："外争主权，内除国贼"。促进了马克思主义在中国的传播。</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">1931 — 1945</span>
                <div class="era-card">
                    <h2>抗日战争</h2>
                    <div class="tags">
                        <span class="tag">十四年抗战</span>
                        <span class="tag">国共第二次合作</span>
                    </div>
                    <p>1931 年"九一八事变"，东北沦陷；1937 年"七七事变"（卢沟桥事变），全面抗战爆发。国共实现第二次合作，建立抗日民族统一战线。</p>
                    <p class="detail">关键节点：1937 南京大屠杀 / 1940 百团大战 / 1945.8.15 日本宣布无条件投降。中国以巨大牺牲赢得近代以来第一次完全胜利的反侵略战争。</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">1949</span>
                <div class="era-card">
                    <h2>🇨🇳 中华人民共和国成立</h2>
                    <div class="tags">
                        <span class="tag">开国大典</span>
                    </div>
                    <p>1949 年 10 月 1 日，毛泽东在天安门城楼宣告中华人民共和国成立。中国近代历史翻开了崭新的一页。</p>
                    <p class="detail">"中国人民从此站起来了！"——标志着中国半殖民地半封建社会彻底结束，进入新纪元。</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
