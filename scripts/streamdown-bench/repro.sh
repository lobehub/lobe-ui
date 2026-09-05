#!/bin/zsh
# usage: repro.sh <site-base-url> [scenario-label ...]
BASE=${1:?site base url, e.g. http://localhost:4174}
shift
LABELS=("$@")
[ ${#LABELS[@]} -eq 0 ] && LABELS=("A." "B." "B2." "C." "D." "E.")
AB=(agent-browser --session repro)
$AB open "$BASE/~demos/src-markdown-demo-streaminganimationrepro" > /dev/null
$AB wait 'button' > /dev/null
sleep 2
for label in "${LABELS[@]}"; do
  $AB eval "[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith('$label')).click(); 1" > /dev/null
  sleep 0.5
  $AB eval "[...document.querySelectorAll('button')].find(b=>/^reproduce$/i.test(b.textContent.trim())).click(); 1" > /dev/null
  for i in $(seq 1 40); do
    sleep 1
    running=$($AB eval "Boolean([...document.querySelectorAll('button')].find(b=>/^stop$/i.test(b.textContent.trim())))")
    [ "$running" = "false" ] && break
  done
  sleep 1
  echo "$label $($AB eval "JSON.stringify(document.body.innerText.match(/animated@birth: \\d+|skipped@birth: \\d+|live revealed\\/total: [^\\n]+/g))")"
  $AB eval "location.reload(); 1" > /dev/null; sleep 2
done
$AB close > /dev/null
