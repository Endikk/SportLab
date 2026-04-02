import { useState } from "react";

const EXTENSIONS = ["gif", "png", "jpg", "webp"];
const BASE_PATH = "/images/exercises/";

export default function ExerciseImage({ name, alt, className }) {
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (!name || failed) return null;

  const handleError = () => {
    if (extIdx < EXTENSIONS.length - 1) {
      setExtIdx((i) => i + 1);
    } else {
      setFailed(true);
    }
  };

  return (
    <img
      src={`${BASE_PATH}${name}.${EXTENSIONS[extIdx]}`}
      alt={alt || name}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}
