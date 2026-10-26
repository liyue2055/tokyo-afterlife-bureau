"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Camera,
  X,
  Plus,
  Sparkles,
  BookOpen,
  Play,
  Volume2,
  VolumeX,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  FolderOpen,
  Leaf,
  RotateCcw,
  Share2,
  Pause,
  Upload,
  Home,
  Film,
  LoaderCircle,
} from "lucide-react";
import {
  samples,
  makeSample,
  type SpiritCase,
  type Category,
} from "../lib/cases";
import { assetUrl, isStaticPreview } from "../lib/runtime";
import dynamic from "next/dynamic";
const SpiritWorkshop = dynamic(
  () =>
    import("../components/spirit-workshop").then(
      (module) => module.SpiritWorkshop,
    ),
  {
    loading: () => (
      <section
        id="spirit-workshop"
        className="workshop-loading"
        aria-busy="true"
      >
        Opening the Spirit Workshop…
      </section>
    ),
  },
);
type View = "lobby" | "archive" | "demo" | "folklore";
const cats: { id: Category; label: string }[] = [
  { id: "umbrella", label: "Umbrella" },
  { id: "kettle", label: "Kettle" },
  { id: "lamp", label: "Lamp" },
  { id: "headphones", label: "Headphones" },
  { id: "other", label: "Something else" },
];
const beats = [
  {
    eyebrow: "01 / THE THINGS WE LEAVE BEHIND",
    heading: "It’s just an old umbrella.",
    body: "A bent rib. A forgotten corner. An object we stopped seeing.",
    voice:
      "In a city that moves as quickly as Tokyo, even the things we love can be left behind.",
  },
  {
    eyebrow: "02 / A LITTLE IMAGINATION",
    heading: "Until it has something to say.",
    body: "“I kept you dry through three rainy seasons. All I ask is one more.”",
    voice:
      "What if that forgotten umbrella could tell its story? Meet Amé, a small spirit with a very big memory.",
  },
  {
    eyebrow: "03 / A SECOND CHAPTER",
    heading: "Connection becomes action.",
    body: "A repair, a new purpose, or a new owner. Choose one small act of care.",
    voice:
      "Inspired by Japanese object-spirit folklore, Tokyo Afterlife Bureau turns a photograph and a memory into a character, a story, and a practical second-life plan.",
  },
  {
    eyebrow: "04 / YOUR TURN",
    heading: "What’s waiting in your drawer?",
    body: "Bring an object. Add a memory. Let a new chapter begin.",
    voice:
      "The character is imaginary. The next act of care is real. Give something forgotten another chapter.",
  },
];
function Spirit({
  category = "umbrella",
  className = "",
}: {
  category?: Category;
  className?: string;
}) {
  return (
    <svg
      className={"spirit " + className}
      viewBox="0 0 300 300"
      role="img"
      aria-label={`${category} spirit illustration`}
    >
      <ellipse
        cx="150"
        cy="263"
        rx="76"
        ry="10"
        fill="currentColor"
        opacity=".07"
      />
      {category === "umbrella" ? (
        <>
          <path
            d="M150 49C103 43 51 88 36 143Q58 123 77 144Q95 121 119 145Q143 120 166 145Q188 120 211 143Q236 124 263 142C243 84 199 47 150 49Z"
            fill="#ba5747"
            stroke="#39332f"
            strokeWidth="3"
          />
          <path
            d="M150 49L77 141M150 49L120 142M150 49L166 142M150 49L211 142"
            fill="none"
            stroke="#703d35"
            strokeWidth="2"
          />
          <path
            d="M150 145V239Q152 259 174 250Q184 244 176 233"
            fill="none"
            stroke="#625440"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <ellipse
            cx="148"
            cy="108"
            rx="23"
            ry="20"
            fill="#f9eed8"
            stroke="#39332f"
            strokeWidth="3"
          />
          <ellipse cx="148" cy="110" rx="8" ry="12" fill="#33332f" />
          <path
            d="M130 143Q145 168 163 144"
            fill="#d87e80"
            stroke="#39332f"
            strokeWidth="2"
          />
          <path
            d="M110 174L91 225L73 230M191 174L204 223L224 226"
            stroke="#39332f"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : category === "kettle" ? (
        <>
          <path
            d="M110 102Q102 57 150 57Q202 56 191 106"
            fill="none"
            stroke="#494d3c"
            strokeWidth="13"
          />
          <path
            d="M101 112Q69 115 73 160L50 135L32 149Q49 195 83 190Q91 244 151 244Q227 245 230 173Q230 117 188 112Z"
            fill="#94a28b"
            stroke="#3d4538"
            strokeWidth="3"
          />
          <path
            d="M100 111Q146 89 196 112"
            fill="#b9c0a6"
            stroke="#3d4538"
            strokeWidth="4"
          />
          <ellipse cx="149" cy="99" rx="13" ry="8" fill="#4a523f" />
          <path
            d="M115 166Q125 175 137 165M166 165Q177 175 189 164"
            stroke="#313b30"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M145 189Q154 201 164 188"
            fill="none"
            stroke="#313b30"
            strokeWidth="3"
          />
          <path
            d="M115 244L110 259M189 241L196 258"
            stroke="#3d4538"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      ) : category === "lamp" ? (
        <>
          <path
            d="M112 65H190L228 166H75Z"
            fill="#ddb558"
            stroke="#5d4930"
            strokeWidth="3"
          />
          <path
            d="M111 69L101 162M189 69L202 161"
            stroke="#b18b41"
            strokeWidth="2"
          />
          <ellipse cx="150" cy="168" rx="72" ry="9" fill="#f5d486" />
          <path
            d="M150 181V244M118 254Q150 231 184 254Z"
            stroke="#5d4930"
            strokeWidth="8"
            fill="#b28547"
            strokeLinecap="round"
          />
          <ellipse cx="131" cy="124" rx="4" ry="7" fill="#49392d" />
          <ellipse cx="174" cy="124" rx="4" ry="7" fill="#49392d" />
          <path
            d="M143 142Q153 152 164 140"
            stroke="#49392d"
            strokeWidth="3"
            fill="none"
          />
          <path d="M228 173V218" stroke="#5d4930" strokeWidth="2" />
          <circle cx="228" cy="221" r="5" fill="#5d4930" />
        </>
      ) : (
        <>
          <path
            d="M78 162V122Q78 51 150 51Q223 51 223 122V163"
            fill="none"
            stroke="#6d6790"
            strokeWidth="25"
          />
          <rect
            x="60"
            y="135"
            width="52"
            height="85"
            rx="24"
            fill="#9e91b7"
            stroke="#443d52"
            strokeWidth="3"
          />
          <rect
            x="188"
            y="135"
            width="52"
            height="85"
            rx="24"
            fill="#9e91b7"
            stroke="#443d52"
            strokeWidth="3"
          />
          <path
            d="M110 206Q153 251 192 207"
            stroke="#443d52"
            strokeWidth="4"
            fill="none"
          />
          <circle cx="83" cy="170" r="5" fill="#443d52" />
          <circle cx="216" cy="170" r="5" fill="#443d52" />
        </>
      )}
      <path
        d="M251 64V82M242 73H260M47 208V223M40 215H54"
        stroke="#9a8e70"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export default function Bureau() {
  const [view, setView] = useState<View>("lobby"),
    [saved, setSaved] = useState<SpiritCase[]>([]),
    [ready, setReady] = useState(false),
    [current, setCurrent] = useState<SpiritCase | null>(null),
    [lastCase, setLastCase] = useState<SpiritCase | null>(null),
    [wizard, setWizard] = useState(false),
    [step, setStep] = useState(0),
    [category, setCategory] = useState<Category>("umbrella"),
    [object, setObject] = useState(""),
    [memory, setMemory] = useState(""),
    [photo, setPhoto] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [ai, setAi] = useState(false),
    [tab, setTab] = useState("story"),
    [filter, setFilter] = useState("all"),
    [beat, setBeat] = useState(0),
    [playing, setPlaying] = useState(false),
    [sound, setSound] = useState(false),
    [present, setPresent] = useState(false),
    [media, setMedia] = useState<any>(null),
    [clip, setClip] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    file = useRef<HTMLInputElement>(null),
    stage = useRef<HTMLDivElement>(null),
    music = useRef<HTMLAudioElement>(null);
  const workshopCases = useMemo(() => {
    const cases = [...(lastCase ? [lastCase] : []), ...saved, ...samples];
    return [...new Map(cases.map((c) => [c.id, c])).values()];
  }, [lastCase, saved]);
  useEffect(() => {
    const readView = () => {
      setPlaying(false);
      setClip(false);
      const requested = new URL(window.location.href).searchParams.get("view");
      if (["lobby", "archive", "demo", "folklore"].includes(requested || ""))
        setView(requested as View);
      else setView("lobby");
    };
    readView();
    window.addEventListener("popstate", readView);
    const jump = setTimeout(() => {
      if (window.location.hash === "#spirit-workshop")
        document
          .getElementById("spirit-workshop")
          ?.scrollIntoView({ block: "start" });
    }, 150);
    return () => {
      window.removeEventListener("popstate", readView);
      clearTimeout(jump);
    };
  }, []);
  useEffect(() => {
    const syncFullscreen = () => {
      if (!document.fullscreenElement) setPresent(false);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  useEffect(() => {
    try {
      const raw = JSON.parse(
        localStorage.getItem("tokyo-afterlife-cases") || "[]",
      );
      if (Array.isArray(raw))
        setSaved(
          raw
            .filter(
              (c) => c && typeof c.id === "string" && Array.isArray(c.actions),
            )
            .slice(0, 20),
        );
    } catch {}
    setReady(true);
    if (!isStaticPreview) {
      fetch("/api/status")
        .then((r) => r.json())
        .then((r) => setAi(!!(r as { aiAvailable?: boolean }).aiAvailable))
        .catch(() => {});
    }
    fetch(assetUrl("/media/manifest.json"))
      .then((r) => (r.ok ? r.json() : null))
      .then(setMedia)
      .catch(() => {});
    if (!isStaticPreview && "serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => {
    if (wizard || current) {
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [wizard, current]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setBeat((b) => {
          if (b === 3) {
            setPlaying(false);
            return b;
          }
          return b + 1;
        }),
      9500,
    );
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!sound || !playing || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(beats[beat].voice);
    u.rate = 0.92;
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [beat, sound, playing]);
  useEffect(() => {
    if (music.current) {
      music.current.volume = 0.12;
      if (sound && playing) music.current.play().catch(() => {});
      else music.current.pause();
    }
  }, [sound, playing]);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 4500);
      return () => clearTimeout(t);
    }
  }, [notice]);
  useEffect(() => {
    if (present && view !== "demo") {
      setPresent(false);
      document.fullscreenElement && document.exitFullscreen().catch(() => {});
    }
  }, [view, present]);
  function nav(v: View) {
    const url = new URL(window.location.href);
    if (v === "lobby") url.searchParams.delete("view");
    else url.searchParams.set("view", v);
    url.hash = "";
    window.history.pushState({}, "", url);
    setView(v);
    setPlaying(false);
    setClip(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function persist(next: SpiritCase[]) {
    try {
      localStorage.setItem(
        "tokyo-afterlife-cases",
        JSON.stringify(next.slice(0, 20)),
      );
      setSaved(next.slice(0, 20));
      return true;
    } catch {
      setNotice(
        "Device storage is full or unavailable. Download this case to keep it.",
      );
      return false;
    }
  }
  function openCase(c: SpiritCase) {
    setCurrent(c);
    setTab("story");
    setError("");
  }
  function start() {
    setCurrent(null);
    setWizard(true);
    setStep(0);
    setObject("");
    setMemory("");
    setPhoto("");
    setError("");
    setCategory("umbrella");
  }
  function close() {
    if (busy) return;
    setWizard(false);
    setCurrent(null);
    setError("");
    window.speechSynthesis?.cancel();
  }
  async function image(f?: File) {
    if (!f) return;
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ].includes(f.type)
    ) {
      setError(
        "Choose a JPG, PNG or WebP photo. If your iPhone uses HEIC, export it as JPG first.",
      );
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("Please choose a photo smaller than 20 MB.");
      return;
    }
    setError("");
    try {
      const url = URL.createObjectURL(f);
      try {
        const img = new Image();
        img.src = url;
        await img.decode();
        const canvas = document.createElement("canvas"),
          scale = Math.min(1, 800 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas
          .getContext("2d")!
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.72));
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      setError("This photo could not be opened. Please try a JPG or PNG.");
    }
  }
  async function awaken(live: boolean) {
    setBusy(true);
    setError("");
    try {
      let c: SpiritCase;
      if (live) {
        const res = await fetch("/api/awaken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            object: object.trim(),
            memory: memory.trim(),
            photo,
          }),
          signal: AbortSignal.timeout(65000),
        });
        const d = (await res.json()) as { error?: string; case: SpiritCase };
        if (!res.ok)
          throw new Error(d.error || "The bureau is busy. Please try again.");
        c = d.case;
      } else {
        c = makeSample(category, object.trim(), memory.trim(), photo);
      }
      setLastCase(c);
      setWizard(false);
      openCase(c);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not create your case. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function pledge(kind: string) {
    if (!current) return;
    const c = { ...current, pledge: kind };
    setCurrent(c);
    if (persist([c, ...saved.filter((s) => s.id !== c.id)]))
      setNotice(
        "A new chapter, officially filed. Your promise is saved on this device.",
      );
  }
  async function download(c: SpiritCase) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1440;
    const x = canvas.getContext("2d")!;
    x.fillStyle = "#f4f0e7";
    x.fillRect(0, 0, 1080, 1440);
    x.fillStyle = "#2d303f";
    x.font = "24px sans-serif";
    x.fillText("TOKYO AFTERLIFE BUREAU", 70, 90);
    x.strokeStyle = "#b9b3a8";
    x.strokeRect(40, 40, 1000, 1360);
    x.font = "72px Georgia";
    x.fillText(c.name.slice(0, 24), 70, 190);
    x.font = "24px sans-serif";
    x.fillText(c.title.slice(0, 65), 70, 235);
    const svg = document.querySelector("#case-spirit svg") as SVGElement | null;
    if (svg) {
      try {
        const img = new Image();
        img.src =
          "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(new XMLSerializer().serializeToString(svg));
        await img.decode();
        x.drawImage(img, 310, 270, 460, 460);
      } catch {}
    }
    x.fillStyle = "#2d303f";
    function wrap(t: string, y: number, font: string, width = 925) {
      x.font = font;
      let line = "";
      for (const w of t.split(" ")) {
        if (x.measureText(line + w).width > width) {
          x.fillText(line, 75, y);
          line = "";
          y += 40;
        }
        line += w + " ";
      }
      x.fillText(line, 75, y);
      return y + 60;
    }
    let y = wrap("“" + c.quote + "”", 785, "italic 32px Georgia");
    y = wrap(c.wish, y, "27px sans-serif");
    wrap(
      "My next chapter: " + (c.pledge || "Still being written"),
      y + 10,
      "24px sans-serif",
    );
    x.font = "20px sans-serif";
    x.fillText(
      (c.mode === "sample" ? "SAMPLE STORY" : "AI-GENERATED FICTION") +
        " · A spirit of your imagination",
      75,
      1330,
    );
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const f = new File([blob], "tokyo-afterlife-" + c.name + ".png", {
        type: "image/png",
      });
      try {
        if (navigator.canShare?.({ files: [f] })) {
          await navigator.share({
            files: [f],
            title: c.name + " — Tokyo Afterlife Bureau",
          });
          return;
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = f.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    }, "image/png");
  }
  const visible = saved.filter(
    (c) => filter === "all" || (filter === "promised" ? c.pledge : !c.pledge),
  );
  return (
    <>
      <header className="header">
        <button
          className="brand"
          onClick={() => nav("lobby")}
          aria-label="Tokyo Afterlife Bureau home"
        >
          <span className="brand-seal">物</span>
          <span>
            TOKYO
            <br />
            <b>AFTERLIFE BUREAU</b>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {(["lobby", "archive", "demo", "folklore"] as View[]).map((v) => (
            <button
              key={v}
              aria-current={view === v ? "page" : undefined}
              className={view === v ? "active" : ""}
              onClick={() => nav(v)}
            >
              {v === "lobby"
                ? "The bureau"
                : v === "archive"
                  ? "My case files"
                  : v === "demo"
                    ? "Demo room"
                    : "The inspiration"}
              {v === "demo" && <span className="tiny-dot" />}
            </button>
          ))}
        </nav>
        <button className="header-cta" onClick={start}>
          File an object <Plus size={16} />
        </button>
      </header>
      {isStaticPreview && (
        <div className="static-demo-note">
          <span>PUBLIC DEMO</span> Explore sample spirits. Your photos stay on
          your device.
        </div>
      )}
      <main className={present ? "presentation" : ""}>
        {view === "lobby" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="status-dot" /> DEPARTMENT OF SECOND CHANCES ·
                  TOKYO
                </div>
                <h1>
                  A little forgotten.
                  <br />A lot of <em>soul.</em>
                  <span className="headline-spark">✳</span>
                </h1>
                <p>
                  That old umbrella. The chipped cup.
                  <br className="desktop-break" /> Some things aren’t done
                  telling their story.
                </p>
                <div className="hero-buttons">
                  <button className="primary" onClick={start}>
                    {isStaticPreview
                      ? "Create a sample spirit"
                      : "Awaken an object"}{" "}
                    <Sparkles size={18} />
                  </button>
                  <button className="text-button" onClick={() => nav("demo")}>
                    <span className="play-circle">
                      <Play size={12} fill="currentColor" />
                    </span>
                    See the magic
                  </button>
                </div>
                <div className="hero-note">
                  <span className="hand-arrow">↳</span> A photo, a memory, a
                  whole new chapter.
                </div>
              </div>
              <div className="hero-art">
                <span className="art-index">FIELD NOTES / 001</span>
                <img
                  src={assetUrl("/spirits.png")}
                  alt="Hand-painted spirits: a one-eyed red umbrella, a sleepy green kettle, and a golden lamp"
                  fetchPriority="high"
                />
                <span className="art-caption">
                  Ordinary objects. Extraordinary inner lives.
                </span>
                <span className="round-stamp">
                  FORGOTTEN
                  <br />
                  <b>≠</b>
                  <br />
                  FINISHED
                </span>
              </div>
            </section>
            <div className="ticker">
              <span>NOT LOST. JUST WAITING.</span>
              <span>✳</span>
              <span>A LITTLE FOLKLORE. A LITTLE AI. A LITTLE CARE.</span>
              <span>✳</span>
              <span>SECOND CHANCES ACCEPTED DAILY.</span>
              <span>✳</span>
            </div>
            <section className="section intake">
              <div>
                <div className="eyebrow">THE PROCESS</div>
                <h2>
                  Small ritual.
                  <br />
                  <em>New beginning.</em>
                </h2>
                <p>
                  No perfect photos. No special objects.
                  <br />
                  Just something you haven’t given up on.
                </p>
              </div>
              <div className="process-grid">
                {[
                  {
                    n: "01",
                    icon: <Camera />,
                    title: "Bring a forgotten thing",
                    body: "Take a photo, or pick a sample from the bureau.",
                  },
                  {
                    n: "02",
                    icon: <Sparkles />,
                    title: "Meet the spirit inside",
                    body: "Add a memory. Discover a personality, a story, a wish.",
                  },
                  {
                    n: "03",
                    icon: <Heart />,
                    title: "Give it a next chapter",
                    body: "Repair it. Reimagine it. Pass it on with care.",
                  },
                ].map((p) => (
                  <article className="process" key={p.n}>
                    <span className="process-number">{p.n}</span>
                    <div className="process-icon">{p.icon}</div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="section residents">
              <div className="section-head">
                <div>
                  <div className="eyebrow">RECENT ARRIVALS · SAMPLE CASES</div>
                  <h2>They have a few things to say.</h2>
                </div>
                <span className="hand-note">tap a spirit to meet them ↙</span>
              </div>
              <div className="case-grid">
                {samples.map((c, i) => (
                  <button
                    className={"case-card color-" + i}
                    key={c.id}
                    onClick={() => openCase(c)}
                  >
                    <div className="case-top">
                      <span>CASE / {String(i + 1).padStart(3, "0")}</span>
                      <ArrowUpRight size={19} />
                    </div>
                    <Spirit category={c.category} />
                    <div className="case-label">
                      <span>{c.object}</span>
                      <h3>{c.name}</h3>
                      <p>“{c.quote}”</p>
                      <span className="pill">
                        {c.traits[0]} <span>✦</span> {c.traits[1]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
            <section className="culture-banner">
              <span className="culture-glyph" aria-hidden="true">
                物
              </span>
              <div>
                <div className="eyebrow">
                  ROOTED IN FOLKLORE. OPEN TO IMAGINATION.
                </div>
                <h2>What if the things around us had a soul?</h2>
                <p>
                  Inspired by Japan’s tsukumogami tradition, we’re imagining a
                  more caring relationship with everyday things.
                </p>
              </div>
              <button className="outline" onClick={() => nav("folklore")}>
                Read the inspiration <ArrowUpRight size={17} />
              </button>
            </section>
          </>
        )}
        {view === "archive" && (
          <section className="section archive">
            <div className="eyebrow">YOUR PERSONAL REGISTRY</div>
            <div className="section-head">
              <div>
                <h1>
                  Every case.
                  <br />
                  <em>A new possibility.</em>
                </h1>
                <p>Your spirits and promises, kept on this device.</p>
              </div>
              <button className="primary" onClick={start}>
                File an object <Plus size={17} />
              </button>
            </div>
            <div className="filter-row">
              {[
                ["all", "All files"],
                ["promised", "Promises made"],
                ["waiting", "Awaiting a chapter"],
              ].map(([v, l]) => (
                <button
                  className={filter === v ? "selected" : ""}
                  onClick={() => setFilter(v)}
                  key={v}
                >
                  {l}
                </button>
              ))}
              <span>
                {visible.length} {visible.length === 1 ? "case" : "cases"}
              </span>
            </div>
            {ready && visible.length === 0 ? (
              <div className="empty">
                <FolderOpen size={42} strokeWidth={1} />
                <h2>
                  {saved.length
                    ? "No cases in this drawer."
                    : "The drawers are waiting."}
                </h2>
                <p>
                  Meet a sample spirit or awaken your own, then save its case
                  file here.
                </p>
                <button
                  className="outline"
                  onClick={() => openCase(samples[0])}
                >
                  Meet Amé <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div className="case-grid">
                {visible.map((c, i) => (
                  <div className={"case-card color-" + (i % 3)} key={c.id}>
                    <button className="saved-case" onClick={() => openCase(c)}>
                      <div className="case-top">
                        <span>
                          {c.mode === "sample" ? "SAMPLE CASE" : "AI CASE"}
                        </span>
                        <ArrowUpRight size={18} />
                      </div>
                      <Spirit category={c.category} />
                      <div className="case-label">
                        <h3>{c.name}</h3>
                        <p>{c.pledge ? "♡ " + c.pledge : c.title}</p>
                      </div>
                    </button>
                    <button
                      className="delete-case"
                      onClick={() => {
                        if (confirm("Remove this case from this device?"))
                          persist(saved.filter((s) => s.id !== c.id));
                      }}
                    >
                      Remove case
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {view === "demo" && (
          <section className="section demo-room">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  THE DEMO ROOM · MADE FOR SHOW & TELL
                </div>
                <h1>
                  From forgotten
                  <br />
                  to <em>unforgettable.</em>
                </h1>
              </div>
              <button
                className="outline"
                onClick={async () => {
                  setPresent(!present);
                  if (!present)
                    await stage.current?.requestFullscreen?.().catch(() => {});
                  else if (document.fullscreenElement)
                    await document.exitFullscreen().catch(() => {});
                }}
              >
                {present ? "Exit presentation" : "Presentation mode"}{" "}
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div
              ref={stage}
              className={"demo-stage beat-" + beat}
              tabIndex={0}
              role="region"
              aria-label="Four-scene presentation. Use left and right arrow keys to change scenes; Space to play or pause."
              onKeyDown={(event) => {
                if ((event.target as HTMLElement).tagName === "VIDEO") return;
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  setClip(false);
                  setPlaying(false);
                  setBeat((b) =>
                    Math.max(
                      0,
                      Math.min(3, b + (event.key === "ArrowRight" ? 1 : -1)),
                    ),
                  );
                }
                if (event.key === " " && event.target === event.currentTarget) {
                  event.preventDefault();
                  setPlaying((p) => !p);
                }
              }}
            >
              <div className="demo-stage-top">
                <span>TOKYO AFTERLIFE BUREAU</span>
                <span>
                  {clip ? "THE SHORT FILM" : "AN OBJECT’S SECOND CHANCE"}
                </span>
              </div>
              {clip ? (
                <video
                  className="demo-video"
                  src={assetUrl("/media/bureau-trailer.mp4")}
                  controls
                  autoPlay
                  playsInline
                  poster={assetUrl("/spirits.png")}
                >
                  <track
                    kind="captions"
                    src={assetUrl("/media/bureau-trailer.vtt")}
                    srcLang="en"
                    label="English"
                    default
                  />
                </video>
              ) : (
                <div className="demo-content">
                  <div className="demo-visual">
                    <div className={"reveal-halo " + (beat > 0 ? "awake" : "")}>
                      {beat === 1 &&
                      media?.assets?.some((a: any) => a.kind === "video") ? (
                        <video
                          className="spirit-clip"
                          src={assetUrl("/media/umbrella-awakening.mp4")}
                          poster={assetUrl("/media/umbrella-poster.jpg")}
                          autoPlay
                          loop
                          muted
                          playsInline
                          aria-label="AI-generated umbrella spirit awakening"
                        />
                      ) : (
                        <Spirit category="umbrella" />
                      )}
                    </div>
                    <span className="sample-tag">
                      {beat === 0
                        ? "ONE FORGOTTEN UMBRELLA"
                        : beat === 1
                          ? "AMÉ · THE RAINKEEPER"
                          : beat === 2
                            ? "A PROMISE TO REPAIR"
                            : "YOUR OBJECT COULD BE NEXT"}
                    </span>
                  </div>
                  <div className="demo-words" key={beat}>
                    <div className="eyebrow">{beats[beat].eyebrow}</div>
                    <h2>{beats[beat].heading}</h2>
                    <p>{beats[beat].body}</p>
                    {beat === 3 && (
                      <button
                        className="cream-button"
                        onClick={() => {
                          setPlaying(false);
                          openCase(samples[0]);
                        }}
                      >
                        Try the sample case <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="demo-controls">
                <button
                  className="icon-button"
                  aria-label={
                    playing ? "Pause presentation" : "Play presentation"
                  }
                  onClick={() => {
                    setClip(false);
                    if (beat === 3) setBeat(0);
                    setPlaying(!playing);
                  }}
                >
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="beat-progress">
                  {beats.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Show scene ${i + 1}`}
                      aria-current={beat === i ? "step" : undefined}
                      className={beat === i ? "active" : ""}
                      onClick={() => {
                        setClip(false);
                        setBeat(i);
                      }}
                    >
                      <span />0{i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="icon-button"
                  aria-label={
                    sound
                      ? "Mute narration and music"
                      : "Enable narration and music"
                  }
                  onClick={() => setSound(!sound)}
                >
                  {sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
                </button>
                <span className="sound-label">
                  {sound ? "Sound on" : "Sound off"}
                </span>
              </div>
              {media?.assets?.some((a: any) => a.kind === "music") && (
                <audio
                  ref={music}
                  src={assetUrl("/media/bureau-score.mp3")}
                  loop
                  preload="none"
                />
              )}
            </div>
            <div className="demo-actions">
              <p>
                <span className="status-dot" /> Click play for the four-scene
                demo. Sound starts only when enabled.
              </p>
              {media?.assets?.some((a: any) => a.kind === "trailer") && (
                <button
                  className="text-button"
                  onClick={() => {
                    setPlaying(false);
                    setClip(true);
                  }}
                >
                  <Film size={18} /> Watch the narrated short film{" "}
                  <ArrowUpRight size={15} />
                </button>
              )}
            </div>
            <div className="workshop-jump">
              <a href="#spirit-workshop" className="text-button">
                Explore the Spirit Workshop <ArrowRight size={16} />
              </a>
              <span>Presentation keys: ← → scenes · Space play / pause</span>
            </div>
            <SpiritWorkshop
              cases={workshopCases}
              onOpenCase={(c) => {
                openCase(c);
                setTab("chapter");
              }}
              onStart={start}
            />
            <div className="explain-grid">
              <article>
                <span className="eyebrow">THE PROBLEM</span>
                <h3>We stop seeing what we own.</h3>
                <p>
                  Forgotten objects often lose our attention before they lose
                  their usefulness. Could a story make us care again?
                </p>
              </article>
              <article>
                <span className="eyebrow">THE EXPERIENCE</span>
                <h3>Photo + memory → a spirit.</h3>
                <p>
                  In live AI mode, a vision model reads the photo and memory,
                  then writes a fictional personality and story. Sample mode
                  uses authored examples. Spirit portraits are illustrated
                  archetypes.
                </p>
              </article>
              <article>
                <span className="eyebrow">THE OUTCOME</span>
                <h3>A small, real act of care.</h3>
                <p>
                  Choose a practical repair, reuse, or pass-on action. Save your
                  promise and export the character card. Promises reflect
                  intent; they aren’t measured waste savings.
                </p>
              </article>
            </div>
            <div className="build-notes">
              <div>
                <span className="eyebrow">HONESTLY MADE</span>
                <h3>What’s real. What’s imagined.</h3>
              </div>
              <p>
                {isStaticPreview ? (
                  <>
                    These characters are original fiction inspired by folklore.
                    This public demo uses authored sample stories and
                    illustrated portraits. Photos and memories stay on your
                    device. The interactive workshop, saved cases, and card
                    export work here; live AI story generation runs in the
                    server-hosted version. Browser narration depends on your
                    device.
                  </>
                ) : (
                  <>
                    The stories and characters are fiction inspired by folklore.
                    The hero artwork is AI-generated. The short film combines
                    animated artwork, a Duomi-generated Grok video, ElevenLabs
                    narration, and generated music. Live case generation is{" "}
                    {ai ? "connected" : "not connected yet"}; sample cases work
                    without a key. Browser narration depends on your device.
                  </>
                )}
              </p>
            </div>
          </section>
        )}
        {view === "folklore" && (
          <section className="section folklore">
            <div className="eyebrow">A NOTE FROM THE BUREAU</div>
            <h1>
              Ordinary things.
              <br />
              <em>Older stories.</em>
            </h1>
            <div className="folklore-layout">
              <div className="folklore-art">
                <Spirit category="umbrella" />
                <span>NEW CHARACTER / OLD INSPIRATION</span>
              </div>
              <article>
                <h2>A little context, with care.</h2>
                <p>
                  Tokyo Afterlife Bureau takes creative inspiration from
                  tsukumogami: object spirits depicted in Japanese folklore and
                  art. We use that idea as an invitation to notice and care for
                  everyday things.
                </p>
                <p>
                  The National Diet Library’s public-domain gallery includes{" "}
                  <em>Tsukumogami Emaki</em>, an example of this rich visual
                  tradition.
                </p>
                <p>
                  Our spirits, dialogue, and case files are newly invented. They
                  are not traditional legends, historical testimony, or
                  religious guidance. Tokyo is our creative setting; the
                  tradition belongs to a much wider Japanese cultural history.
                </p>
                <a
                  className="outline"
                  href="https://ndlsearch.ndl.go.jp/en/gallery"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore the NDL Gallery <ArrowUpRight size={17} />
                </a>
                <h3>Imagination with a practical purpose.</h3>
                <p>
                  We pair fictional stories with modest, category-based
                  suggestions. Electrical objects should be checked by a
                  qualified repairer. Recycling and donation rules depend on
                  your municipality and the object’s condition.
                </p>
                <button className="primary" onClick={start}>
                  Give something a second chapter <ArrowRight size={17} />
                </button>
              </article>
            </div>
          </section>
        )}
      </main>
      <footer>
        <div className="footer-brand">
          <span className="brand-seal small">物</span>
          <span>TOKYO AFTERLIFE BUREAU</span>
        </div>
        <span>A spirit of your imagination. An act of your care.</span>
        <span>EST. 2026 · OPEN TO SECOND CHANCES</span>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[
          { id: "lobby", label: "Bureau", icon: <Home /> },
          { id: "archive", label: "My files", icon: <FolderOpen /> },
          { id: "demo", label: "Demo room", icon: <Play /> },
          { id: "folklore", label: "Inspiration", icon: <BookOpen /> },
        ].map((v) => (
          <button
            key={v.id}
            aria-current={view === v.id ? "page" : undefined}
            className={view === v.id ? "active" : ""}
            onClick={() => nav(v.id as View)}
          >
            {v.icon}
            <span>{v.label}</span>
          </button>
        ))}
      </nav>
      <dialog
        ref={dialog}
        className="case-dialog"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="dialog-shell">
          <div className="dialog-header">
            <span className="eyebrow">
              TOKYO AFTERLIFE BUREAU / {wizard ? "NEW INTAKE" : "CASE FILE"}
            </span>
            <button
              className="icon-button"
              aria-label="Close case"
              onClick={close}
              disabled={busy}
            >
              <X size={22} />
            </button>
          </div>
          {wizard && (
            <div className="wizard">
              <div className="wizard-progress">
                <span className={step === 0 ? "active" : ""}>
                  01 THE OBJECT
                </span>
                <span>—</span>
                <span className={step === 1 ? "active" : ""}>
                  02 THE MEMORY
                </span>
              </div>
              <h2>
                {step === 0
                  ? "Every object starts somewhere."
                  : "Tell us a little about it."}
              </h2>
              <p className="muted">
                {step === 0
                  ? "What’s been waiting for a second chance?"
                  : "A memory gives the spirit something to hold on to."}
              </p>
              {step === 0 ? (
                <>
                  <button
                    className={"photo-drop " + (photo ? "has-photo" : "")}
                    onClick={() => file.current?.click()}
                  >
                    {photo ? (
                      <>
                        <img src={photo} alt="Your object preview" />
                        <span>
                          Change photo <Camera size={16} />
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera size={32} strokeWidth={1.3} />
                        <b>Take a photo or choose one</b>
                        <span>JPG, PNG or WebP · up to 20 MB</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={file}
                    key="object-photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      image(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <label className="field-label">What kind of object?</label>
                  <div className="category-options">
                    {cats.map((c) => (
                      <button
                        className={category === c.id ? "selected" : ""}
                        onClick={() => setCategory(c.id)}
                        key={c.id}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <p className="privacy-note">
                    Photos are resized on your device. Sample mode never uploads
                    them.
                  </p>
                  <button
                    className="primary wide"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                  >
                    Next: add a memory <ArrowRight size={17} />
                  </button>
                  <button
                    className="text-button center"
                    onClick={() => {
                      setWizard(false);
                      openCase(samples[0]);
                    }}
                  >
                    Just looking? Meet a sample spirit
                  </button>
                </>
              ) : (
                <>
                  <label className="field-label" htmlFor="object-name">
                    What do you call it?
                  </label>
                  <input
                    key="object-name"
                    id="object-name"
                    value={object}
                    maxLength={70}
                    placeholder="The umbrella from my first Tokyo summer"
                    onChange={(e) => setObject(e.target.value)}
                  />
                  <label className="field-label" htmlFor="memory">
                    A memory, a flaw, or a reason you kept it{" "}
                    <span>(optional)</span>
                  </label>
                  <textarea
                    id="memory"
                    value={memory}
                    maxLength={700}
                    rows={4}
                    placeholder="It kept me dry on my walk home. One rib is bent, but I can’t quite throw it away…"
                    onChange={(e) => setMemory(e.target.value)}
                  />
                  <div className="mode-notice">
                    <Sparkles size={18} />
                    <p>
                      {ai
                        ? "Live AI is connected. Creating a spirit sends this photo and memory to our AI provider. Cases stay on this device unless you export them."
                        : isStaticPreview
                          ? "This public demo gives your object an authored sample story. Photos and memories stay on your device; no AI request is made."
                          : "You’re in sample mode. Your object will receive an authored sample story for its category. Live AI is not connected yet."}
                    </p>
                  </div>
                  <button
                    className="primary wide"
                    disabled={busy || !object.trim()}
                    onClick={() => awaken(ai)}
                  >
                    {busy ? (
                      <>
                        <LoaderCircle className="spin" size={18} />
                        Listening for a little soul…
                      </>
                    ) : (
                      <>
                        {ai ? "Awaken my object" : "Create a sample spirit"}{" "}
                        <Sparkles size={18} />
                      </>
                    )}
                  </button>
                  {ai && (
                    <button
                      className="text-button center"
                      disabled={busy || !object.trim()}
                      onClick={() => awaken(false)}
                    >
                      Use sample mode instead
                    </button>
                  )}
                  <button
                    className="text-button center"
                    disabled={busy}
                    onClick={() => setStep(0)}
                  >
                    <ChevronLeft size={16} />
                    Back to the object
                  </button>
                </>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}
          {current && (
            <>
              <div className="case-reveal">
                <div className="case-meta">
                  <span>
                    {current.mode === "sample"
                      ? "AUTHORED SAMPLE"
                      : "AI-GENERATED FICTION"}
                  </span>
                  <span>
                    {current.pledge
                      ? "♡ PROMISE FILED"
                      : "AWAITING A NEW CHAPTER"}
                  </span>
                </div>
                <div
                  className={
                    "portrait color-" +
                    (current.category === "umbrella"
                      ? 0
                      : current.category === "kettle"
                        ? 1
                        : 2)
                  }
                  id="case-spirit"
                >
                  <Spirit category={current.category} />
                  {current.photo && (
                    <img
                      className="original-photo"
                      src={current.photo}
                      alt="Original object"
                    />
                  )}
                  <span className="portrait-label">
                    SPIRIT PORTRAIT · ILLUSTRATED ARCHETYPE
                  </span>
                </div>
                <div className="reveal-title">
                  <span className="eyebrow">{current.object}</span>
                  <h2>{current.name}</h2>
                  <p>{current.title}</p>
                  <div className="trait-row">
                    {current.traits.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div
                  className="case-tabs"
                  role="tablist"
                  aria-label="Case sections"
                >
                  {[
                    ["story", "Their story"],
                    ["chapter", "Next chapter"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={tab === v}
                      onClick={() => setTab(v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {tab === "story" ? (
                  <div className="story-body">
                    <blockquote>“{current.quote}”</blockquote>
                    <p>{current.story}</p>
                    {current.memory && (
                      <div className="memory-note">
                        <span className="eyebrow">YOUR MEMORY</span>
                        <p>{current.memory}</p>
                      </div>
                    )}
                    <div className="spirit-wish">
                      <Heart size={20} />
                      <div>
                        <span className="eyebrow">ONE LITTLE WISH</span>
                        <p>{current.wish}</p>
                      </div>
                    </div>
                    <button
                      className="primary wide"
                      onClick={() => setTab("chapter")}
                    >
                      Write the next chapter <ArrowRight size={17} />
                    </button>
                  </div>
                ) : (
                  <div className="story-body">
                    <p className="muted">
                      Choose one act of care. A promise is a beginning.
                    </p>
                    {current.actions.map((a) => (
                      <button
                        className={
                          "action-card " +
                          (current.pledge === a.title ? "chosen" : "")
                        }
                        key={a.kind}
                        onClick={() => pledge(a.title)}
                      >
                        <span className="action-symbol">
                          {a.kind === "repair" ? (
                            <RotateCcw />
                          ) : a.kind === "reuse" ? (
                            <Leaf />
                          ) : (
                            <Heart />
                          )}
                        </span>
                        <span>
                          <b>{a.title}</b>
                          <p>{a.detail}</p>
                        </span>
                        {current.pledge === a.title ? (
                          <Check size={20} />
                        ) : (
                          <Plus size={20} />
                        )}
                      </button>
                    ))}
                    <p className="privacy-note">
                      Suggestions are general. Check local rules and use a
                      qualified repairer for electrical items.
                    </p>
                  </div>
                )}
                <div className="case-footer">
                  <button
                    className="outline"
                    onClick={() => {
                      if (
                        persist([
                          current,
                          ...saved.filter((c) => c.id !== current.id),
                        ])
                      )
                        setNotice(
                          "Case filed. Find it in My case files on this device.",
                        );
                    }}
                  >
                    <FolderOpen size={16} />
                    {saved.some((c) => c.id === current.id)
                      ? "Saved on device"
                      : "Save case"}
                  </button>
                  <button className="outline" onClick={() => download(current)}>
                    <Share2 size={16} /> Share / export
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog>
      {notice && (
        <div className="toast" role="status">
          <Check size={18} />
          {notice}
        </div>
      )}
    </>
  );
}
