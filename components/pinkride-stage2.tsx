"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  Copy,
  CreditCard,
  Download,
  Heart,
  Home,
  LocateFixed,
  MapPin,
  MessageSquareText,
  Minus,
  Navigation,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShieldPlus,
  Siren,
  Sparkles,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const mockUser = {
  name: "Priya Sharma",
  phone: "+91 98765 43210",
  email: "priya.sharma@gmail.com",
  avatar: "PS",
};

const mockCaptain = {
  name: "Ananya Patel",
  phone: "+91 98765 43210",
  rating: 4.9,
  rides: 1248,
  vehicle: "Honda Activa",
  plate: "GJ 05 AB 1234",
  city: "Surat, Gujarat",
  avatar: "AP",
};

const passengerSteps = [
  "splash",
  "onboarding",
  "login",
  "otp",
  "profile",
  "permissions",
  "home",
  "search",
  "pickup",
  "ride-options",
  "fare",
  "confirm-booking",
  "finding",
  "captain-assigned",
  "captain-arriving",
  "captain-arrived",
  "ride-pin",
  "ride-active",
  "safety",
  "share",
  "ride-complete",
  "payment",
  "rating",
  "history",
] as const;

type PassengerStep = (typeof passengerSteps)[number];
type Role = "passenger" | "captain";
type RideStatus =
  | "idle"
  | "searching_captain"
  | "captain_requested"
  | "captain_assigned"
  | "captain_navigating_pickup"
  | "captain_arrived"
  | "awaiting_pin"
  | "ride_started"
  | "ride_in_progress"
  | "ride_completed"
  | "payment_pending"
  | "payment_completed"
  | "rated"
  | "cancelled";

type MockRide = {
  id: string;
  passenger: string;
  captain: string;
  pickup: string;
  destination: string;
  fare: number;
  captainEarnings: number;
  status: RideStatus;
  pin: string;
  distance: string;
  eta: string;
  duration: string;
  paymentMethod: string;
};

const defaultRide: MockRide = {
  id: "PR-28461",
  passenger: "Priya Sharma",
  captain: "Ananya Patel",
  pickup: "Current Location",
  destination: "Vesu, Surat",
  fare: 82,
  captainEarnings: 72,
  status: "idle",
  pin: "4821",
  distance: "6.4 km",
  eta: "3 min away",
  duration: "18 min",
  paymentMethod: "UPI",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d089aa] focus:ring-offset-2";
  const variants = {
    primary:
      "bg-[#a6437a] text-white shadow-[0_14px_30px_rgba(166,67,122,0.28)] hover:bg-[#8d3768]",
    secondary:
      "border border-[#e9d2dd] bg-white text-[#2b2d2f] shadow-sm hover:bg-[#fdf4f7]",
    ghost: "bg-transparent text-[#2b2d2f] hover:bg-[#f4eef1]",
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(base, variants[variant], className, disabled && "cursor-not-allowed opacity-75")}
    >
      {children}
    </button>
  );
}

function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const digits = Array.from({ length: 4 }, (_, index) => value[index] ?? "");

  return (
    <div className="flex items-center justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          value={digit}
          inputMode="numeric"
          maxLength={1}
          onChange={(event) => {
            const next = event.target.value.replace(/[^0-9]/g, "").slice(0, 1);
            const entered = (value || "").split("");
            entered[index] = next;
            onChange(entered.join("").slice(0, 4));
          }}
          className="h-14 w-12 rounded-2xl border border-[#e7d9e4] bg-white text-center text-xl font-bold text-[#1d1b1f] shadow-sm outline-none transition-all focus:border-[#b85587]"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

function MapView({
  mode = "home",
  routeProgress = 30,
}: {
  mode?: "home" | "route" | "finding";
  routeProgress?: number;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#edf2f4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.85),transparent_20%),linear-gradient(135deg,#edf0f4,#e8ecef_48%,#dfe7eb)]" />
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(135,150,160,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(135,150,160,0.3)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="absolute left-[18%] top-[20%] h-16 w-32 rotate-12 rounded-full border border-[#c1bec8]/70 bg-white/12" />
      <div className="absolute right-[20%] top-[28%] h-14 w-28 -rotate-12 rounded-full border border-[#c1bec8]/70 bg-white/14" />
      <div className="absolute left-[22%] bottom-[26%] h-28 w-40 rotate-6 rounded-full border border-[#c1bec8]/70 bg-white/12" />

      <div className="absolute left-[27%] top-[30%] h-[1px] w-[48%] bg-[#adb7bb]/70" />
      <div className="absolute left-[15%] bottom-[38%] h-[1px] w-[55%] rotate-[-18deg] bg-[#adb7bb]/70" />
      <div className="absolute right-[14%] top-[38%] h-[1px] w-[26%] rotate-[16deg] bg-[#adb7bb]/70" />

      <div className="absolute left-[24%] top-[54%] h-3 w-3 rounded-full bg-[#a6437a] shadow-[0_0_0_8px_rgba(166,67,122,0.15)]" />
      <div className="absolute right-[18%] bottom-[25%] h-3 w-3 rounded-full bg-[#5d1f4d] shadow-[0_0_0_8px_rgba(93,31,77,0.2)]" />
      <div className="absolute left-[50%] top-[46%] h-4 w-4 rounded-full bg-[#a6437a] shadow-[0_0_0_10px_rgba(166,67,122,0.15)]" />

      {mode !== "home" && (
        <div className="absolute inset-x-[16%] top-[30%] h-[2px] rounded-full bg-gradient-to-r from-[#a6437a] via-[#8d3f8a] to-[#5d1f4d] shadow-[0_0_18px_rgba(166,67,122,0.6)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-transparent via-[#f7d0df] to-transparent"
            style={{ width: `${routeProgress}%` }}
          />
        </div>
      )}

      {mode === "finding" && (
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          className="absolute left-[24%] top-[55%] flex h-20 w-20 items-center justify-center rounded-full border border-[#a6437a]/40"
        >
          <div className="h-5 w-5 rounded-full bg-[#a6437a]" />
        </motion.div>
      )}

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-md backdrop-blur-sm">
          <LocateFixed className="h-4 w-4 text-[#2a2f33]" />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-md backdrop-blur-sm">
          <Plus className="h-4 w-4 text-[#2a2f33]" />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-md backdrop-blur-sm">
          <Minus className="h-4 w-4 text-[#2a2f33]" />
        </button>
      </div>
    </div>
  );
}

function CaptainHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-5 flex items-start justify-between px-4 pt-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a7d85]">PinkRide</p>
        <h1 className="mt-1 text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#676167]">{subtitle}</p>}
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-sm font-bold text-white shadow-md">
        AP
      </div>
    </header>
  );
}

function PinkRideStage2() {
  const [role, setRole] = useState<Role>("passenger");
  const [ride, setRide] = useState<MockRide>(defaultRide);
  const [passengerStep, setPassengerStep] = useState<PassengerStep>("splash");
  const [captainStep, setCaptainStep] = useState<"splash" | "login" | "otp" | "onboarding" | "home" | "request" | "navigate" | "arrived" | "pin" | "active" | "safety" | "earnings" | "profile" | "wallet" | "rides" | "help" | "settings">("splash");
  const [otp, setOtp] = useState("");
  const [captainOtp, setCaptainOtp] = useState("");
  const [passengerRating, setPassengerRating] = useState(0);
  const [captainRating, setCaptainRating] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [sosOpen, setSosOpen] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (passengerStep === "splash") {
      const timer = window.setTimeout(() => setPassengerStep("onboarding"), 1700);
      return () => window.clearTimeout(timer);
    }
  }, [passengerStep]);

  useEffect(() => {
    if (captainStep === "splash") {
      const timer = window.setTimeout(() => setCaptainStep("login"), 1400);
      return () => window.clearTimeout(timer);
    }
  }, [captainStep]);

  useEffect(() => {
    if (ride.status === "searching_captain" && role === "passenger") {
      setPassengerStep("finding");
    }
    if (ride.status === "captain_assigned" && role === "passenger") {
      setPassengerStep("captain-assigned");
    }
    if (ride.status === "captain_arrived" && role === "passenger") {
      setPassengerStep("captain-arrived");
    }
    if (ride.status === "ride_started" && role === "passenger") {
      setPassengerStep("ride-active");
    }
    if (ride.status === "ride_completed" && role === "passenger") {
      setPassengerStep("ride-complete");
    }
    if (ride.status === "payment_completed" && role === "passenger") {
      setPassengerStep("rating");
    }
  }, [ride.status, role]);

  useEffect(() => {
    if (ride.status === "captain_requested" && role === "captain") {
      setCaptainStep("request");
    }
    if (ride.status === "captain_assigned" && role === "captain") {
      setCaptainStep("navigate");
    }
    if (ride.status === "captain_arrived" && role === "captain") {
      setCaptainStep("arrived");
    }
    if (ride.status === "awaiting_pin" && role === "captain") {
      setCaptainStep("pin");
    }
    if (ride.status === "ride_started" && role === "captain") {
      setCaptainStep("active");
    }
    if (ride.status === "ride_completed" && role === "captain") {
      setCaptainStep("earnings");
    }
  }, [ride.status, role]);

  useEffect(() => {
    if (otp.length === 4 && otp === "4821") {
      const timer = window.setTimeout(() => {
        setPassengerStep("profile");
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [otp]);

  useEffect(() => {
    if (captainOtp.length === 4 && captainOtp === "4821") {
      const timer = window.setTimeout(() => {
        setCaptainStep("onboarding");
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [captainOtp]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const demoScenario = useMemo(() => ({
    requestTimer: 15,
    captainEarnings: 72,
  }), []);

  const bookRide = () => {
    setRide((prev) => ({
      ...prev,
      status: "searching_captain",
      pickup: "Current Location",
      destination: "Vesu, Surat",
      fare: 82,
      captainEarnings: 72,
      paymentMethod: "UPI",
    }));
    setPassengerStep("finding");
    setRole("passenger");
  };

  const captainAcceptRide = () => {
    setRide((prev) => ({ ...prev, status: "captain_assigned" }));
    setRole("captain");
    setToast("Ride accepted");
  };

  const captainDeclineRide = () => {
    setRide((prev) => ({ ...prev, status: "cancelled" }));
    setPassengerStep("finding");
    setRole("passenger");
    setToast("Ride declined");
  };

  const captainArrived = () => {
    setRide((prev) => ({ ...prev, status: "captain_arrived" }));
    setRole("captain");
  };

  const confirmPassengerPin = () => {
    setRide((prev) => ({ ...prev, status: "ride_started" }));
    setRole("captain");
    setToast("Ride verified");
  };

  const completeRide = () => {
    setRide((prev) => ({ ...prev, status: "ride_completed", captainEarnings: 72 }));
    setRole("captain");
    setToast("₹72 earned");
  };

  const renderPassengerFlow = () => {
    if (passengerStep === "splash") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen items-center justify-center bg-[#fffafc]">
          <div className="flex flex-col items-center justify-center gap-5 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-[radial-gradient(circle_at_30%_20%,#f8dbe8,#d79ab0_28%,#b44b7a_52%,#6e2148_100%)] shadow-[0_20px_50px_rgba(166,67,122,0.36)]">
              <span className="text-2xl font-black text-white">P</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="text-xl font-semibold text-[#352d3b]">
              Safe rides. By women. For women.
            </motion.p>
          </div>
        </motion.div>
      );
    }

    if (passengerStep === "onboarding") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f0d7e3,#d081a5_40%,#a6437a_80%)] text-sm font-bold text-white">P</div>
              <span className="text-lg font-semibold tracking-wide text-[#2a1d28]">PinkRide</span>
            </div>
            <button onClick={() => setPassengerStep("login")} className="text-sm font-medium text-[#7d7780]">Skip</button>
          </div>
          <div className="flex h-[430px] flex-col rounded-[32px] bg-white p-4 shadow-[0_18px_40px_rgba(132,92,120,0.08)]">
            <div className="mb-6 flex justify-center gap-2">
              {[0, 1, 2].map((index) => (
                <span key={index} className={cn("h-2.5 w-2.5 rounded-full transition-all", index === 0 ? "w-7 bg-[#a6437a]" : "bg-[#ecdfe7]")} />
              ))}
            </div>
            <div className="flex h-52 w-full items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_30%_0%,#ffeaf1,#f2d9e6_40%,#ead4df_55%,#f6f2f3_100%)]">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/70 shadow-inner">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7cfe0,#d88cad_45%,#a6437a_100%)] text-3xl font-black text-white">✦</div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h1 className="text-[30px] font-bold tracking-[-0.06em] text-[#241d27]">Move freely.</h1>
              <p className="mt-3 text-[15px] leading-7 text-[#58545a]">Convenient bike rides designed specifically for women.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_112px] gap-3">
            <Button onClick={() => setPassengerStep("login")}>Next</Button>
            <Button variant="secondary" onClick={() => setPassengerStep("login")}>Skip</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "login") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafd] px-5 pb-8 pt-8">
          <div className="mb-8 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_20%,#f0d7e3,#d88cad_35%,#a6437a_80%)] text-lg font-bold text-white shadow-md">P</div>
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-[32px] font-bold tracking-[-0.06em] text-[#2a1d28]">Welcome to PinkRide</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#6a6368]">Your safer way to move around the city.</p>
          </div>

          <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-4 shadow-[0_18px_40px_rgba(132,92,120,0.06)]">
            <label className="mb-2 block text-sm font-medium text-[#4c474d]">Mobile number</label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#f0dfe8] bg-[#fffdfd] px-3 py-3 shadow-sm">
              <span className="rounded-full bg-[#f5edf2] px-2 py-1 text-sm font-semibold text-[#2d2a2d]">+91</span>
              <input className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none placeholder:text-[#908b90]" value="98765 43210" readOnly />
            </div>
            <Button onClick={() => setPassengerStep("otp")} className="mt-5 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "otp") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <button onClick={() => setPassengerStep("login")} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#4a464b]">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Verify your number</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#655f63]">We&apos;ve sent a 4-digit code to +91 XXXXX XXXXX</p>
          </div>
          <div className="rounded-[30px] border border-[#f0dde7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <OTPInput value={otp} onChange={setOtp} />
            <p className="mt-5 text-center text-sm font-medium text-[#8d7d84]">Resend code in 00:30</p>
            <Button onClick={() => setPassengerStep("profile")} className="mt-6 w-full" disabled={otp.length !== 4}>Continue</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "profile") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Let&apos;s get you started</h1>
          </div>
          <div className="rounded-[28px] border border-[#f3dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <div className="mb-6 flex items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-2xl font-bold text-white shadow-md">
                <span>PS</span>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#ead6e3] text-[#5e2645]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4b484d]">Full name</label>
                <input value={mockUser.name} readOnly className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4b484d]">Email</label>
                <input value={mockUser.email} readOnly className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none" />
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-[#6d6a6e]">PinkRide is exclusively for women passengers and women captains.</p>
            <Button onClick={() => setPassengerStep("permissions")} className="mt-6 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "permissions") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Let&apos;s make your rides safer</h1>
          </div>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#f0dde7] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9edf3] text-[#a6437a]"><MapPin className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-semibold text-[#1f1f22]">Location</h2>
                  <p className="text-xs text-[#706b71]">Used to find your pickup location and track your ride.</p>
                </div>
              </div>
              <Button onClick={() => setToast("Location enabled")} variant="secondary" className="mt-4 w-full">Allow location</Button>
            </div>
            <div className="rounded-[24px] border border-[#f0dde7] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9edf3] text-[#a6437a]"><Bell className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-semibold text-[#1f1f22]">Notifications</h2>
                  <p className="text-xs text-[#706b71]">Get important updates about your ride.</p>
                </div>
              </div>
              <Button onClick={() => setToast("Notifications enabled")} variant="secondary" className="mt-4 w-full">Allow notifications</Button>
            </div>
          </div>
          <div className="mt-6"><Button onClick={() => setPassengerStep("home")} className="w-full">Continue</Button></div>
        </div>
      );
    }

    if (passengerStep === "home") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] pb-24 pt-6">
          <header className="mb-4 flex items-center justify-between px-4">
            <div>
              <p className="text-[13px] font-medium text-[#8a7d85]">Good morning, Priya 👋</p>
              <h1 className="mt-1 text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">Where are you going today?</h1>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-sm font-bold text-white shadow-md">PS</div>
          </header>
          <div className="h-[420px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_40px_rgba(39,19,31,0.08)] px-4">
            <MapView mode="home" />
          </div>
          <div className="-mt-4 mx-4 rounded-[30px] border border-[#f1dfe8] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#f1dfe8] bg-[#fdf4f7] p-3">
              <div className="flex flex-col items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#a6437a]" />
                <span className="h-6 w-px bg-[#d9b5c6]" />
                <span className="h-2.5 w-2.5 rounded-full border border-[#a6437a] bg-white" />
              </div>
              <div className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#6f6a70]">Pickup</span><span className="font-medium text-[#1f1f22]">Current location</span></div>
                <div className="flex justify-between"><span className="text-[#6f6a70]">Destination</span><button onClick={() => setPassengerStep("search")} className="font-medium text-[#a6437a]">Search destination</button></div>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 px-4">
            {[{ title: "Book a Pink Bike", subtitle: "Fast & affordable", icon: Sparkles }, { title: "Safety", subtitle: "Your safety center", icon: ShieldPlus }, { title: "Ride history", subtitle: "View your previous rides", icon: BriefcaseBusiness }].map((item) => (
              <button key={item.title} onClick={() => {
                if (item.title === "Safety") setPassengerStep("safety");
                if (item.title === "Ride history") setPassengerStep("history");
                if (item.title === "Book a Pink Bike") setPassengerStep("search");
              }} className="rounded-[24px] border border-[#f0dfe7] bg-white p-3 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edf3] text-[#a6437a]"><item.icon className="h-4 w-4" /></div>
                <p className="text-sm font-semibold text-[#1f1f22]">{item.title}</p>
                <p className="mt-1 text-[11px] text-[#716b70]">{item.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (passengerStep === "search") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-5">
          <div className="mb-5 flex items-center gap-3">
            <button onClick={() => setPassengerStep("home")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft className="h-4 w-4 text-[#2b2a2d]" /></button>
            <div className="flex-1 rounded-2xl border border-[#f0dde7] bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2"><Search className="h-4 w-4 text-[#a6437a]" /><input value="Vesu, Surat" readOnly className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none" /></div>
            </div>
          </div>
          <div className="space-y-3">
            {[{ label: "Vesu", detail: "Surat, Gujarat" }, { label: "VR Mall", detail: "Dumas Road, Surat" }, { label: "Surat Railway Station", detail: "Station Road" }, { label: "Airport", detail: "Surat International Airport" }].map((item) => (
              <button key={item.label} onClick={() => { setRide((prev) => ({ ...prev, destination: `${item.label}, Surat` })); setPassengerStep("pickup"); }} className="flex w-full items-center justify-between rounded-2xl border border-[#f1e5eb] bg-white p-3 text-left shadow-sm">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7edf3] text-[#a6437a]"><MapPin className="h-4 w-4" /></span><div><p className="font-medium text-[#1f1f22]">{item.label}</p><p className="text-xs text-[#737174]">{item.detail}</p></div></div>
                <ChevronRight className="h-4 w-4 text-[#7b6a73]" />
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (passengerStep === "pickup") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[480px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_40px_rgba(26,17,22,0.08)]">
            <MapView mode="route" routeProgress={70} />
          </div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#211d20]">Confirm pickup</h2>
            <div className="mt-4 rounded-2xl bg-[#fdf4f7] p-3"><div className="mb-3 flex items-center gap-2 text-sm text-[#665d62]"><span className="h-2.5 w-2.5 rounded-full bg-[#a6437a]" /> Pickup</div><div className="font-medium text-[#1f1f22]">Current Location</div></div>
            <div className="mt-3 rounded-2xl bg-[#f8f8f9] p-3"><div className="mb-3 flex items-center gap-2 text-sm text-[#665d62]"><span className="h-2.5 w-2.5 rounded-full border border-[#a6437a] bg-white" /> Destination</div><div className="font-medium text-[#1f1f22]">{ride.destination}</div></div>
            <Button onClick={() => setPassengerStep("ride-options")} className="mt-5 w-full">Confirm location</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "ride-options") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="mb-4 h-[280px] overflow-hidden rounded-[28px] border border-[#f1dfe8] bg-white p-2 shadow-sm"><MapView mode="route" routeProgress={50} /></div>
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="mb-4 text-[24px] font-bold tracking-[-0.05em] text-[#211d20]">Choose your ride</h2>
            <div className="space-y-3">
              {[
                { id: "pink-bike", name: "Pink Bike", eta: "2 min away", fare: 82, tag: "Fast & affordable" },
                { id: "pink-auto", name: "Pink Auto", eta: "5 min away", fare: 126, tag: "More space", badge: "Coming soon" },
              ].map((option) => (
                <button key={option.id} onClick={() => setRide((prev) => ({ ...prev, fare: option.fare }))} className={cn("flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition-all", option.id === "pink-bike" ? "border-[#a6437a] bg-[#fff4f8]" : "border-[#f0dde7] bg-white") }>
                  <div>
                    <div className="flex items-center gap-2"><h3 className="text-base font-semibold text-[#1f1f22]">{option.name}</h3>{option.id === "pink-bike" && <Check className="h-4 w-4 text-[#a6437a]" />}</div>
                    <p className="mt-1 text-sm text-[#69646a]">Women captain</p>
                    <p className="mt-1 text-sm text-[#69646a]">{option.eta}</p>
                    <div className="mt-2 flex items-center gap-2"><span className="text-xl font-bold text-[#1f1f22]">₹{option.fare}</span><span className="text-xs text-[#787178]">{option.tag}</span></div>
                  </div>
                  {option.badge && <span className="rounded-full bg-[#f2ecf2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6d5a67]">{option.badge}</span>}
                </button>
              ))}
            </div>
            <Button onClick={() => setPassengerStep("fare")} className="mt-5 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "fare") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f1dfe8] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d1f]">Your ride</h2>
            <div className="mt-4 space-y-3 text-sm text-[#5f5a60]">
              <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
              <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
            </div>
            <div className="mt-6 rounded-[24px] bg-[#fff7fa] p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Base fare</span><span>₹30</span></div>
                <div className="flex justify-between"><span>Distance</span><span>₹46</span></div>
                <div className="flex justify-between"><span>Platform fee</span><span>₹6</span></div>
              </div>
              <div className="mt-4 border-t border-[#f0dfe7] pt-3 text-base font-semibold text-[#1f1f22]">
                <div className="flex justify-between"><span>Total</span><span>₹82</span></div>
              </div>
            </div>
            <Button onClick={() => setPassengerStep("confirm-booking")} className="mt-6 w-full">Confirm PinkRide</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "confirm-booking") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-10">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d1f]">Ready to ride?</h2>
            <div className="mt-5 space-y-3 text-sm text-[#5c565c]">
              <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
              <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
              <div className="flex justify-between"><span>Ride type</span><span className="font-medium text-[#1f1f22]">Pink Bike</span></div>
              <div className="flex justify-between"><span>Estimated fare</span><span className="font-medium text-[#1f1f22]">₹82</span></div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#e9d7e1] bg-[#fff7fa] p-3 text-sm font-medium text-[#a6437a]">Women-only ride</div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setPassengerStep("ride-options")}>Change ride</Button>
              <Button onClick={() => { setRide((prev) => ({ ...prev, status: "searching_captain" })); setPassengerStep("finding"); }}>Book PinkRide</Button>
            </div>
          </div>
        </div>
      );
    }

    if (passengerStep === "finding") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pt-3">
          <div className="h-[560px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]">
            <MapView mode="finding" routeProgress={40} />
          </div>
          <div className="-mt-12 mx-auto max-w-[310px] rounded-[28px] border border-[#f0dde7] bg-white p-4 text-center shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="mb-4 flex items-center justify-center gap-3"><div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f8edf3] text-[#a6437a]"><motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute inset-0 rounded-full border border-[#a6437a]/50" /><MapPin className="h-5 w-5" /></div></div>
            <h2 className="text-[22px] font-bold tracking-[-0.05em] text-[#1d1b1f]">Finding your PinkRide captain...</h2>
            <p className="mt-2 text-sm text-[#655f63]">Matching you with a verified woman captain nearby.</p>
          </div>
        </div>
      );
    }

    if (passengerStep === "captain-assigned") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[420px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" routeProgress={66} /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Your captain is on the way</h2>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">AP</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="font-semibold text-[#1f1f22]">Ananya Patel</p><span className="rounded-full bg-[#f2ebf0] px-2 py-0.5 text-[10px] font-medium text-[#a6437a]">Verified</span></div>
                <div className="mt-1 flex items-center gap-2 text-sm text-[#625c60]"><Star className="h-3.5 w-3.5 fill-[#f6b153] text-[#f6b153]" /> 4.9 <span>•</span> <span>1,248 rides</span></div>
              </div>
              <span className="text-sm font-semibold text-[#a6437a]">3 min away</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]"><Phone className="mx-auto mb-2 h-4 w-4" /> Call</button>
              <button className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]"><MessageSquareText className="mx-auto mb-2 h-4 w-4" /> Chat</button>
              <button onClick={() => setPassengerStep("safety")} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]"><ShieldCheck className="mx-auto mb-2 h-4 w-4" /> Safety</button>
            </div>
          </div>
        </div>
      );
    }

    if (passengerStep === "captain-arrived") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">Your captain has arrived</h2>
            <div className="mt-5 flex items-center gap-3 rounded-[24px] bg-[#fff7fa] p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">AP</div>
              <div>
                <p className="font-semibold text-[#1f1f22]">Ananya Patel</p>
                <p className="text-sm text-[#626166]">Honda Activa • GJ 05 AB 1234</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] p-3 text-sm text-[#605d63]">Check the vehicle number before starting your ride.</div>
            <Button onClick={() => setPassengerStep("ride-pin")} className="mt-6 w-full">Start Ride</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "ride-pin") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">Confirm your ride</h2>
            <p className="mt-2 text-sm text-[#695f64]">Ask your captain for the 4-digit ride PIN.</p>
            <div className="mt-6 flex justify-center"><OTPInput value={ride.pin} onChange={() => undefined} /></div>
            <div className="mt-4 text-center text-sm text-[#7f787e]">Demo PIN: 4821</div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "ride_started" })); setPassengerStep("ride-active"); }} className="mt-6 w-full">Start ride</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "ride-active") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[520px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" routeProgress={84} /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-[#6b666a]">You&apos;re on your way</p><h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">Ananya Patel</h2></div>
              <span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">ETA 12 min</span>
            </div>
            <div className="mt-3 text-sm text-[#5e575d]">Destination: {ride.destination}</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button onClick={() => setPassengerStep("share")} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]"><Navigation className="mx-auto mb-2 h-4 w-4" /> Share ride</button>
              <button className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]"><MessageSquareText className="mx-auto mb-2 h-4 w-4" /> Chat</button>
              <button onClick={() => setPassengerStep("safety")} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]"><ShieldCheck className="mx-auto mb-2 h-4 w-4" /> Safety</button>
            </div>
          </div>
        </div>
      );
    }

    if (passengerStep === "safety") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">You&apos;re in control</h2>
            <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#fff0f6,#f6edf3)] p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a6437a] text-white shadow-md"><Siren className="h-5 w-5" /></div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.2em] text-[#8c646e]">SOS</p>
                  <p className="text-base font-semibold text-[#201d20]">Emergency assistance</p>
                </div>
              </div>
              <div className="space-y-3">
                {['Emergency SOS', 'Share Live Ride', 'Trusted Contacts', 'Call Support', 'Report an Issue'].map((item) => (
                  <button key={item} onClick={() => { if (item === 'Emergency SOS') setSosOpen(true); else if (item === 'Share Live Ride') setPassengerStep('share'); else setToast(item); }} className="flex w-full items-center justify-between rounded-2xl border border-[#f0dfe7] bg-white px-3 py-3 text-left text-sm font-medium text-[#2b2a2d]">
                    <span>{item}</span><ChevronRight className="h-4 w-4 text-[#7e767a]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (passengerStep === "share") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d20]">Share your live ride</h2>
            <div className="mt-5 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5f5a60]">
              <div className="flex justify-between"><span>Captain</span><span className="font-medium text-[#1f1f22]">Ananya Patel</span></div>
              <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
              <div className="mt-2 flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
            </div>
            <div className="mt-5 space-y-3">
              {['WhatsApp', 'SMS', 'Copy link'].map((item) => (
                <button key={item} onClick={() => setToast(item === 'Copy link' ? 'Ride details copied' : `${item} shared`)} className="flex w-full items-center justify-between rounded-2xl border border-[#f0dde7] bg-white px-4 py-3 text-sm font-medium text-[#2b2a2d]">
                  <span>{item}</span><ChevronRight className="h-4 w-4 text-[#7d777d]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (passengerStep === "ride-complete") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-3xl shadow-md">💗</div>
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">You&apos;re safely here 💗</h2>
            <p className="mt-2 text-sm text-[#655f63]">Thanks for riding with PinkRide.</p>
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5c5a5d]">
              <div><p className="text-[#847d82]">Distance</p><p className="mt-1 font-semibold text-[#1f1f22]">6.4 km</p></div>
              <div><p className="text-[#847d82]">Duration</p><p className="mt-1 font-semibold text-[#1f1f22]">18 min</p></div>
              <div><p className="text-[#847d82]">Fare</p><p className="mt-1 font-semibold text-[#1f1f22]">₹82</p></div>
            </div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "payment_completed" })); setPassengerStep("payment"); }} className="mt-6 w-full">Continue to payment</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "payment") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">Complete payment</h2>
            <div className="mt-4 text-center text-[34px] font-bold tracking-[-0.08em] text-[#201d20]">₹82</div>
            <div className="mt-6 space-y-3">
              {['UPI', 'Credit / Debit Card', 'Cash'].map((method) => (
                <button key={method} className="flex w-full items-center justify-between rounded-[22px] border border-[#f0dde7] bg-white p-3 text-left text-sm font-medium text-[#2f2d31]">
                  <span>{method}</span><Check className="h-4 w-4 text-[#a6437a]" />
                </button>
              ))}
            </div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "rated" })); setPassengerStep("rating"); }} className="mt-6 w-full">Pay ₹82</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "rating") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">How was your ride?</h2>
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">AP</div>
              <div><p className="font-semibold text-[#1f1f22]">Ananya Patel</p></div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} onClick={() => setPassengerRating(value)} className="text-3xl text-[#f7c86e]">
                  <Star className={cn("h-8 w-8", passengerRating >= value ? "fill-[#f6b153] text-[#f6b153]" : "text-[#e9d8de]")} />
                </button>
              ))}
            </div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "rated" })); setPassengerStep("history"); setToast("Thanks for your feedback 💗"); }} className="mt-6 w-full">Submit rating</Button>
          </div>
        </div>
      );
    }

    if (passengerStep === "history") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">My Rides</h2></div>
          <div className="space-y-3">
            {[
              { date: "29 Sep", name: "Ananya Patel", route: "Adajan → Vesu", amount: "₹82", status: "Completed" },
              { date: "26 Sep", name: "Kavya Shah", route: "Vesu → Dumas", amount: "₹96", status: "Completed" },
            ].map((item) => (
              <button key={item.date} onClick={() => setToast("Ride details open")} className="w-full rounded-[24px] border border-[#f0dfe7] bg-white p-4 text-left shadow-sm">
                <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#826d75]">{item.date}</span><span className="rounded-full bg-[#ecfaf1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#166f40]">{item.status}</span></div>
                <div className="mt-3 flex items-center justify-between"><div><p className="font-semibold text-[#1f1f22]">{item.name}</p><p className="mt-1 text-sm text-[#676167]">{item.route}</p></div><p className="text-base font-semibold text-[#201d20]">{item.amount}</p></div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderCaptainFlow = () => {
    if (captainStep === "splash") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffafc]">
          <div className="flex flex-col items-center justify-center gap-5 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-[radial-gradient(circle_at_30%_20%,#f8dbe8,#d79ab0_28%,#b44b7a_52%,#6e2148_100%)] shadow-[0_20px_50px_rgba(166,67,122,0.36)]">
              <span className="text-2xl font-black text-white">P</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-xl font-semibold text-[#352d3b]">Ride. Earn. Empower.</motion.p>
          </div>
        </div>
      );
    }

    if (captainStep === "login") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.06em] text-[#241d27]">Welcome, Captain</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#6a6368]">Help women move safely around the city.</p>
          </div>
          <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-4 shadow-[0_18px_40px_rgba(132,92,120,0.06)]">
            <label className="mb-2 block text-sm font-medium text-[#4c474d]">Mobile number</label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#f0dfe8] bg-[#fffdfd] px-3 py-3 shadow-sm">
              <span className="rounded-full bg-[#f5edf2] px-2 py-1 text-sm font-semibold text-[#2d2a2d]">+91</span>
              <input value="98765 43210" readOnly className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none" />
            </div>
            <Button onClick={() => setCaptainStep("otp")} className="mt-5 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "otp") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <button onClick={() => setCaptainStep("login")} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#4a464b]"><ArrowLeft className="h-4 w-4" /> Back</button>
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Verify your number</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#655f63]">We&apos;ve sent a 4-digit code to +91 XXXXX XXXXX</p>
          </div>
          <div className="rounded-[30px] border border-[#f0dde7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <OTPInput value={captainOtp} onChange={setCaptainOtp} />
            <p className="mt-5 text-center text-sm font-medium text-[#8d7d84]">Demo code: 4821</p>
            <Button onClick={() => setCaptainStep("onboarding")} className="mt-6 w-full" disabled={captainOtp.length !== 4}>Continue</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "onboarding") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Ride with PinkRide</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#655f63]">Earn on your schedule while helping women travel with confidence.</p>
          </div>
          <div className="rounded-[28px] border border-[#f3dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <div className="space-y-3 text-sm text-[#544f53]">
              <div className="flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3"><Check className="h-4 w-4 text-[#a6437a]" /> Flexible hours</div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3"><Check className="h-4 w-4 text-[#a6437a]" /> Weekly earnings</div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3"><Check className="h-4 w-4 text-[#a6437a]" /> Women-only rides</div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3"><Check className="h-4 w-4 text-[#a6437a]" /> Safety support</div>
            </div>
            <Button onClick={() => setCaptainStep("home")} className="mt-6 w-full">Start registration</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "home") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] pb-24 pt-6">
          <CaptainHeader title="Good morning, Ananya" subtitle="Verified Pink Captain" />
          <div className="px-4">
            <div className="rounded-[28px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-[#726b71]">Availability</div>
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]", online ? "bg-[#ecfaf1] text-[#166f40]" : "bg-[#f7edf2] text-[#a6437a]")}>{online ? "Online" : "Offline"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className={cn("flex flex-1 items-center justify-center rounded-full py-4 text-base font-semibold", online ? "bg-[#a6437a] text-white" : "bg-[#f8edf3] text-[#8f3d69]")}>
                  {online ? "You’re online" : "Go Online"}
                </div>
              </div>
              <Button onClick={() => { setOnline(true); setToast("You're now online"); setRide((prev) => ({ ...prev, status: "captain_requested" })); setCaptainStep("request"); }} variant={online ? "secondary" : "primary"} className="mt-4 w-full">{online ? "Stay online" : "Go Online"}</Button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Today’s earnings", value: "₹640" },
                { label: "Rides", value: "8" },
                { label: "Online", value: "4h 12m" },
                { label: "Rating", value: "4.9 ⭐" },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-[#f0dfe7] bg-white p-3 shadow-sm">
                  <div className="text-xs text-[#786f74]">{item.label}</div>
                  <div className="mt-2 text-xl font-bold text-[#1f1f22]">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 h-[220px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" routeProgress={25} /></div>
          </div>
        </div>
      );
    }

    if (captainStep === "request") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[430px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="finding" routeProgress={55} /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[22px] font-bold tracking-[-0.05em] text-[#1d1b1f]">New PinkRide</h2><span className="rounded-full bg-[#fdf3f7] px-2 py-1 text-xs font-medium text-[#a6437a]">15s</span></div>
            <div className="rounded-[22px] bg-[#fff7fa] p-3 text-sm text-[#5c565c]">
              <div className="flex justify-between"><span>Passenger</span><span className="font-medium text-[#1f1f22]">Priya Sharma</span></div>
              <div className="mt-2 flex justify-between"><span>Rating</span><span className="font-medium text-[#1f1f22]">4.8 ⭐</span></div>
              <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">1.2 km away</span></div>
              <div className="mt-2 flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">Vesu, Surat</span></div>
              <div className="mt-2 flex justify-between"><span>Est. earnings</span><span className="font-medium text-[#1f1f22]">₹72</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={captainDeclineRide}>Decline</Button>
              <Button onClick={captainAcceptRide}>Accept Ride</Button>
            </div>
          </div>
        </div>
      );
    }

    if (captainStep === "navigate") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[440px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" routeProgress={72} /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="flex items-center justify-between"><div><p className="text-sm text-[#6b666a]">Pickup in 3 min</p><h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">Priya Sharma</h2></div><span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">1.2 km</span></div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {['Call', 'Chat', 'Safety', 'Navigation'].map((action) => (
                <button key={action} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-[11px] font-medium text-[#2f2d31]">{action}</button>
              ))}
            </div>
            <Button onClick={captainArrived} className="mt-4 w-full">Arrived at pickup</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "arrived") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">You&apos;re at the pickup</h2>
            <div className="mt-5 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5f5a60]">
              <div className="flex justify-between"><span>Passenger</span><span className="font-medium text-[#1f1f22]">Priya Sharma</span></div>
              <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] p-3 text-sm text-[#605d63]">Confirm passenger details before starting.</div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "awaiting_pin" })); setCaptainStep("pin"); }} className="mt-6 w-full">Passenger is here</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "pin") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">Start ride</h2>
            <p className="mt-2 text-sm text-[#695f64]">Ask the passenger for their 4-digit ride PIN.</p>
            <div className="mt-6 flex justify-center"><OTPInput value={ride.pin} onChange={() => undefined} /></div>
            <div className="mt-4 text-center text-sm text-[#7f787e]">Demo PIN: 4821</div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "ride_started" })); setCaptainStep("active"); }} className="mt-6 w-full">Start Ride</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "active") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[520px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" routeProgress={86} /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="flex items-center justify-between"><div><p className="text-sm text-[#6b666a]">Ride in progress</p><h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">Priya Sharma</h2></div><span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">ETA 12 min</span></div>
            <div className="mt-3 text-sm text-[#5e575d]">Destination: Vesu, Surat</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {['Call', 'Chat', 'Safety', 'Cancel'].map((action) => (
                <button key={action} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-[11px] font-medium text-[#2f2d31]">{action}</button>
              ))}
            </div>
            <Button onClick={completeRide} className="mt-4 w-full">Complete Ride</Button>
          </div>
        </div>
      );
    }

    if (captainStep === "earnings") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-3xl shadow-md">₹</div>
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">₹72 earned</h2>
            <p className="mt-2 text-sm text-[#655f63]">Today&apos;s earnings updated.</p>
            <div className="mt-6 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5c5a5d]">
              <div className="flex justify-between"><span>Today&apos;s earnings</span><span className="font-semibold text-[#1f1f22]">₹712</span></div>
              <div className="mt-2 flex justify-between"><span>Today&apos;s rides</span><span className="font-semibold text-[#1f1f22]">9</span></div>
            </div>
            <Button onClick={() => setCaptainStep("home")} className="mt-6 w-full">Back to Home</Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#fff9fb] text-[#1d1b1f]">
      <div className="mx-auto max-w-[1100px] px-2 py-4">
        <div className="mb-3 flex justify-center">
          <div className="inline-flex rounded-full border border-[#f1dfe8] bg-white p-1 shadow-sm">
            <button onClick={() => setRole("passenger")} className={cn("rounded-full px-4 py-2 text-sm font-semibold", role === "passenger" ? "bg-[#a6437a] text-white" : "text-[#5d5a5f]")}>Passenger</button>
            <button onClick={() => setRole("captain")} className={cn("rounded-full px-4 py-2 text-sm font-semibold", role === "captain" ? "bg-[#a6437a] text-white" : "text-[#5d5a5f]")}>Captain</button>
          </div>
        </div>
        {role === "passenger" ? renderPassengerFlow() : renderCaptainFlow()}
      </div>

      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1d1a1f]/50 px-4 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(15,15,18,0.28)]">
            <h3 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Are you sure you need emergency assistance?</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setSosOpen(false)}>Cancel</Button>
              <Button onClick={() => { setSosOpen(false); setToast("Emergency assistance activated"); }}>Get help</Button>
            </div>
          </motion.div>
        </div>
      )}

      {toast && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-full bg-[#1d1b1f] px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </motion.div>
      )}
    </div>
  );
}

export default PinkRideStage2;
