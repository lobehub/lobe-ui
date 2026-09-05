#!/bin/zsh
# usage: probe.sh <bench-url>   (any streamingBench URL; prints chars whose opacity dropped from 1 mid-stream)
URL=${1:?bench url}
DIR=${0:a:h}
AB=(agent-browser --session probe)
$AB open "$URL" > /dev/null
$AB wait 'button[data-phase="idle"]' > /dev/null
sleep 3
$AB eval --stdin < "$DIR/opacity-probe.js" > /dev/null
$AB click 'button[data-phase="idle"]' > /dev/null
for i in $(seq 1 240); do
  sleep 1
  [ "$($AB eval 'document.querySelector("button[data-phase]").dataset.phase')" = '"done"' ] && break
done
$AB eval 'JSON.stringify({frames:window.__FL.frames,total:window.__FL.events.length,events:window.__FL.events.slice(0,10)})' \
  | python3 -c "import sys,json; d=json.loads(json.loads(sys.stdin.read())); print('frames',d['frames'],'resets',d['total']); [print(e['key'],repr(e['ch']),e['t'],'ms |',e['block'],'\n  prev:',e['prev'],'\n  cur :',e['cur']) for e in d['events']]"
$AB close > /dev/null
