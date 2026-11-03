const FADE_SECONDS = 1.2;
const NOISE_SECONDS = 4;

/** 在音频适配层生成循环噪声，循环内没有网络或文件 I/O。 */
function createNoise(context) {
  const buffer = context.createBuffer(1, context.sampleRate * NOISE_SECONDS, context.sampleRate);
  const samples = buffer.getChannelData(0);
  let previous = 0;
  // PERF: 缓冲区每次播放只合成一次，后续由音频线程循环。
  for (let index = 0; index < samples.length; index++) {
    previous = (previous + (Math.random() * 2 - 1) * 0.02) / 1.02;
    samples[index] = previous * 3.5;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

/** 一次柔和的船笛、杯盏或虫鸣，包络避免突发响声。 */
function playTone(options) {
  const { context, destination, frequency, duration, volume, delay = 0, type = 'sine' } = options;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const start = context.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + Math.min(0.3, duration / 3));
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope).connect(destination);
  oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  oscillator.start(start);
  oscillator.stop(start + duration);
}

/** 用不同频段和稀疏音符形成四种环境意象，不合成人声。 */
function addAtmosphere(options) {
  const { context, destination, id } = options;
  const tone = settings => playTone({ context, destination, ...settings });
  if (id === 'ferry') { tone({ frequency: 110, duration: 3.8, volume: 0.035 }); tone({ frequency: 165, duration: 3.6, volume: 0.012, delay: 0.2 }); }
  if (id === 'teahouse') { tone({ frequency: 720, duration: 0.35, volume: 0.009 }); tone({ frequency: 1080, duration: 0.25, volume: 0.004, delay: 0.12 }); }
  if (id === 'breakfast') { tone({ frequency: 380, duration: 0.17, volume: 0.012 }); tone({ frequency: 560, duration: 0.2, volume: 0.008, delay: 0.4 }); }
  if (id === 'courtyard') { tone({ frequency: 2100, duration: 0.25, volume: 0.003 }); tone({ frequency: 2300, duration: 0.18, volume: 0.002, delay: 0.35 }); }
}

/** 单个环境实例；停止时先淡出，释放计时器、节点和音频上下文。 */
export async function startAmbient(id) {
  const context = new AudioContext();
  try {
    await context.resume();
    const master = context.createGain();
    const noiseGain = context.createGain();
    const filter = context.createBiquadFilter();
    const noise = createNoise(context);
    filter.type = 'lowpass';
    filter.frequency.value = { ferry: 260, breakfast: 1600, teahouse: 340, courtyard: 700 }[id];
    noiseGain.gain.value = { ferry: 0.2, breakfast: 0.08, teahouse: 0.1, courtyard: 0.09 }[id];
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(0.6, context.currentTime + FADE_SECONDS);
    noise.connect(filter).connect(noiseGain).connect(master).connect(context.destination);
    noise.start();
    const interval = window.setInterval(() => addAtmosphere({ context, destination: master, id }), id === 'ferry' ? 14000 : 6500);
    addAtmosphere({ context, destination: master, id });
    return {
      async stop() {
        window.clearInterval(interval);
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setValueAtTime(master.gain.value, context.currentTime);
        master.gain.linearRampToValueAtTime(0, context.currentTime + FADE_SECONDS);
        await new Promise(resolve => window.setTimeout(resolve, FADE_SECONDS * 1000));
        noise.stop();
        await context.close();
      },
    };
  } catch (error) {
    await context.close();
    throw error;
  }
}
