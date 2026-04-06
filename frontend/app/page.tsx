"use client";

import { useState, useEffect, useRef } from "react";
import s from "./page.module.css";

const API = "/api";

type Size = "small" | "medium" | "large";

interface Cfg {
  url: string; qr_color: string; bg_color: string;
  size: Size; filename: string;
}

interface HistItem extends Cfg { id: string; image: string; ts: string; }

const DEFAULTS: Cfg = {
  url: "", qr_color: "#f5a623", bg_color: "#080808",
  size: "medium", filename: "qrcode",
};

export default function Home() {
  const [cfg, setCfg]           = useState<Cfg>(DEFAULTS);
  const [preview, setPreview]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [valid, setValid]       = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [hist, setHist]         = useState<HistItem[]>([]);
  const [theme, setTheme]       = useState<"dark"|"light">("dark");
  const [tab, setTab]           = useState<"forge"|"history">("forge");
  const [copied, setCopied]     = useState(false);
  const [toastMsg, setToastMsg] = useState<string|null>(null);
  const valRef  = useRef<ReturnType<typeof setTimeout>|null>(null);
  const prevRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("qrforge_hist");
    if (saved) setHist(JSON.parse(saved));
  }, []);

  // URL validation
  useEffect(() => {
    if (!cfg.url) { setValid(null); return; }
    if (valRef.current) clearTimeout(valRef.current);
    valRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const r = await fetch(`${API}/api/qr/validate`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: cfg.url }),
        });
        setValid((await r.json()).valid);
      } catch { setValid(false); }
      finally { setChecking(false); }
    }, 450);
  }, [cfg.url]);

  // Live preview
  useEffect(() => {
    if (!cfg.url || !valid) { if (!valid) setPreview(null); return; }
    if (prevRef.current) clearTimeout(prevRef.current);
    prevRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API}/api/qr/preview`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cfg),
        });
        setPreview((await r.json()).image);
      } catch {}
      finally { setLoading(false); }
    }, 550);
  }, [cfg, valid]);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const download = async (fmt: "png"|"svg") => {
    if (!valid || !preview) return;
    try {
      const r = await fetch(`${API}/api/qr/download/${fmt}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cfg, format: fmt }),
      });
      const blob = await r.blob();
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: `${cfg.filename || "qrcode"}.${fmt}`,
      });
      a.click();
      URL.revokeObjectURL(a.href);
      saveHist();
      toast(`Downloaded as ${fmt.toUpperCase()}`);
    } catch { toast("Download failed"); }
  };

  const copyImg = async () => {
    if (!preview) return;
    try {
      const blob = await (await fetch(preview)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true); toast("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast("Copy not supported in this browser"); }
  };

  const saveHist = () => {
    if (!preview) return;
    const item: HistItem = { ...cfg, id: Date.now().toString(), image: preview, ts: new Date().toLocaleString() };
    const updated = [item, ...hist].slice(0, 12);
    setHist(updated);
    localStorage.setItem("qrforge_hist", JSON.stringify(updated));
  };

  const set = (k: keyof Cfg, v: string) => setCfg(c => ({ ...c, [k]: v }));
  const canAct = !!valid && !!preview;

  return (
    <div className={s.root} data-theme={theme}>
      {/* Toast */}
      {toastMsg && <div className={s.toast}>{toastMsg}</div>}

      {/* Header */}
      <header className={`${s.header} afu`}>
        <div className={s.brand}>
          <span className={s.brandMark}>◈</span>
          <span className={s.brandName}>QR<em>FORGE</em></span>
        </div>
        <nav className={s.nav}>
          <button className={`${s.navBtn} ${tab==="forge"?s.navActive:""}`} onClick={()=>setTab("forge")}>Forge</button>
          <button className={`${s.navBtn} ${tab==="history"?s.navActive:""}`} onClick={()=>setTab("history")}>
            History{hist.length>0&&<span className={s.pill}>{hist.length}</span>}
          </button>
          <button className={s.themeBtn} onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} title="Toggle theme">
            {theme==="dark"?"○":"●"}
          </button>
        </nav>
      </header>

      {tab === "forge" && (
        <>
          {/* Hero */}
          <section className={`${s.hero} afu d1`}>
            <p className={s.heroEyebrow}>URL → QR · INSTANT · FREE</p>
            <h1 className={s.heroTitle}>FORGE YOUR<br/><span className={s.heroGold}>QR CODE</span></h1>
            <p className={s.heroSub}>Custom colors · PNG & SVG export · Live preview</p>
          </section>

          {/* Main */}
          <main className={`${s.workspace} afu d2`}>

            {/* Left — Controls */}
            <div className={s.controls}>

              {/* URL */}
              <div className={s.field}>
                <label className={s.label}>
                  <span>TARGET URL</span>
                  {checking && <span className={s.checking}>checking…</span>}
                  {!checking && valid===true  && <span className={s.ok}>✓ valid</span>}
                  {!checking && valid===false && <span className={s.err}>✗ invalid</span>}
                </label>
                <div className={s.inputRow}>
                  <input
                    className={`${s.urlInput} ${cfg.url?(valid?s.inputOk:s.inputErr):""}`}
                    type="url" placeholder="https://your-url.com"
                    value={cfg.url}
                    onChange={e=>set("url",e.target.value)}
                  />
                </div>
                {valid===false && cfg.url && (
                  <p className={s.hintErr}>Must start with https:// or http://</p>
                )}
              </div>

              {/* Divider */}
              <div className={s.divider}><span>CUSTOMISE</span></div>

              {/* Size */}
              <div className={s.field}>
                <label className={s.label}>SIZE</label>
                <div className={s.sizeRow}>
                  {(["small","medium","large"] as Size[]).map(sz=>(
                    <button key={sz} className={`${s.sizeBtn} ${cfg.size===sz?s.sizeSel:""}`}
                      onClick={()=>set("size",sz)}>
                      <span className={s.sizeDot} style={{width:sz==="small"?10:sz==="medium"?14:18,height:sz==="small"?10:sz==="medium"?14:18}}/>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className={s.field}>
                <label className={s.label}>COLORS</label>
                <div className={s.colorRow}>
                  <div className={s.colorCard}>
                    <span className={s.colorLabel}>QR</span>
                    <label className={s.colorSwatch} style={{background:cfg.qr_color}}>
                      <input type="color" value={cfg.qr_color} onChange={e=>set("qr_color",e.target.value)}/>
                    </label>
                    <span className={s.colorHex}>{cfg.qr_color.toUpperCase()}</span>
                  </div>
                  <div className={s.colorCardDivider}/>
                  <div className={s.colorCard}>
                    <span className={s.colorLabel}>BG</span>
                    <label className={s.colorSwatch} style={{background:cfg.bg_color}}>
                      <input type="color" value={cfg.bg_color} onChange={e=>set("bg_color",e.target.value)}/>
                    </label>
                    <span className={s.colorHex}>{cfg.bg_color.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Filename */}
              <div className={s.field}>
                <label className={s.label}>FILENAME</label>
                <div className={s.filenameRow}>
                  <input className={s.fnInput} placeholder="qrcode"
                    value={cfg.filename} onChange={e=>set("filename",e.target.value)}/>
                  <span className={s.fnExt}>.png / .svg</span>
                </div>
              </div>

              {/* Actions */}
              <div className={s.actions}>
                <button className={`${s.btn} ${s.btnPrimary}`} onClick={()=>download("png")} disabled={!canAct}>
                  <span>↓</span> PNG
                </button>
                <button className={`${s.btn} ${s.btnSecondary}`} onClick={()=>download("svg")} disabled={!canAct}>
                  <span>↓</span> SVG
                </button>
                <button className={`${s.btn} ${s.btnGhost}`} onClick={copyImg} disabled={!canAct}>
                  {copied?"✓":"⊕"} Copy
                </button>
              </div>
            </div>

            {/* Right — Preview */}
            <div className={s.previewWrap}>
              <div className={`${s.previewFrame} ${preview?s.previewLit:""}`}>
                {/* Corner brackets */}
                <span className={`${s.corner} ${s.tl}`}/>
                <span className={`${s.corner} ${s.tr}`}/>
                <span className={`${s.corner} ${s.bl}`}/>
                <span className={`${s.corner} ${s.br}`}/>

                {loading && (
                  <div className={s.loaderBox}>
                    <div className={s.spinner}/>
                    <p className={s.loaderLabel}>GENERATING</p>
                  </div>
                )}

                {!loading && preview && (
                  <img className={s.qrImg} src={preview} alt="QR Code"/>
                )}

                {!loading && !preview && (
                  <div className={s.placeholder}>
                    <div className={s.phIcon}>◈</div>
                    <p className={s.phText}>Enter a URL above<br/>to generate your QR code</p>
                  </div>
                )}
              </div>

              {preview && (
                <div className={s.previewMeta}>
                  <span className={s.metaDot}/>
                  LIVE PREVIEW · {cfg.size.toUpperCase()} · {cfg.size==="small"?"150px":cfg.size==="medium"?"300px":"500px"}
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {tab === "history" && (
        <section className={`${s.histSection} afu d1`}>
          <div className={s.histHeader}>
            <h2 className={s.histTitle}>RECENT FORGES</h2>
            {hist.length>0 && (
              <button className={s.clearBtn} onClick={()=>{setHist([]);localStorage.removeItem("qrforge_hist");}}>
                Clear all
              </button>
            )}
          </div>
          {hist.length===0 ? (
            <div className={s.emptyState}>
              <p className={s.emptyIcon}>◈</p>
              <p>No history yet.<br/>Generate and download a QR to save it here.</p>
            </div>
          ) : (
            <div className={s.histGrid}>
              {hist.map(item=>(
                <div key={item.id} className={s.histCard}>
                  <div className={s.histImgWrap}>
                    <img src={item.image} alt="QR" className={s.histImg}/>
                  </div>
                  <div className={s.histInfo}>
                    <p className={s.histUrl}>{item.url}</p>
                    <div className={s.histMeta}>
                      <span className={s.histSize}>{item.size}</span>
                      <span className={s.histTs}>{item.ts}</span>
                    </div>
                    <div className={s.histColors}>
                      <span className={s.histDot} style={{background:item.qr_color}} title={item.qr_color}/>
                      <span className={s.histDot} style={{background:item.bg_color,border:"1px solid var(--border)"}} title={item.bg_color}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className={s.footer}>
        <span>QRFORGE · FASTAPI + NEXT.JS</span>
        <span>◈</span>
      </footer>
    </div>
  );
}