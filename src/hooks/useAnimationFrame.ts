import { useState, useRef, useCallback, useLayoutEffect } from 'react';

export const useAnimationFrame = (framesPerSecond: number, callback: any) => {
  const callbackRef = useRef(callback);
  const frameRef = useRef(0);
  const [now, setNow] = useState(Date.now());
  const [then, setThen] = useState(Date.now());

  const loop = useCallback(() => {
    frameRef.current = requestAnimationFrame(loop);
    setNow(Date.now());
    const delta = now - then;
    const interval = 1000 / framesPerSecond;

    if (delta > interval) {
      setThen(now - (delta % interval));
      const cb = callbackRef.current;
      cb();
    }
  }, [framesPerSecond, now, then]);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [loop]);
};
