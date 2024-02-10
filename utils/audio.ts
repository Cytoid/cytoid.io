// https://github.com/eshaz/wasm-audio-decoders/blob/master/demo/index.html

export async function preDecodeAudio(url: string): Promise<string> {
  const isOgg = new URL(url).pathname.endsWith('.ogg')
  const { isSafari, isIos } = useDevice()
  const isClient = process.client
  if (!(isOgg && isClient && (isIos || isSafari))) {
    // skip
    return url
  }

  const file = await $fetch<ArrayBuffer>(url, { responseType: 'arrayBuffer' })
  let res: {
    channelData: Float32Array[]
    samplesDecoded: number
    sampleRate: number
  } | undefined

  try {
    res = await decodeVorbis(new Uint8Array(file))
  }
  catch (e) {
    // ignore
  }
  if (!res) {
    try {
      res = await decodeOpus(new Uint8Array(file))
    }
    catch (e) {
      // ignore
    }
  }
  if (!res) {
    console.error('Failed to decode audio')
    return url
  }

  const interleaved = getInterleaved(res.channelData, res.samplesDecoded)
  const waveHeader = generateHeader(
    interleaved.length * Int16Array.BYTES_PER_ELEMENT,
    res.channelData.length,
    res.sampleRate,
    16,
  )

  const decoded = new Uint8Array(
    waveHeader.length + interleaved.length,
  )
  decoded.set(waveHeader)
  decoded.set(interleaved, waveHeader.length)

  const blob = new Blob([decoded], { type: 'audio/wav' })

  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.readAsDataURL(blob)
  })
}

async function decodeOpus(data: Uint8Array) {
  const { OggOpusDecoderWebWorker } = await import('ogg-opus-decoder')
  const decoder = new OggOpusDecoderWebWorker()
  await decoder.ready
  return await decoder.decode(data)
}

async function decodeVorbis(data: Uint8Array) {
  const { OggVorbisDecoderWebWorker } = await import('@wasm-audio-decoders/ogg-vorbis')
  const decoder = new OggVorbisDecoderWebWorker()
  await decoder.ready
  return await decoder.decode(data)
}

function getInterleaved(channelData: Float32Array[], samples: number) {
  const interleaved = new Int16Array(samples * channelData.length)

  for (let offset = 0, interleavedOffset = 0; offset < samples; offset++) {
    for (let channel = 0; channel < channelData.length; channel++) {
      interleaved[interleavedOffset++] = floatToInt(
        channelData[channel][offset],
      )
    }
  }

  return new Uint8Array(interleaved.buffer)
}

function generateHeader(
  dataLength: number,
  channels: number,
  sampleRate: number,
  bitDepth: number,
) {
  const RIFF = stringToUint8Array('RIFF')
  const WAVE = stringToUint8Array('WAVE')
  const fmt = stringToUint8Array('fmt ')
  const data = stringToUint8Array('data')

  const format = 1 // raw PCM

  const headerLength = 44
  const fileSize = dataLength + headerLength

  const header = new Uint8Array(headerLength)
  const headerView = new DataView(header.buffer)

  let offset = 0

  header.set(RIFF, offset)
  offset += RIFF.length

  headerView.setInt32(offset, fileSize - 8, true)
  offset += 4

  header.set(WAVE, offset)
  offset += WAVE.length

  header.set(fmt, offset)
  offset += fmt.length

  // Write the size of the "fmt " chunk.
  // Value of 16 is hard-coded for raw PCM format. other formats have different size.
  headerView.setUint32(offset, 16, true)
  offset += 4

  headerView.setUint16(offset, format, true)
  offset += 2

  headerView.setUint16(offset, channels, true)
  offset += 2

  headerView.setUint32(offset, sampleRate, true)
  offset += 4

  const byteRate = (sampleRate * channels * bitDepth) / 8
  headerView.setUint32(offset, byteRate, true)
  offset += 4

  const blockAlign = (channels * bitDepth) / 8
  headerView.setUint16(offset, blockAlign, true)
  offset += 2

  headerView.setUint16(offset, bitDepth, true)
  offset += 2

  header.set(data, offset)
  offset += data.length

  headerView.setUint32(offset, dataLength, true)
  offset += 4

  return header
}

function stringToUint8Array(str: string) {
  const buf = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i)
  }
  return buf
}

function floatToInt(val: number) {
  return val > 0 ? Math.min(val * 32767, 32767) : Math.max(val * 32767, -32768)
}
