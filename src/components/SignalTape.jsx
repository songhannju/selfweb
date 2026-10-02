import { useEffect, useRef } from 'react';

// A small, honest simulation of the kind of pipeline Han builds: events pass four gates,
// a few fail and loop back to the last checkpoint, and nothing is ever settled twice.
const GATES = [
  { x: 0.16, label: 'Validate' },
  { x: 0.4, label: 'Checkpoint' },
  { x: 0.64, label: 'Notify' },
  { x: 0.88, label: 'Settle' },
];
const LANES = 7;
const FAIL_RATE = 0.05;
const HEX = '0123456789ABCDEF';

function makeId() {
  let id = '';
  for (let i = 0; i < 4; i += 1) id += HEX[Math.floor(Math.random() * 16)];
  return id;
}

export default function SignalTape() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const settledRef = useRef(null);
  const retriedRef = useRef(null);
  const inspectRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const styles = getComputedStyle(document.documentElement);
    const color = {
      ink: styles.getPropertyValue('--ink').trim() || '#e9eee9',
      ink3: styles.getPropertyValue('--ink-3').trim() || '#85918a',
      accent: styles.getPropertyValue('--accent').trim() || '#9ad5bb',
    };

    let width = 0;
    let height = 0;
    let packets = [];
    let laneClock = new Array(LANES).fill(0);
    let settled = 0;
    let retried = 0;
    let pointerX = null;
    let timeScale = 1;
    let frame = 0;
    let last = 0;
    let running = false;
    let visible = true;
    let lastReadout = 0;

    const top = 34;
    const bottom = 40;
    const laneY = (lane) => top + ((height - top - bottom) / (LANES - 1)) * lane;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(lane) {
      packets.push({
        id: makeId(),
        lane,
        x: -0.02,
        speed: 0.07 + Math.random() * 0.05,
        state: 'run',
        stateT: 0,
        gate: -1,
        from: 0,
        to: 0,
        retriedOnce: false,
      });
    }

    function step(dt) {
      for (let lane = 0; lane < LANES; lane += 1) {
        laneClock[lane] -= dt;
        if (laneClock[lane] <= 0) {
          spawn(lane);
          laneClock[lane] = 0.55 + Math.random() * 1.35;
        }
      }

      packets.forEach((p) => {
        if (p.state === 'run') {
          const before = p.x;
          p.x += p.speed * dt;
          GATES.forEach((gate, index) => {
            if (before < gate.x && p.x >= gate.x && index > p.gate) {
              p.gate = index;
              const canFail = !p.retriedOnce && (index === 1 || index === 2);
              if (canFail && Math.random() < FAIL_RATE) {
                p.x = gate.x;
                p.state = 'fail';
                p.stateT = 0;
              }
            }
          });
        } else if (p.state === 'fail') {
          p.stateT += dt;
          if (p.stateT > 0.55) {
            p.state = 'retry';
            p.stateT = 0;
            p.from = p.x;
            p.to = GATES[Math.max(0, p.gate - 1)].x;
          }
        } else if (p.state === 'retry') {
          p.stateT += dt / 1.1;
          const t = Math.min(1, p.stateT);
          const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
          p.x = p.from + (p.to - p.from) * eased;
          if (t >= 1) {
            p.state = 'run';
            p.gate = Math.max(0, p.gate - 1);
            p.retriedOnce = true;
            retried += 1;
          }
        }
      });

      const before = packets.length;
      packets = packets.filter((p) => p.x < 1.03);
      settled += before - packets.length;
    }

    function stageOf(p) {
      if (p.state === 'fail') return `${GATES[p.gate].label.toLowerCase()} failed`;
      if (p.state === 'retry') return `retrying from ${GATES[Math.max(0, p.gate - 1)].label.toLowerCase()}`;
      if (p.gate < 0) return 'queued';
      return `passed ${GATES[p.gate].label.toLowerCase()}`;
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);

      // lanes
      ctx.lineWidth = 1;
      for (let lane = 0; lane < LANES; lane += 1) {
        const y = Math.round(laneY(lane)) + 0.5;
        ctx.strokeStyle = 'rgba(214,232,222,0.07)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // gates
      GATES.forEach((gate) => {
        const x = Math.round(gate.x * width) + 0.5;
        ctx.strokeStyle = 'rgba(214,232,222,0.2)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(x, top - 12);
        ctx.lineTo(x, height - bottom + 12);
        ctx.stroke();
        ctx.setLineDash([]);
        for (let lane = 0; lane < LANES; lane += 1) {
          const y = laneY(lane);
          ctx.fillStyle = 'rgba(214,232,222,0.35)';
          ctx.fillRect(x - 3.5, y - 0.5, 7, 1);
        }
      });

      const size = width < 640 ? 4 : 5;
      let nearest = null;
      let nearestDist = Infinity;

      packets.forEach((p) => {
        const x = p.x * width;
        let y = laneY(p.lane);
        const settledZone = p.x > GATES[3].x;

        if (p.state === 'retry') {
          const t = Math.min(1, p.stateT);
          const arc = Math.sin(t * Math.PI) * Math.min(22, (height - top - bottom) / (LANES - 1) * 0.9);
          y -= arc;
          // the loop path, drawn as it is travelled
          ctx.strokeStyle = color.accent;
          ctx.globalAlpha = 0.55;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          const steps = 18;
          for (let i = 0; i <= steps; i += 1) {
            const s = (i / steps) * t;
            const e = s < 0.5 ? 4 * s * s * s : 1 - (-2 * s + 2) ** 3 / 2;
            const px = (p.from + (p.to - p.from) * e) * width;
            const py = laneY(p.lane) - Math.sin(s * Math.PI) * Math.min(22, (height - top - bottom) / (LANES - 1) * 0.9);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }

        if (p.state === 'run') {
          // motion trail
          const trail = p.speed * width * 0.6;
          const grad = ctx.createLinearGradient(x - trail, 0, x, 0);
          grad.addColorStop(0, 'rgba(214,232,222,0)');
          grad.addColorStop(1, settledZone || p.retriedOnce ? 'rgba(154,213,187,0.45)' : 'rgba(214,232,222,0.28)');
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(x - trail, Math.round(y) + 0.5);
          ctx.lineTo(x, Math.round(y) + 0.5);
          ctx.stroke();
        }

        if (p.state === 'fail') {
          const pulse = (p.stateT / 0.55);
          ctx.strokeStyle = color.accent;
          ctx.globalAlpha = 1 - pulse;
          ctx.beginPath();
          ctx.arc(x, y, 4 + pulse * 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.strokeRect(x - size / 2 + 0.5, y - size / 2 + 0.5, size, size);
        } else {
          ctx.fillStyle = settledZone || p.retriedOnce || p.state === 'retry' ? color.accent : color.ink;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }

        if (pointerX !== null) {
          const d = Math.abs(x - pointerX);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = { p, x, y };
          }
        }
      });

      // inspection cursor
      const inspect = inspectRef.current;
      if (pointerX !== null) {
        ctx.strokeStyle = color.accent;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.round(pointerX) + 0.5, top - 16);
        ctx.lineTo(Math.round(pointerX) + 0.5, height - bottom + 16);
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (nearest && nearestDist < 60) {
          ctx.strokeStyle = color.accent;
          ctx.strokeRect(nearest.x - 7.5, nearest.y - 7.5, 15, 15);
          const p = nearest.p;
          inspect.innerHTML = `#${p.id} <span>·</span> ${stageOf(p)}<br><span>attempt</span> ${p.retriedOnce || p.state === 'retry' ? 2 : 1} <span>· charged once</span>`;
          const tipX = Math.min(Math.max(nearest.x + 14, 8), width - inspect.offsetWidth - 8);
          inspect.style.transform = `translate3d(${tipX}px, ${Math.max(0, nearest.y - 64)}px, 0)`;
          inspect.classList.add('is-on');
        } else {
          inspect.classList.remove('is-on');
        }
      } else if (inspect) {
        inspect.classList.remove('is-on');
      }

      if (now - lastReadout > 180) {
        lastReadout = now;
        settledRef.current.textContent = settled.toLocaleString('en-US');
        retriedRef.current.textContent = retried.toLocaleString('en-US');
      }
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0) * timeScale;
      last = now;
      const target = pointerX !== null ? 0.25 : 1;
      timeScale += (target - timeScale) * 0.08;
      step(dt);
      draw(now);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    resize();
    // prewarm so the first frame is already a full, working pipeline
    for (let i = 0; i < 300; i += 1) step(1 / 30);

    if (reduceMotion) {
      // compose a still: one event caught mid-retry, the rest in flight
      const candidate = packets.find((p) => p.state === 'run' && p.x > GATES[2].x && p.x < GATES[3].x - 0.05);
      if (candidate) {
        candidate.state = 'retry';
        candidate.gate = 2;
        candidate.from = GATES[2].x;
        candidate.to = GATES[1].x;
        candidate.stateT = 0.5;
      }
      draw(performance.now());
    } else {
      draw(performance.now());
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    resizeObserver.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const onMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      if (reduceMotion) draw(performance.now());
    };
    const onLeave = () => {
      pointerX = null;
      if (reduceMotion) draw(performance.now());
    };
    if (finePointer) {
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <figure className="tape" ref={wrapRef} aria-label="Live simulation: payment events pass validate, checkpoint, notify and settle gates. Failed events retry from the last checkpoint and are never settled twice.">
      <canvas className="tape__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="tape__gates" aria-hidden="true">
        {GATES.map((gate, index) => (
          <span className="tape__gate" style={{ left: `${gate.x * 100}%` }} key={gate.label}>
            <span className="tape__gate-num">0{index + 1} </span><b>{gate.label.toUpperCase()}</b>
          </span>
        ))}
      </div>
      <div className="tape__inspect" ref={inspectRef} aria-hidden="true" />
      <figcaption className="tape__readout" aria-hidden="true">
        <span>settled <b ref={settledRef}>0</b></span>
        <span>retried <b ref={retriedRef}>0</b></span>
        <span>duplicates <b className="is-zero">0</b></span>
        <span className="is-optional">simulation</span>
      </figcaption>
    </figure>
  );
}
