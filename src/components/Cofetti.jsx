// Confetti disabled - no animation on start
export default function Confetti({ onDone }) {
  // Immediately call onDone, no animation
  if (onDone) setTimeout(onDone, 0);
  return null;
}
