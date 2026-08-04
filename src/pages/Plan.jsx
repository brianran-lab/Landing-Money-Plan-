import { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Wallet, CreditCard, Umbrella, Landmark, PiggyBank, TrendingUp, BarChart3,
  Repeat, Award, ChevronLeft, ChevronRight, Check, Plane, X, Plus, Sparkles,
  Phone, Smartphone, Star, Home, GraduationCap, Tag,
} from "lucide-react";

const INK = "#1E2B28";
const PAPER = "#FAF8F3";
const STAMP = "#B5451F";
const FOREST = "#2B6653";
const GOLD = "#A97F26";
const LINE = "#DCD6C7";

const STEPS = [
  { code: "GAP", title: "Find the gap", icon: Wallet },
  { code: "DBT", title: "Kill the debt", icon: CreditCard },
  { code: "EFN", title: "Emergency fund", icon: Umbrella },
  { code: "ACC", title: "Open a brokerage account", icon: Landmark },
  { code: "TAX", title: "Tax shelters", icon: PiggyBank },
  { code: "GRW", title: "Compound growth", icon: TrendingUp },
  { code: "IDX", title: "Index funds", icon: BarChart3 },
  { code: "ETF", title: "Meet the funds", icon: Tag },
  { code: "AUT", title: "Automate", icon: Repeat },
  { code: "LND", title: "Landed", icon: Award },
];

const cad = (n) =>
  isFinite(n) ? n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }) : "—";

function Stamp({ children, size = "md" }) {
  const dims = size === "sm" ? "w-14 h-14 text-[9px]" : "w-28 h-28 text-xs";
  return (
    <div
      className={`${dims} rounded-full border-[3px] flex items-center justify-center text-center font-mono font-bold uppercase leading-tight shrink-0 stamp-wiggle`}
      style={{ borderColor: STAMP, color: STAMP }}
    >
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block mb-5">
      <span className="block text-[11px] font-mono uppercase tracking-wider mb-1.5" style={{ color: INK, opacity: 0.6 }}>
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs mt-1" style={{ color: INK, opacity: 0.5 }}>{hint}</span>}
    </label>
  );
}

function Input({ prefix, ...props }) {
  return (
    <div className="flex items-center border-b-2 pb-1 transition-colors duration-200 focus-within:border-b-[3px]" style={{ borderColor: INK }}>
      {prefix && <span className="font-mono mr-1" style={{ color: INK, opacity: 0.5 }}>{prefix}</span>}
      <input
        {...props}
        className="w-full bg-transparent outline-none font-mono text-lg"
        style={{ color: INK }}
      />
    </div>
  );
}

function Slider({ value, onChange, min, max, step = 1, suffix = "" }) {
  return (
    <div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-current"
        style={{ accentColor: FOREST }}
      />
      <div className="font-mono text-2xl font-bold mt-1" style={{ color: FOREST }}>{value}{suffix}</div>
    </div>
  );
}

function Check3({ label, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 border-2 rounded-2xl px-4 py-3 mb-3 text-left transition-colors"
      style={{ borderColor: checked ? FOREST : LINE, background: checked ? `${FOREST}10` : "transparent" }}
    >
      <span
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{ borderColor: checked ? FOREST : LINE, background: checked ? FOREST : "transparent" }}
      >
        {checked && <Check size={13} color="white" strokeWidth={3} />}
      </span>
      <span className="font-medium" style={{ color: INK }}>{label}</span>
    </button>
  );
}

const PRESET_FIXED = ["Rent", "Utilities & Internet", "Groceries", "Transport / Gas", "Phone bill", "Insurance", "Subscriptions", "Memberships"];
const PRESET_SAVING = ["Emergency fund", "Savings for trips", "Investments"];

function Chip({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-mono px-3 py-2 rounded-full border-2 shrink-0"
      style={{ borderColor: LINE, color: INK }}
    >
      <Plus size={12} /> {label}
    </button>
  );
}

function ItemRow({ item, onChange, onRemove, accent, showMethod, onMethodChange }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-sm font-medium truncate" style={{ color: INK }}>{item.label}</span>
        <div className="flex items-center border-b-2 w-24 shrink-0" style={{ borderColor: accent }}>
          <span className="font-mono text-sm mr-0.5" style={{ color: INK, opacity: 0.5 }}>$</span>
          <input
            type="number" inputMode="decimal" value={item.amount} placeholder="0"
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-sm py-1"
            style={{ color: INK }}
          />
        </div>
        <button onClick={onRemove} className="shrink-0 p-1" style={{ color: INK, opacity: 0.35 }}>
          <X size={16} />
        </button>
      </div>
      {showMethod && (
        <div className="flex gap-1.5 mt-1 ml-0">
          {["credit", "chequing"].map((m) => (
            <button
              key={m}
              onClick={() => onMethodChange(m)}
              className="text-[10px] font-mono px-2 py-1 rounded-full border"
              style={{
                borderColor: (item.method || "chequing") === m ? accent : LINE,
                background: (item.method || "chequing") === m ? `${accent}18` : "transparent",
                color: (item.method || "chequing") === m ? accent : INK,
                opacity: (item.method || "chequing") === m ? 1 : 0.5,
              }}
            >
              {m === "credit" ? "Credit card" : "Chequing bucket"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BudgetGroup({ title, presets, items, onAdd, onAddCustom, onChange, onRemove, total, accent, showMethod, onMethodChange, freqLabel }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const usedLabels = items.map((i) => i.label);
  const available = presets.filter((p) => !usedLabels.includes(p));

  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: INK, opacity: 0.6 }}>{title}</span>
        <span className="font-mono text-sm font-bold" style={{ color: accent }}>{cad(total)}{freqLabel ? ` ${freqLabel}` : ""}</span>
      </div>

      {items.length > 0 && (
        <div className="mb-3">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              accent={accent}
              showMethod={showMethod}
              onChange={(v) => onChange(item.id, v)}
              onRemove={() => onRemove(item.id)}
              onMethodChange={(m) => onMethodChange && onMethodChange(item.id, m)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {available.map((p) => (
          <Chip key={p} label={p} onClick={() => onAdd(p)} />
        ))}
        {!customOpen && <Chip label="Custom" onClick={() => setCustomOpen(true)} />}
      </div>

      {customOpen && (
        <div className="flex items-center gap-2 mt-2">
          <input
            autoFocus value={customLabel} placeholder="e.g. Pet food"
            onChange={(e) => setCustomLabel(e.target.value)}
            className="flex-1 border-b-2 bg-transparent outline-none text-sm py-1.5"
            style={{ borderColor: INK, color: INK }}
          />
          <button
            onClick={() => { if (customLabel.trim()) { onAddCustom(customLabel.trim()); setCustomLabel(""); setCustomOpen(false); } }}
            className="text-xs font-mono px-3 py-2 rounded-full text-white shrink-0"
            style={{ background: INK }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function ExampleBudget({ open, onToggle }) {
  return (
    <div className="mb-6 rounded-[1.75rem] border-2 overflow-hidden" style={{ borderColor: GOLD }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3" style={{ background: `${GOLD}18` }}>
        <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold" style={{ color: GOLD }}>
          <Sparkles size={14} /> My real budget, no filter
        </span>
        <span className="text-xs font-mono" style={{ color: INK, opacity: 0.5 }}>{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="px-4 py-4 text-sm" style={{ color: INK }}>
          <div className="mb-4 p-3 rounded-2xl" style={{ background: `${STAMP}12` }}>
            <p className="font-bold mb-1" style={{ color: STAMP }}>This is the end game, not today's homework.</p>
            <p className="opacity-80">
              This budget already has debt cleared, an emergency fund, and investing dialed in — that's what it looks like after working through all 9 steps. By the last gate, it's also fully automated: money moves itself, and you won't have to manage it by hand. Right now, just focus on finding your own gap below.
            </p>
          </div>
          <p className="mb-4 opacity-70">
            This is genuinely what my budget looked like when I put this plan together — bi-weekly pay, split with my partner on rent, the works. Nothing here is dressed up. Use it as a reference, not a rule.
          </p>

          <div className="mb-3">
            <div className="font-mono text-[10px] uppercase tracking-wider opacity-50 mb-1">Income (bi-weekly)</div>
            <div className="flex justify-between"><span>Pay</span><span className="font-mono font-bold">$2,718</span></div>
          </div>

          <div className="mb-3">
            <div className="font-mono text-[10px] uppercase tracking-wider opacity-50 mb-1">Fixed expenses</div>
            {[["Rent (my share)", 760], ["Parking (my share)", 22.5], ["Car insurance", 46], ["Hydro & internet", 30], ["Groceries", 160], ["Gas", 80], ["Phone", 38], ["Gym", 20], ["Subscriptions", 25], ["Life insurance", 20]].map(([l, v]) => (
              <div key={l} className="flex justify-between opacity-80"><span>{l}</span><span className="font-mono">${v}</span></div>
            ))}
            <div className="flex justify-between font-bold mt-1 pt-1 border-t" style={{ borderColor: LINE }}><span>Total</span><span className="font-mono">$1,201.50</span></div>
          </div>

          <div className="mb-3">
            <div className="font-mono text-[10px] uppercase tracking-wider opacity-50 mb-1">Saving & investing</div>
            {[["Trip fund", 100], ["Emergency fund", 150], ["Investments", 500]].map(([l, v]) => (
              <div key={l} className="flex justify-between opacity-80"><span>{l}</span><span className="font-mono">${v}</span></div>
            ))}
            <div className="flex justify-between font-bold mt-1 pt-1 border-t" style={{ borderColor: LINE }}><span>Total</span><span className="font-mono">$750</span></div>
          </div>

          <div className="p-3 rounded-2xl" style={{ background: `${FOREST}12` }}>
            <div className="flex justify-between font-bold"><span>Fun money, guilt-free</span><span className="font-mono" style={{ color: FOREST }}>~$383 / week</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

const PRESET_DEBTS = ["Credit card", "Line of credit", "Car loan", "Student loan", "BNPL / installment"];

function DebtItemRow({ item, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="flex-1 text-sm font-medium truncate" style={{ color: INK }}>{item.label}</span>
      <div className="flex items-center border-b-2 w-20 shrink-0" style={{ borderColor: STAMP }}>
        <span className="font-mono text-[11px] mr-0.5" style={{ color: INK, opacity: 0.5 }}>$</span>
        <input
          type="number" inputMode="decimal" value={item.balance} placeholder="owed"
          onChange={(e) => onChange({ ...item, balance: e.target.value })}
          className="w-full bg-transparent outline-none font-mono text-sm py-1"
          style={{ color: INK }}
        />
      </div>
      <div className="flex items-center border-b-2 w-24 shrink-0" style={{ borderColor: FOREST }}>
        <span className="font-mono text-[11px] mr-0.5" style={{ color: INK, opacity: 0.5 }}>$</span>
        <input
          type="number" inputMode="decimal" value={item.payment} placeholder="/2wk"
          onChange={(e) => onChange({ ...item, payment: e.target.value })}
          className="w-full bg-transparent outline-none font-mono text-sm py-1"
          style={{ color: INK }}
        />
      </div>
      <button onClick={onRemove} className="shrink-0 p-1" style={{ color: INK, opacity: 0.35 }}>
        <X size={16} />
      </button>
    </div>
  );
}

function DebtGroup({ items, onAdd, onChange, onRemove }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const usedLabels = items.map((i) => i.label);
  const available = PRESET_DEBTS.filter((p) => !usedLabels.includes(p));

  return (
    <div className="mb-2">
      {items.length > 0 && (
        <>
          <div className="flex text-[10px] font-mono uppercase tracking-wider opacity-50 mb-2" style={{ color: INK }}>
            <span className="flex-1">Debt</span><span className="w-20 shrink-0">Owed</span><span className="w-24 shrink-0">Bi-weekly</span><span className="w-6 shrink-0" />
          </div>
          {items.map((item) => (
            <DebtItemRow key={item.id} item={item} onChange={onChange} onRemove={() => onRemove(item.id)} />
          ))}
        </>
      )}
      <div className="flex flex-wrap gap-2 mt-1">
        {available.map((p) => (
          <Chip key={p} label={p} onClick={() => onAdd(p)} />
        ))}
        {!customOpen && <Chip label="Custom" onClick={() => setCustomOpen(true)} />}
      </div>
      {customOpen && (
        <div className="flex items-center gap-2 mt-2">
          <input
            autoFocus value={customLabel} placeholder="e.g. Store card"
            onChange={(e) => setCustomLabel(e.target.value)}
            className="flex-1 border-b-2 bg-transparent outline-none text-sm py-1.5"
            style={{ borderColor: INK, color: INK }}
          />
          <button
            onClick={() => { if (customLabel.trim()) { onAdd(customLabel.trim()); setCustomLabel(""); setCustomOpen(false); } }}
            className="text-xs font-mono px-3 py-2 rounded-full text-white shrink-0"
            style={{ background: INK }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function BrokerCard({ name, tag, tagColor, points }) {
  return (
    <div className="rounded-2xl border p-3 mb-2" style={{ borderColor: LINE }}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-bold text-sm" style={{ color: INK }}>{name}</span>
        <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${tagColor}18`, color: tagColor }}>{tag}</span>
      </div>
      <ul className="space-y-0.5">
        {points.map((p) => (
          <li key={p} className="text-xs flex gap-1.5" style={{ color: INK, opacity: 0.7 }}>
            <span style={{ color: tagColor }}>·</span>{p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccountCard({ icon: Icon, badge, name, full, accent, body, stat }) {
  return (
    <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: accent }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${accent}18` }}>
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: accent }} />
          <div>
            <div className="text-sm font-black" style={{ color: INK }}>{name}</div>
            <div className="text-[10px] opacity-60" style={{ color: INK }}>{full}</div>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full shrink-0" style={{ background: accent, color: PAPER }}>{badge}</span>
      </div>
      <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
        {body}
        <div className="mt-2 p-2.5 rounded-2xl font-mono text-xs" style={{ background: `${accent}12`, color: accent }}>{stat}</div>
      </div>
    </div>
  );
}

function FundCard({ ticker, name, mer, holds, note, risk, riskColor, returns, accent }) {
  return (
    <div className="rounded-[1.75rem] border-2 overflow-hidden mb-3" style={{ borderColor: accent }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${accent}18` }}>
        <div>
          <div className="font-mono text-lg font-black tracking-tight" style={{ color: INK }}>{ticker}</div>
          <div className="text-[11px] opacity-60" style={{ color: INK }}>{name}</div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full shrink-0" style={{ background: accent, color: PAPER }}>{mer} MER</span>
      </div>
      <div className="px-4 py-3 text-sm space-y-1.5" style={{ color: INK, opacity: 0.8 }}>
        <p>{holds}</p>
        <p className="text-xs opacity-70">{note}</p>
        <div className="flex gap-2 pt-1">
          <div className="flex-1 p-2 rounded-2xl" style={{ background: `${riskColor}15` }}>
            <div className="text-[9px] font-mono uppercase tracking-wide opacity-60">Risk level</div>
            <div className="text-xs font-bold" style={{ color: riskColor }}>{risk}</div>
          </div>
          <div className="flex-1 p-2 rounded-2xl" style={{ background: `${INK}08` }}>
            <div className="text-[9px] font-mono uppercase tracking-wide opacity-60">Historical avg return</div>
            <div className="text-xs font-bold" style={{ color: INK }}>{returns}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingMoneyPlan() {
  useEffect(() => {
    if (document.getElementById("lmp-fonts")) return;
    const link = document.createElement("link");
    link.id = "lmp-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Quicksand:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const [step, setStep] = useState(0);
  const [d, setD] = useState({
    income: "", incomeFreq: "biweekly",
    fixedItems: [], savingItems: [], exampleOpen: false,
    debtItems: [], debtRate: "",
    efMultiplier: 4, efCurrent: "", efContribution: "", efContribFreq: "biweekly",
    accSIN: false, accID: false, accOpened: false,
    taxTFSA: false, taxRRSP: false, taxFHSA: false, taxRESP: false,
    arrivalYear: "", contribution: "", contributionFreq: "biweekly", years: 25, rate: 10, goalAmount: "", startingAmount: "",
    feePortfolio: "10000", feeYears: 20, bankMER: 2.0,
    autoSet: false, autoAmount: false, autoDay: false,
  });
  const set = (k) => (v) => setD((prev) => ({ ...prev, [k]: v }));

  const addItem = (group, label) =>
    setD((prev) => ({ ...prev, [group]: [...prev[group], { id: `${Date.now()}-${Math.random()}`, label, amount: "", method: "chequing" }] }));
  const updateItemAmount = (group, id, amount) =>
    setD((prev) => ({ ...prev, [group]: prev[group].map((it) => (it.id === id ? { ...it, amount } : it)) }));
  const updateItemMethod = (group, id, method) =>
    setD((prev) => ({ ...prev, [group]: prev[group].map((it) => (it.id === id ? { ...it, method } : it)) }));
  const removeItem = (group, id) =>
    setD((prev) => ({ ...prev, [group]: prev[group].filter((it) => it.id !== id) }));

  const incomeMonthly = useMemo(
    () => (d.incomeFreq === "biweekly" ? (Number(d.income) || 0) * 26 / 12 : (Number(d.income) || 0)),
    [d.income, d.incomeFreq]
  );
  const fixedTotal = useMemo(() => d.fixedItems.reduce((s, i) => s + (Number(i.amount) || 0), 0), [d.fixedItems]);
  const gapFreqLabel = d.incomeFreq === "biweekly" ? "/2wk" : "/mo";
  const displayIncome = useMemo(() => (d.incomeFreq === "biweekly" ? (Number(d.income) || 0) : incomeMonthly), [d.incomeFreq, d.income, incomeMonthly]);
  // fixedTotal is already in whatever frequency is currently selected (that's what the user typed) — no further conversion needed for display.
  const displayFixed = fixedTotal;
  const displayGap = useMemo(() => displayIncome - displayFixed, [displayIncome, displayFixed]);
  const fixedCreditTotal = useMemo(() => d.fixedItems.filter((i) => i.method === "credit").reduce((s, i) => s + (Number(i.amount) || 0), 0), [d.fixedItems]);
  const fixedChequingTotal = useMemo(() => fixedTotal - fixedCreditTotal, [fixedTotal, fixedCreditTotal]);
  const displayFixedCredit = fixedCreditTotal;
  const displayFixedChequing = fixedChequingTotal;
  // True monthly-equivalent, converting FROM whichever frequency is currently selected — used for internal math (gap, EF target) that always needs a real monthly figure regardless of the toggle.
  const fixedMonthly = useMemo(() => (d.incomeFreq === "biweekly" ? fixedTotal * 26 / 12 : fixedTotal), [d.incomeFreq, fixedTotal]);
  const gap = useMemo(() => incomeMonthly - fixedMonthly, [incomeMonthly, fixedMonthly]);

  const addDebt = (label) =>
    setD((prev) => ({ ...prev, debtItems: [...prev.debtItems, { id: `${Date.now()}-${Math.random()}`, label, balance: "", payment: "" }] }));
  const updateDebt = (item) =>
    setD((prev) => ({ ...prev, debtItems: prev.debtItems.map((it) => (it.id === item.id ? item : it)) }));
  const removeDebt = (id) =>
    setD((prev) => ({ ...prev, debtItems: prev.debtItems.filter((it) => it.id !== id) }));

  const debtTotal = useMemo(() => d.debtItems.reduce((s, i) => s + (Number(i.balance) || 0), 0), [d.debtItems]);
  const debtBiweeklyPayment = useMemo(() => d.debtItems.reduce((s, i) => s + (Number(i.payment) || 0), 0), [d.debtItems]);

  const debtMonthlyPayment = useMemo(() => debtBiweeklyPayment * 26 / 12, [debtBiweeklyPayment]);
  const funMoneyAfterDebt = useMemo(() => gap - debtMonthlyPayment, [gap, debtMonthlyPayment]);
  const displayDebtPayment = useMemo(() => (d.incomeFreq === "biweekly" ? debtBiweeklyPayment : debtMonthlyPayment), [d.incomeFreq, debtBiweeklyPayment, debtMonthlyPayment]);
  const displayFunMoneyAfterDebt = useMemo(() => displayGap - displayDebtPayment, [displayGap, displayDebtPayment]);
  const efContribMonthly = useMemo(
    () => (d.efContribFreq === "biweekly" ? (Number(d.efContribution) || 0) * 26 / 12 : (Number(d.efContribution) || 0)),
    [d.efContribution, d.efContribFreq]
  );
  const efContribBiweekly = useMemo(
    () => (d.efContribFreq === "biweekly" ? (Number(d.efContribution) || 0) : (Number(d.efContribution) || 0) * 12 / 26),
    [d.efContribution, d.efContribFreq]
  );
  const fundsAfterDebtInEFFreq = useMemo(
    () => (d.efContribFreq === "biweekly" ? funMoneyAfterDebt * 12 / 26 : funMoneyAfterDebt),
    [d.efContribFreq, funMoneyAfterDebt]
  );
  const efFunMoneyRemaining = useMemo(
    () => fundsAfterDebtInEFFreq - (Number(d.efContribution) || 0),
    [fundsAfterDebtInEFFreq, d.efContribution]
  );

  const contributionMonthly = useMemo(
    () => (d.contributionFreq === "biweekly" ? (Number(d.contribution) || 0) * 26 / 12 : (Number(d.contribution) || 0)),
    [d.contribution, d.contributionFreq]
  );
  const investMonthly = useMemo(() => contributionMonthly, [contributionMonthly]);
  const investBiweekly = useMemo(() => investMonthly * 12 / 26, [investMonthly]);
  const gapInContributionFreq = useMemo(
    () => (d.contributionFreq === "biweekly" ? gap * 12 / 26 : gap),
    [d.contributionFreq, gap]
  );
  const remainingAfterInvesting = useMemo(
    () => gapInContributionFreq - (Number(d.contribution) || 0),
    [gapInContributionFreq, d.contribution]
  );
  const savingTotal = useMemo(() => d.savingItems.reduce((s, i) => s + (Number(i.amount) || 0), 0), [d.savingItems]);
  const displaySaving = useMemo(() => (d.incomeFreq === "biweekly" ? savingTotal * 12 / 26 : savingTotal), [d.incomeFreq, savingTotal]);
  const savingBiweekly = useMemo(() => savingTotal * 12 / 26, [savingTotal]);
  const finalFunMoneyMonthly = useMemo(() => gap - debtMonthlyPayment - efContribMonthly - investMonthly - savingTotal, [gap, debtMonthlyPayment, efContribMonthly, investMonthly, savingTotal]);
  const finalFunMoneyBiweekly = useMemo(() => finalFunMoneyMonthly * 12 / 26, [finalFunMoneyMonthly]);

  const debtMonths = useMemo(() => {
    const P = debtTotal, i = (Number(d.debtRate) || 0) / 100 / 12, E = debtBiweeklyPayment * 26 / 12;
    if (!P || !E) return null;
    if (i === 0) return Math.ceil(P / E);
    if (E <= P * i) return null;
    return Math.ceil(-Math.log(1 - (P * i) / E) / Math.log(1 + i));
  }, [debtTotal, d.debtRate, debtBiweeklyPayment]);

  const efTarget = useMemo(() => fixedMonthly * d.efMultiplier, [fixedMonthly, d.efMultiplier]);
  const efProgress = useMemo(() => (efTarget > 0 ? Math.min(100, ((Number(d.efCurrent) || 0) / efTarget) * 100) : 0), [efTarget, d.efCurrent]);

  const tfsaRoom = useMemo(() => {
    const arrival = Number(d.arrivalYear);
    if (!arrival || arrival < 1990 || arrival > 2026) return null;
    const yrs = Math.min(Math.max(2026 - arrival + 1, 0), 8);
    return yrs * 7000;
  }, [d.arrivalYear]);

  const growthData = useMemo(() => {
    const c = contributionMonthly, r = d.rate / 100 / 12, years = d.years;
    const rows = [];
    let balance = Number(d.startingAmount) || 0;
    rows.push({ year: 0, value: Math.round(balance) });
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) balance = balance * (1 + r) + c;
      rows.push({ year: y, value: Math.round(balance) });
    }
    return rows;
  }, [contributionMonthly, d.rate, d.years, d.startingAmount]);
  const finalValue = growthData[growthData.length - 1]?.value || 0;
  const totalContributed = contributionMonthly * d.years * 12;

  const requiredMonthly = useMemo(() => {
    const FV = Number(d.goalAmount) || 0;
    const n = d.years * 12;
    const r = d.rate / 100 / 12;
    if (!FV || !n) return 0;
    if (r === 0) return FV / n;
    return (FV * r) / (Math.pow(1 + r, n) - 1);
  }, [d.goalAmount, d.years, d.rate]);
  const requiredBiweekly = useMemo(() => requiredMonthly * 12 / 26, [requiredMonthly]);

  const feeGrow = (P, y, feePct) => P * Math.pow(1 + (0.10 - feePct / 100), y);
  const feeBankValue = useMemo(() => Math.round(feeGrow(Number(d.feePortfolio) || 0, d.feeYears, d.bankMER)), [d.feePortfolio, d.feeYears, d.bankMER]);
  const feeIndexValue = useMemo(() => Math.round(feeGrow(Number(d.feePortfolio) || 0, d.feeYears, 0.2)), [d.feePortfolio, d.feeYears]);
  const feeDiff = useMemo(() => feeIndexValue - feeBankValue, [feeIndexValue, feeBankValue]);

  const S = STEPS[step];
  const Icon = S.icon;

  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        backgroundColor: PAPER,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${INK}0a 1px, transparent 0)`,
        backgroundSize: "22px 22px",
      }}
    >
      <style>{`
        .lmp-root { font-family: 'Quicksand', system-ui, sans-serif; }
        .lmp-root .font-mono { font-family: 'Space Mono', ui-monospace, monospace !important; letter-spacing: 0.02em; }
        .lmp-root h1, .lmp-root h2, .lmp-root h3 { font-family: 'Baloo 2', system-ui, sans-serif; font-weight: 700; letter-spacing: -0.01em; }
        .lmp-root button { font-family: 'Quicksand', system-ui, sans-serif; font-weight: 600; }
        @keyframes stampWiggle { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(-9deg); } }
        .stamp-wiggle { animation: stampWiggle 3s ease-in-out infinite; }
        @keyframes gateIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .gate-content { animation: gateIn 320ms ease both; }
        @keyframes planeBob { 0%, 100% { transform: translateY(0) rotate(90deg); } 50% { transform: translateY(-3px) rotate(90deg); } }
        .plane-marker { animation: planeBob 1.8s ease-in-out infinite; }
      `}</style>
      <div className="w-full max-w-3xl lmp-root">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: STAMP }}>Boarding Pass · Financial Route</div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: INK }}>The Landing Money Plan</h1>
          </div>
          <Plane size={28} style={{ color: INK, opacity: 0.3 }} />
        </div>

        {/* Flight path progress */}
        <div className="relative mb-8 px-2 pt-3">
          <div className="absolute left-2 right-2 top-4 border-t-2 border-dashed" style={{ borderColor: LINE }} />
          <div
            className="absolute left-2 top-4 border-t-2 transition-all duration-500 ease-out"
            style={{ borderColor: STAMP, width: `calc(${(step / (STEPS.length - 1)) * 100}% * (100% - 16px) / 100%)` }}
          />
          <div
            className="absolute top-0 transition-all duration-500 ease-out plane-marker"
            style={{
              left: `calc(8px + ${(step / (STEPS.length - 1)) * 100}% * (100% - 16px) / 100%)`,
              transform: "translateX(-50%)",
            }}
          >
            <Plane size={14} style={{ color: STAMP, transform: "rotate(90deg)" }} />
          </div>
          <div className="relative flex justify-between">
            {STEPS.map((s, i) => (
              <button
                key={s.code}
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <span
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 font-mono text-[10px] font-bold z-10 transition-all duration-300"
                  style={{
                    background: i <= step ? INK : PAPER,
                    borderColor: i <= step ? INK : LINE,
                    color: i <= step ? PAPER : INK,
                    boxShadow: i === step ? `0 0 0 4px ${STAMP}22` : "none",
                  }}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                <span
                  className="font-mono text-[10px] tracking-wide hidden sm:block transition-opacity"
                  style={{ color: i === step ? STAMP : INK, opacity: i === step ? 1 : 0.4, fontWeight: i === step ? 700 : 400 }}
                >
                  {s.code}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket card */}
        <div
          className="rounded-[2.5rem] overflow-hidden flex relative"
          style={{ background: "white", boxShadow: `0 1px 2px ${INK}10, 0 12px 32px -12px ${INK}30, 0 0 0 1px ${INK}08` }}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, ${STAMP}, ${GOLD}, ${FOREST})` }} />
          {/* Stub */}
          <div
            className="hidden sm:flex flex-col items-center justify-between w-28 py-8 px-3 text-center shrink-0"
            style={{ background: `linear-gradient(165deg, ${INK}, #16211f)`, color: PAPER }}
          >
            <Icon size={26} />
            <div>
              <div className="font-mono text-3xl font-black tracking-tighter">{S.code}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider mt-1 opacity-60">Gate {step + 1} of {STEPS.length}</div>
            </div>
            <div className="w-full border-t border-dashed opacity-30" />
          </div>

          {/* Perforation */}
          <div
            className="hidden sm:block w-0 relative"
            style={{
              backgroundImage: `radial-gradient(circle, ${PAPER} 3px, transparent 3px)`,
              backgroundSize: "1px 14px",
              borderLeft: `2px dashed ${LINE}`,
            }}
          />

          {/* Content */}
          <div key={step} className="flex-1 p-6 sm:p-8 pt-8 min-w-0 gate-content">
            <div
              className="sm:hidden inline-flex items-center gap-1.5 font-mono text-xs font-bold mb-3 px-3 py-1.5 rounded-full"
              style={{ background: `${STAMP}15`, color: STAMP }}
            >
              <Icon size={13} /> {S.code} · Gate {step + 1} of {STEPS.length}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-5" style={{ color: INK }}>{S.title}</h2>

            {step === 0 && (
              <>
                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>
                  This is the quickest, easiest stop on this whole route — and it's also the one most people quietly avoid. Budgeting has a reputation for being tedious, fiddly, spreadsheet-heavy work. It's not. It's two numbers: what comes in, and what goes out. That's it. Work through it below and you're done with the hardest-sounding step in the entire guide.
                </p>

                <ExampleBudget open={d.exampleOpen} onToggle={() => set("exampleOpen")(!d.exampleOpen)} />

                <div className="mb-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: INK, opacity: 0.6 }}>Your income</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input prefix="$" type="number" inputMode="decimal" value={d.income} onChange={(e) => set("income")(e.target.value)} placeholder="0" />
                    </div>
                    <div className="flex rounded-full border-2 shrink-0" style={{ borderColor: INK }}>
                      {["biweekly", "monthly"].map((f) => (
                        <button
                          key={f}
                          onClick={() => { if (f === d.incomeFreq) return; const v = parseFloat(d.income); const nv = (!v || isNaN(v)) ? d.income : (f === "monthly" ? String(Math.round(v * 26 / 12)) : String(Math.round(v * 12 / 26))); setD(prev => ({ ...prev, income: nv, incomeFreq: f })); }}
                          className="px-3 py-1.5 text-xs font-mono capitalize rounded-full"
                          style={{ background: d.incomeFreq === f ? INK : "transparent", color: d.incomeFreq === f ? PAPER : INK }}
                        >
                          {f === "biweekly" ? "Bi-weekly" : "Monthly"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="block text-xs mt-1" style={{ color: INK, opacity: 0.5 }}>Pick whichever matches how your employer actually pays you. Once this is automated, the moment you get paid, this money moves to where it needs to go — no manual transfers, no remembering.</span>
                </div>

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <BudgetGroup
                  title="Fixed expenses"
                  presets={PRESET_FIXED}
                  items={d.fixedItems}
                  accent={STAMP}
                  onAdd={(label) => addItem("fixedItems", label)}
                  onAddCustom={(label) => addItem("fixedItems", label)}
                  onChange={(id, v) => updateItemAmount("fixedItems", id, v)}
                  onRemove={(id) => removeItem("fixedItems", id)}
                  total={displayFixed}
                  freqLabel={gapFreqLabel}
                />

                <div className="mt-2 p-4 rounded-2xl space-y-1.5" style={{ background: `${FOREST}12` }}>
                  <div className="flex justify-between text-sm" style={{ color: INK, opacity: 0.7 }}>
                    <span>Income</span><span className="font-mono">{cad(displayIncome)} {gapFreqLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: INK, opacity: 0.7 }}>
                    <span>− Fixed expenses</span><span className="font-mono">{cad(displayFixed)} {gapFreqLabel}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1.5 mt-1 border-t" style={{ borderColor: LINE, color: INK }}>
                    <span>Your gap</span>
                    <span className="font-mono text-lg" style={{ color: displayGap >= 0 ? FOREST : STAMP }}>{cad(displayGap)} {gapFreqLabel}</span>
                  </div>
                  <p className="text-sm pt-1" style={{ color: INK, opacity: 0.7 }}>
                    {displayGap >= 0
                      ? "This is what's spare each month, before debt, savings, or anything else gets decided. We'll put it to work step by step from here."
                      : "You're spending more than you earn right now — that's important to know before anything else in this plan."}
                  </p>
                </div>

                <div className="mt-3 p-4 rounded-2xl flex gap-3" style={{ background: `${GOLD}15` }}>
                  <Sparkles size={18} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                  <p className="text-sm" style={{ color: INK, opacity: 0.8 }}>
                    <span className="font-bold">We're not touching saving or investing yet</span> — this step is only about spotting the gap. Where it goes comes later. By the last gate, this whole plan runs itself: automatic transfers, automatic investing, a check-in a couple of times a year. You do this bit once, then you don't have to think about it again.
                  </p>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>
                  If you're carrying anything above roughly 8–10% interest, this comes before investing a cent elsewhere. Add what you're paying toward each debt, bi-weekly, and watch your fun money adjust live below.
                </p>

                <div className="mb-5 p-3 rounded-2xl flex justify-between items-center" style={{ background: `${INK}08` }}>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider opacity-50" style={{ color: INK }}>Carried over from Gate 1</div>
                    <div className="text-sm" style={{ color: INK, opacity: 0.7 }}>Income {cad(displayIncome)} − Fixed {cad(displayFixed)} {gapFreqLabel}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-[10px] uppercase tracking-wider opacity-50" style={{ color: INK }}>Your gap</div>
                    <div className="font-mono font-bold" style={{ color: FOREST }}>{cad(displayGap)} {gapFreqLabel}</div>
                  </div>
                </div>

                <DebtGroup items={d.debtItems} onAdd={addDebt} onChange={updateDebt} onRemove={removeDebt} />

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <Field label="Highest interest rate among them" hint="This is the one costing you most — use it for the estimate below.">
                  <Input type="number" inputMode="decimal" value={d.debtRate} onChange={(e) => set("debtRate")(e.target.value)} placeholder="19.99" />
                </Field>

                <div className="mt-2 p-4 rounded-2xl space-y-1.5" style={{ background: `${STAMP}10` }}>
                  <div className="flex justify-between text-sm" style={{ color: INK, opacity: 0.7 }}>
                    <span>Total owed</span><span className="font-mono">{cad(debtTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: INK, opacity: 0.7 }}>
                    <span>Total debt payments</span><span className="font-mono">{cad(debtBiweeklyPayment)} / 2wk</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1.5 mt-1 border-t" style={{ borderColor: LINE, color: INK }}>
                    <span>Estimated time to clear it all</span>
                    <span className="font-mono text-lg" style={{ color: STAMP }}>{debtMonths ? `${debtMonths} mo` : "—"}</span>
                  </div>
                  <p className="text-sm pt-1" style={{ color: INK, opacity: 0.7 }}>No investment reliably beats this interest rate. Clear it first, always.</p>
                </div>

                <div className="mt-3 p-4 rounded-2xl space-y-1.5" style={{ background: `${FOREST}12` }}>
                  <div className="flex justify-between text-sm" style={{ color: INK, opacity: 0.7 }}>
                    <span>Your gap</span><span className="font-mono">{cad(displayGap)} {gapFreqLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: INK, opacity: 0.7 }}>
                    <span>− Debt payments</span><span className="font-mono">{cad(displayDebtPayment)} {gapFreqLabel}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1.5 mt-1 border-t" style={{ borderColor: LINE, color: INK }}>
                    <span>Fun money, right now</span>
                    <span className="font-mono text-lg" style={{ color: displayFunMoneyAfterDebt >= 0 ? FOREST : STAMP }}>{cad(displayFunMoneyAfterDebt)} {gapFreqLabel}</span>
                  </div>
                  <p className="text-sm pt-1" style={{ color: INK, opacity: 0.7 }}>
                    Adjust any bi-weekly payment above and this updates instantly — find the balance between clearing debt fast and still having breathing room. This stays in whichever frequency you picked back in Gate 1 — worth matching it to your actual payday.
                  </p>
                </div>

                {debtTotal > 0 && displayFunMoneyAfterDebt > displayDebtPayment && displayDebtPayment > 0 && (
                  <div className="mt-3 p-3 rounded-2xl" style={{ background: `${GOLD}15` }}>
                    <p className="text-sm" style={{ color: INK, opacity: 0.8 }}>
                      <span className="font-bold">Quick nudge:</span> right now you've got more sitting in fun money than you're putting toward debt. That's... a choice. Bump a payment up above and watch the payoff time shrink — future-you would much rather be onto the investing gates than still fighting this one.
                    </p>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${GOLD}12` }}>
                  <div className="font-mono text-[10px] uppercase tracking-wider opacity-60" style={{ color: INK }}>Fun money available to allocate</div>
                  <div className="font-mono text-2xl font-black" style={{ color: GOLD }}>{cad(displayFunMoneyAfterDebt)} <span className="text-sm font-normal opacity-60">{gapFreqLabel}</span></div>
                  <p className="text-sm mt-1" style={{ color: INK, opacity: 0.75 }}>
                    Carried over from Gate 2, after debt payments — stays in whichever frequency you picked back in Gate 1. No problem putting some of this toward your emergency fund now while still paying off debt — just keep debt getting the bigger share until it's cleared, then shift more here. Nothing here is locked in; adjust the split anytime as your situation changes.
                  </p>
                </div>

                <Field label="Months of expenses to hold as a buffer">
                  <Slider value={d.efMultiplier} onChange={set("efMultiplier")} min={3} max={6} suffix=" months" />
                </Field>
                <Field label="What you've saved toward it so far"><Input prefix="$" type="number" value={d.efCurrent} onChange={(e) => set("efCurrent")(e.target.value)} placeholder="0" /></Field>

                <div className="mb-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: INK, opacity: 0.6 }}>How much you're adding each pay</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input prefix="$" type="number" inputMode="decimal" value={d.efContribution} onChange={(e) => set("efContribution")(e.target.value)} placeholder="0" />
                    </div>
                    <div className="flex rounded-full border-2 shrink-0" style={{ borderColor: INK }}>
                      {["biweekly", "monthly"].map((f) => (
                        <button
                          key={f}
                          onClick={() => { if (f === d.efContribFreq) return; const v = parseFloat(d.efContribution); const nv = (!v || isNaN(v)) ? d.efContribution : (f === "monthly" ? String(Math.round(v * 26 / 12)) : String(Math.round(v * 12 / 26))); setD(prev => ({ ...prev, efContribution: nv, efContribFreq: f })); }}
                          className="px-3 py-1.5 text-xs font-mono capitalize rounded-full"
                          style={{ background: d.efContribFreq === f ? INK : "transparent", color: d.efContribFreq === f ? PAPER : INK }}
                        >
                          {f === "biweekly" ? "Bi-weekly" : "Monthly"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="block text-xs mt-1" style={{ color: INK, opacity: 0.5 }}>Pick whichever matches how your employer actually pays you. Once this is automated, the moment you get paid, this money moves to where it needs to go — no manual transfers, no remembering.</span>
                </div>

                <div className="mb-5 p-2.5 rounded-2xl flex justify-between items-center" style={{ background: efFunMoneyRemaining >= 0 ? `${FOREST}12` : `${STAMP}12` }}>
                  <span className="text-xs font-mono uppercase opacity-60" style={{ color: INK }}>Fun money remaining</span>
                  <span className="font-mono font-bold" style={{ color: efFunMoneyRemaining >= 0 ? FOREST : STAMP }}>
                    {cad(efFunMoneyRemaining)} {d.efContribFreq === "biweekly" ? "/2wk" : "/mo"}
                  </span>
                </div>

                <div className="mt-2 p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <div className="flex justify-between font-mono text-xs uppercase tracking-wider opacity-60 mb-1" style={{ color: INK }}>
                    <span>Progress</span><span>{cad(Number(d.efCurrent) || 0)} / {cad(efTarget)}</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: LINE }}>
                    <div className="h-full rounded-full" style={{ width: `${efProgress}%`, background: FOREST }} />
                  </div>
                  <p className="text-sm mt-2" style={{ color: INK, opacity: 0.7 }}>This buffer matters even more if you're newer here or just starting out — without it, one bad month can turn into a real financial crisis.</p>
                </div>

                <div className="mt-3 p-3 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <p className="text-sm" style={{ color: INK, opacity: 0.8 }}>
                    <span className="font-bold">Remember:</span> you're just capturing your current-state numbers here — not automating anything yet. That comes later, once every gate's numbers are in. Right now this is just about getting your emergency fund's real picture set.
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  A brokerage account is basically a bank account — it holds your cash just fine. Its bigger purpose is just making investing easy: a place built so that buying stocks and funds is as simple as anything else you do with money, not something separate and complicated.
                </p>
                <p className="text-sm mb-3" style={{ color: INK, opacity: 0.7 }}>
                  Often it holds that cash better, too — without the usual bank baggage: no monthly fees, no ATM foreign-transaction charges, no overdraft fee nonsense, and typically a higher interest rate on your everyday balance than a standard chequing account ever pays.
                </p>
                <p className="text-sm mb-3" style={{ color: INK, opacity: 0.7 }}>
                  Most also let you split that cash into named buckets — like the Debt Payoff, Emergency Fund, and Fun Money buckets from a couple of gates back. One app, both jobs.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  What's genuinely changed is how easy it's become to open one.
                </p>

                <div className="rounded-[1.75rem] overflow-hidden border mb-5" style={{ borderColor: LINE }}>
                  <div className="grid grid-cols-2">
                    <div className="p-4 border-r" style={{ borderColor: LINE }}>
                      <Phone size={18} style={{ color: INK, opacity: 0.4 }} />
                      <div className="font-mono text-[10px] uppercase tracking-wider mt-2 mb-2 opacity-50" style={{ color: INK }}>The old way</div>
                      <ul className="space-y-1.5 text-xs" style={{ color: INK, opacity: 0.65 }}>
                        <li>Call a broker in office hours</li>
                        <li>$1,000s minimum to start</li>
                        <li>~$10 or more per trade</li>
                        <li>Paperwork, days to open</li>
                      </ul>
                    </div>
                    <div className="p-4" style={{ background: `${FOREST}10` }}>
                      <Smartphone size={18} style={{ color: FOREST }} />
                      <div className="font-mono text-[10px] uppercase tracking-wider mt-2 mb-2" style={{ color: FOREST }}>Now</div>
                      <ul className="space-y-1.5 text-xs" style={{ color: INK, opacity: 0.8 }}>
                        <li>Open it from your phone</li>
                        <li>$0 minimum, most platforms</li>
                        <li>$0 commission, most trades</li>
                        <li>Minutes, not days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: INK, opacity: 0.6 }}>A few real options in Canada</span>
                </div>
                <BrokerCard
                  name="Wealthsimple"
                  tag="Simplest"
                  tagColor={FOREST}
                  points={["$0 commission on Canadian & US stocks and ETFs", "No account minimum, buy fractional shares", "Every Canadian investment account type in one app — explained next gate"]}
                />
                <BrokerCard
                  name="Questrade"
                  tag="More control"
                  tagColor={GOLD}
                  points={["$0 commission on stocks and ETFs", "Better tools for currency conversion & USD-heavy accounts", "Widest range of account types"]}
                />
                <BrokerCard
                  name="National Bank Direct Brokerage"
                  tag="Bank-backed"
                  tagColor={STAMP}
                  points={["$0 commission, backed by a major Canadian bank", "$100/yr admin fee, often waivable", "For anyone who wants a bank name behind it"]}
                />
                <p className="text-xs mb-5" style={{ color: INK, opacity: 0.5 }}>For comparison: TD and RBC's direct investing platforms still charge roughly $9.95–$9.99 a trade. Worth knowing before you assume your existing bank is the easy default.</p>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: GOLD }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${GOLD}18` }}>
                    <Star size={14} style={{ color: GOLD }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: GOLD }}>Why I personally use Wealthsimple</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>Not a sponsor, just what's actually worked for me:</p>
                    <ul className="space-y-1.5">
                      <li className="flex gap-2"><span style={{ color: GOLD }}>·</span>It was the simplest thing to figure out when I had zero investing experience and everything else about Canada was already new.</li>
                      <li className="flex gap-2"><span style={{ color: GOLD }}>·</span>All my different investment account types live in the same app (more on what those are next gate), so I'm not juggling logins to see the full picture.</li>
                      <li className="flex gap-2"><span style={{ color: GOLD }}>·</span>Recurring automatic purchases just run in the background — exactly the "set it and forget it" this whole guide is built around.</li>
                    </ul>
                    <p className="text-xs pt-1 opacity-60">You can add a USD account for a small monthly fee if you need one — it becomes free once your balance passes $100,000. For someone starting from zero, it was the easiest door in.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${FOREST}18` }}>
                    <Smartphone size={14} style={{ color: FOREST }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>Step by step: opening it on your phone</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-3" style={{ color: INK }}>
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wide mb-1.5 opacity-60">Have these ready first</p>
                      <p className="opacity-80">Full name, SIN, date of birth, Canadian address, a Canadian phone number, and your employment info. That's it — no paperwork to print.</p>
                    </div>
                    <ol className="space-y-2 list-decimal list-inside opacity-80">
                      <li>Download the Wealthsimple app and tap <span className="font-medium">Sign up</span>.</li>
                      <li>Enter your email, phone number, and a password, then confirm the code texted to your phone.</li>
                      <li>Fill in your personal details — name, date of birth, address, SIN, employment info.</li>
                      <li>Identity check happens automatically in the background. Occasionally it'll ask for a selfie and a photo of your ID instead — normal, not a red flag.</li>
                      <li>Choose your first account: a Cash account for bucketed saving, or one of Canada's investment accounts if you're ready to invest — we'll explain exactly which one and why in the next gate, so it's fine to just note this and move on for now.</li>
                      <li>Link your Canadian bank account to fund it, either by logging in through your bank or entering your account and transit number. That's it — the account's open and ready. Actually automating transfers into it comes later, in Gate 9.</li>
                    </ol>
                  </div>
                </div>

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>Check off what you've sorted. You'll need a SIN and Canadian ID before a brokerage account can be opened — this usually happens naturally in your first few weeks here.</p>
                <Check3 label="I have my SIN (Social Insurance Number)" checked={d.accSIN} onToggle={() => set("accSIN")(!d.accSIN)} />
                <Check3 label="I have valid Canadian ID" checked={d.accID} onToggle={() => set("accID")(!d.accID)} />
                <Check3 label="Brokerage account is open and bank account is linked" checked={d.accOpened} onToggle={() => set("accOpened")(!d.accOpened)} />

                <div className="mt-5 p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Brokerage open, bank linked. Nicely done.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>Now let's look at which tax-advantaged accounts to actually open inside it, so your investments start growing tax-free from day one.</p>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-sm mb-3" style={{ color: INK, opacity: 0.7 }}>
                  Real talk: this is exactly where most people switch off. TFSA. RRSP. FHSA. Three acronyms that sound like a keyboard mishap, explained by every bank's website like you already have a finance degree. They're not complicated. Let's fix that.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  Normally, when your investments grow, the government takes a cut of that growth every year. These accounts flip that — Canada lets the money inside them grow tax-free or tax-deferred. Compared to most places, including likely where you're from, that's a genuinely big deal. Skip them and you're quietly leaving money on the table.
                </p>

                <div className="mb-5 p-3 rounded-2xl" style={{ background: `${STAMP}10` }}>
                  <p className="text-sm" style={{ color: INK, opacity: 0.8 }}>
                    <span className="font-bold">Important: these aren't high-interest savings accounts.</span> A TFSA or RRSP is just a wrapper. Money sitting in one as plain cash doesn't grow tax-free on its own — it only grows once it's actually invested in something, like the index funds we'll get to soon. Genuinely common mistake: people open a TFSA, leave the cash sitting there, and wonder why nothing's happening.
                  </p>
                </div>

                <AccountCard
                  icon={PiggyBank}
                  badge="Fill this first"
                  name="TFSA"
                  full="Tax-Free Savings Account"
                  accent={FOREST}
                  body={
                    <p>The simplest one. You put in money you've already paid tax on, and it grows completely tax-free — forever. No tax on the growth, no tax when you take it out, no matter how big it gets. This is the one that matters most once your investments are really compounding — the day you're sitting on $100k+ and it keeps growing, none of that growth is ever taxed. That's why it gets first priority, every time.</p>
                  }
                  stat="2026 limit: $7,000/year, building up from the year you became a Canadian resident."
                />

                <AccountCard
                  icon={Landmark}
                  badge="2nd priority"
                  name="RRSP"
                  full="Registered Retirement Savings Plan"
                  accent={GOLD}
                  body={
                    <>
                      <p>The flip side of the TFSA. Instead of tax-free later, you get the tax break now — money you contribute reduces your taxable income for the year, so some of that tax comes back to you at refund time. It grows tax-deferred, and you only pay tax when you eventually withdraw it, usually in retirement when your income — and tax rate — is lower.</p>
                      <p>Worth knowing: if your employer offers a group RRSP, some will match a percentage of what you contribute directly through payroll. That's free money — one of the rare offers in personal finance that's an easy yes.</p>
                    </>
                  }
                  stat="2026 limit: 18% of last year's income, up to $33,810."
                />

                <AccountCard
                  icon={Home}
                  badge="3rd, if buying's on the radar"
                  name="FHSA"
                  full="First Home Savings Account"
                  accent={STAMP}
                  body={
                    <>
                      <p>The newest one, and honestly a bit of magic. It's a TFSA and RRSP mashed together — contributions reduce your taxable income like an RRSP, and withdrawals toward a first home are completely tax-free like a TFSA.</p>
                      <p>Best part: if you open one and life changes — you never end up buying — you can simply transfer the whole balance straight into your RRSP, tax-free, regardless of how much RRSP room you have. There's genuinely no downside to opening one, even if you're not sure yet.</p>
                    </>
                  }
                  stat="2026 limit: $8,000/year, $40,000 lifetime."
                />
                <div className="mb-5 p-3 rounded-2xl" style={{ background: `${STAMP}12` }}>
                  <p className="text-sm" style={{ color: INK, opacity: 0.8 }}>
                    <span className="font-bold">Worth repeating:</span> if you don't end up buying a home, the entire FHSA balance can simply be transferred into your RRSP — tax-free, regardless of how much RRSP room you have. There's no penalty and no downside to opening one, even if a house is only a maybe.
                  </p>
                </div>

                <AccountCard
                  icon={GraduationCap}
                  badge="Bonus, if kids are in the picture"
                  name="RESP"
                  full="Registered Education Savings Plan"
                  accent={INK}
                  body={
                    <p>Not for you — for a future kid's education. The government matches 20% of what you put in, up to $500 a year per child, up to $7,200 over their childhood. That's a guaranteed 20% return before the money's even invested. Nothing else in this guide comes close.</p>
                  }
                  stat="Match: 20% up to $500/yr, $7,200 lifetime per child."
                />

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${FOREST}18` }}>
                    <Star size={14} style={{ color: FOREST }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>What order to actually fund these in</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-3" style={{ color: INK, opacity: 0.8 }}>
                    <p>Not advice, just the order that makes sense to me — worth confirming against your own goals, or with a registered advisor:</p>
                    <ol className="space-y-2.5 list-decimal list-inside">
                      <li><span className="font-bold">TFSA first.</span> Tax-free forever beats every other advantage on this list. Fill this before anything else.</li>
                      <li><span className="font-bold">Then RRSP or FHSA</span> — depends on your goal. If buying a home is realistically on the horizon, FHSA usually comes first, since it does everything RRSP does plus gives you a tax-free withdrawal toward the house. If retirement is the focus and a home purchase isn't, go RRSP. Either way: <span className="font-bold">both of these hand you a chunk back at tax season</span> — the contribution reduces your taxable income, so you'll see some of it return as a refund the following spring. TFSA never does this; these two do. One more RRSP-only perk: it's the only account here that can come with an employer match through work — literally free money, so check if yours offers it.</li>
                      <li><span className="font-bold">Then RESP, if you have kids.</span> Not a tax deduction like the two above — instead the government matches 20% of what you put in, which is its own kind of guaranteed return.</li>
                      <li><span className="font-bold">Then a non-registered account, once everything above is full.</span> This is where any leftover investing money goes after your tax-sheltered room runs out. The good news: it's not as harsh as it sounds. In Canada, only <span className="font-bold">50% of a capital gain gets added to your taxable income</span> — taxed at your normal marginal rate, not some special punishing rate — and critically, <span className="font-bold">only once you actually sell.</span> Paper gains on stuff you're still holding are never taxed. Most people won't touch this stage for years, but it's good to know the ceiling isn't a wall.</li>
                    </ol>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: LINE }}>
                  <div className="px-4 py-3" style={{ background: `${INK}08` }}>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: INK }}>Room & penalties, made simple</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>Every account above has an annual limit, and going over it triggers a real CRA penalty — 1% a month on the extra amount until it's fixed. That sounds scary, and it's the part banks make feel complicated. It isn't.</p>
                    <p>Wealthsimple shows your exact remaining room, live, right in the app — it updates the moment you contribute. You're not tracking this in a spreadsheet. Glance at the number before you add money, and you're basically overcontribution-proof.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${FOREST}18` }}>
                    <Smartphone size={14} style={{ color: FOREST }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>Setting each one up in Wealthsimple</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-3" style={{ color: INK }}>
                    <p className="opacity-80">Once you've got the app downloaded from Gate 4 and you're earning, opening each account takes about a minute — same flow every time:</p>
                    <ol className="space-y-2 list-decimal list-inside opacity-80">
                      <li>In the app, go to <span className="font-medium">Accounts</span> and tap to add a new one.</li>
                      <li>Pick the type — TFSA, RRSP, FHSA, or RESP.</li>
                      <li>Confirm your SIN if it's not already on file — this is how the account gets registered with the CRA.</li>
                      <li>Link your Canadian bank account so it's ready to fund. That's it for now — actually setting up the automatic transfers into each account happens later, in Gate 9.</li>
                    </ol>
                    <div className="p-3 rounded-2xl" style={{ background: `${GOLD}12` }}>
                      <p className="font-bold text-xs uppercase tracking-wide mb-1" style={{ color: GOLD }}>One RESP quirk</p>
                      <p className="opacity-80">If you're opening an RESP, you'll be asked for the child's SIN and your relationship to them as the beneficiary — so this one waits until you actually have a kid, not something to set up in advance.</p>
                    </div>
                  </div>
                </div>

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <Field label="Year you became a Canadian tax resident" hint="Not your PR date specifically — it's whichever year you settled here with real ties (home, job, bank account), even on a work permit. For most newcomers that's the year they arrived. Check your exact figure with CRA before contributing.">
                  <Input type="number" value={d.arrivalYear} onChange={(e) => set("arrivalYear")(e.target.value)} placeholder="2024" />
                </Field>
                <div className="mt-2 p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60" style={{ color: INK }}>Estimated TFSA room</div>
                  <div className="font-mono text-3xl font-black" style={{ color: GOLD }}>{tfsaRoom !== null ? cad(tfsaRoom) : "—"}</div>
                  <p className="text-sm mt-1" style={{ color: INK, opacity: 0.7 }}>Room builds from the year you became a Canadian resident, not years lived elsewhere. This is a rough estimate only.</p>
                </div>

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>Check off which ones you've actually opened, in priority order:</p>
                <Check3 label="TFSA — fill this first, tax-free growth forever" checked={d.taxTFSA} onToggle={() => set("taxTFSA")(!d.taxTFSA)} />
                <Check3 label="RRSP — 2nd priority, tax refund now, check for employer match" checked={d.taxRRSP} onToggle={() => set("taxRRSP")(!d.taxRRSP)} />
                <Check3 label="FHSA — if a home's on the horizon, or not: it can be transferred tax-free to RRSP later either way" checked={d.taxFHSA} onToggle={() => set("taxFHSA")(!d.taxFHSA)} />
                <Check3 label="RESP — only if you have kids to save for" checked={d.taxRESP} onToggle={() => set("taxRESP")(!d.taxRESP)} />

                <div className="mt-5 p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Tax-sheltered accounts, sorted.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>Next up: compound interest — the actual engine that turns steady investing into serious money. Once you see the math, you'll want to automate everything. Promise.</p>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <p className="text-base font-black mb-3" style={{ color: STAMP }}>
                  Anyone can become a millionaire. No trust fund, no six-figure salary, no lucky stock pick — just time and consistency. No excuses left after this gate.
                </p>
                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  Okay, this is the fun gate. Everything up to now has been about managing the money your job pays you. This one's different — this is how real wealth actually gets built, and it has almost nothing to do with your paycheque.
                </p>
                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  Once money's invested, it just quietly works. No shifts, no overtime, no asking for a raise — it compounds away in the background while you're at work, asleep, on a night out, completely unrelated to anything you're doing. That's the part that's genuinely wild once it clicks.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  Meet Sarah and Tom. Same rule for both: invest $300 <span className="font-bold">bi-weekly</span>, never stop, retire at 60. The only difference is when they start.
                </p>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-3" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${FOREST}18` }}>
                    <span className="font-black text-sm" style={{ color: INK }}>Sarah</span>
                    <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full" style={{ background: FOREST, color: PAPER }}>Starts at 25</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>Starts investing $300 bi-weekly the day her first real paycheque lands, and just keeps going — 35 years, no breaks — all the way to retirement at 60.</p>
                    <div className="flex gap-3 pt-1">
                      <div className="flex-1 p-2.5 rounded-2xl text-center" style={{ background: `${INK}08` }}>
                        <div className="font-mono text-[10px] uppercase opacity-60">She put in</div>
                        <div className="font-mono font-black">{cad(273000)}</div>
                      </div>
                      <div className="flex-1 p-2.5 rounded-2xl text-center" style={{ background: `${FOREST}15` }}>
                        <div className="font-mono text-[10px] uppercase opacity-60">At 60, she has</div>
                        <div className="font-mono font-black text-lg" style={{ color: FOREST }}>{cad(2467815)}</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl text-center" style={{ background: `${GOLD}15` }}>
                      <div className="font-mono text-[10px] uppercase opacity-60">Pure return — money that showed up while she lived her life</div>
                      <div className="font-mono font-black text-lg" style={{ color: GOLD }}>{cad(2194815)}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: STAMP }}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${STAMP}18` }}>
                    <span className="font-black text-sm" style={{ color: INK }}>Tom</span>
                    <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full" style={{ background: STAMP, color: PAPER }}>Starts at 35</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>Also means to start at 25. New country, new job, life's chaotic — "I'll sort it once things settle down." Ten years quietly disappear. At 35 he finally starts the exact same $300 bi-weekly, and keeps it going just as reliably as Sarah — 25 years, no breaks, to the same retirement at 60.</p>
                    <div className="flex gap-3 pt-1">
                      <div className="flex-1 p-2.5 rounded-2xl text-center" style={{ background: `${INK}08` }}>
                        <div className="font-mono text-[10px] uppercase opacity-60">He put in</div>
                        <div className="font-mono font-black">{cad(195000)}</div>
                      </div>
                      <div className="flex-1 p-2.5 rounded-2xl text-center" style={{ background: `${STAMP}15` }}>
                        <div className="font-mono text-[10px] uppercase opacity-60">At 60, he has</div>
                        <div className="font-mono font-black text-lg" style={{ color: STAMP }}>{cad(862442)}</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl text-center" style={{ background: `${GOLD}15` }}>
                      <div className="font-mono text-[10px] uppercase opacity-60">Pure return — money that showed up while he lived his life</div>
                      <div className="font-mono font-black text-lg" style={{ color: GOLD }}>{cad(667442)}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Sarah invested for just 10 more years than Tom. She retired with $1.6 million more.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>Same monthly habit. Same return. The only difference was starting a decade sooner — and that decade of extra head start is worth more than everything Tom ever contributed.</p>
                </div>

                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  And 10% isn't a fantasy number. It's roughly the long-run average of the S&P 500 — the broad US stock market — going all the way back to 1928. Some years it's up 25%, some years it's down 15%, but stretched over decades, ~10% a year before inflation is what a boring, diversified, do-nothing-clever portfolio has actually delivered.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  No stock-picking required. Next gate covers exactly how you capture that average safely, without needing to be a genius or get lucky.
                </p>

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>Now play with your own numbers below.</p>

                <div className="mb-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: INK, opacity: 0.6 }}>How much would you like to invest?</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        prefix="$" type="number" inputMode="decimal"
                        value={d.contribution}
                        onChange={(e) => set("contribution")(e.target.value)}
                        placeholder="e.g. 300"
                      />
                    </div>
                    <div className="flex rounded-full border-2 shrink-0" style={{ borderColor: INK }}>
                      {["biweekly", "monthly"].map((f) => (
                        <button
                          key={f}
                          onClick={() => { if (f === d.contributionFreq) return; const v = parseFloat(d.contribution); const nv = (!v || isNaN(v)) ? d.contribution : (f === "monthly" ? String(Math.round(v * 26 / 12)) : String(Math.round(v * 12 / 26))); setD(prev => ({ ...prev, contribution: nv, contributionFreq: f })); }}
                          className="px-3 py-1.5 text-xs font-mono capitalize rounded-full"
                          style={{ background: d.contributionFreq === f ? INK : "transparent", color: d.contributionFreq === f ? PAPER : INK }}
                        >
                          {f === "biweekly" ? "Bi-weekly" : "Monthly"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 p-2.5 rounded-2xl flex justify-between items-center" style={{ background: remainingAfterInvesting >= 0 ? `${FOREST}12` : `${STAMP}12` }}>
                    <span className="text-xs font-mono uppercase opacity-60" style={{ color: INK }}>Remaining fun money</span>
                    <span className="font-mono font-bold" style={{ color: remainingAfterInvesting >= 0 ? FOREST : STAMP }}>
                      {cad(remainingAfterInvesting)} {d.contributionFreq === "biweekly" ? "/2wk" : "/mo"}
                    </span>
                  </div>
                  <span className="block text-xs mt-1" style={{ color: INK, opacity: 0.5 }}>Your gap from Gate 1 minus whatever you invest — adjust the amount above and this updates live.</span>
                </div>

                <Field label="Starting amount already invested, if any" hint="Leave at 0 if you're starting fresh.">
                  <Input prefix="$" type="number" inputMode="decimal" value={d.startingAmount} onChange={(e) => set("startingAmount")(e.target.value)} placeholder="0" />
                </Field>

                <div className="grid sm:grid-cols-2 gap-x-4 mt-3">
                  <Field label="Years invested"><Slider value={d.years} onChange={set("years")} min={5} max={30} suffix="y" /></Field>
                  <Field label="Assumed annual return"><Slider value={d.rate} onChange={set("rate")} min={6} max={15} suffix="%" /></Field>
                </div>
                <div style={{ height: 200 }} className="mt-3 -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={FOREST} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={FOREST} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={LINE} strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: INK }} tickFormatter={(v) => `Y${v}`} />
                      <YAxis tick={{ fontSize: 11, fill: INK }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} width={40} />
                      <Tooltip formatter={(v) => cad(v)} labelFormatter={(l) => `Year ${l}`} />
                      <Area type="monotone" dataKey="value" stroke={FOREST} strokeWidth={2.5} fill="url(#growthFill)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1 p-3 rounded-2xl" style={{ background: `${FOREST}12` }}>
                    <div className="font-mono text-[10px] uppercase opacity-60" style={{ color: INK }}>Projected value</div>
                    <div className="font-mono text-xl font-black" style={{ color: FOREST }}>{cad(finalValue)}</div>
                  </div>
                  <div className="flex-1 p-3 rounded-2xl" style={{ background: `${INK}08` }}>
                    <div className="font-mono text-[10px] uppercase opacity-60" style={{ color: INK }}>You'll have contributed</div>
                    <div className="font-mono text-xl font-black" style={{ color: INK }}>{cad(totalContributed)}</div>
                  </div>
                </div>

                <div className="my-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>Or flip it around — set a goal, and see what it actually takes to get there, using the years and return you set above.</p>
                <Field label="Your goal amount">
                  <Input prefix="$" type="number" inputMode="decimal" value={d.goalAmount} onChange={(e) => set("goalAmount")(e.target.value)} placeholder="1000000" />
                </Field>
                <div className="p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60" style={{ color: INK }}>What that takes, bi-weekly</div>
                  <div className="font-mono text-3xl font-black" style={{ color: GOLD }}>{requiredBiweekly > 0 ? cad(requiredBiweekly) : "—"}</div>
                  <p className="text-sm mt-1" style={{ color: INK, opacity: 0.7 }}>
                    {requiredBiweekly > 0
                      ? `That's ${cad(requiredMonthly)} a month, invested for ${d.years} years at ${d.rate}% average, to land on ${cad(Number(d.goalAmount) || 0)}.`
                      : "Enter a goal amount above to see the number."}
                  </p>
                </div>

                <div className="mt-5 p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Compound interest is the engine.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>Index funds are how you actually fuel it, without needing to be a stock-picking genius. Let's look at those next.</p>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  You just saw that 10% average return is real. Here's how you actually capture it — no stock-picking, no genius required.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  An index fund is one fund that owns a tiny slice of hundreds or thousands of companies at once. Buy an S&P 500 index fund and you own a piece of 500 of the biggest US companies in a single purchase. You're not betting on any one of them — you're betting on the whole market going up over time, which, as Gate 6 just showed, it reliably has.
                </p>

                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>The index itself isn't fixed — that's the point.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>
                    Using the S&P 500 purely as an example, since I can't tell you which fund to buy: the 500 companies inside it aren't locked in forever. A committee reviews it regularly, and a company that's underperformed, shrunk too much, or lost relevance gets quietly removed — a new, growing company takes its spot. You're never stuck holding yesterday's losers. The index cleans itself out as it goes, which is part of why it holds up so well over long periods.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: LINE }}>
                  <div className="px-4 py-3" style={{ background: `${INK}08` }}>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: INK }}>Why people paid banks instead</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>For decades the default was different: you'd sit with a bank advisor, and they'd put you into a mutual fund — a fund run by a professional manager actively picking stocks, trying to beat the market. Sounds reasonable. You're paying for expertise, right?</p>
                    <p>Here's the catch: that expertise isn't free, and it usually doesn't work. Canadian mutual funds charge an MER — a management fee taken automatically every year, no matter how the fund performs. And the data on whether that fee buys you anything is brutal.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: STAMP }}>
                  <div className="px-4 py-3" style={{ background: `${STAMP}18` }}>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: STAMP }}>The numbers banks don't lead with</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2.5" style={{ color: INK, opacity: 0.8 }}>
                    <p>The average Canadian mutual fund charges around <span className="font-bold">1.47%</span> a year — some run as high as 2%+. A basic index ETF charges as little as <span className="font-bold">0.05–0.25%</span>. That gap looks tiny until you compound it over decades.</p>
                    <p>S&P's own SPIVA scorecard — the industry's standard report card — found that over 10 to 15 years, <span className="font-bold">85–98% of actively managed Canadian equity funds underperform</span> the very benchmark they're trying to beat. Almost all of them. Year after year.</p>
                    <p>And the fee isn't the only cost — some bank advisors are paid more to sell certain in-house funds, whether or not that fund is actually the best option for you.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: GOLD }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${GOLD}18` }}>
                    <Star size={14} style={{ color: GOLD }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: GOLD }}>Don't take my word for it</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2.5" style={{ color: INK, opacity: 0.8 }}>
                    <p><span className="font-bold">The Little Book of Common Sense Investing</span> by John Bogle — founder of Vanguard and the man who created the first index fund in 1976 — is built on one core idea: after costs, trying to beat the market is a loser's game, and simply owning the whole market at the lowest possible cost is the only strategy that guarantees you your fair share of its returns.</p>
                    <p><span className="font-bold">The Retirement Gamble</span>, a PBS Frontline documentary, dug into exactly where those hidden fees go — and found that over a working lifetime, fees most people don't even know they're paying can quietly cost the average person over $100,000. Bogle himself appears in it, saying the same thing: costs are the one thing you can actually control.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3" style={{ background: `${FOREST}18` }}>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>Your odds of losing money, long term</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>Using the S&P 500's full history as the example: over any 20-year stretch since records began, it has never delivered a negative return. Stretch that to 25 years and the worst window on record still averaged roughly <span className="font-bold">+2.6% a year</span> — the best window averaged closer to 12%. Historically, the odds of losing money over a 25-year horizon: <span className="font-bold">zero</span>.</p>
                    <p className="text-xs opacity-60">Past performance doesn't guarantee future results — but this is nearly a century of data across depressions, wars, and crashes saying the same thing.</p>
                  </div>
                </div>

                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${STAMP}10` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>The honest catch: it won't feel calm getting there.</p>
                  <p className="text-sm mb-2" style={{ color: INK, opacity: 0.75 }}>
                    In the 2008 financial crisis, the S&P 500 fell roughly 57% peak to trough. That's not a mutual-fund-vs-index-fund thing — a mutual fund holding similar stocks would've dropped just as hard. It's the price of admission for the long-term return, not a flaw in the strategy. Every crash in the index's history has fully recovered — which is exactly why the 25-year number above holds up.
                  </p>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>The trick: don't panic, don't sell. Keep going.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>
                    A downturn only becomes a loss if you sell during it — otherwise it's just a number on a screen that hasn't recovered yet. Keep your bi-weekly automatic contribution running exactly as normal (that's what Gate 9 sets up), and a falling market actually works in your favour: the same $300 buys more of the index while it's cheap, so you own more shares by the time it bounces back. Your automated buys never "lock in" a loss — only selling does. You can't time the market, so don't try. Just keep buying, on schedule, through the noise.
                  </p>
                </div>

                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  This is why low-cost index funds are such a genuine shift for someone doing this themselves: the strategy that quietly outperforms almost every expensive professional is also the cheapest, simplest one available — no advisor, no meetings, no guessing who's good.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  See it for yourself below — same portfolio, same market, only the fee changes.
                </p>

                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>Fees compound against you the same way returns compound for you.</p>
                <div className="grid sm:grid-cols-2 gap-x-4 mb-3">
                  <Field label="Starting amount"><Input prefix="$" type="number" value={d.feePortfolio} onChange={(e) => set("feePortfolio")(e.target.value)} /></Field>
                  <Field label="Years held"><Slider value={d.feeYears} onChange={set("feeYears")} min={5} max={35} suffix="y" /></Field>
                </div>
                <Field label="Bank mutual fund MER" hint="Defaults to 2% — a realistic mid-to-high range for a bank-sold Canadian equity mutual fund. Drag it to whatever you've actually been quoted.">
                  <Slider value={d.bankMER} onChange={set("bankMER")} min={0.5} max={3} step={0.1} suffix="%" />
                </Field>

                <div className="grid sm:grid-cols-2 gap-3 mb-3 mt-3">
                  <div className="rounded-[1.75rem] border-2 overflow-hidden" style={{ borderColor: STAMP }}>
                    <div className="px-3 py-2" style={{ background: `${STAMP}18` }}>
                      <div className="font-bold text-xs" style={{ color: INK }}>Typical bank mutual fund</div>
                      <div className="font-mono text-[10px] uppercase opacity-60" style={{ color: INK }}>{d.bankMER}% MER</div>
                    </div>
                    <div className="p-3">
                      <div className="font-mono text-xl font-black" style={{ color: STAMP }}>{cad(feeBankValue)}</div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border-2 overflow-hidden" style={{ borderColor: FOREST }}>
                    <div className="px-3 py-2" style={{ background: `${FOREST}18` }}>
                      <div className="font-bold text-xs" style={{ color: INK }}>Low-cost index fund</div>
                      <div className="font-mono text-[10px] uppercase opacity-60" style={{ color: INK }}>~0.2% MER</div>
                    </div>
                    <div className="p-3">
                      <div className="font-mono text-xl font-black" style={{ color: FOREST }}>{cad(feeIndexValue)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60" style={{ color: INK }}>Difference, same starting amount, same 10% market return</div>
                  <div className="font-mono text-3xl font-black" style={{ color: GOLD }}>{cad(feeDiff)}</div>
                  <p className="text-sm mt-1" style={{ color: INK, opacity: 0.7 }}>Nothing else changed between these two — same money, same market. Only the fee.</p>
                </div>
                <p className="text-xs mt-2" style={{ color: INK, opacity: 0.5 }}>
                  Footnote: this is actually generous to the bank fund. It assumes the manager matches the market's 10% gross return before fees, and just loses to the index on cost alone. In reality, most active managers don't even match the market's raw return over the long term — they just don't advertise that. What gets shown to you is usually a cherry-picked stretch where the fund happened to have a good run, not its honest track record over 15–20 years.
                </p>
                <p className="text-xs mt-2" style={{ color: INK, opacity: 0.5 }}>
                  And yes — there's more than just the MER. The quoted MER already has a trailing commission baked into it, paid to the advisor every year for as long as you hold the fund, whether or not they ever talk to you again. Older funds bought before June 2022 can also still carry a deferred sales charge — a penalty for selling before a set number of years — a practice now banned for new purchases, but not for money that went in before the ban. Some fee-based advisors also charge a separate planning or account fee on top, and some accounts carry a small annual administration fee — always worth asking "what am I actually paying, all in?" before signing anything.
                </p>

                <div className="mt-5 rounded-[1.75rem] border-2 overflow-hidden" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3" style={{ background: `${FOREST}18` }}>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>Why this is the core, not a piece of the puzzle</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2.5" style={{ color: INK, opacity: 0.8 }}>
                    <p>This is why low-cost index funds should be the bulk of any serious long-term portfolio — not one option among many, the actual foundation. Everything in this guide, from Sarah and Tom to the fee math above, only works if the core of the money is doing the boring, reliable thing.</p>
                    <p>Picking individual stocks isn't off-limits — plenty of people enjoy it, and there's nothing wrong with having some fun with it. But it's genuinely risky compared to owning the whole market, and it should be treated that way: a small slice, not the strategy. A common rule of thumb is capping individual stock picks at around <span className="font-bold">5% of a portfolio</span> — enough to scratch the itch, small enough that being wrong about one company never actually threatens the plan.</p>
                    <p className="font-bold">95%+ boring and diversified. 5% or less for the fun stuff, if any at all. That's a split that actually builds wealth — not the only one, just a sensible starting point to adjust from.</p>
                  </div>
                </div>

                <div className="mt-5 mb-5 p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Two quick things nobody explains</p>
                  <p className="text-sm mb-2" style={{ color: INK, opacity: 0.75 }}>
                    You don't need enough money to buy a "whole share." Say a fund costs $130 and you're investing $50 — most brokerages just buy you 0.38 of a share. Whatever amount you set is what actually goes in, no rounding up required.
                  </p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>
                    Many of these funds also pay dividends — small regular cash payouts from the companies inside them. Make sure dividend reinvestment (often called DRIP) is turned on in your brokerage settings, so those payouts automatically buy more of the fund instead of sitting there as cash. That's free extra snowball for compounding — don't leave it switched off by accident.
                  </p>
                </div>

                <div className="p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Now you know why index funds win.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>Next: real Canadian ticker symbols you can actually search and buy — so this gate's theory turns into an actual shopping list.</p>
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <p className="text-sm mb-2" style={{ color: INK, opacity: 0.7 }}>
                  Theory's done. This gate exists so that when you open your brokerage and see a wall of ticker symbols, none of it is a mystery — before Gate 9 puts the whole plan on autopilot.
                </p>
                <div className="mb-5 p-3 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <p className="text-sm" style={{ color: INK, opacity: 0.8 }}>
                    Quick thing that trips people up: <span className="font-bold">"S&P 500" is the index</span> — a list of 500 companies used to measure the market. You can't actually buy "the S&P 500" directly. <span className="font-bold">"VFV" is the ticker</span> — the real, Canadian-listed fund you search for and buy in your brokerage that tracks that index. Same idea, different name, because one is the concept and the other is the product on the shelf.
                  </p>
                </div>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  General education, not a personal recommendation — I'm not licensed to tell you what to buy. Look these up yourself, compare them, or run them by a registered advisor before you commit.
                </p>

                <FundCard
                  ticker="XEQT" name="iShares Core Equity ETF Portfolio" mer="0.20%" accent={FOREST}
                  risk="Medium–High" riskColor={FOREST} returns="~8–10%/yr"
                  holds="One fund, roughly 9,000 companies across Canada, the US, international, and emerging markets — a full portfolio in a single ticker."
                  note="The one most commonly mentioned for Canadian beginners wanting a single, all-in-one, do-nothing-else holding."
                />
                <FundCard
                  ticker="VEQT" name="Vanguard All-Equity ETF Portfolio" mer="0.20%" accent={FOREST}
                  risk="Medium–High" riskColor={FOREST} returns="~8–10%/yr"
                  holds="Nearly identical to XEQT — same idea, same cost, slightly more weighted toward Canadian companies."
                  note="Comes down to which provider you'd rather hold. Functionally, pick either."
                />
                <FundCard
                  ticker="VFV" name="Vanguard S&P 500 Index ETF" mer="0.09%" accent={GOLD}
                  risk="Medium–High" riskColor={GOLD} returns="~10%/yr"
                  holds="Tracks the S&P 500 directly — the same 500 US companies from Gate 6's Sarah and Tom story, held in a Canadian-listed fund."
                  note="Narrower than XEQT/VEQT — US only, no Canadian or international companies. A deliberate bet, not a full portfolio on its own."
                />
                <FundCard
                  ticker="VUN" name="Vanguard US Total Market Index ETF" mer="0.16%" accent={GOLD}
                  risk="Medium–High" riskColor={GOLD} returns="~9–10%/yr"
                  holds="The whole US stock market, not just the 500 biggest — large, mid, and small US companies in one fund."
                  note="Broader than VFV for a similar cost. Historically moves almost identically to the S&P 500, since the 500 make up most of it anyway."
                />
                <FundCard
                  ticker="XEF" name="iShares Core MSCI EAFE IMI Index ETF" mer="0.22%" accent={INK}
                  risk="Medium–High" riskColor={INK} returns="~5–7%/yr"
                  holds="Thousands of companies across developed international markets — Europe, Japan, Australia — no US or Canada."
                  note="How you add real international exposure without an all-in-one fund. Historically trailed US returns, but moves on a different cycle — genuine diversification, not just more of the same."
                />
                <FundCard
                  ticker="QQC" name="Invesco NASDAQ 100 Index ETF" mer="~0.35–0.39%" accent={STAMP}
                  risk="High" riskColor={STAMP} returns="~14%/yr since 1985"
                  holds="The 100 largest non-financial companies on the Nasdaq — heavily weighted toward big tech."
                  note="Concentrated, not diversified in the way the others are. In the dot-com crash it fell roughly 78% peak to trough, versus the S&P 500's ~49% — same kind of downturn, much rougher ride. That 14%/yr figure is the official long-run average since the index launched — not a guarantee going forward, and it hides some brutal years along the way."
                />

                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>These six are just a handpicked starting point.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>
                    There are hundreds of legitimate low-cost index funds out there, split by country, by sector or industry, by company size, by dividend focus — you can get as specific or as broad as you want. This list exists so the idea stops being abstract, not because these are the only six worth knowing.
                  </p>
                </div>

                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${INK}08` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Notice the pattern.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>
                    Every fund here charges under 0.4% — a fraction of the ~2% bank MER from the last gate — and every one of them, even the riskiest, is a fund of dozens or hundreds of companies, not a single stock. That's the whole strategy from this gate and the last one, just with real names attached.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-4" style={{ borderColor: STAMP }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${STAMP}18` }}>
                    <Star size={14} style={{ color: STAMP }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: STAMP }}>What I actually do — not advice, just transparency</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2.5" style={{ color: INK, opacity: 0.8 }}>
                    <p>My own bi-weekly contribution is split roughly <span className="font-bold">50% VFV, 40% QQC, and 5% + 5% in two individual stocks</span> I've chosen myself.</p>
                    <p>Yes — VFV and QQC overlap. A handful of the same mega-cap tech names show up in both. I'm doing it anyway, on purpose: QQC's tech-heavy tilt means it's positioned to potentially outgrow the S&P 500 — though that's absolutely not guaranteed, and it cuts both ways in a downturn. I use it to add some spice to my index fund picking rather than playing it completely flat, and so far it's outpaced VFV dramatically for me. That's a risk-tolerance call tied to my own 15–20 year timeline, not a rule for anyone else's.</p>
                    <p>The two 5% slices are individual stocks — right at that 5%-each cap from the last gate. Enough to have some skin in specific companies I believe in, small enough that being wrong about either one never threatens the plan.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3" style={{ background: `${FOREST}18` }}>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>For contrast: my in-laws</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-2" style={{ color: INK, opacity: 0.8 }}>
                    <p>They hold mostly VEQT — no QQC, no individual stocks. Lower volatility, lower expected return on paper, and that's exactly right for them.</p>
                    <p>They've been at this for decades and are retired now. Their balances are large enough that even a smaller percentage return compounds into serious money, and with far less time to recover from a bad crash, smoother and steadier beats swinging for extra growth. Same tools, completely different right answer — because the timeline is completely different.</p>
                  </div>
                </div>

                <p className="text-xs" style={{ color: INK, opacity: 0.5 }}>
                  Both of these are examples of real people making real choices for their own situation — not a template to copy. Your right split depends on your own timeline and how you actually feel watching a 78% drop happen to your money. Figure that out honestly before picking yours.
                </p>

                <div className="mt-5 p-4 rounded-2xl" style={{ background: `${GOLD}15` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: INK }}>Theory and tickers, done.</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>Next is the big one: putting every number from every gate so far into one real, automated system. This is where it all clicks.</p>
                </div>
              </>
            )}

            {step === 8 && (
              <>
                <p className="text-base font-black mb-3" style={{ color: FOREST }}>
                  This is the gate that changes everything. Set it up once, and every single payday, you pay your future self first — automatically, before you even see the money.
                </p>
                <p className="text-sm mb-5" style={{ color: INK, opacity: 0.7 }}>
                  This gate has two halves. First, we lock in your real numbers — five categories, no more, no less. Then we go step by step, bucket by bucket, until it's actually running instead of just sounding nice on paper.
                </p>
                <div className="mb-5 p-3 rounded-2xl flex gap-2" style={{ background: `${FOREST}12` }}>
                  <Check size={16} style={{ color: FOREST, flexShrink: 0, marginTop: 2 }} />
                  <p className="text-xs" style={{ color: INK, opacity: 0.75 }}>
                    Income and Fixed expenditure below are already filled in from Gate 1 — nothing to retype. Just glance over the numbers and tag each expense Credit card or Chequing bucket.
                  </p>
                </div>
                <div className="mb-5 p-3 rounded-2xl" style={{ background: `${GOLD}12` }}>
                  <p className="text-xs" style={{ color: INK, opacity: 0.8 }}>
                    <span className="font-bold">Quick priority reminder:</span> debt first, then emergency fund, then investing — you can fund all three at once, just keep debt getting the biggest share until it's cleared. Once debt's gone and your emergency fund's built, this shifts into set-and-forget mode with just small tweaks over time.
                  </p>
                </div>

                <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: INK, opacity: 0.6 }}>1. Income</p>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1">
                    <Input prefix="$" type="number" inputMode="decimal" value={d.income} onChange={(e) => set("income")(e.target.value)} placeholder="0" />
                  </div>
                  <div className="flex rounded-full border-2 shrink-0" style={{ borderColor: INK }}>
                    {["biweekly", "monthly"].map((f) => (
                      <button
                        key={f} onClick={() => { if (f === d.incomeFreq) return; const v = parseFloat(d.income); const nv = (!v || isNaN(v)) ? d.income : (f === "monthly" ? String(Math.round(v * 26 / 12)) : String(Math.round(v * 12 / 26))); setD(prev => ({ ...prev, income: nv, incomeFreq: f })); }}
                        className="px-3 py-1.5 text-xs font-mono capitalize rounded-full"
                        style={{ background: d.incomeFreq === f ? INK : "transparent", color: d.incomeFreq === f ? PAPER : INK }}
                      >
                        {f === "biweekly" ? "Bi-weekly" : "Monthly"}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: INK, opacity: 0.6 }}>2. Fixed expenditure</p>
                <p className="text-xs mb-3" style={{ color: INK, opacity: 0.6 }}>
                  Tag each one Credit card or Chequing bucket. Painful for two seconds, worth it forever — it's the only way the leftover in chequing is actually trustworthy as fun money.
                </p>
                <BudgetGroup
                  title="Fixed expenses" presets={PRESET_FIXED} items={d.fixedItems} accent={STAMP} showMethod
                  onAdd={(label) => addItem("fixedItems", label)} onAddCustom={(label) => addItem("fixedItems", label)}
                  onChange={(id, v) => updateItemAmount("fixedItems", id, v)} onRemove={(id) => removeItem("fixedItems", id)}
                  onMethodChange={(id, m) => updateItemMethod("fixedItems", id, m)}
                  total={displayFixed}
                  freqLabel={gapFreqLabel}
                />
                <div className="flex gap-3 mb-5 -mt-3">
                  <div className="flex-1 p-2.5 rounded-2xl text-center" style={{ background: `${INK}08` }}>
                    <div className="font-mono text-[10px] uppercase opacity-60">Credit card float</div>
                    <div className="font-mono font-bold" style={{ color: INK }}>{cad(displayFixedCredit)} <span className="text-xs font-normal opacity-60">{gapFreqLabel}</span></div>
                  </div>
                  <div className="flex-1 p-2.5 rounded-2xl text-center" style={{ background: `${STAMP}12` }}>
                    <div className="font-mono text-[10px] uppercase opacity-60">Chequing buckets</div>
                    <div className="font-mono font-bold" style={{ color: STAMP }}>{cad(displayFixedChequing)} <span className="text-xs font-normal opacity-60">{gapFreqLabel}</span></div>
                  </div>
                </div>

                <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: INK, opacity: 0.6 }}>3. Savings</p>
                <p className="text-xs mb-3" style={{ color: INK, opacity: 0.6 }}>Trips, emergency fund top-ups, anything else with a name on it.</p>
                <BudgetGroup
                  title="Savings goals" presets={PRESET_SAVING.filter((p) => p !== "Investments")} items={d.savingItems} accent={GOLD}
                  onAdd={(label) => addItem("savingItems", label)} onAddCustom={(label) => addItem("savingItems", label)}
                  onChange={(id, v) => updateItemAmount("savingItems", id, v)} onRemove={(id) => removeItem("savingItems", id)}
                  total={displaySaving}
                  freqLabel={gapFreqLabel}
                />

                <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: INK, opacity: 0.6 }}>4. Investments — total</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <Input prefix="$" type="number" inputMode="decimal" value={d.contribution} onChange={(e) => set("contribution")(e.target.value)} placeholder="0" />
                  </div>
                  <div className="flex rounded-full border-2 shrink-0" style={{ borderColor: INK }}>
                    {["biweekly", "monthly"].map((f) => (
                      <button
                        key={f} onClick={() => { if (f === d.contributionFreq) return; const v = parseFloat(d.contribution); const nv = (!v || isNaN(v)) ? d.contribution : (f === "monthly" ? String(Math.round(v * 26 / 12)) : String(Math.round(v * 12 / 26))); setD(prev => ({ ...prev, contribution: nv, contributionFreq: f })); }}
                        className="px-3 py-1.5 text-xs font-mono capitalize rounded-full"
                        style={{ background: d.contributionFreq === f ? INK : "transparent", color: d.contributionFreq === f ? PAPER : INK }}
                      >
                        {f === "biweekly" ? "Bi-weekly" : "Monthly"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-5 p-2.5 rounded-2xl text-center" style={{ background: `${FOREST}12` }}>
                  <div className="font-mono text-[10px] uppercase opacity-60">Investment total</div>
                  <div className="font-mono font-bold" style={{ color: FOREST }}>{cad(investBiweekly)} <span className="text-xs font-normal opacity-60">/2wk</span></div>
                </div>

                <div className="mb-5 p-3 rounded-2xl flex justify-between items-center" style={{ background: `${GOLD}12`, border: `1px dashed ${GOLD}` }}>
                  <div>
                    <div className="font-mono text-[10px] uppercase opacity-60" style={{ color: INK }}>Subtotal — savings + investments</div>
                    <div className="text-xs opacity-60" style={{ color: INK }}>this whole amount moves as one transfer straight to Wealthsimple, where it auto-splits itself — exactly how, is what we set up below</div>
                  </div>
                  <div className="font-mono font-bold shrink-0 pl-3" style={{ color: GOLD }}>{cad(savingBiweekly + investBiweekly)} <span className="text-xs font-normal opacity-60">/2wk</span></div>
                </div>

                <div className="mb-5 p-4 rounded-2xl" style={{ background: `${FOREST}12` }}>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60" style={{ color: INK }}>5. Fun fund, remaining</div>
                  <div className="font-mono text-3xl font-black" style={{ color: finalFunMoneyBiweekly >= 0 ? FOREST : STAMP }}>{cad(finalFunMoneyBiweekly)} <span className="text-sm font-normal opacity-60">/2wk</span></div>
                  <p className="text-sm mt-1" style={{ color: INK, opacity: 0.7 }}>
                    Income, minus everything above. This is what stays sitting in chequing, untouched by anything automatic — spend it however you like, whenever you like.
                  </p>
                </div>

                <div className="my-6 border-t-2 border-dashed" style={{ borderColor: LINE }} />

                <p className="text-base font-black mb-2" style={{ color: FOREST }}>Numbers locked. Now let's actually build it.</p>
                <p className="text-sm mb-3" style={{ color: INK, opacity: 0.7 }}>
                  Nobody's bank magically knows to do this — you have to tell it, once, and then never again. Grab your phone, open your banking app, and follow along like I'm standing over your shoulder. This is the least exciting productive thing you'll do all year.
                </p>
                <div className="mb-5 p-3 rounded-2xl" style={{ background: `${INK}08` }}>
                  <p className="text-xs" style={{ color: INK, opacity: 0.75 }}>
                    <span className="font-bold">CIBC is only the example</span> — it's what I bank with, so it's what I can actually screenshot. On TD, BMO, RBC, Scotiabank, or anyone else, the exact same tool exists, just under a slightly different button. Look for <span className="font-bold">"Scheduled transfers"</span> or <span className="font-bold">"Recurring transfers,"</span> usually tucked under a <span className="font-bold">"Move money"</span> or <span className="font-bold">"Transfers"</span> menu. Every major Canadian bank has this — none of them make you go without it.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: GOLD }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${GOLD}18` }}>
                    <Sparkles size={14} style={{ color: GOLD }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: GOLD }}>Step by step: your bank, CIBC as the example</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-4" style={{ color: INK }}>
                    <div>
                      <p className="font-bold mb-1.5">1. Open a bucket for every chequing item above</p>
                      <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                        <li>In the CIBC app, tap the <span className="font-bold">+</span> next to "Deposit Accounts," or tap <span className="font-bold">Apply</span>.</li>
                        <li>Choose <span className="font-bold">eAdvantage Savings Account</span>. No fee, no minimum — and since you're already a CIBC client, this is usually instant, not a fresh application.</li>
                        <li>Once it's open, tap into it, find the rename or edit option, and give it the bucket's actual name — "Rent," "Utilities," "Trip fund" — so it's obvious at a glance later.</li>
                        <li>Repeat once per bucket. Tedious the first time through, invisible forever after.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold mb-1.5">2. Set an automatic transfer into each bucket, on payday</p>
                      <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                        <li>From the home screen, tap <span className="font-bold">Move money</span>, then <span className="font-bold">Add Transaction</span> (this is CIBC's AutoSave tool).</li>
                        <li>Set <span className="font-bold">From: Chequing</span>, <span className="font-bold">To:</span> the bucket you just named.</li>
                        <li>Enter the dollar amount from category 2 for that exact item.</li>
                        <li>Set the frequency to match your category 1 toggle — Bi-weekly or Monthly — and pick your actual next payday as the start date.</li>
                        <li>Confirm. Repeat for every bucket. This is the whole trick — future-you doesn't get a vote once it's running.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold mb-1.5">3. Set one bulk transfer to your credit card, same day</p>
                      <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                        <li>Same Move money screen, one more transfer: <span className="font-bold">From: Chequing</span>, <span className="font-bold">To:</span> your credit card.</li>
                        <li>Amount = the "Credit card float" total from category 2 — everything you tagged Credit card, added up.</li>
                        <li>Same frequency, same payday. This is what actually pays the card off before it can charge you a cent of interest, while every one of those purchases still earns points or cash back like it's supposed to.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold mb-1.5">4. Set one transfer straight to your brokerage</p>
                      <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                        <li>If Wealthsimple isn't already saved as a contact, add it once — either as an Interac e-Transfer recipient (their email, from your Wealthsimple account settings) or as a bill payee if your bank supports it.</li>
                        <li>Set up the recurring transfer the same way as the buckets: amount = the combined savings + investments subtotal, same payday.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold mb-1.5">5. Leave the rest exactly where it lands</p>
                      <p className="opacity-80">Whatever's still sitting in chequing after every transfer above fires is category 5 — your fun fund. Don't build a bucket for it. Its entire job is to just sit there, guilt-free, until you spend it.</p>
                    </div>
                    <div className="p-3 rounded-2xl" style={{ background: `${FOREST}12` }}>
                      <p className="font-bold text-xs uppercase tracking-wide mb-1" style={{ color: FOREST }}>Small bonus</p>
                      <p className="opacity-80">CIBC pays extra "Smart Interest" in months your combined eAdvantage balance across all your buckets grows by $200 or more — free money for doing something you were already doing.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${FOREST}18` }}>
                    <TrendingUp size={14} style={{ color: FOREST }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>Now the big one: Wealthsimple</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-4" style={{ color: INK }}>
                    <p className="opacity-80">Your bank's job stops at the brokerage door. Wealthsimple takes it from there — and this is genuinely the fun part, because it's the last thing you'll ever have to set up. Everything below is specific to Wealthsimple's own app; if you opened somewhere else in Gate 5, the buttons will be named slightly differently, but the same two things exist everywhere.</p>
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wide mb-1.5 opacity-60">Part 1 — savings buckets, if you want them here too</p>
                      <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                        <li>Open the Wealthsimple app, tap into your <span className="font-bold">Cash</span> account.</li>
                        <li>Look for <span className="font-bold">Add a goal</span> or a similar "+" option — this creates a named sub-bucket, same idea as CIBC's, except it can also earn interest while it sits there.</li>
                        <li>Name it to match a category 3 goal — "Trips," "Emergency fund top-up" — and set a recurring transfer into it, same payday as everything else. Optional, not required, if you'd rather keep goals at your bank instead.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wide mb-1.5 opacity-60">Part 2 — the main event: recurring investments</p>
                      <ul className="space-y-1.5 opacity-80 list-disc list-inside">
                        <li>Tap into the account you're investing through — your TFSA, RRSP, FHSA, RESP, non-registered, or whatever else you set up back in Gate 5.</li>
                        <li>Find <span className="font-bold">Recurring investments</span> (usually under Activity or the account's own menu), then tap <span className="font-bold">Create a recurring investment</span>.</li>
                        <li>Search the ticker for whatever you've decided to invest in — VFV, QQC, XEQT, and the others from Gate 8 are examples, not a locked-in list. If you've researched something else that fits your goals better, search that instead.</li>
                        <li>Enter the dollar amount and set the frequency to match your split of the total from category 4.</li>
                        <li>Confirm, then repeat for every fund or stock in your split. Once each one is set, you never touch it again — it buys automatically, on schedule, market up or down.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border-2 overflow-hidden mb-5" style={{ borderColor: FOREST }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${FOREST}18` }}>
                    <Smartphone size={14} style={{ color: FOREST }} />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: FOREST }}>See it in action — my real setup</span>
                  </div>
                  <div className="px-4 py-4 text-sm space-y-4" style={{ color: INK }}>
                    <p className="opacity-80">This is genuinely what's live in my accounts right now — every account number and email swapped out, but the structure and dollar amounts are exactly what runs on my payday. I get paid bi-weekly, so every figure below is a bi-weekly amount, not monthly.</p>

                    <div>
                      <p className="font-bold text-xs uppercase tracking-wide mb-2 opacity-60">CIBC chequing splits itself, same day</p>
                      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: LINE }}>
                        {[
                          ["Rent bucket", "$760"], ["Car insurance bucket", "$46"], ["Utilities bucket", "$30"],
                          ["Food bucket", "$160"], ["Credit card float", "$183"],
                          ["To Wealthsimple", "$800"],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between px-3 py-2 text-xs" style={{ borderBottom: `1px solid ${LINE}` }}>
                            <span className="opacity-70">{l}</span><span className="font-mono font-bold">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-xs uppercase tracking-wide mb-2 opacity-60">The $800 lands in one place, then splits itself</p>
                      <p className="text-xs mb-2 opacity-70">All $800 arrives in my Wealthsimple Chequing account — which doubles as my emergency fund. From there, it splits itself four ways:</p>
                      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: LINE }}>
                        {[
                          ["VFV — investing", "$250 /2wk"], ["QQC — investing", "$200 /2wk"],
                          ["2 individual stocks — investing", "$50 /2wk"],
                          ["Trips fund", "$100 /2wk"],
                          ["Stays as emergency fund top-up", "$150 /2wk"],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between px-3 py-2 text-xs" style={{ borderBottom: `1px solid ${LINE}` }}>
                            <span className="opacity-70">{l}</span><span className="font-mono font-bold">{v}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs mt-1 opacity-60">$500 goes into the four standing buy orders, $100 sweeps out to a Trips bucket, and the remaining $150 just sits — it's the ongoing top-up for the emergency fund itself. Once that fund hits its $8,000 target, that $150 stops being needed there and gets redirected into investments instead. The bucket's job changes; the transfer doesn't have to.</p>
                    </div>
                  </div>
                </div>

                <Check3 label="I've picked a payday to run all transfers on" checked={d.autoDay} onToggle={() => set("autoDay")(!d.autoDay)} />
                <Check3 label="Every bucket, the credit card float, and the brokerage transfer match the numbers above" checked={d.autoAmount} onToggle={() => set("autoAmount")(!d.autoAmount)} />
                <Check3 label="Recurring investments are set up for every fund and stock in my split" checked={d.autoSet} onToggle={() => set("autoSet")(!d.autoSet)} />
              </>
            )}

            {step === 9 && (
              <div className="text-center py-2">
                <Stamp size="md">Cleared for Landing</Stamp>
                <h3 className="text-xl font-black mt-4 mb-1" style={{ color: INK }}>Your route is set.</h3>
                <p className="text-sm mb-6" style={{ color: INK, opacity: 0.7 }}>This is your snapshot right now, built from your own real numbers at every gate. Come back and update it anytime your situation changes — for today, here's exactly where you stand.</p>

                <div className="text-left grid sm:grid-cols-2 gap-3">
                  <ItineraryRow label="Income" value={`${cad(Number(d.income) || 0)} /${d.incomeFreq === "biweekly" ? "2wk" : "mo"}`} />
                  <ItineraryRow label="Fixed expenses" value={`${cad(displayFixed)} ${gapFreqLabel}`} />
                  <ItineraryRow label="Debt payoff time" value={debtMonths ? `${debtMonths} mo` : debtTotal > 0 ? "—" : "Cleared"} />
                  <ItineraryRow label="Emergency fund" value={`${cad(Number(d.efCurrent) || 0)} / ${cad(efTarget)}`} />
                  <ItineraryRow label="Savings goals" value={cad(savingBiweekly) + " /2wk"} />
                  <ItineraryRow label="Investing" value={cad(investBiweekly) + " /2wk"} />
                  <ItineraryRow label="Fun fund, guilt-free" value={cad(finalFunMoneyBiweekly) + " /2wk"} />
                </div>

                <div className="mt-4 p-4 rounded-2xl text-left" style={{ background: `${GOLD}15` }}>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60" style={{ color: INK }}>Projected value in {d.years} years</div>
                  <div className="font-mono text-3xl font-black" style={{ color: GOLD }}>{cad(finalValue)}</div>
                  <p className="text-sm mt-1" style={{ color: INK, opacity: 0.7 }}>
                    Built from the contribution and return rate you set back in Gate 6 — {d.rate}% here, used as the example throughout this guide because it's roughly the S&P 500's long-run historical average, achievable with a boring, diversified, low-cost index fund like the ones in Gate 7. It's not from the specific funds in Gate 8 — VFV, QQC, XEQT, and the rest each have their own real historical average, so your actual number depends on the mix you land on. And no return is ever guaranteed; markets don't move in a straight line. Think of this as a realistic direction, not a promise.
                  </p>
                </div>

                <p className="text-xs mt-6" style={{ color: INK, opacity: 0.45 }}>General education, not personalized advice. Talk to a registered advisor or accountant for your specific situation.</p>

                <p className="text-base font-black mt-6" style={{ color: FOREST }}>
                  You're done. Genuinely done. Go have dinner with friends, sleep in, hit the gym — spend your fun fund completely guilt-free, exactly as you set it up, because your wealth is quietly compounding in the background the entire time, whether you're watching or not.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center mt-5 px-1">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1 font-mono text-sm uppercase tracking-wide disabled:opacity-30 px-4 py-2 rounded-full border-2 transition-transform active:scale-95 hover:opacity-80"
            style={{ borderColor: INK, color: INK }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={goNext}
            disabled={step === STEPS.length - 1}
            className="flex items-center gap-1 font-mono text-sm uppercase tracking-wide disabled:opacity-30 px-5 py-2 rounded-full text-white transition-transform active:scale-95 hover:opacity-90"
            style={{ background: INK, boxShadow: `0 4px 14px -4px ${INK}80` }}
          >
            Next Gate <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ItineraryRow({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2" style={{ borderColor: LINE }}>
      <span className="font-mono text-xs uppercase tracking-wide opacity-60" style={{ color: INK }}>{label}</span>
      <span className="font-mono font-bold" style={{ color: INK }}>{value}</span>
    </div>
  );
}
