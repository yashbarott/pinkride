"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  LogOut,
  MapPin,
  Search,
  ShieldPlus,
  Siren,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PassengerStep =
  | "splash"
  | "onboarding"
  | "login"
  | "otp"
  | "profile"
  | "permissions"
  | "home"
  | "places"
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
  | "history";
type Role = "passenger" | "captain";
type CaptainStep =
  | "splash"
  | "login"
  | "otp"
  | "onboarding"
  | "home"
  | "request"
  | "navigate"
  | "arrived"
  | "pin"
  | "active"
  | "safety"
  | "earnings"
  | "profile"
  | "wallet"
  | "rides"
  | "help"
  | "settings";
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

type RideVehicleType = "bike" | "rickshaw" | "car";

function getRideVehicleLabel(vehicleType: RideVehicleType) {
  if (vehicleType === "rickshaw") return "Pink Rickshaw";
  if (vehicleType === "car") return "Pink 4 Wheeler";
  return "Pink Bike";
}

type MockRide = {
  id: string;
  vehicleType: RideVehicleType;
  passenger: string;
  passengerPhone?: string;
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
  createdAt?: string;
};

type RideHistoryEntry = {
  id: string;
  createdAt: string;
  vehicleType?: RideVehicleType;
  captain: string;
  pickup: string;
  destination: string;
  fare: number;
};

type SavedPlaces = {
  home: string;
  work: string;
};

const emptySavedPlaces: SavedPlaces = { home: "", work: "" };

function parseSavedPlaces(value: string | null): SavedPlaces {
  if (!value) return emptySavedPlaces;

  const parsed: unknown = JSON.parse(value);
  if (
    typeof parsed !== "object"
    || parsed === null
    || !("home" in parsed)
    || typeof parsed.home !== "string"
    || !("work" in parsed)
    || typeof parsed.work !== "string"
  ) {
    throw new Error("Saved places must contain Home and Work addresses.");
  }

  return { home: parsed.home, work: parsed.work };
}

function parseRideHistory(value: string | null): RideHistoryEntry[] {
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error("Ride history must be a list.");
  }

  return parsed.filter((entry): entry is RideHistoryEntry =>
    typeof entry === "object"
    && entry !== null
    && "id" in entry
    && typeof entry.id === "string"
    && "createdAt" in entry
    && typeof entry.createdAt === "string"
    && Number.isFinite(Date.parse(entry.createdAt))
    && "captain" in entry
    && typeof entry.captain === "string"
    && "pickup" in entry
    && typeof entry.pickup === "string"
    && "destination" in entry
    && typeof entry.destination === "string"
    && "fare" in entry
    && typeof entry.fare === "number"
    && Number.isFinite(entry.fare),
  );
}

type NavigationSnapshot = {
  role: Role;
  passengerStep: PassengerStep;
  captainStep: CaptainStep;
  ride: MockRide;
};

const defaultRide: MockRide = {
  id: "PR-28461",
  vehicleType: "bike",
  passenger: "Passenger",
  captain: "Captain",
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

function getInitials(name: string, fallback: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  return initials || fallback;
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
}: {
  mode?: "home" | "route" | "finding";
}) {
  const mapLabels = {
    home: "Vesu, Surat · demo map",
    route: "Map preview · not a live route",
    finding: "Map preview · no live tracking",
  };

  return (
    <div
      role="region"
      aria-label="Interactive map preview centered on Vesu, Surat"
      className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#e8eee8]"
    >
      <iframe
        title="Interactive OpenStreetMap centered on Vesu, Surat"
        src="https://www.openstreetmap.org/export/embed.html?bbox=72.740%2C21.118%2C72.813%2C21.170&layer=mapnik&marker=21.1458%2C72.7701#map=15/21.1458/72.7701"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#39343a] shadow-md">
        {mapLabels[mode]}
      </div>
      <div className="absolute bottom-2 left-2 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[10px] font-medium text-[#514a50] shadow-sm">
        Demo location · no live GPS
      </div>
      <div className="absolute bottom-2 right-2 rounded bg-white/95 px-1.5 py-1 text-[10px] text-[#514a50] shadow-sm">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-2"
        >
          OpenStreetMap contributors
        </a>
      </div>
    </div>
  );
}

function CaptainHeader({ title, subtitle, name }: { title: string; subtitle?: string; name: string }) {
  return (
    <header className="mb-5 flex items-start justify-between px-4 pt-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a7d85]">PinkRide</p>
        <h1 className="mt-1 text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#676167]">{subtitle}</p>}
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-sm font-bold text-white shadow-md">
        {getInitials(name, "CP")}
      </div>
    </header>
  );
}

function PinkRideStage2() {
  const [role, setRole] = useState<Role>("passenger");
  const [ride, setRide] = useState<MockRide>(defaultRide);
  const [passengerStep, setPassengerStep] = useState<PassengerStep>("splash");
  const [captainStep, setCaptainStep] = useState<CaptainStep>("splash");
  const [phone, setPhone] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [passengerAccountPhone, setPassengerAccountPhone] = useState("");
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaces>(emptySavedPlaces);
  const [passengerRideHistory, setPassengerRideHistory] = useState<RideHistoryEntry[]>([]);
  const [otp, setOtp] = useState("");
  const [captainOtp, setCaptainOtp] = useState("");
  const [passengerRating, setPassengerRating] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [sosOpen, setSosOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [loggedInRoles, setLoggedInRoles] = useState<Record<Role, boolean>>({
    passenger: false,
    captain: false,
  });
  const [canGoBack, setCanGoBack] = useState(false);
  const navigationHistory = useRef<NavigationSnapshot[]>([]);
  const currentNavigation = useRef<NavigationSnapshot | null>(null);
  const restoringNavigation = useRef(false);

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

  const passengerRideSteps: Partial<Record<RideStatus, PassengerStep>> = {
    searching_captain: "finding",
    captain_assigned: "captain-assigned",
    captain_arrived: "captain-arrived",
    ride_started: "ride-active",
    ride_completed: "ride-complete",
    payment_completed: "rating",
  };
  const captainRideSteps: Partial<Record<RideStatus, typeof captainStep>> = {
    captain_requested: "request",
    captain_assigned: "navigate",
    captain_arrived: "arrived",
    awaiting_pin: "pin",
    ride_started: "active",
    ride_completed: "earnings",
  };
  const currentPassengerStep =
    role === "passenger" ? passengerRideSteps[ride.status] ?? passengerStep : passengerStep;
  const currentCaptainStep =
    role === "captain"
      ? ride.status === "ride_completed" && captainStep === "home"
        ? captainStep
        : captainRideSteps[ride.status] ?? captainStep
      : captainStep;

  useEffect(() => {
    const nextNavigation: NavigationSnapshot = {
      role,
      passengerStep,
      captainStep,
      ride,
    };
    const previousNavigation = currentNavigation.current;

    if (restoringNavigation.current) {
      restoringNavigation.current = false;
      currentNavigation.current = nextNavigation;
      return;
    }

    if (!previousNavigation) {
      currentNavigation.current = nextNavigation;
      return;
    }

    const previousScreen = `${previousNavigation.role}:${previousNavigation.ride.status}:${previousNavigation.role === "passenger" ? previousNavigation.passengerStep : previousNavigation.captainStep}`;
    const nextScreen = `${nextNavigation.role}:${nextNavigation.ride.status}:${nextNavigation.role === "passenger" ? nextNavigation.passengerStep : nextNavigation.captainStep}`;

    const previousStep = previousNavigation.role === "passenger"
      ? previousNavigation.passengerStep
      : previousNavigation.captainStep;
    if (previousScreen !== nextScreen && previousStep !== "splash") {
      navigationHistory.current.push(previousNavigation);
      setCanGoBack(true);
    }
    currentNavigation.current = nextNavigation;
  }, [captainStep, passengerStep, ride, role]);

  const goBack = () => {
    const previousNavigation = navigationHistory.current.pop();
    if (!previousNavigation) {
      setCanGoBack(false);
      return;
    }

    restoringNavigation.current = true;
    currentNavigation.current = previousNavigation;
    setCanGoBack(navigationHistory.current.length > 0);
    setRole(previousNavigation.role);
    setPassengerStep(previousNavigation.passengerStep);
    setCaptainStep(previousNavigation.captainStep);
    setRide(previousNavigation.ride);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadPassengerPlaces = (passengerPhone: string) => {
    try {
      const saved = parseSavedPlaces(
        window.localStorage.getItem(`pinkride:saved-places:${passengerPhone}`),
      );
      setSavedPlaces(saved);
    } catch {
      setSavedPlaces(emptySavedPlaces);
      setToast("Could not load saved places. Check browser storage and try again.");
    }
  };

  const saveDemoAccount = (accountRole: Role, name: string, email: string) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setToast("Enter a valid 10-digit mobile number");
      return false;
    }
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setToast("Enter your name and a valid email address");
      return false;
    }

    const accountKey = `pinkride:demo-account:${accountRole}:${cleanedPhone}`;
    try {
      if (window.localStorage.getItem(accountKey)) {
        setToast("An account already exists for this number");
        return false;
      }

      window.localStorage.setItem(accountKey, JSON.stringify({
        role: accountRole,
        phone: cleanedPhone,
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      }));
      return true;
    } catch {
      setToast("Could not save your account. Check browser storage and try again.");
      return false;
    }
  };

  const createPassengerAccount = () => {
    if (!saveDemoAccount("passenger", passengerName, passengerEmail)) return;
    const passengerPhone = phone.replace(/\D/g, "");
    setPassengerAccountPhone(passengerPhone);
    loadPassengerPlaces(passengerPhone);
    setLoggedInRoles((previous) => ({ ...previous, passenger: true }));
    setPassengerStep("permissions");
    setToast("Passenger account created");
  };

  const createCaptainAccount = () => {
    if (!saveDemoAccount("captain", captainName, captainEmail)) return;
    setLoggedInRoles((previous) => ({ ...previous, captain: true }));
    setCaptainStep("home");
    setToast("Captain account created");
  };

  const signInDemoAccount = (accountRole: Role): boolean | null => {
    const cleanedPhone = phone.replace(/\D/g, "");
    const accountKey = `pinkride:demo-account:${accountRole}:${cleanedPhone}`;
    let storedAccount: string | null;
    try {
      storedAccount = window.localStorage.getItem(accountKey);
    } catch {
      setToast("Could not access your saved account. Check browser storage and try again.");
      return null;
    }

    if (!storedAccount) return false;

    try {
      const account: unknown = JSON.parse(storedAccount);
      if (
        typeof account !== "object"
        || account === null
        || !("role" in account)
        || !("phone" in account)
        || !("name" in account)
        || !("email" in account)
        || account.role !== accountRole
        || account.phone !== cleanedPhone
        || typeof account.name !== "string"
        || typeof account.email !== "string"
      ) {
        setToast("Saved account details are invalid. Please contact support.");
        return null;
      }

      if (accountRole === "passenger") {
        setPassengerName(account.name);
        setPassengerEmail(account.email);
        setPassengerAccountPhone(account.phone);
        loadPassengerPlaces(account.phone);
        setLoggedInRoles((previous) => ({ ...previous, passenger: true }));
        setPassengerStep("home");
      } else {
        setCaptainName(account.name);
        setCaptainEmail(account.email);
        setLoggedInRoles((previous) => ({ ...previous, captain: true }));
        setCaptainStep("home");
      }
      setToast(`Welcome back, ${account.name}`);
      return true;
    } catch {
      setToast("Could not read your saved account. Please try again.");
      return null;
    }
  };

  const logout = () => {
    setLoggedInRoles((previous) => ({ ...previous, [role]: false }));
    setPhone("");
    if (role === "passenger") {
      setPassengerName("");
      setPassengerEmail("");
      setPassengerAccountPhone("");
      setSavedPlaces(emptySavedPlaces);
      setOtp("");
      setPassengerStep("login");
    } else {
      setCaptainName("");
      setCaptainEmail("");
      setCaptainOtp("");
      setOnline(false);
      setCaptainStep("login");
    }
    navigationHistory.current = [];
    restoringNavigation.current = true;
    setCanGoBack(false);
    setLogoutOpen(false);
    setToast("You have been logged out");
  };

  const openPassengerRideHistory = () => {
    const passengerPhone = passengerAccountPhone || phone.replace(/\D/g, "") || "guest";
    try {
      const history = parseRideHistory(
        window.localStorage.getItem(`pinkride:ride-history:${passengerPhone}`),
      );
      setPassengerRideHistory(history.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
    } catch {
      setPassengerRideHistory([]);
      setToast("Could not load your ride history. Check browser storage and try again.");
    }
    setPassengerStep("history");
  };

  const savePassengerPlaces = () => {
    const passengerPhone = passengerAccountPhone || phone.replace(/\D/g, "");
    if (!passengerPhone) {
      setToast("Sign in to save your places.");
      return;
    }

    const places = {
      home: savedPlaces.home.trim(),
      work: savedPlaces.work.trim(),
    };

    try {
      window.localStorage.setItem(
        `pinkride:saved-places:${passengerPhone}`,
        JSON.stringify(places),
      );
      setSavedPlaces(places);
      setToast("Saved places updated");
      setPassengerStep("home");
    } catch {
      setToast("Could not save your places. Check browser storage and try again.");
    }
  };

  const selectSavedPlace = (address: string) => {
    setRide((previous) => ({ ...previous, destination: address }));
    setPassengerStep("pickup");
  };

  const captainAcceptRide = () => {
    setRide((prev) => ({
      ...prev,
      captain: captainName.trim() || "Captain",
      status: "captain_assigned",
    }));
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

  const completeRide = () => {
    const completedAt = new Date().toISOString();
    const completedRide = { ...ride, status: "ride_completed" as const };
    const historyEntry: RideHistoryEntry = {
      id: completedRide.id,
      createdAt: completedAt,
      vehicleType: completedRide.vehicleType,
      captain: completedRide.captain,
      pickup: completedRide.pickup,
      destination: completedRide.destination,
      fare: completedRide.fare,
    };
    const historyKey = `pinkride:ride-history:${completedRide.passengerPhone || passengerAccountPhone || "guest"}`;
    let updatedHistory = [historyEntry, ...passengerRideHistory.filter((entry) => entry.id !== historyEntry.id)]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    let historySaved = true;

    try {
      const savedHistory = parseRideHistory(window.localStorage.getItem(historyKey));
      updatedHistory = [historyEntry, ...savedHistory.filter((entry) => entry.id !== historyEntry.id)]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      window.localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } catch {
      historySaved = false;
    }

    setPassengerRideHistory(updatedHistory);
    setRide(completedRide);
    setRole("captain");
    setToast(historySaved ? `₹${completedRide.captainEarnings} earned` : "Ride completed, but history could not be saved to browser storage.");
  };

  const toggleCaptainAvailability = () => {
    if (online) {
      setOnline(false);
      setCaptainStep("home");
      setToast("You are offline");
      return;
    }

    setOnline(true);
    setToast("Showing a sample ride request");
    setRide((prev) => ({ ...prev, status: "captain_requested" }));
    setCaptainStep("request");
  };

  const shareRideDetails = async () => {
    const details = `PinkRide demo trip\nRide type: ${getRideVehicleLabel(ride.vehicleType)}\nCaptain: ${ride.captain}\nPickup: ${ride.pickup}\nDestination: ${ride.destination}\nFare: ₹${ride.fare}\nThis is not live location tracking.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "PinkRide trip details", text: details });
        return;
      }
      if (!navigator.clipboard) {
        setToast("Sharing is not supported by this browser.");
        return;
      }
      await navigator.clipboard.writeText(details);
      setToast("Trip details copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setToast("Could not share trip details. Please try again.");
    }
  };

  const renderPassengerFlow = () => {
    if (currentPassengerStep === "splash") {
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

    if (currentPassengerStep === "onboarding") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-6">
          <div className="mb-6 flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f0d7e3,#d081a5_40%,#a6437a_80%)] text-sm font-bold text-white">P</div>
              <span className="text-lg font-semibold tracking-wide text-[#2a1d28]">PinkRide</span>
            </div>
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
              <p className="mt-3 text-[15px] leading-7 text-[#58545a]">Bike, rickshaw and car rides designed around women&apos;s mobility.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_112px] gap-3">
            <Button onClick={() => setPassengerStep("login")}>Next</Button>
            <Button variant="secondary" onClick={() => setPassengerStep("login")}>Skip</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "login") {
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
            <label htmlFor="passenger-phone" className="mb-2 block text-sm font-medium text-[#4c474d]">Mobile number</label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#f0dfe8] bg-[#fffdfd] px-3 py-3 shadow-sm">
              <span className="rounded-full bg-[#f5edf2] px-2 py-1 text-sm font-semibold text-[#2d2a2d]">+91</span>
              <input id="passenger-phone" className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none placeholder:text-[#908b90]" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} />
            </div>
              <Button onClick={() => {
                if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
                  setToast("Enter a valid 10-digit mobile number");
                  return;
                }
                setOtp("");
                setPassengerStep("otp");
              }} className="mt-5 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "otp") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <button onClick={() => setPassengerStep("login")} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#4a464b]">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Verify your number</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#655f63]">Enter the 4-digit demo code for +91 {phone || "your number"}</p>
          </div>
          <div className="rounded-[30px] border border-[#f0dde7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <OTPInput value={otp} onChange={setOtp} />
            <p className="mt-5 text-center text-sm font-medium text-[#8d7d84]">Demo code: 4821</p>
            <Button onClick={() => {
              if (otp !== "4821") {
                setToast("That code is incorrect. Use demo code 4821.");
                return;
              }
              if (signInDemoAccount("passenger") === false) setPassengerStep("profile");
            }} className="mt-6 w-full" disabled={otp.length !== 4}>Verify number</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "profile") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Let&apos;s get you started</h1>
          </div>
          <div className="rounded-[28px] border border-[#f3dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <div className="mb-6 flex items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-2xl font-bold text-white shadow-md">
                <span>{getInitials(passengerName, "P")}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="passenger-name" className="mb-2 block text-sm font-medium text-[#4b484d]">Full name</label>
                <input id="passenger-name" value={passengerName} onChange={(event) => setPassengerName(event.target.value)} autoComplete="name" placeholder="Your full name" className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none" />
              </div>
              <div>
                <label htmlFor="passenger-email" className="mb-2 block text-sm font-medium text-[#4b484d]">Email</label>
                <input id="passenger-email" type="email" value={passengerEmail} onChange={(event) => setPassengerEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none" />
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-[#6d6a6e]">PinkRide is exclusively for women passengers and women captains.</p>
            <Button onClick={createPassengerAccount} className="mt-6 w-full">Create passenger account</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "permissions") {
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
                  <p className="text-xs text-[#706b71]">Live location is not available in this demo.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[#f0dde7] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9edf3] text-[#a6437a]"><Bell className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-semibold text-[#1f1f22]">Notifications</h2>
                  <p className="text-xs text-[#706b71]">Push notifications are not connected in this demo.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6"><Button onClick={() => setPassengerStep("home")} className="w-full">Continue</Button></div>
        </div>
      );
    }

    if (currentPassengerStep === "home") {
      const savedPlaceShortcuts = [
        { label: "Home", address: savedPlaces.home, icon: MapPin },
        { label: "Work", address: savedPlaces.work, icon: BriefcaseBusiness },
      ].filter((place) => place.address);

      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] pb-24 pt-6">
          <header className="mb-4 flex items-center justify-between px-4">
            <div>
              <p className="text-[13px] font-medium text-[#8a7d85]">Good morning, {passengerName.trim() || "there"} 👋</p>
              <h1 className="mt-1 text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">Where are you going today?</h1>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f7dbe8,#d78aa8_28%,#a6437a_90%)] text-sm font-bold text-white shadow-md">{getInitials(passengerName, "P")}</div>
          </header>
          <div className="h-[280px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_40px_rgba(39,19,31,0.08)] px-4">
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
            {[{ title: "Book a ride", subtitle: "Bike, rickshaw or car", icon: Sparkles }, { title: "Safety", subtitle: "Safety information", icon: ShieldPlus }, { title: "Ride history", subtitle: "Your completed trips", icon: BriefcaseBusiness }].map((item) => (
              <button key={item.title} onClick={() => {
                if (item.title === "Safety") setPassengerStep("safety");
                if (item.title === "Ride history") openPassengerRideHistory();
                if (item.title === "Book a ride") setPassengerStep("search");
              }} className="rounded-[24px] border border-[#f0dfe7] bg-white p-3 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edf3] text-[#a6437a]"><item.icon className="h-4 w-4" /></div>
                <p className="text-sm font-semibold text-[#1f1f22]">{item.title}</p>
                <p className="mt-1 text-[11px] text-[#716b70]">{item.subtitle}</p>
              </button>
            ))}
          </div>
          <section className="mx-4 mt-5 rounded-[24px] border border-[#f0dfe7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#1f1f22]">Saved places</h2>
                <p className="mt-1 text-xs text-[#716b70]">Book your regular destinations faster.</p>
              </div>
              <button
                type="button"
                onClick={() => setPassengerStep("places")}
                className="shrink-0 rounded-full bg-[#fff4f8] px-3 py-2 text-xs font-semibold text-[#a6437a]"
              >
                Manage
              </button>
            </div>
            {savedPlaceShortcuts.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {savedPlaceShortcuts.map((place) => (
                  <button
                    key={place.label}
                    type="button"
                    onClick={() => selectSavedPlace(place.address)}
                    className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#f1e5eb] p-3 text-left transition hover:bg-[#fff8fb]"
                  >
                    <place.icon className="h-4 w-4 shrink-0 text-[#a6437a]" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#1f1f22]">{place.label}</span>
                      <span className="block truncate text-xs text-[#716b70]">{place.address}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPassengerStep("places")}
                className="mt-3 w-full rounded-2xl border border-dashed border-[#e7cbd9] px-3 py-3 text-left text-sm font-medium text-[#a6437a]"
              >
                Add your Home or Work address
              </button>
            )}
          </section>
        </div>
      );
    }

    if (currentPassengerStep === "places") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-5">
          <div className="mb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPassengerStep("home")}
              aria-label="Back to home"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 text-[#2b2a2d]" />
            </button>
            <div>
              <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#211d20]">Saved places</h2>
              <p className="text-sm text-[#706b71]">Keep regular destinations ready to book.</p>
            </div>
          </div>
          <div className="space-y-4 rounded-[28px] border border-[#f0dfe7] bg-white p-4 shadow-sm">
            <div>
              <label htmlFor="saved-home" className="mb-2 block text-sm font-semibold text-[#4c474d]">Home</label>
              <input
                id="saved-home"
                autoComplete="street-address"
                maxLength={100}
                placeholder="Add your home address"
                value={savedPlaces.home}
                onChange={(event) => setSavedPlaces((previous) => ({ ...previous, home: event.target.value }))}
                className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none focus:border-[#b85587]"
              />
            </div>
            <div>
              <label htmlFor="saved-work" className="mb-2 block text-sm font-semibold text-[#4c474d]">Work</label>
              <input
                id="saved-work"
                autoComplete="street-address"
                maxLength={100}
                placeholder="Add your work address"
                value={savedPlaces.work}
                onChange={(event) => setSavedPlaces((previous) => ({ ...previous, work: event.target.value }))}
                className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none focus:border-[#b85587]"
              />
            </div>
            <p className="text-xs leading-5 text-[#716b70]">Addresses are saved only in this browser for your passenger account.</p>
            <Button onClick={savePassengerPlaces} className="w-full">Save places</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "search") {
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

    if (currentPassengerStep === "pickup") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[480px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_40px_rgba(26,17,22,0.08)]">
            <MapView mode="route" />
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

    if (currentPassengerStep === "ride-options") {
      const rideOptions: Array<{
        id: RideVehicleType;
        name: string;
        eta: string;
        fare: number;
        captainEarnings: number;
        tag: string;
      }> = [
        { id: "bike", name: "Pink Bike", eta: "2 min away", fare: 82, captainEarnings: 72, tag: "Fast & affordable" },
        { id: "rickshaw", name: "Pink Rickshaw", eta: "5 min away", fare: 126, captainEarnings: 111, tag: "More space" },
        { id: "car", name: "Pink 4 Wheeler", eta: "7 min away", fare: 210, captainEarnings: 184, tag: "Comfortable ride" },
      ];

      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="mb-4 h-[280px] overflow-hidden rounded-[28px] border border-[#f1dfe8] bg-white p-2 shadow-sm"><MapView mode="route" /></div>
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="mb-4 text-[24px] font-bold tracking-[-0.05em] text-[#211d20]">Choose your ride</h2>
            <div className="space-y-3">
              {rideOptions.map((option) => (
                <button key={option.id} aria-pressed={ride.vehicleType === option.id} onClick={() => setRide((prev) => ({ ...prev, vehicleType: option.id, fare: option.fare, captainEarnings: option.captainEarnings }))} className={cn("flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition-all", ride.vehicleType === option.id ? "border-[#a6437a] bg-[#fff4f8]" : "border-[#f0dfe7] bg-white")}>
                  <div>
                    <div className="flex items-center gap-2"><h3 className="text-base font-semibold text-[#1f1f22]">{option.name}</h3>{ride.vehicleType === option.id && <Check className="h-4 w-4 text-[#a6437a]" />}</div>
                    <p className="mt-1 text-sm text-[#69646a]">Women captain</p>
                    <p className="mt-1 text-sm text-[#69646a]">{option.eta}</p>
                    <div className="mt-2 flex items-center gap-2"><span className="text-xl font-bold text-[#1f1f22]">₹{option.fare}</span><span className="text-xs text-[#787178]">{option.tag}</span></div>
                  </div>
                </button>
              ))}
            </div>
            <Button onClick={() => setPassengerStep("fare")} className="mt-5 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "fare") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f1dfe8] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d1f]">Your ride</h2>
            <div className="mt-4 space-y-3 text-sm text-[#5f5a60]">
              <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
              <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
              <div className="flex justify-between"><span>Ride type</span><span className="font-medium text-[#1f1f22]">{getRideVehicleLabel(ride.vehicleType)}</span></div>
            </div>
            <div className="mt-6 rounded-[24px] bg-[#fff7fa] p-4">
              <div className="flex justify-between text-base font-semibold text-[#1f1f22]"><span>Estimated total</span><span>₹{ride.fare}</span></div>
            </div>
            <Button onClick={() => setPassengerStep("confirm-booking")} className="mt-6 w-full">Confirm PinkRide</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "confirm-booking") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-10">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d1f]">Ready to ride?</h2>
            <div className="mt-5 space-y-3 text-sm text-[#5c565c]">
              <div className="flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">Current Location</span></div>
              <div className="flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
              <div className="flex justify-between"><span>Ride type</span><span className="font-medium text-[#1f1f22]">{getRideVehicleLabel(ride.vehicleType)}</span></div>
              <div className="flex justify-between"><span>Estimated fare</span><span className="font-medium text-[#1f1f22]">₹{ride.fare}</span></div>
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">Demo booking only. Passenger and captain identities are not verified.</div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setPassengerStep("ride-options")}>Change ride</Button>
              <Button onClick={() => { setRide((prev) => ({ ...prev, passenger: passengerName.trim() || "Passenger", passengerPhone: passengerAccountPhone || phone.replace(/\D/g, ""), id: `PR-${Date.now()}`, createdAt: new Date().toISOString(), status: "searching_captain" })); setPassengerStep("finding"); }}>Book PinkRide</Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "finding") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pt-3">
          <div className="h-[560px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]">
            <MapView mode="finding" />
          </div>
          <div className="-mt-12 mx-auto max-w-[310px] rounded-[28px] border border-[#f0dde7] bg-white p-4 text-center shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="mb-4 flex items-center justify-center gap-3"><div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f8edf3] text-[#a6437a]"><motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute inset-0 rounded-full border border-[#a6437a]/50" /><MapPin className="h-5 w-5" /></div></div>
            <h2 className="text-[22px] font-bold tracking-[-0.05em] text-[#1d1b1f]">Finding your PinkRide captain...</h2>
            <p className="mt-2 text-sm text-[#655f63]">This is a sample booking. No nearby captain is contacted in the demo.</p>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "captain-assigned") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[420px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Sample captain assigned</h2>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#fff7fa] p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">{getInitials(ride.captain, "CP")}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="font-semibold text-[#1f1f22]">{ride.captain}</p><span className="rounded-full bg-[#f2ebf0] px-2 py-0.5 text-[10px] font-medium text-[#a6437a]">Demo captain</span></div>
                <div className="mt-1 flex items-center gap-2 text-sm text-[#625c60]"><Star className="h-3.5 w-3.5 fill-[#f6b153] text-[#f6b153]" /> Sample rating and trip history</div>
              </div>
              <span className="text-sm font-semibold text-[#a6437a]">Sample ETA: 3 min</span>
            </div>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
              This captain profile, rating and arrival estimate are sample data. Calls and chat are unavailable.
            </div>
            <Button onClick={() => setPassengerStep("safety")} variant="secondary" className="mt-3 w-full">Safety information</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "captain-arrived") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">Your captain has arrived</h2>
            <div className="mt-5 flex items-center gap-3 rounded-[24px] bg-[#fff7fa] p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">{getInitials(ride.captain, "CP")}</div>
              <div>
                <p className="font-semibold text-[#1f1f22]">{ride.captain}</p>
                <p className="text-sm text-[#626166]">Sample captain profile · no vehicle assigned</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">Demo only. A real ride should show the verified driver and vehicle details here.</div>
            <Button onClick={() => setPassengerStep("ride-pin")} className="mt-6 w-full">Start Ride</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "ride-pin") {
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

    if (currentPassengerStep === "ride-active") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[520px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-[#6b666a]">Demo ride in progress</p><h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">{ride.captain}</h2></div>
              <span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">Sample ETA: 12 min</span>
            </div>
            <div className="mt-3 text-sm text-[#5e575d]">Destination: {ride.destination}</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setPassengerStep("share")}>Share trip details</Button>
              <Button variant="secondary" onClick={() => setPassengerStep("safety")}>Safety information</Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "safety") {
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
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                  Emergency response and live location sharing are not connected in this demo. Call 112 for immediate help.
                </p>
                {["Emergency help", "Share trip details"].map((item) => (
                  <button key={item} onClick={() => { if (item === "Emergency help") setSosOpen(true); else setPassengerStep("share"); }} className="flex w-full items-center justify-between rounded-2xl border border-[#f0dfe7] bg-white px-3 py-3 text-left text-sm font-medium text-[#2b2a2d]">
                    <span>{item}</span><ChevronRight className="h-4 w-4 text-[#7e767a]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "share") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[26px] font-bold tracking-[-0.05em] text-[#201d20]">Share trip details</h2>
            <p className="mt-2 text-sm text-[#655f63]">This shares trip information only; it does not include live location.</p>
            <div className="mt-5 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5f5a60]">
              <div className="flex justify-between"><span>Captain</span><span className="font-medium text-[#1f1f22]">{ride.captain}</span></div>
              <div className="mt-2 flex justify-between"><span>Ride type</span><span className="font-medium text-[#1f1f22]">{getRideVehicleLabel(ride.vehicleType)}</span></div>
              <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">{ride.pickup}</span></div>
              <div className="mt-2 flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
              <div className="mt-2 flex justify-between"><span>Fare</span><span className="font-medium text-[#1f1f22]">₹{ride.fare}</span></div>
            </div>
            <div className="mt-5 space-y-3">
              <Button onClick={shareRideDetails} className="w-full">Share trip details</Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "ride-complete") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-3xl shadow-md">💗</div>
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">You&apos;re safely here 💗</h2>
            <p className="mt-2 text-sm text-[#655f63]">Thanks for riding with PinkRide.</p>
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5c5a5d]">
              <div><p className="text-[#847d82]">Distance</p><p className="mt-1 font-semibold text-[#1f1f22]">6.4 km</p></div>
              <div><p className="text-[#847d82]">Duration</p><p className="mt-1 font-semibold text-[#1f1f22]">18 min</p></div>
              <div><p className="text-[#847d82]">Fare</p><p className="mt-1 font-semibold text-[#1f1f22]">₹{ride.fare}</p></div>
            </div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "payment_pending" })); setPassengerStep("payment"); }} className="mt-6 w-full">Continue to demo payment</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "payment") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">Complete payment</h2>
            <div className="mt-4 text-center text-[34px] font-bold tracking-[-0.08em] text-[#201d20]">₹{ride.fare}</div>
            <div className="mt-6 space-y-3">
              {['UPI', 'Credit / Debit Card', 'Cash'].map((method) => (
                <button key={method} type="button" aria-pressed={ride.paymentMethod === method} onClick={() => setRide((prev) => ({ ...prev, paymentMethod: method }))} className={cn("flex w-full items-center justify-between rounded-[22px] border p-3 text-left text-sm font-medium text-[#2f2d31]", ride.paymentMethod === method ? "border-[#a6437a] bg-[#fff4f8]" : "border-[#f0dde7] bg-white")}>
                  <span>{method}</span>{ride.paymentMethod === method && <Check className="h-4 w-4 text-[#a6437a]" />}
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">Demo only: no money is charged and no payment provider is connected.</p>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "rated" })); setPassengerStep("rating"); }} className="mt-4 w-full">Simulate demo payment · ₹{ride.fare}</Button>
          </div>
        </div>
      );
    }

    if (currentPassengerStep === "rating") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.05em] text-[#201d20]">How was your ride?</h2>
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-sm font-bold text-white">{getInitials(ride.captain, "CP")}</div>
              <div><p className="font-semibold text-[#1f1f22]">{ride.captain}</p></div>
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

    if (currentPassengerStep === "history") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">My Rides</h2></div>
          <div className="space-y-3">
            {passengerRideHistory.length === 0 ? (
              <div className="rounded-[24px] border border-[#f0dfe7] bg-white p-5 text-center text-sm text-[#676167] shadow-sm">
                Your completed rides will appear here.
              </div>
            ) : (
              passengerRideHistory.map((item) => (
                <div key={item.id} className="w-full rounded-[24px] border border-[#f0dfe7] bg-white p-4 text-left shadow-sm">
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#826d75]">{new Date(item.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span><span className="rounded-full bg-[#ecfaf1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#166f40]">Completed</span></div>
                  <div className="mt-3 flex items-center justify-between"><div><p className="font-semibold text-[#1f1f22]">{item.vehicleType ? `${getRideVehicleLabel(item.vehicleType)} · ` : ""}{item.captain}</p><p className="mt-1 text-sm text-[#676167]">{item.pickup} → {item.destination}</p></div><p className="text-base font-semibold text-[#201d20]">₹{item.fare}</p></div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderCaptainFlow = () => {
    if (currentCaptainStep === "splash") {
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

    if (currentCaptainStep === "login") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.06em] text-[#241d27]">Welcome, Captain</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#6a6368]">Help women move safely around the city.</p>
          </div>
          <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-4 shadow-[0_18px_40px_rgba(132,92,120,0.06)]">
            <label htmlFor="captain-phone" className="mb-2 block text-sm font-medium text-[#4c474d]">Mobile number</label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#f0dfe8] bg-[#fffdfd] px-3 py-3 shadow-sm">
              <span className="rounded-full bg-[#f5edf2] px-2 py-1 text-sm font-semibold text-[#2d2a2d]">+91</span>
              <input id="captain-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} className="w-full border-0 bg-transparent text-[15px] text-[#1d1b1f] outline-none" />
            </div>
              <Button onClick={() => {
                if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
                  setToast("Enter a valid 10-digit mobile number");
                  return;
                }
                setCaptainOtp("");
                setCaptainStep("otp");
              }} className="mt-5 w-full">Continue</Button>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "otp") {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffafc] px-5 pb-8 pt-8">
          <button onClick={() => setCaptainStep("login")} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#4a464b]"><ArrowLeft className="h-4 w-4" /> Back</button>
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#241d27]">Verify your number</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#655f63]">Enter the 4-digit demo code for +91 {phone || "your number"}</p>
          </div>
          <div className="rounded-[30px] border border-[#f0dde7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.06)]">
            <OTPInput value={captainOtp} onChange={setCaptainOtp} />
            <p className="mt-5 text-center text-sm font-medium text-[#8d7d84]">Demo code: 4821</p>
            <Button onClick={() => {
              if (captainOtp !== "4821") {
                setToast("That code is incorrect. Use demo code 4821.");
                return;
              }
              if (signInDemoAccount("captain") === false) setCaptainStep("onboarding");
            }} className="mt-6 w-full" disabled={captainOtp.length !== 4}>Verify number</Button>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "onboarding") {
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
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="captain-name" className="mb-2 block text-sm font-medium text-[#4b484d]">Full name</label>
                <input id="captain-name" value={captainName} onChange={(event) => setCaptainName(event.target.value)} autoComplete="name" placeholder="Your full name" className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none" />
              </div>
              <div>
                <label htmlFor="captain-email" className="mb-2 block text-sm font-medium text-[#4b484d]">Email</label>
                <input id="captain-email" type="email" value={captainEmail} onChange={(event) => setCaptainEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-[#ebd9e3] bg-[#fffdfd] px-4 py-3 text-[15px] text-[#1f1f22] outline-none" />
              </div>
            </div>
            <Button onClick={createCaptainAccount} className="mt-6 w-full">Create captain account</Button>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "home") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] pb-24 pt-6">
          <CaptainHeader title={`Good morning, ${captainName.trim() || "Captain"}`} subtitle="PinkRide Captain" name={captainName} />
          <div className="px-4">
            <div className="rounded-[28px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-[#726b71]">Demo availability</div>
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]", online ? "bg-[#ecfaf1] text-[#166f40]" : "bg-[#f7edf2] text-[#a6437a]")}>{online ? "Demo online" : "Offline"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className={cn("flex flex-1 items-center justify-center rounded-full py-4 text-base font-semibold", online ? "bg-[#a6437a] text-white" : "bg-[#f8edf3] text-[#8f3d69]")}>
                  {online ? "Demo mode active" : "Not accepting real rides"}
                </div>
              </div>
              <Button onClick={toggleCaptainAvailability} variant={online ? "secondary" : "primary"} className="mt-4 w-full">{online ? "Go Offline" : "Show demo ride request"}</Button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Sample earnings", value: "₹640" },
                { label: "Sample rides", value: "8" },
                { label: "Sample online time", value: "4h 12m" },
                { label: "Sample rating", value: "4.9 ⭐" },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-[#f0dfe7] bg-white p-3 shadow-sm">
                  <div className="text-xs text-[#786f74]">{item.label}</div>
                  <div className="mt-2 text-xl font-bold text-[#1f1f22]">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 h-[180px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" /></div>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "request") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[430px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="finding" /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[22px] font-bold tracking-[-0.05em] text-[#1d1b1f]">Sample ride request</h2><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">DEMO</span></div>
            <div className="rounded-[22px] bg-[#fff7fa] p-3 text-sm text-[#5c565c]">
              <div className="flex justify-between"><span>Passenger</span><span className="font-medium text-[#1f1f22]">{ride.passenger}</span></div>
              <div className="mt-2 flex justify-between"><span>Rating</span><span className="font-medium text-[#1f1f22]">Sample only</span></div>
              <div className="mt-2 flex justify-between"><span>Ride type</span><span className="font-medium text-[#1f1f22]">{getRideVehicleLabel(ride.vehicleType)}</span></div>
              <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">{ride.pickup}</span></div>
              <div className="mt-2 flex justify-between"><span>Destination</span><span className="font-medium text-[#1f1f22]">{ride.destination}</span></div>
              <div className="mt-2 flex justify-between"><span>Est. earnings</span><span className="font-medium text-[#1f1f22]">₹{ride.captainEarnings}</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={captainDeclineRide}>Decline</Button>
              <Button onClick={captainAcceptRide}>Accept Ride</Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "navigate") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[440px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="flex items-center justify-between"><div><p className="text-sm text-[#6b666a]">Pickup in 3 min</p><h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">{ride.passenger}</h2></div><span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">1.2 km</span></div>
            <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">Calls, chat, real navigation and safety support are not connected in this demo.</p>
            <Button onClick={captainArrived} className="mt-4 w-full">Arrived at pickup</Button>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "arrived") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#211d20]">You&apos;re at the pickup</h2>
            <div className="mt-5 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5f5a60]">
              <div className="flex justify-between"><span>Passenger</span><span className="font-medium text-[#1f1f22]">{ride.passenger}</span></div>
              <div className="mt-2 flex justify-between"><span>Pickup</span><span className="font-medium text-[#1f1f22]">{ride.pickup}</span></div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#f0dfe7] bg-[#fffdfd] p-3 text-sm text-[#605d63]">Confirm passenger details before starting.</div>
            <Button onClick={() => { setRide((prev) => ({ ...prev, status: "awaiting_pin" })); setCaptainStep("pin"); }} className="mt-6 w-full">Passenger is here</Button>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "pin") {
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

    if (currentCaptainStep === "active") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-4">
          <div className="h-[520px] overflow-hidden rounded-[30px] border border-[#f1dfe8] bg-white p-2 shadow-[0_20px_35px_rgba(26,17,22,0.08)]"><MapView mode="route" /></div>
          <div className="-mt-4 rounded-[30px] border border-[#f0dfe7] bg-white p-4 shadow-[0_18px_35px_rgba(132,92,120,0.08)]">
            <div className="flex items-center justify-between"><div><p className="text-sm text-[#6b666a]">Ride in progress</p><h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#221d20]">{ride.passenger}</h2></div><span className="rounded-full bg-[#f3edf0] px-2 py-1 text-xs font-medium text-[#a6437a]">ETA 12 min</span></div>
            <div className="mt-3 text-sm text-[#5e575d]">Destination: {ride.destination}</div>
            <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">Calls, chat, cancellation and safety support are not connected in this demo.</p>
            <Button onClick={completeRide} className="mt-4 w-full">Complete Ride</Button>
          </div>
        </div>
      );
    }

    if (currentCaptainStep === "earnings") {
      return (
        <div className="mx-auto min-h-screen max-w-md bg-[#fffafc] px-4 pb-24 pt-8">
          <div className="rounded-[30px] border border-[#f0dfe7] bg-white p-5 shadow-[0_18px_35px_rgba(132,92,120,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#f6dbe9,#d98ca9_28%,#a6437a_85%)] text-3xl shadow-md">₹</div>
            <h2 className="text-[28px] font-bold tracking-[-0.06em] text-[#201d20]">₹{ride.captainEarnings} earned</h2>
            <p className="mt-2 text-sm text-[#655f63]">Demo summary only. No real earnings are recorded.</p>
            <div className="mt-6 rounded-[24px] bg-[#fff7fa] p-4 text-sm text-[#5c5a5d]">
              <div className="flex justify-between"><span>Sample earnings</span><span className="font-semibold text-[#1f1f22]">₹712</span></div>
              <div className="mt-2 flex justify-between"><span>Sample completed rides</span><span className="font-semibold text-[#1f1f22]">9</span></div>
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
        <div className="mb-3 flex items-center justify-between">
          {canGoBack ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back to previous screen"
              className="inline-flex items-center gap-1 rounded-full border border-[#f1dfe8] bg-white px-3 py-2 text-sm font-semibold text-[#5d5a5f] shadow-sm transition hover:bg-[#fff4f8] focus:outline-none focus:ring-2 focus:ring-[#d089aa] focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <span className="w-[68px]" aria-hidden="true" />
          )}
          <div className="inline-flex rounded-full border border-[#f1dfe8] bg-white p-1 shadow-sm">
            <button onClick={() => setRole("passenger")} className={cn("rounded-full px-4 py-2 text-sm font-semibold", role === "passenger" ? "bg-[#a6437a] text-white" : "text-[#5d5a5f]")}>Passenger</button>
            <button onClick={() => setRole("captain")} className={cn("rounded-full px-4 py-2 text-sm font-semibold", role === "captain" ? "bg-[#a6437a] text-white" : "text-[#5d5a5f]")}>Captain / Driver</button>
          </div>
          {loggedInRoles[role] ? (
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="inline-flex items-center gap-1 rounded-full border border-[#f1dfe8] bg-white px-3 py-2 text-sm font-semibold text-[#5d5a5f] shadow-sm transition hover:bg-[#fff4f8] focus:outline-none focus:ring-2 focus:ring-[#d089aa] focus:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          ) : (
            <span className="w-[68px]" aria-hidden="true" />
          )}
        </div>
        <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">
          <strong>Demo preview.</strong> OTP/PIN: 4821. Sample maps and fares only; no real ride dispatch, emergency response, identity checks, or payments.
        </div>
        {role === "passenger" ? renderPassengerFlow() : renderCaptainFlow()}
        <footer className="mx-auto mt-4 flex max-w-md justify-center gap-4 pb-6 text-xs text-[#706b71]">
          <Link href="/legal" className="underline underline-offset-2">Policies (draft)</Link>
          <span>Demo only · Do not use for real trips</span>
        </footer>
      </div>

      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1d1a1f]/50 px-4 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(15,15,18,0.28)]">
            <h3 className="text-[24px] font-bold tracking-[-0.05em] text-[#1f1f22]">Emergency help</h3>
            <p className="mt-2 text-sm leading-6 text-[#655f63]">PinkRide cannot contact emergency services or share your location in this demo. If you are in immediate danger in India, call 112.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setSosOpen(false)}>Cancel</Button>
              <a href="tel:112" onClick={() => setSosOpen(false)} className="inline-flex items-center justify-center rounded-full bg-[#a6437a] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(166,67,122,0.28)]">Call 112</a>
            </div>
          </motion.div>
        </div>
      )}

      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1a1f]/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-[0_20px_50px_rgba(15,15,18,0.28)]"
          >
            <h2 id="logout-title" className="text-xl font-bold text-[#1f1f22]">Log out of PinkRide?</h2>
            <p className="mt-2 text-sm text-[#655f63]">Your account stays saved on this browser. You can sign back in with your phone number.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setLogoutOpen(false)}>Stay logged in</Button>
              <Button onClick={logout}>Log out</Button>
            </div>
          </div>
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
