/** 用户主动打开声音后，实时合成一次短促而轻的气泡声。 */
export async function playPopSound() {
  let context;
  try {
    context = new AudioContext();
    await context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime;
    oscillator.frequency.setValueAtTime(430, start);
    oscillator.frequency.exponentialRampToValueAtTime(90, start + 0.09);
    gain.gain.setValueAtTime(0.035, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(start + 0.12);
    await new Promise(resolve => oscillator.addEventListener('ended', resolve, { once: true }));
    return null;
  } catch (error) {
    return error;
  } finally {
    if (context) await context.close();
  }
}
