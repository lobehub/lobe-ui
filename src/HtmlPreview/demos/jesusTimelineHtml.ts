// "Life of Jesus of Nazareth" — the canonical "slow-model + large head"
// case. The ~4 KB inline `<style>` block at the top is what makes
// Phase 1 of streaming last long enough to be worth showing the user
// real progress: at DeepSeek's typical 30 tps (~150 cps) it takes 25+
// seconds for `</style>` to arrive, which is why `HtmlPreview` now
// streams the source through the loading placeholder instead of a
// static spinner.
export const jesusTimelineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Life of Jesus of Nazareth — Historical Timeline</title>
    <style>
        :root {
            --bg: #f6ecd6;
            --card-bg: #fffdf5;
            --line: #6b3410;
            --dot: #8b4513;
            --text: #2e1a0a;
            --muted: #6b5236;
            --accent: #b8860b;
            --shadow: 0 2px 12px rgba(60, 30, 10, .08);
            --border: #d9c7a1;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: var(--bg);
            font-family: "EB Garamond", "Cardo", "Times New Roman", Georgia, serif;
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
            letter-spacing: .04em;
            color: #5a2a08;
            margin-bottom: 4px;
        }

        .subtitle {
            text-align: center;
            font-size: .95rem;
            color: var(--muted);
            margin-bottom: 48px;
            letter-spacing: .04em;
            font-style: italic;
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
            background: var(--accent);
            box-shadow: 0 0 0 3px var(--accent);
        }

        .era-year {
            display: inline-block;
            background: #6b3410;
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
            box-shadow: 0 6px 20px rgba(60, 30, 10, .12);
        }

        .era-card h2 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #5a2a08;
            margin-bottom: 8px;
            letter-spacing: .02em;
        }

        .era-card .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }

        .tag {
            font-size: .75rem;
            background: #efe4cc;
            color: #6b5236;
            padding: 2px 10px;
            border-radius: 12px;
            letter-spacing: .03em;
        }

        .era-card p {
            font-size: .95rem;
            color: #2e1a0a;
            margin: 0;
        }

        .era-card .detail {
            margin-top: 8px;
            font-size: .88rem;
            color: #6b5236;
            border-left: 3px solid var(--accent);
            padding-left: 12px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Life of Jesus of Nazareth</h1>
        <p class="subtitle">c. 4 BC – c. AD 30 · Historical Timeline</p>

        <div class="timeline">
            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">c. 4 BC</span>
                <div class="era-card">
                    <h2>The Nativity</h2>
                    <div class="tags">
                        <span class="tag">Bethlehem</span>
                        <span class="tag">Reign of Herod</span>
                    </div>
                    <p>Born in Bethlehem of Judea to Mary and Joseph during the census ordered by Caesar Augustus. The Gospels of Matthew and Luke recount the visits of shepherds and Magi from the east.</p>
                    <p class="detail">Most scholars place the date between 6 and 4 BC, shortly before Herod the Great's death in 4 BC.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">c. AD 8</span>
                <div class="era-card">
                    <h2>The Boy in the Temple</h2>
                    <div class="tags">
                        <span class="tag">Jerusalem</span>
                        <span class="tag">Luke 2</span>
                    </div>
                    <p>At twelve years old, Jesus is found in the Temple courts discussing scripture with the teachers, who are amazed at his understanding. The only canonical account of his childhood.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">c. AD 27</span>
                <div class="era-card">
                    <h2>Baptism by John the Baptist</h2>
                    <div class="tags">
                        <span class="tag">River Jordan</span>
                        <span class="tag">John the Baptist</span>
                    </div>
                    <p>Baptized by John in the Jordan. The synoptic Gospels describe the heavens opening, the Spirit descending as a dove, and a voice declaring: "This is my beloved Son, in whom I am well pleased."</p>
                    <p class="detail">Traditionally regarded as the start of Jesus' public ministry, at roughly thirty years of age.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">c. AD 28</span>
                <div class="era-card">
                    <h2>The Sermon on the Mount</h2>
                    <div class="tags">
                        <span class="tag">Galilee</span>
                        <span class="tag">Matthew 5–7</span>
                    </div>
                    <p>Delivered to a gathered multitude on a hillside near Capernaum. Includes the Beatitudes, the Lord's Prayer, and the central ethical teachings of the new covenant.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">c. AD 29</span>
                <div class="era-card">
                    <h2>Feeding of the Five Thousand</h2>
                    <div class="tags">
                        <span class="tag">Sea of Galilee</span>
                        <span class="tag">Miracle</span>
                    </div>
                    <p>With five loaves and two fish, Jesus is recorded as feeding a crowd of more than five thousand. The only miracle (besides the resurrection) attested in all four canonical Gospels.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">c. AD 30 · Sunday</span>
                <div class="era-card">
                    <h2>Triumphal Entry into Jerusalem</h2>
                    <div class="tags">
                        <span class="tag">Palm Sunday</span>
                        <span class="tag">Passover Week</span>
                    </div>
                    <p>Jesus enters Jerusalem riding a donkey while crowds spread cloaks and palm branches in his path, crying "Hosanna! Blessed is he who comes in the name of the Lord."</p>
                    <p class="detail">Begins the final week of his earthly ministry, observed in Christian tradition as Holy Week.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">c. AD 30 · Thursday</span>
                <div class="era-card">
                    <h2>The Last Supper</h2>
                    <div class="tags">
                        <span class="tag">Upper Room</span>
                        <span class="tag">Eucharist instituted</span>
                    </div>
                    <p>Shared the Passover meal with the twelve apostles. Broke bread and shared the cup, instituting what Christians commemorate as the Eucharist. Foretold his betrayal and Peter's denial.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">c. AD 30 · Friday</span>
                <div class="era-card">
                    <h2>Crucifixion at Golgotha</h2>
                    <div class="tags">
                        <span class="tag">Pontius Pilate</span>
                        <span class="tag">Good Friday</span>
                    </div>
                    <p>Arrested in Gethsemane, tried before the Sanhedrin and the Roman prefect Pontius Pilate, and crucified outside Jerusalem at the place called Golgotha (Calvary).</p>
                    <p class="detail">Tacitus (Annals XV.44) independently records the execution under Pilate during the reign of Tiberius.</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot major"></div>
                <span class="era-year">c. AD 30 · Sunday</span>
                <div class="era-card">
                    <h2>The Resurrection</h2>
                    <div class="tags">
                        <span class="tag">Easter</span>
                        <span class="tag">Empty Tomb</span>
                    </div>
                    <p>On the third day, the women find the tomb empty. The Gospels record subsequent appearances to Mary Magdalene, the apostles, and others over the following weeks.</p>
                    <p class="detail">The cornerstone of Christian belief; the apostle Paul writes: "If Christ has not been raised, our preaching is useless and so is your faith." (1 Corinthians 15:14)</p>
                </div>
            </div>

            <div class="era">
                <div class="era-dot"></div>
                <span class="era-year">c. AD 30 — 40 days later</span>
                <div class="era-card">
                    <h2>The Ascension</h2>
                    <div class="tags">
                        <span class="tag">Mount of Olives</span>
                        <span class="tag">Acts 1</span>
                    </div>
                    <p>After forty days of post-resurrection appearances, Jesus commissions the apostles and is taken up into the heavens from the Mount of Olives, with the promise of his return.</p>
                    <p class="detail">"You will receive power when the Holy Spirit comes on you, and you will be my witnesses to the ends of the earth." (Acts 1:8)</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
