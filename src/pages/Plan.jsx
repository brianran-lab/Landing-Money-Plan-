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
    arrivalYear: "", contribution: "", contributionFreq: "biweekly", years: 25, rate: 10, goalAmount: "",
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
  const displayFixed = useMemo(() => (d.incomeFreq === "biweekly" ? fixedTotal * 12 / 26 : fixedTotal), [d.incomeFreq, fixedTotal]);
  const displayGap = useMemo(() => displayIncome - displayFixed, [displayIncome, displayFixed]);
  const fixedCreditTotal = useMemo(() => d.fixedItems.filter((i) => i.method === "credit").reduce((s, i) => s + (Number(i.amount) || 0), 0), [d.fixedItems]);
  const fixedChequingTotal = useMemo(() => fixedTotal - fixedCreditTotal, [fixedTotal, fixedCreditTotal]);
  const displayFixedCredit = useMemo(() => (d.incomeFreq === "biweekly" ? fixedCreditTotal * 12 / 26 : fixedCreditTotal), [d.incomeFreq, fixedCreditTotal]);
  const displayFixedChequing = useMemo(() => (d.incomeFreq === "biweekly" ? fixedChequingTotal * 12 / 26 : fixedChequingTotal), [d.incomeFreq, fixedChequingTotal]);
  const gap = useMemo(() => incomeMonthly - fixedTotal, [incomeMonthly, fixedTotal]);

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

  const efTarget = useMemo(() => fixedTotal * d.efMultiplier, [fixedTotal, d.efMultiplier]);
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
    let balance = 0;
    for (let y = 0; y <= years; y++) {
      if (y > 0) {
        for (let m = 0; m < 12; m++) balance = balance * (1 + r) + c;
      }
      rows.push({ year: y, value: Math.round(balance) });
    }
    return rows;
  }, [contributionMonthly, d.rate, d.years]);
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
                  This is the quickest, easiest stop on this whole route — and it's also the one most people quietly avoid. Budgeting has a reputation for being tedious, fiddly, spreadsheet-heavy work. It's not. It's two numbers: what comes in, and what goes out. That's it. Give it two minutes below and you're done with the hardest-sounding step in the entire guide.
                </p>
                <p className="text-sm mb-4" style={{ color: INK, opacity: 0.7 }}>
                  Redo this in Canadian dollars — don't assume your old budget habits still apply here.
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
                          onClick={() => set("incomeFreq")(f)}
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
                      <span className="font-bold">Quick nudge:
