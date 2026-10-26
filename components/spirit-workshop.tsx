"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Category, SpiritCase } from "../lib/cases";
import {
  WORKSHOP_ART,
  WORKSHOP_MOTION,
  WORKSHOP_STATIONS,
  WORKSHOP_VIEWBOX,
} from "./spirit-workshop.geometry";
import "./spirit-workshop.css";

type Step = 0 | 1 | 2 | 3;
const steps = [
  { key: "photo", label: "PHOTO", title: "An object arrives" },
  { key: "memory", label: "MEMORY", title: "A memory turns the reel" },
  { key: "story", label: "STORY", title: "The letterpress makes a docket" },
  { key: "next", label: "NEXT CHAPTER", title: "Choose a real next step" },
] as const;

interface Props {
  cases: SpiritCase[];
  onOpenCase: (c: SpiritCase) => void;
  onStart: () => void;
}

const art = (markup: string) => ({ __html: markup });

function safePhoto(value?: string) {
  return value &&
    value.length < 1_500_000 &&
    /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)
    ? value
    : undefined;
}

function categoryLabel(category: Category) {
  return (
    {
      umbrella: "Umbrella",
      kettle: "Kettle",
      lamp: "Lamp",
      headphones: "Headphones",
      other: "Something else",
    } as const
  )[category];
}

export function SpiritWorkshop({ cases, onOpenCase, onStart }: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [step, setStep] = useState<Step>(0);
  const [actionSelection, setActionSelection] = useState<{
    caseId: string;
    kind: SpiritCase["actions"][number]["kind"];
  } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const root = useRef<HTMLElement>(null);
  const previousFirstId = useRef("");
  const selected = useMemo(
    () => cases.find((item) => item.id === selectedId) ?? cases[0],
    [cases, selectedId],
  );

  // The host prepends a successfully generated case. A changed first ID always
  // selects that new result; ordinary saved-case list changes preserve choice.
  useEffect(() => {
    const firstId = cases[0]?.id ?? "";
    if (
      !selectedId ||
      firstId !== previousFirstId.current ||
      !cases.some((item) => item.id === selectedId)
    ) {
      setSelectedId(firstId);
      if (firstId !== previousFirstId.current) {
        setStep(0);
        setPlaying(false);
      }
    }
    previousFirstId.current = firstId;
  }, [cases, selectedId]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: "100px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(query.matches);
      if (query.matches) setPlaying(false);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || !visible || reducedMotion) {
      return;
    }
    const timer = window.setTimeout(() => {
      if (step >= 3) setPlaying(false);
      else setStep((step + 1) as Step);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [playing, visible, reducedMotion, step]);

  if (!selected) {
    return (
      <section
        className="section spirit-workshop"
        id="spirit-workshop"
        aria-labelledby="workshop-title"
      >
        <div className="workshop-heading">
          <div>
            <div className="eyebrow">THE SECOND CHANCE MACHINE</div>
            <h2 id="workshop-title">Spirit Workshop</h2>
            <p>Go behind the counter.</p>
          </div>
          <button className="outline" onClick={onStart}>
            File an object
          </button>
        </div>
        <p className="workshop-empty">
          There are no case files yet. Start an intake to bring an object to the
          workshop.
        </p>
      </section>
    );
  }

  const fileLabel =
    selected.mode === "sample" ? "Sample demonstration" : "Filed AI case";
  const photo = safePhoto(selected.photo);
  const actionKind =
    actionSelection?.caseId === selected.id ? actionSelection.kind : "";
  const selectedAction = actionKind
    ? selected.actions.find((item) => item.kind === actionKind)
    : undefined;
  const show = (value: string) => <g dangerouslySetInnerHTML={art(value)} />;
  const leverRotation = step === 2 ? -25 : step === 3 ? 9 : 0;
  const ramTransform = step === 2 ? WORKSHOP_MOTION.pressDown : "";
  const photoTransform = step >= 1 ? WORKSHOP_MOTION.photoAdvance : "";
  const docketTransform = step >= 2 ? WORKSHOP_MOTION.docketOpen : "";
  const reelRotation = step === 1 ? 120 : 0;
  const origin = WORKSHOP_STATIONS.story;

  return (
    <section
      className="section spirit-workshop"
      id="spirit-workshop"
      aria-labelledby="workshop-title"
      ref={root}
    >
      <div className="workshop-heading">
        <div>
          <div className="eyebrow">
            THE SECOND CHANCE MACHINE · INTERACTIVE CASE FILE
          </div>
          <h2 id="workshop-title">Spirit Workshop</h2>
          <p>Go behind the counter.</p>
        </div>
        <button className="outline workshop-intake" onClick={onStart}>
          File an object <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="workshop-controls">
        <label htmlFor="workshop-case">Choose a case</label>
        <select
          id="workshop-case"
          value={selected.id}
          onChange={(event) => {
            setSelectedId(event.target.value);
            setStep(0);
            setPlaying(false);
          }}
        >
          {cases.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {item.object} ·{" "}
              {item.mode === "sample" ? "sample" : "AI"}
            </option>
          ))}
        </select>
        <span
          className={`workshop-file-tag ${selected.mode}`}
          aria-live="polite"
        >
          {fileLabel}
        </span>
      </div>

      <div className="workshop-machine-card">
        <div className="workshop-machine-head">
          <span>SECOND CHANCE MACHINE</span>
          <span>OBJECT → STORY → ACTION</span>
        </div>
        <svg
          className="workshop-machine iso-svg"
          viewBox={WORKSHOP_VIEWBOX}
          role="img"
          aria-labelledby="workshop-svg-title workshop-svg-desc"
          data-stage={steps[step].key}
        >
          <title id="workshop-svg-title">
            Interactive isometric letterpress spirit workshop
          </title>
          <desc id="workshop-svg-desc">
            A miniature bureau routes an object photo through a memory reel and
            a letterpress docket drawer to three output trays for repair, reuse,
            or passing an item on. The active step is {steps[step].label}.
          </desc>
          {show(WORKSHOP_ART.base.join(""))}
          {show(WORKSHOP_ART.intake.join(""))}
          <g data-live="photo" transform={photoTransform}>
            {show(WORKSHOP_ART.moving.photo)}
          </g>
          {show(WORKSHOP_ART.memory.join(""))}
          <g
            data-live="reel"
            transform={`rotate(${reelRotation} ${WORKSHOP_STATIONS.memory[0]} ${WORKSHOP_STATIONS.memory[1]})`}
          >
            {show(WORKSHOP_ART.moving.reel)}
          </g>
          {show(WORKSHOP_ART.press.join(""))}
          <g
            data-live="lever"
            transform={`rotate(${leverRotation} ${origin[0]} ${origin[1]})`}
          >
            {show(WORKSHOP_ART.moving.lever)}
          </g>
          <g data-live="ram" transform={ramTransform}>
            {show(WORKSHOP_ART.moving.ram)}
          </g>
          {show(WORKSHOP_ART.docket.join(""))}
          <g data-live="docket" transform={docketTransform}>
            {show(WORKSHOP_ART.moving.docket)}
          </g>
          {(
            Object.keys(WORKSHOP_ART.outputs) as Array<
              keyof typeof WORKSHOP_ART.outputs
            >
          ).map((kind) => (
            <g
              key={kind}
              className="workshop-output"
              data-output={kind}
              data-active={actionKind === kind ? "" : undefined}
            >
              {show(WORKSHOP_ART.outputs[kind])}
            </g>
          ))}
          {Object.entries(WORKSHOP_STATIONS).map(([key, [x, y]]) => (
            <circle
              key={key}
              className="workshop-station-dot"
              data-current={steps[step].key === key ? "" : undefined}
              cx={x}
              cy={y}
              r="4"
            />
          ))}
        </svg>
        <div className="workshop-machine-foot">
          <span>WORKING MODEL · FILE DATA SHOWN BELOW</span>
          <span aria-live="polite">{steps[step].title}</span>
        </div>
      </div>

      <div className="workshop-tour" aria-label="Workshop process">
        <div
          className="workshop-steps"
          role="group"
          aria-label="Machine stages"
        >
          {steps.map((item, index) => (
            <button
              key={item.key}
              aria-current={step === index ? "step" : undefined}
              aria-pressed={step === index}
              className={step === index ? "active" : ""}
              onClick={() => {
                setStep(index as Step);
                setPlaying(false);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="workshop-tour-actions">
          <button
            className="workshop-play"
            onClick={() => {
              if (reducedMotion) {
                setStep(0);
                setPlaying(false);
              } else {
                setStep(0);
                setPlaying(true);
              }
            }}
            disabled={reducedMotion}
            aria-label={
              playing
                ? `${fileLabel} playing`
                : `Play ${fileLabel.toLowerCase()}`
            }
          >
            {playing
              ? `${fileLabel} playing…`
              : `Play ${fileLabel.toLowerCase()}`}
          </button>
          <div>
            <button
              onClick={() => {
                setPlaying(false);
                setStep((value) => Math.max(0, value - 1) as Step);
              }}
              disabled={step === 0}
            >
              Previous
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setStep((value) => Math.min(3, value + 1) as Step);
              }}
              disabled={step === 3}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="workshop-case-panel" aria-live="polite">
        <div className="workshop-case-identity">
          <div className="workshop-object-preview">
            {photo ? (
              <Image
                src={photo}
                width={78}
                height={78}
                unoptimized
                alt={`Photo attached to ${selected.object}`}
              />
            ) : (
              <span>
                {selected.mode === "sample"
                  ? "Sample object"
                  : "No photo attached"}
              </span>
            )}
          </div>
          <div>
            <span className="eyebrow">
              {categoryLabel(selected.category)} · {selected.object}
            </span>
            <h3>{selected.name}</h3>
            <p>{selected.title}</p>
          </div>
        </div>
        <div className="workshop-evidence-grid">
          <article data-active={step === 0 ? "" : undefined}>
            <span className="eyebrow">PHOTO</span>
            <p>
              {photo
                ? "Photo attached"
                : selected.mode === "sample"
                  ? "Sample object · no photo attached"
                  : "No photo attached"}
            </p>
          </article>
          <article data-active={step === 1 ? "" : undefined}>
            <span className="eyebrow">MEMORY</span>
            <p>{selected.memory?.trim() || "No memory shared"}</p>
          </article>
          <article data-active={step === 2 ? "" : undefined}>
            <span className="eyebrow">STORY</span>
            <blockquote>“{selected.quote}”</blockquote>
            <p>{selected.story}</p>
            <div className="workshop-traits">
              {selected.traits.map((trait) => (
                <span key={trait}>{trait}</span>
              ))}
            </div>
          </article>
        </div>
      </div>

      <div
        className="workshop-actions-panel"
        data-active={step === 3 ? "" : undefined}
      >
        <div className="workshop-actions-title">
          <div>
            <span className="eyebrow">
              NEXT CHAPTER · {selected.actions.length} FILED OPTIONS
            </span>
            <h3>Choose a real act of care.</h3>
          </div>
          <p>{selected.wish}</p>
        </div>
        <div className="workshop-action-trays">
          {selected.actions.map((action) => (
            <button
              key={action.kind}
              className="workshop-action-tray"
              data-kind={action.kind}
              data-selected={actionKind === action.kind ? "" : undefined}
              onClick={() => {
                setActionSelection({ caseId: selected.id, kind: action.kind });
                onOpenCase(selected);
              }}
            >
              <span className="workshop-action-kind">
                {action.kind === "pass-on"
                  ? "PASS ON"
                  : action.kind.toUpperCase()}
              </span>
              <b>{action.title}</b>
              <span>{action.detail}</span>
              <span className="workshop-file-action">
                Open case file <span aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </div>
        {selectedAction && (
          <p className="workshop-action-selected" role="status">
            Selected: {selectedAction.title}. The case file is open for this
            next step.
          </p>
        )}
        <p className="workshop-safety-note">
          Suggestions are general. Local rules and an item&apos;s condition can
          change the right next step. Electrical items need a qualified
          repairer.
        </p>
        <p className="workshop-safety-note">
          A case-file walkthrough; replay does not call AI. Isometric craft:{" "}
          <a
            className="workshop-credit"
            href="https://github.com/wheresryan22/anatomy"
            target="_blank"
            rel="noreferrer"
          >
            Anatomy · MIT
          </a>
          .
        </p>
      </div>
      {reducedMotion && (
        <p className="workshop-motion-note">
          Automatic motion is paused by your reduced-motion setting. Use the
          stage buttons to explore the machine.
        </p>
      )}
    </section>
  );
}
