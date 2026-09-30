"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlarmClockCheck,
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
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
  StarHalf,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const mockUser = {
  name: "Priya Sharma",
  phone: "+91 XXXXX XXXXX",
  email: "priya.sharma@gmail.com",
  gender: "Women",
  avatar: "PS",
};

const mockCaptain = {
  name: "Ananya Patel",
  rating: 4.9,
  rides: 1248,
  vehicle: "Honda Activa",
  plate: "GJ 05 AB 1234",
  image: "AP",
};

const rideOptions = [
  {
    id: "pink-bike",
    name: "Pink Bike",
    captain: "Women captain",
    eta: "2 min away",
    fare: 82,
    tag: "Fast & affordable",
    selected: true,
    badge: null,
  },
  {
    id: "pink-auto",
    name: "Pink Auto",
    captain: "Women captain",
    eta: "5 min away",
    fare: 126,
    tag: "More space",
    selected: false,
    badge: "Coming soon",
  },
  {
    id: "pink-cab",
    name: "Pink Cab",
    captain: "Women captain",
    eta: "7 min away",
    fare: 210,
    tag: "Comfortable",
    selected: false,
    badge: "Coming soon",
  },
];

const recentSearches = [
  { label: "Vesu", detail: "Surat, Gujarat" },
  { label: "VR Mall", detail: "Dumas Road, Surat" },
  { label: "Surat Railway Station", detail: "Station Road" },
  { label: "Airport", detail: "Surat International Airport" },
];

const savedPlaces = [
  { name: "Home", address: "C-24, Vesu, Surat" },
  { name: "Work", address: "Business Bay, Adajan" },
];

const mockNotifications = [
  "Your captain Ananya is arriving.",
  "Your ride has started.",
  "Payment successful.",
  "Your ride was completed safely.",
  "New safety feature available.",
];

const helpCategories = [
  "Ride issues",
  "Payment",
  "Account",
  "Safety",
  "Captain",
  "Other",
];

const bottomTabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "rides", label: "Rides", icon: BriefcaseBusiness },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "profile", label: "Profile", icon: UserRound },
] as const;

type Page =
  | "splash"
  | "onboarding"
  | "login"
  | "otp"
  | "profile"
  | "permissions"
  | "home"
  | "search"
  | "pickup"
  | "ride-options"
  | "fare"
  | "confirm-booking"
  | "finding"
  | "captain-assigned"
  | "captain-arriving"
  | "captain-arrived"
  | "ride-pin"
  | "ride-active"
  | "safety"
  | "share"
  | "ride-complete"
  | "payment"
  | "rating"
  | "history"
  | "details"
  | "wallet"
  | "profile-screen"
  | "emergency"
  | "saved"
  | "notifications"
  | "support";

type RideState = {
  pickup: string;
  destination: string;
  distance: string;
  duration: string;
  fare: number;
  eta: string;
  captain: typeof mockCaptain;
  rideType: string;
  activeTab: string;
};

const onboardingSlides = [
  {
    title: "Move freely.",
    description: "Convenient bike rides designed specifically for women.",
    accent: "pink",
  },
  {
    title: "Ride with confidence.",
    description:
      "Verified women captains, live trip tracking and safety tools at every step.",
    accent: "plum",
  },
  {
    title: "Women supporting women.",
    description:
      "Travel confidently while creating earning opportunities for women.",
    accent: "rose",
  },
];

const defaultRide: RideState = {
  pickup: "Current location",
  destination: "Vesu, Surat",
  distance: "6.4 km",
  duration: "18 min",
  fare: 82,
  eta: "3 min away",
  captain: mockCaptain,
  rideType: "Pink Bike",
  activeTab: "home",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MapView({
  mode = "home",
  routeProgress = 0,
}: {
  mode?: "home" | "pickup" | "route" | "finding";
  routeProgress?: number;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#eef2f3]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.85),transparent_20%),linear-gradient(135deg,#edf0f4,#e8ecef_48%,#dfe7eb)]" />
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(135,150,160,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(135,150,160,0.3)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(120deg,transparent_0%,transparent_42%,rgba(255,255,255,0.5)_43%,rgba(255,255,255,0.5)_44%,transparent_45%,transparent_100%)]" />

      <div className="absolute left-[18%] top-[26%] h-28 w-36 rotate-12 rounded-full border border-[#c1bec8]/70 bg-white/10" />
      <div className="absolute right-[22%] top-[18%] h-16 w-40 -rotate-12 rounded-full border border-[#c1bec8]/70 bg-white/15" />
      <div className="absolute left-[12%] bottom-[18%] h-24 w-40 rotate-6 rounded-full border border-[#c1bec8]/70 bg-white/10" />
      <div className="absolute right-[28%] bottom-[24%] h-28 w-36 -rotate-12 rounded-full border border-[#c1bec8]/70 bg-white/12" />

      <div className="absolute left-[22%] top-[34%] h-[1px] w-[52%] bg-[#a1a9b0]/70" />
      <div className="absolute left-[18%] top-[14%] h-[1px] w-[35%] rotate-[20deg] bg-[#a1a9b0]/70" />
      <div className="absolute left-[42%] top-[12%] h-[1px] w-[28%] -rotate-[18deg] bg-[#a1a9b0]/70" />
      <div className="absolute left-[10%] top-[58%] h-[1px] w-[56%] rotate-[-24deg] bg-[#a1a9b0]/70" />
      <div className="absolute right-[18%] top-[40%] h-[1px] w-[24%] rotate-[16deg] bg-[#a1a9b0]/70" />

      <div className="absolute left-[22%] top-[56%] h-3 w-3 rounded-full bg-[#a6437a] shadow-[0_0_0_8px_rgba(166,67,122,0.15)]" />
      <div className="absolute right-[18%] bottom-[30%] h-3 w-3 rounded-full bg-[#5d1f4d] shadow-[0_0_0_8px_rgba(93,31,77,0.2)]" />
      <div className="absolute left-[50%] top-[48%] h-4 w-4 rounded-full bg-[#a6437a] shadow-[0_0_0_10px_rgba(166,67,122,0.15)]" />

      {mode !== "home" && (
        <div className="absolute inset-x-[16%] top-[30%] h-[2px] rounded-full bg-gradient-to-r from-[#a6437a] via-[#8d3f8a] to-[#5d1f4d] shadow-[0_0_18px_rgba(166,67,122,0.6)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-transparent via-[#f7d0df] to-transparent"
            style={{ width: `${routeProgress}%` }}
          />
        </div>
      )}

      {(mode === "finding" || mode === "route") && (
        <>
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.4] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut" }}
            className="absolute left-[24%] top-[55%] flex h-20 w-20 items-center justify-center rounded-full border border-[#a6437a]/40"
          >
            <div className="h-5 w-5 rounded-full bg-[#a6437a]" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
            className="absolute right-[18%] bottom-[32%] flex h-20 w-20 items-center justify-center rounded-full border border-[#5d1f4d]/30"
          >
            <div className="h-5 w-5 rounded-full bg-[#5d1f4d]" />
          </motion.div>
        </>
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

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
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
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[variant], className, disabled && "cursor-not-allowed opacity-70")}
    >
      {children}
    </button>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 shadow-sm", className)}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent text-[15px] text-[#1f1f22] outline-none placeholder:text-[#8b8a8d]"
      />
    </div>
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
            const entered = value.split("");
            entered[index] = next;
            onChange(entered.join("").slice(0, 4));
          }}
          className="h-14 w-12 rounded-2xl border border-[#e7d9e4] bg-white text-center text-xl font-bold text-[#1d1b1f] shadow-sm outline-none ring-0 transition-all focus:border-[#b85587]"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

function PinkRidePrototype() {
  const [page, setPage] = useState<Page>("splash");
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [profileName, setProfileName] = useState(mockUser.name);
  const [selectedDestination, setSelectedDestination] = useState(defaultRide.destination);
  const [selectedRide, setSelectedRide] = useState(rideOptions[0].id);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [toast, setToast] = useState<string | null>(null);
  const [sosOpen, setSosOpen] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [ride, setRide] = useState<RideState>(defaultRide);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [routeProgress, setRouteProgress] = useState(0);
  const [selectedSearch, setSelectedSearch] = useState<string | null>(null);

  useEffect(() => {
    if (page !== "splash") return;
    const timer = window.setTimeout(() => setPage("onboarding"), 1700);
    return () => window.clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    if (toast) {
      const timer = window.setTimeout(() => setToast(null), 1800);
      return () => window.clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (page === "finding") {
      const timer = window.setTimeout(() => setPage("captain-assigned"), 2600);
      return () => window.clearTimeout(timer);
    }
  }, [page]);

  useEffect(() => {
    if (page === "captain-assigned") {
      const timer = window.setTimeout(() => setPage("captain-arriving"), 3400);
      return () => window.clearTimeout(timer);
    }
  }, [page]);

  useEffect(() => {
    if (page === "captain-arriving") {
      const timer = window.setTimeout(() => setPage("captain-arrived"), 2600);
      return () => window.clearTimeout(timer);
    }
  }, [page]);

  useEffect(() => {
    if (page === "ride-active") {
      const interval = window.setInterval(() => {
        setRouteProgress((current) => {
          const next = current + 14;
          if (next >= 100) {
            window.clearInterval(interval);
            setTimeout(() => setPage("ride-complete"), 800);
            return 100;
          }
          return next;
        });
      }, 900);

      return () => window.clearInterval(interval);
    }
  }, [page]);

  useEffect(() => {
    if (otpValue.length === 4 && otpValue === "4821") {
      const timer = window.setTimeout(() => {
        setPage("profile");
      }, 220);
      return () => window.clearTimeout(timer);
    }
  }, [otpValue]);

  useEffect(() => {
    if (pinValue.length === 4 && pinValue === "4821") {
      const timer = window.setTimeout(() => {
        setPage("ride-active");
        setRouteProgress(12);
      }, 220);
      return () => window.clearTimeout(timer);
    }
  }, [pinValue]);

  const handleContinueToOtp = () => {
    setPage("otp");
  };

  const handleBookRide = () => {
    setPage("finding");
    setRide((current) => ({
      ...current,
      destination: selectedDestination,
      rideType: selectedRide === "pink-auto" ? "Pink Auto" : selectedRide === "pink-cab" ? "Pink Cab" : "Pink Bike",
      fare: selectedRide === "pink-auto" ? 126 : selectedRide === "pink-cab" ? 210 : 82,
      eta: "3 min away",
    }));
  };

  const handlePayment = () => {
    setPaymentState("processing");
    window.setTimeout(() => {
      setPaymentState("success");
      setToast("Payment successful");
      setPage("rating");
    }, 1400);
  };

  const renderSearchResults = () => (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-[#4d4a4d]">Recent searches</p>
      </div>
      <div className="space-y-3">
        {recentSearches.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedSearch(item.label);
              setSelectedDestination(item.label + ", Surat");
              setPage("pickup");
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-[#f1e5eb] bg-white p-3 text-left shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7edf3] text-[#a6437a]">
                {item.label === "Airport" ? <MapPin className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-medium text-[#1f1f22]">{item.label}</p>
                <p className="text-xs text-[#737174]">{item.detail}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7b6a73]" />
          </button>
        ))}
      </div>
      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-[#4d4a4d]">Saved locations</p>
        <div className="space-y-3">
          {savedPlaces.map((place) => (
            <button
              key={place.name}
              onClick={() => {
                setSelectedDestination(place.address);
                setPage("pickup");
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-[#f1e5eb] bg-white p-3 text-left shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7edf3] text-[#a6437a]">
                  {place.name === "Home" ? <Home className="h-4 w-4" /> : <BriefcaseBusiness className="h-4 w-4" />}
                </span>
                <div>
                  <p className="font-medium text-[#1f1f22]">{place.name}</p>
                  <p className="text-xs text-[#737174]">{place.address}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f0e5eb] bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2 backdrop-blur-md">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
        {bottomTabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                const nextPage = id === "home" ? "home" : id === "rides" ? "history" : id === "safety" ? "safety" : id === "wallet" ? "wallet" : "profile-screen";
                setPage(nextPage as Page);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition-all",
                active ? "text-[#a6437a]" : "text-[#7d777b]",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_12px_rgba(166,67,122,0.3)]")} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#fff9fb] text-[#1d1b1f]">
      <AnimatePresence mode="wait">
        {page === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center justify-center bg-[#fffafc]"
          >
            <div className="flex flex-col items-center justify-center gap-5 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-[radial-gradient(circle_at_30%_20%,#f8dbe8,#d79ab0_28%,#b44b7a_52%,#6e2148_100%)] shadow-[0_20px_50px_rgba(166,67,122,0.36)]"
              >
                <span className="text-2xl font-black text-white">P</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-xl font-semibold text-[#352d3b]"
              >
                Safe rides. By women. For women.
              </motion.p>
            </div>
          </motion.div>
        )}

        {page === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-10"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f0d7e3,#d081a5_40%,#a6437a_80%)] text-sm font-bold text-white">
                  P
                </div>
                <span className="text-lg font-semibold tracking-wide text-[#2a1d28]">PinkRide</span>
              </div>
              <button onClick={() => setPage("login")} className="text-sm font-medium text-[#7d7780]">
                Skip
              </button>
            </div>

            <div className="flex-1 overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_18px_40px_rgba(132,92,120,0.08)]">
              <div className="mb-6 flex justify-center gap-2">
                {onboardingSlides.map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      index === onboardingIndex ? "w-7 bg-[#a6437a]" : "bg-[#ecdfe7]",
                    )}
                  />
                ))}
              </div>

              <motion.div
                key={onboardingIndex}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="flex h-[440px] flex-col items-center justify-between"
              >
                <div className="flex h-52 w-full items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_30%_0%,#ffeaf1,#f2d9e6_40%,#ead4df_55%,#f6f2f3_100%)]">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/70 shadow-inner">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7cfe0,#d88cad_45%,#a6437a_100%)] text-3xl font-black text-white">
                      {onboardingIndex === 0 ? "✦" : onboardingIndex === 1 ? "◎" : "❤"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h1 className="text-[30px] font-bold tracking-[-0.06em] text-[#241d27]">
                    {onboardingSlides[onboardingIndex].title}
                  </h1>
                  <p className="mt-3 text-[15px] leading-7 text-[#58545a]">
                    {onboardingSlides[onboardingIndex].description}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                onClick={() =>
                  onboardingIndex === onboardingSlides.length - 1
                    ? setPage("login")
                    : setOnboardingIndex((current) => current + 1)
                }
                className="flex-1"
              >
                {onboardingIndex === onboardingSlides.length - 1 ? "Get Started" : "Next"}
              </Button>
              {onboardingIndex < onboardingSlides.length - 1 && (
                <Button onClick={() => setPage("login")} variant="secondary" className="min-w-[88px]">
                  Skip
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {page === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafd] px-5 pb-8 pt-8"
          >
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_20%,#f0d7e3,#d88cad_35%,#a6437a_80%)] text-lg font-bold text-white shadow-md">
                P
              </div>
            </div>
            <div className="mb-8 text-center">
              <h1 className="text-[32px] font-bold tracking-[-0.06em] text-[#2a1d28]">Welcome to PinkRide</h1>
              <p className="mt-3 text-[15px] leading-6 text-[#6a6368]">Your safer way to move around the city.</p>
            </div>

            <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-4 shadow-[0_18px_40px_rgba(132,92,120,0.06)]">
              <label className="mb-2 block text-sm font-medium text-[#4c474d]">Mobile number</label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#f0dfe8] bg-[#fffdfd] px-3 py-3 shadow-sm">
                <span className="rounded-full bg-[#f5edf2] px-2 py-1 text-sm font-semibold text-[#2d2a2d]">+91</span>
                <input
                  className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none placeholder:text-[#908b90]"
                  value="98765 43210"
                  readOnly
                />
              </div>
              <Button onClick={handleContinueToOtp} className="mt-5 w-full">
                Continue
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#eae1e6] bg-white px-4 py-3 text-sm font-medium text-[#2d2a2d] shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f7d8e7] text-xs font-bold text-[#a6437a]">G</span>
                Continue with Google
              </button>
              <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#eae1e6] bg-white px-4 py-3 text-sm font-medium text-[#2d2a2d] shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f0edf1] text-xs font-black text-[#1f1f22]"></span>
                Continue with Apple
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#736d73]">
              By continuing, you agree to our <span className="font-semibold text-[#2b2a2b]">Terms & Privacy Policy.</span>
            </p>
          </motion.div>
        )}

        {page === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8"
          >
            <button onClick={() => setPage("login")} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#4a464b]">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="mb-8 text-center">
              <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Verify your number</h1>
              <p className="mt-3 text-[15px] leading-6 text-[#655f63]">
                We&apos;ve sent a 4-digit code to +91 XXXXX XXXXX
              </p>
            </div>

            <div className="rounded-[30px] border border-[#f0dde7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
              <OTPInput value={otpValue} onChange={setOtpValue} />
              <p className="mt-5 text-center text-sm font-medium text-[#8d7d84]">Resend code in 00:30</p>
              <Button onClick={() => setPage("profile")} className="mt-6 w-full" disabled={otpValue.length !== 4}>
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {page === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8"
          >
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
                  <StyledInput value={profileName} onChange={setProfileName} placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4b484d]">Email</label>
                  <StyledInput value={mockUser.email} onChange={() => undefined} placeholder="Email" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4b484d]">Gender</label>
                  <div className="rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] font-medium text-[#2d2a2d] shadow-sm">
                    Women
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-[#6d6a6e]">
                PinkRide is exclusively for women passengers and women captains.
              </p>

              <Button onClick={() => setPage("permissions")} className="mt-6 w-full">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {page === "permissions" && (
          <motion.div
            key="permissions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8"
          >
            <div className="mb-8 text-center">
              <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Let&apos;s make your rides safer</h1>
            </div>

            <div className="space-y-4">
              {[
                { title: "Location", detail: "Used to find your pickup location and track your ride." },
                { title: "Notifications", detail: "Get important updates about your ride." },
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] border border-[#f0dde7] bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9edf3] text-[#a6437a]">
                        {item.title === "Location" ? <MapPin className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                      </span>
                      <div>
                        <h2 className="font-semibold text-[#1f1f22]">{item.title}</h2>
                        <p className="text-xs text-[#706b71]">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setToast("Permission enabled")} variant="secondary" className="w-full">
                    {item.title === "Location" ? "Allow location" : "Allow notifications"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={() => setPage("home")} className="w-full">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {(page === "home" ||
          page === "search" ||
          page === "pickup" ||
          page === "ride-options" ||
          page === "fare" ||
          page === "confirm-booking" ||
          page === "finding" ||
          page === "captain-assigned" ||
          page === "captain-arriving" ||
          page === "captain-arrived" ||
          page === "ride-pin" ||
          page === "ride-active" ||
          page === "safety" ||
          page === "share" ||
          page === "ride-complete" ||
          page === "payment" ||
          page === "rating" ||
          page === "history" ||
          page === "details" ||
          page === "wallet" ||
          page === "profile-screen" ||
          page === "emergency" ||
          page === "saved" ||
          page === "notifications" ||
          page === "support") && (
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto min-h-screen max-w-md bg-[#fffafc] pb-24 pt-6"
          >
            {page === "home" && (
              <div className="px-4">
                <header className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#8a7d85]">Good morning, {profileName.split(" ")[0]} 👋</p>
                    <h1 className="mt-1 text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">Where are you going today?</h1>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-sm font-bold text-white shadow-md">
                    PS
                  </div>
                </header>

                <div className="h-[420px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_40px_rgba(39,19,31,0.08)]">
                  <MapView mode="home" />
                </div>

                <div className="-mt-4 rounded-[30px] border border-[#f1dfe8] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#f1dfe8] bg-[#fdf4f7] p-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#a6437a]" />
                      <span className="h-6 w-px bg-[#d9b5c6]" />
                      <span className="h-2.5 w-2.5 rounded-full border border-[#a6437a] bg-white" />
                    </div>
                    <div className="flex-1 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6f6a70]">Pickup</span>
                        <span className="font-medium text-[#1f1f22]">Current location</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6f6a70]">Destination</span>
                        <button onClick={() => setPage("search")} className="font-medium text-[#a6437a]">
                          Search destination
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Home", icon: Home },
                      { label: "Work", icon: BriefcaseBusiness },
                      { label: "Recent", icon: HistoryIcon },
                    ].map(({ label, icon: Icon }) => (
                      <button key={label} className="rounded-2xl border border-[#f2e1ea] bg-[#fffafc] p-3 text-center text-[12px] font-medium text-[#392d36]">
                        <Icon className="mx-auto mb-1 h-4 w-4 text-[#a6437a]" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[{ title: "Book a Pink Bike", subtitle: "Fast & affordable", icon: Sparkles }, { title: "Safety", subtitle: "Your safety center", icon: ShieldPlus }, { title: "Ride history", subtitle: "View your previous rides", icon: AlarmClockCheck }].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        if (item.title === "Ride history") setPage("history");
                        if (item.title === "Safety") setPage("safety");
                        if (item.title === "Book a Pink Bike") setPage("search");
                      }}
                      className="rounded-[24px] border border-[#f0dfe7] bg-white p-3 text-left shadow-sm"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edf3] text-[#a6437a]">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-[#1f1f22]">{item.title}</p>
                      <p className="mt-1 text-[11px] text-[#716b70]">{item.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {page === "search" && (
              <div className="px-4">
                <div className="mb-5 flex items-center gap-3">
                  <button onClick={() => setPage("home")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <ArrowLeft className="h-4 w-4 text-[#2b2a2d]" />
                  </button>
                  <div className="flex-1 rounded-2xl border border-[#f0dde7] bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-[#a6437a]" />
                      <input
                        value={selectedDestination}
                        onChange={(event) => setSelectedDestination(event.target.value)}
                        placeholder="Where to?"
                        className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none placeholder:text-[#88848a]"
                      />
                    </div>
                  </div>
                </div>

                {renderSearchResults()}
              </div>
            )}

            {page === "pickup" && (
              <div className="px-4">
                <div className="h-[490px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_40px_rgba(26,17,22,0.08)]">
                  <MapView mode="pickup" routeProgress={70} />
                </div>
                <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#211d20]">Confirm pickup</h2>
                  <div className="mt-4 rounded-2xl bg-[#fdf4f7] p-3">
                    <div className="mb-3 flex items-center gap-2 text-sm text-[#665d62]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#a6437a]" /> Pickup
                    </div>
                    <div className="font-medium text-[#1f1f22]">Current Location</div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-[#f8f8f9] p-3">
                    <div className="mb-3 flex items-center gap-2 text-sm text-[#665d62]">
                      <span className="h-2.5 w-2.5 rounded-full border border-[#a6437a] bg-white" /> Destination
                    </div>
                    <div className="font-medium text-[#1f1f22]">{selectedDestination || "Vesu, Surat"}</div>
                  </div>
                  <Button onClick={() => setPage("ride-options")} className="mt-5 w-full">
                    Confirm location
                  </Button>
                </div>
              </div>
            )}

            {page === "ride-options" && (
              <div className="px-4">
                <div className="mb-4 h-[280px] overflow-hidden rounded-[28px] border border-[#f1dfe8] bg-white p-2 shadow-sm">
                  <MapView mode="route" routeProgress={50} />
                </div>
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="mb-4 text-[24px] font-bold tracking-[-0.05em] text-[#211d20]">Choose your ride</h2>
                  <div className="space-y-3">
                    {rideOptions.map((rideOption) => {
                      const active = selectedRide === rideOption.id;
                      return (
                        <button
                          key={rideOption.id}
                          onClick={() => setSelectedRide(rideOption.id)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition-all",
                            active ? "border-[#a6437a] bg-[#fff4f8] shadow-[0_12px_22px_rgba(166,67,122,0.08)]" : "border-[#f0dde7] bg-white",
                          )}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-semibold text-[#1f1f22]">{rideOption.name}</h3>
                              {active && <Check className="h-4 w-4 text-[#a6437a]" />}
                            </div>
                            <p className="mt-1 text-sm text-[#69646a]">{rideOption.captain}</p>
                            <p className="mt-1 text-sm text-[#69646a]">{rideOption.eta}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xl font-bold text-[#1f1f22]">₹{rideOption.fare}</span>
                              <span className="text-xs text-[#787178]">{rideOption.tag}</span>
                            </div>
                          </div>
                          {rideOption.badge && (
                            <span className="rounded-full bg-[#f2ecf2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6d5a67]">
                              {rideOption.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <Button onClick={() => setPage("fare")} className="mt-5 w-full">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {page === "fare" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f1dfe8] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d1f]">Your ride</h2>
                  <div className="mt-4 space-y-3 text-sm text-[#5f5a60]">
                    <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
                    <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{selectedDestination || "Vesu, Surat"}</span></div>
                    <div className="flex justify-between"><span>Distance</span><span className="font-medium text-[#1f1f22]">6.4 km</span></div>
                    <div className="flex justify-between"><span>Estimated time</span><span className="font-medium text-[#1f1f22]">18 min</span></div>
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

                  <div className="mt-5 rounded-2xl border border-[#efdddf] bg-[#fffdfd] p-3 text-sm text-[#645d63]">
                    Verified women captain
                  </div>
                  <Button onClick={() => setPage("confirm-booking")} className="mt-6 w-full">
                    Confirm PinkRide
                  </Button>
                </div>
              </div>
            )}

            {page === "confirm-booking" && (
              <div className="px-4">
                <div className="rounded-[28px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d1f]">Ready to ride?</h2>
                  <div className="mt-5 space-y-3 text-sm text-[#5c565c]">
                    <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1d1b1f]">Current Location</span></div>
                    <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1d1b1f]">{selectedDestination}</span></div>
                    <div className="flex justify-between"><span>Ride type</span><span className="font-medium text-[#1d1b1f]">{selectedRide === "pink-bike" ? "Pink Bike" : selectedRide === "pink-auto" ? "Pink Auto" : "Pink Cab"}</span></div>
                    <div className="flex justify-between"><span>Estimated fare</span><span className="font-medium text-[#1d1b1f]">₹82</span></div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#e9d7e1] bg-[#fff7fa] p-3 text-sm font-medium text-[#a6437a]">
                    Women-only ride
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="secondary" onClick={() => setPage("ride-options")}>Change ride</Button>
                    <Button onClick={handleBookRide}>Book PinkRide</Button>
                  </div>
                </div>
              </div>
            )}

            {page === "finding" && (
              <div className="px-4 pt-3">
                <div className="h-[560px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]">
                  <MapView mode="finding" routeProgress={40} />
                </div>
                <div className="-mt-12 mx-auto max-w-[310px] rounded-[28px] border border-[#f0dde7] bg-white p-4 text-center shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f8edf3] text-[#a6437a]">
                      <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border border-[#a6437a]/50"
                      />
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <h2 className="text-[22px] font-bold tracking-[-0.05em] text-[#1d1b1f]">Finding your PinkRide captain...</h2>
                  <p className="mt-2 text-sm text-[#655f63]">Matching you with a verified woman captain nearby.</p>
                  <div className="mt-4 text-xs font-medium text-[#7c7277]">Looking for nearby captains...</div>
                </div>
              </div>
            )}

            {page === "captain-assigned" && (
              <div className="px-4">
                <div className="h-[420px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]">
                  <MapView mode="route" routeProgress={62} />
                </div>
                <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Your captain is on the way</h2>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">
                      AP
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#1f1f22]">Ananya Patel</p>
                        <span className="rounded-full bg-[#f2ebf0] px-2 py-0.5 text-[10px] font-medium text-[#a6437a]">Verified</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-[#625c60]">
                        <Star className="h-3.5 w-3.5 fill-[#f6b153] text-[#f6b153]" /> 4.9
                        <span>•</span>
                        <span>1,248 rides</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#a6437a]">3 min away</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]">
                      <Phone className="mx-auto mb-2 h-4 w-4" /> Call
                    </button>
                    <button className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]">
                      <MessageSquareText className="mx-auto mb-2 h-4 w-4" /> Chat
                    </button>
                    <button onClick={() => setPage("safety")} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]">
                      <ShieldCheck className="mx-auto mb-2 h-4 w-4" /> Safety
                    </button>
                  </div>
                </div>
              </div>
            )}

            {page === "captain-arriving" && (
              <div className="px-4">
                <div className="h-[420px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]">
                  <MapView mode="route" routeProgress={82} />
                </div>
                <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Ananya is arriving</h2>
                  <p className="mt-1 text-sm text-[#686168]">ETA: <span className="font-semibold text-[#1f1f22]">2 min</span></p>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => setPage("share")} variant="secondary" className="flex-1">Share ride</Button>
                    <Button onClick={() => setPage("safety")} variant="secondary" className="flex-1">Safety</Button>
                  </div>
                </div>
              </div>
            )}

            {page === "captain-arrived" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">Your captain has arrived</h2>
                  <div className="mt-5 flex items-center gap-3 rounded-[24px] bg-[#fff7fa] p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">
                      AP
                    </div>
                    <div>
                      <p className="font-semibold text-[#1f1f22]">Ananya Patel</p>
                      <p className="text-sm text-[#626166]">Honda Activa • GJ 05 AB 1234</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] p-3 text-sm text-[#605d63]">
                    Check the vehicle number before starting your ride.
                  </div>
                  <Button onClick={() => setPage("ride-pin")} className="mt-6 w-full">
                    Start Ride
                  </Button>
                </div>
              </div>
            )}

            {page === "ride-pin" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">Confirm your ride</h2>
                  <p className="mt-2 text-sm text-[#695f64]">Ask your captain for the 4-digit ride PIN.</p>
                  <div className="mt-6 flex justify-center">
                    <OTPInput value={pinValue} onChange={setPinValue} />
                  </div>
                  <div className="mt-4 text-center text-sm text-[#7f787e]">Demo PIN: 4821</div>
                  <Button onClick={() => setPage("ride-active")} className="mt-6 w-full">
                    Start ride
                  </Button>
                </div>
              </div>
            )}

            {page === "ride-active" && (
              <div className="px-4">
                <div className="h-[520px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]">
                  <MapView mode="route" routeProgress={routeProgress} />
                </div>
                <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6b666a]">You&apos;re on your way</p>
                      <h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">Ananya Patel</h2>
                    </div>
                    <span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">ETA 12 min</span>
                  </div>
                  <div className="mt-3 text-sm text-[#5e575d]">Destination: {selectedDestination}</div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button onClick={() => setPage("share")} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]">
                      <Navigation className="mx-auto mb-2 h-4 w-4" /> Share ride
                    </button>
                    <button className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]">
                      <MessageSquareText className="mx-auto mb-2 h-4 w-4" /> Chat
                    </button>
                    <button onClick={() => setPage("safety")} className="rounded-2xl border border-[#f0dfe7] bg-[#fffafd] p-3 text-center text-sm font-medium text-[#2f2d31]">
                      <ShieldCheck className="mx-auto mb-2 h-4 w-4" /> Safety
                    </button>
                  </div>
                </div>
              </div>
            )}

            {page === "safety" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">You&apos;re in control</h2>
                  <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#fff0f6,#f6edf3)] p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a6437a] text-white shadow-md">
                        <Siren className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.2em] text-[#8c646e]">SOS</p>
                        <p className="text-base font-semibold text-[#201d20]">Emergency assistance</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {["Emergency SOS", "Share Live Ride", "Trusted Contacts", "Call Support", "Report an Issue"].map((item, index) => (
                        <button
                          key={item}
                          onClick={() => {
                            if (item === "Emergency SOS") setSosOpen(true);
                            else if (item === "Share Live Ride") setPage("share");
                            else if (item === "Trusted Contacts") setPage("emergency");
                            else if (item === "Call Support") setToast("Support contact ready");
                            else setToast("Issue reported");
                          }}
                          className="flex w-full items-center justify-between rounded-2xl border border-[#f0dfe7] bg-white px-3 py-3 text-left text-sm font-medium text-[#2b2a2d]"
                        >
                          <span>{item}</span>
                          <ChevronRight className="h-4 w-4 text-[#7e767a]" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="mt-5 text-center text-xs text-[#736d73]">Your location is being shared during this ride.</p>
                </div>
              </div>
            )}

            {page === "share" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d20]">Share your live ride</h2>
                  <div className="mt-5 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5f5a60]">
                    <div className="flex justify-between"><span>Captain</span><span className="font-medium text-[#1f1f22]">Ananya Patel</span></div>
                    <div className="mt-2 flex justify-between"><span>Vehicle</span><span className="font-medium text-[#1f1f22]">Honda Activa</span></div>
                    <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
                    <div className="mt-2 flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{selectedDestination}</span></div>
                    <div className="mt-2 flex justify-between"><span>ETA</span><span className="font-medium text-[#1f1f22]">12 min</span></div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {['WhatsApp', 'SMS', 'Copy link'].map((item) => (
                      <button
                        key={item}
                        onClick={() => setToast(item === 'Copy link' ? 'Ride details copied' : `${item} shared`)}
                        className="flex w-full items-center justify-between rounded-2xl border border-[#f0dde7] bg-white px-4 py-3 text-sm font-medium text-[#2b2a2d]"
                      >
                        <span>{item}</span>
                        <ChevronRight className="h-4 w-4 text-[#7d777d]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page === "ride-complete" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)] text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-3xl shadow-md">💗</div>
                  <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">You&apos;re safely here 💗</h2>
                  <p className="mt-2 text-sm text-[#655f63]">Thanks for riding with PinkRide.</p>
                  <div className="mt-6 grid grid-cols-3 gap-2 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5c5a5d]">
                    <div><p className="text-[#847d82]">Distance</p><p className="mt-1 font-semibold text-[#1f1f22]">6.4 km</p></div>
                    <div><p className="text-[#847d82]">Duration</p><p className="mt-1 font-semibold text-[#1f1f22]">18 min</p></div>
                    <div><p className="text-[#847d82]">Fare</p><p className="mt-1 font-semibold text-[#1f1f22]">₹82</p></div>
                  </div>
                  <Button onClick={() => setPage("payment")} className="mt-6 w-full">
                    Continue to payment
                  </Button>
                </div>
              </div>
            )}

            {page === "payment" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">Complete payment</h2>
                  <div className="mt-4 text-center text-[34px] font-bold tracking-[-0.08em] text-[#201d20]">₹82</div>
                  <div className="mt-6 space-y-3">
                    {['UPI', 'Credit / Debit Card', 'Cash'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[22px] border p-3 text-left text-sm font-medium",
                          paymentMethod === method ? "border-[#a6437a] bg-[#fff4f8] text-[#201d20]" : "border-[#f0dde7] bg-white text-[#2f2d31]",
                        )}
                      >
                        <span>{method}</span>
                        {paymentMethod === method && <Check className="h-4 w-4 text-[#a6437a]" />}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handlePayment} className="mt-6 w-full">
                    {paymentState === "idle" ? "Pay ₹82" : paymentState === "processing" ? "Processing..." : "Payment successful"}
                  </Button>
                  {paymentState === "success" && (
                    <div className="mt-4 rounded-2xl border border-[#e7f4eb] bg-[#ecfaf1] p-3 text-center text-sm font-medium text-[#166f40]">
                      Payment successful
                    </div>
                  )}
                </div>
              </div>
            )}

            {page === "rating" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">How was your ride?</h2>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">
                      AP
                    </div>
                    <div>
                      <p className="font-semibold text-[#1f1f22]">Ananya Patel</p>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button key={value} onClick={() => setStarRating(value)} className="text-3xl text-[#f7c86e]">
                        <Star className={cn("h-8 w-8 fill-current", starRating >= value ? "fill-[#f6b153] text-[#f6b153]" : "text-[#e9d8de]")} />
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {['Safe', 'Friendly', 'Professional', 'Smooth ride', 'Clean vehicle'].map((option) => (
                      <button key={option} className="rounded-xl border border-[#f0dfe7] bg-[#fff9fb] px-3 py-2 text-sm font-medium text-[#2c2a2d]">
                        {option}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(event) => setFeedbackText(event.target.value)}
                    placeholder="Add a comment"
                    className="mt-4 h-24 w-full rounded-[20px] border border-[#f0dfe7] bg-[#fffdfd] p-3 text-sm text-[#1d1b1f] outline-none placeholder:text-[#8e868b]"
                  />
                  <Button
                    onClick={() => {
                      setPage("history");
                      setToast("Thanks for your feedback 💗");
                    }}
                    className="mt-6 w-full"
                  >
                    Submit rating
                  </Button>
                </div>
              </div>
            )}

            {page === "history" && (
              <div className="px-4">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">My Rides</h2>
                  <button onClick={() => setToast("Loading ride history")}> </button>
                </div>
                <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                  {['All', 'Completed', 'Cancelled'].map((tab) => (
                    <button
                      key={tab}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium",
                        activeTab === tab || tab === "All" ? "bg-[#a6437a] text-white" : "bg-white text-[#5f5b60] border border-[#f0dfe7]",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    { date: "29 Sep", name: "Ananya Patel", route: "Adajan → Vesu", amount: "₹82", status: "Completed" },
                    { date: "26 Sep", name: "Kavya Shah", route: "Vesu → Dumas", amount: "₹96", status: "Completed" },
                  ].map((rideItem) => (
                    <button
                      key={rideItem.date}
                      onClick={() => setPage("details")}
                      className="w-full rounded-[24px] border border-[#f0dfe7] bg-white p-4 text-left shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#826d75]">{rideItem.date}</span>
                        <span className="rounded-full bg-[#ecfaf1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#166f40]">
                          {rideItem.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#1f1f22]">{rideItem.name}</p>
                          <p className="mt-1 text-sm text-[#676167]">{rideItem.route}</p>
                        </div>
                        <p className="text-base font-semibold text-[#201d20]">{rideItem.amount}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {page === "details" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <div className="mb-4 flex items-center gap-3">
                    <button onClick={() => setPage("history")} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf3f7] text-[#2b2a2d]">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d20]">Ride details</h2>
                  </div>
                  <div className="space-y-3 text-sm text-[#5f5a60]">
                    <div className="flex justify-between"><span>Ride ID</span><span className="font-medium text-[#1f1f22]">#PR-28461</span></div>
                    <div className="flex justify-between"><span>Date</span><span className="font-medium text-[#1f1f22]">29 Sep, 2026</span></div>
                    <div className="flex justify-between"><span>Captain</span><span className="font-medium text-[#1f1f22]">Ananya Patel</span></div>
                    <div className="flex justify-between"><span>Vehicle</span><span className="font-medium text-[#1f1f22]">Honda Activa</span></div>
                    <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Adajan</span></div>
                    <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">Vesu</span></div>
                    <div className="flex justify-between"><span>Distance</span><span className="font-medium text-[#1f1f22]">6.4 km</span></div>
                    <div className="flex justify-between"><span>Duration</span><span className="font-medium text-[#1f1f22]">18 min</span></div>
                    <div className="flex justify-between"><span>Fare</span><span className="font-medium text-[#1f1f22]">₹82</span></div>
                    <div className="flex justify-between"><span>Payment method</span><span className="font-medium text-[#1f1f22]">UPI</span></div>
                    <div className="flex justify-between"><span>Rating</span><span className="font-medium text-[#1f1f22]">★★★★★</span></div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="secondary" onClick={() => setToast("Receipt downloaded")} className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download receipt
                    </Button>
                    <Button variant="secondary" onClick={() => setToast("Issue reported")} className="w-full">
                      Report an issue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {page === "wallet" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[30px] font-bold tracking-[-0.06em] text-[#201d20]">Wallet</h2>
                  <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#f7dfe9,#f7edf3)] p-4">
                    <p className="text-sm text-[#7d7579]">Balance</p>
                    <p className="mt-2 text-3xl font-bold text-[#1f1f22]">₹240</p>
                  </div>
                  <div className="mt-5 space-y-3">
                    {['UPI', 'Visa', 'Cash'].map((method) => (
                      <div key={method} className="flex items-center justify-between rounded-2xl border border-[#f0dfe7] bg-[#fffafc] px-4 py-3 text-sm font-medium text-[#2b2a2d]">
                        <span>{method}</span>
                        <span className="text-[#7d7579]">Primary</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[22px] border border-[#f0dfe7] bg-[#fff9fb] p-4">
                    <p className="text-sm font-semibold text-[#201d20]">Transaction history</p>
                    <div className="mt-3 space-y-3 text-sm">
                      <div className="flex justify-between"><span>PinkRide</span><span className="font-medium text-[#1f1f22]">₹82</span></div>
                      <div className="flex justify-between"><span>PinkRide</span><span className="font-medium text-[#1f1f22]">₹96</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "profile-screen" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-lg font-bold text-white">
                      PS
                    </div>
                    <div>
                      <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#201d20]">Priya Sharma</h2>
                      <p className="text-sm text-[#696369]">+91 XXXXX XXXXX</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl border border-[#f0dfe7] bg-[#fff7fa] p-3 text-sm font-medium text-[#a6437a]">
                    Verified profile
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-[#5f5a60]">
                    {['Personal details', 'Emergency contacts', 'Saved places', 'Payment methods', 'Ride history', 'Notifications', 'Language', 'Privacy', 'Help & Support', 'Terms & Conditions', 'Logout'].map((field) => (
                      <button
                        key={field}
                        onClick={() => {
                          if (field === 'Emergency contacts') setPage('emergency');
                          else if (field === 'Saved places') setPage('saved');
                          else if (field === 'Notifications') setPage('notifications');
                          else if (field === 'Help & Support') setPage('support');
                        }}
                        className="flex w-full items-center justify-between rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] p-3 text-left"
                      >
                        <span>{field}</span>
                        <ChevronRight className="h-4 w-4 text-[#797579]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page === "emergency" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[30px] font-bold tracking-[-0.06em] text-[#201d20]">Trusted contacts</h2>
                  <p className="mt-2 text-sm text-[#686168]">People who can receive your live ride information.</p>
                  <div className="mt-5 space-y-3">
                    {['Mother', 'Friend'].map((person, index) => (
                      <div key={person} className="flex items-center justify-between rounded-[22px] border border-[#f0dfe7] bg-[#fffdfd] p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6edf2] text-sm font-bold text-[#a6437a]">
                            {person.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-medium text-[#1f1f22]">{person}</p>
                            <p className="text-xs text-[#79757a]">+91 XXXXX XXXXX</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="rounded-full bg-[#fdf3f7] px-2 py-1 text-xs font-medium text-[#a6437a]">Edit</button>
                          {index === 0 && <button className="rounded-full bg-[#fdf3f7] px-2 py-1 text-xs font-medium text-[#a6437a]">Remove</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full">Add contact</Button>
                </div>
              </div>
            )}

            {page === "saved" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[30px] font-bold tracking-[-0.06em] text-[#201d20]">Saved places</h2>
                  <div className="mt-5 space-y-3">
                    {savedPlaces.map((place) => (
                      <div key={place.name} className="rounded-[22px] border border-[#f0dfe7] bg-[#fffdfd] p-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edf3] text-[#a6437a]">
                            {place.name === "Home" ? <Home className="h-4 w-4" /> : <BriefcaseBusiness className="h-4 w-4" />}
                          </span>
                          <div>
                            <p className="font-medium text-[#1f1f22]">{place.name}</p>
                            <p className="text-xs text-[#767077]">{place.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full">Add new place</Button>
                </div>
              </div>
            )}

            {page === "notifications" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[30px] font-bold tracking-[-0.06em] text-[#201d20]">Notifications</h2>
                  <div className="mt-5 space-y-3">
                    {mockNotifications.map((notification, index) => (
                      <div key={notification} className={cn("flex items-start gap-3 rounded-[20px] border p-3", index === 0 ? "border-[#f0dfe7] bg-[#fff7fa]" : "border-[#f1ebef] bg-[#fffdfd]")}>
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#a6437a]" />
                        <div className="flex-1 text-sm text-[#2d2a2d]">{notification}</div>
                        {index === 0 && <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a6437a]">New</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page === "support" && (
              <div className="px-4">
                <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
                  <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">How can we help?</h2>
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] px-4 py-3 text-sm text-[#767077] shadow-sm">
                    <Search className="h-4 w-4 text-[#a6437a]" />
                    <input value="Search help" readOnly className="w-full border-0 bg-transparent" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {helpCategories.map((category) => (
                      <button key={category} className="rounded-full border border-[#f0dfe7] bg-[#fff9fb] px-3 py-2 text-xs font-medium text-[#413d42]">
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    {['How do I share my ride?', 'How do I update my profile?', 'What is the verification process?'].map((faq) => (
                      <div key={faq} className="rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] p-3 text-sm text-[#2c2a2d]">
                        {faq}
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full">Contact support</Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1d1a1f]/50 px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(15,15,18,0.28)]"
          >
            <h3 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Are you sure you need emergency assistance?</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setSosOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                setSosOpen(false);
                setToast("Emergency assistance activated");
              }}>Get help</Button>
            </div>
          </motion.div>
        </div>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-full bg-[#1d1b1f] px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </motion.div>
      )}

      {[
        "home",
        "history",
        "safety",
        "wallet",
        "profile-screen",
      ].includes(page) && renderBottomNav()}
    </div>
  );
}

export default PinkRidePrototype;

function HistoryIcon(props: React.ComponentProps<typeof Home>) {
  return <AlarmClockCheck {...props} />;
}
