# Pretty Json Log (PJL)

Convert JSON log lines into simple pretty colored log output

Converts

```json
{"pid":0,"time":"2019-11-03T00:48:55.623Z","hostname":"","level":30,"msg":"HTTPGet","v":0,"name":"cogview","firstChunk":0,"lastChunk":0,"chunkCount":1,"bytes":32768,"fetchRange":"bytes=0-32768"}
{"pid":0,"time":"2019-11-03T00:48:55.677Z","hostname":"","level":30,"msg":"HTTPGet","v":0,"name":"cogview","firstChunk":94,"lastChunk":95,"chunkCount":1,"bytes":32768,"fetchRange":"bytes=3080192-3145728"}
```

into

![Example output](./static/pretty-output.png)

## Install

```bash
npm i -g pretty-json-log

cat <log-file> | pjl
```
