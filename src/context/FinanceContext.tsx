"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

// ── Types ──

interface Income {
  gross_salary: number;
  state: string;
  filing_status: string;
  contribution_401k: number;
  health_insurance: number;
  hsa: number;
  bonus_amount: number;
  bonus_type: string;
  student_loan_interest: number;
  charitable: number;
}

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  note: string;
}

interface Debt {
  name: string;
  balance: number;
  rate: number;
  min_payment: number;
}

interface Goal {
  name: string;
  target: number;
  current: number;
  deadline: string;
  priority: number;
}

interface TakeHome {
  annual_gross: number;
  contrib_401k: number;
  health: number;
  hsa: number;
  pretax: number;
  fed_tax: number;
  state_tax: number;
  fica: number;
  total_tax: number;
  annual_take_home: number;
  monthly_take_home: number;
  agi: number;
  taxable: number;
  std_ded: number;
  effective_rate: number;
  marginal_fed: number;
  filing: string;
}

interface FinanceData {
  income: Income;
  budget: {
    needs: Record<string, number>;
    wants: Record<string, number>;
    savings: Record<string, number>;
  };
  expenses: Expense[];
  assets: Record<string, number>;
  liabilities: Record<string, number>;
  debts: Debt[];
  savings_goals: Goal[];
}

interface FinanceContextType {
  data: FinanceData;
  takeHome: TakeHome | null;
  loading: boolean;
  user: any | null;
  updateIncome: (income: Partial<Income>) => void;
  updateBudget: (category: "needs" | "wants" | "savings", items: Record<string, number>) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  updateAssets: (assets: Record<string, number>) => void;
  updateLiabilities: (liabilities: Record<string, number>) => void;
  setDebts: (debts: Debt[]) => void;
  setGoals: (goals: Goal[]) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const DEFAULT_DATA: FinanceData = {
  income: {
    gross_salary: 95000, state: "New York", filing_status: "Single",
    contribution_401k: 6, health_insurance: 180, hsa: 100,
    bonus_amount: 10000, bonus_type: "Annual (spread monthly)",
    student_loan_interest: 0, charitable: 0,
  },
  budget: {
    needs: { Rent: 1900, Utilities: 130, Groceries: 380, Transportation: 127, Insurance: 90, "Min. Debt Payments": 0, Phone: 75 },
    wants: { "Dining Out": 280, Entertainment: 90, Subscriptions: 45, Shopping: 120, Travel: 175, Gym: 45 },
    savings: { "Emergency Fund": 350, "Student Loans (Extra)": 0, Investing: 450, "Short-Term Goals": 150 },
  },
  expenses: [
    { id: "1", date: new Date().toISOString().slice(0, 10), amount: 1900, category: "Rent", note: "Monthly rent" },
    { id: "2", date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10), amount: 52.30, category: "Groceries", note: "Trader Joe's" },
    { id: "3", date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10), amount: 45, category: "Dining Out", note: "Dinner with friends" },
    { id: "4", date: new Date(Date.now() - 86400000 * 6).toISOString().slice(0, 10), amount: 127, category: "Transportation", note: "Metro pass" },
    { id: "5", date: new Date(Date.now() - 86400000 * 8).toISOString().slice(0, 10), amount: 89.99, category: "Shopping", note: "Running shoes" },
  ],
  assets: { Checking: 6200, Savings: 9500, "401(k)": 4800, "Roth IRA": 2500, Brokerage: 1800 },
  liabilities: { "Student Loans": 0, "Car Loan": 0, "Credit Cards": 0 },
  debts: [{ name: "Student Loan", balance: 35000, rate: 5.5, min_payment: 370 }],
  savings_goals: [
    { name: "Emergency Fund", target: 15000, current: 9500, deadline: "2027-12-31", priority: 1 },
    { name: "Vacation Fund", target: 3000, current: 800, deadline: "2026-12-31", priority: 2 },
    { name: "Down Payment", target: 50000, current: 1800, deadline: "2030-06-30", priority: 3 },
  ],
};

// ── Context ──

const FinanceContext = createContext<FinanceContextType | null>(null);

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}

// ── Provider ──

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceData>(DEFAULT_DATA);
  const [takeHome, setTakeHome] = useState<TakeHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Calculate take-home whenever income changes
  const recalculate = useCallback(async (income: Income) => {
    try {
      const result = await api<TakeHome>("/api/take-home", income);
      setTakeHome(result);
    } catch (e) {
      console.error("Take-home calc failed:", e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Load saved data
        try {
          const { data: row } = await supabase
            .from("user_data")
            .select("app_data")
            .eq("user_id", session.user.id)
            .single();
          if (row?.app_data) {
            setData(row.app_data as FinanceData);
            await recalculate(row.app_data.income);
          } else {
            await recalculate(DEFAULT_DATA.income);
          }
        } catch {
          await recalculate(DEFAULT_DATA.income);
        }
      } else {
        await recalculate(DEFAULT_DATA.income);
      }
      setLoading(false);
    };
    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, [recalculate]);

  // Auto-save debounced
  const autoSave = useCallback((newData: FinanceData) => {
    if (!user) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        await supabase
          .from("user_data")
          .upsert({ user_id: user.id, app_data: newData }, { onConflict: "user_id" });
      } catch (e) {
        console.error("Auto-save failed:", e);
      }
    }, 2000);
  }, [user]);

  // Update functions
  const updateIncome = useCallback((partial: Partial<Income>) => {
    setData(prev => {
      const newIncome = { ...prev.income, ...partial };
      const newData = { ...prev, income: newIncome };
      recalculate(newIncome);
      autoSave(newData);
      return newData;
    });
  }, [recalculate, autoSave]);

  const updateBudget = useCallback((category: "needs" | "wants" | "savings", items: Record<string, number>) => {
    setData(prev => {
      const newData = { ...prev, budget: { ...prev.budget, [category]: items } };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setData(prev => {
      const newData = { ...prev, expenses: [{ ...expense, id: Date.now().toString() }, ...prev.expenses] };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const deleteExpense = useCallback((id: string) => {
    setData(prev => {
      const newData = { ...prev, expenses: prev.expenses.filter(e => e.id !== id) };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const updateAssets = useCallback((assets: Record<string, number>) => {
    setData(prev => {
      const newData = { ...prev, assets };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const updateLiabilities = useCallback((liabilities: Record<string, number>) => {
    setData(prev => {
      const newData = { ...prev, liabilities };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const setDebts = useCallback((debts: Debt[]) => {
    setData(prev => {
      const newData = { ...prev, debts };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const setGoals = useCallback((goals: Goal[]) => {
    setData(prev => {
      const newData = { ...prev, savings_goals: goals };
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  // Auth
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Reload data after sign in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: row } = await supabase
        .from("user_data")
        .select("app_data")
        .eq("user_id", session.user.id)
        .single();
      if (row?.app_data) {
        setData(row.app_data as FinanceData);
        await recalculate((row.app_data as FinanceData).income);
      }
    }
    return {};
  }, [recalculate]);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setData(DEFAULT_DATA);
    setUser(null);
    await recalculate(DEFAULT_DATA.income);
  }, [recalculate]);

  return (
    <FinanceContext.Provider value={{
      data, takeHome, loading, user,
      updateIncome, updateBudget, addExpense, deleteExpense,
      updateAssets, updateLiabilities, setDebts, setGoals,
      signIn, signUp, signOut,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}
