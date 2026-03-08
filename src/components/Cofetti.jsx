export default function Confetti({ onDone }) {
  if (onDone) setTimeout(onDone, 0);
  return null;
}
