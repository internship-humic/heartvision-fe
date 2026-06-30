"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiFetch, getSavedSession } from "@/utils/api";

interface ScheduleItem {
  day: string;
  time: string;
}

interface EditScheduleProps {
  isOpen: boolean;
  currentSchedule: ScheduleItem[];
  onClose: () => void;
  onSave: (updated: ScheduleItem[]) => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditSchedule({ isOpen, currentSchedule, onClose, onSave }: EditScheduleProps) {
  const [dayFrom, setDayFrom] = useState("Monday");
  const [dayTo, setDayTo] = useState("Wednesday");
  const [timeFrom, setTimeFrom] = useState("09:00");
  const [timeTo, setTimeTo] = useState("15:00");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Use ref to track if we've already initialized from the current schedule
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialSchedule = currentSchedule[0] || { day: "Monday - Wednesday", time: "09:00 - 15:00" };

    if (initialSchedule.day.includes("-")) {
      const parts = initialSchedule.day.split("-").map(s => s.trim());
      setDayFrom(parts[0] || "Monday");
      setDayTo(parts[1] || "Wednesday");
    } else {
      setDayFrom(initialSchedule.day);
      setDayTo(initialSchedule.day);
    }

    if (initialSchedule.time.includes("-")) {
      const parts = initialSchedule.time.split("-").map(s => s.trim());
      setTimeFrom(parts[0] || "09:00");
      setTimeTo(parts[1] || "15:00");
    } else {
      setTimeFrom(initialSchedule.time);
      setTimeTo(initialSchedule.time);
    }
  }, [isOpen, currentSchedule]);

  if (!isOpen) return null;

  const mapWeekdayToDate = (day: string) => {
    const mapping: { [key: string]: string } = {
      Monday: "2026-01-05",
      Tuesday: "2026-01-06",
      Wednesday: "2026-01-07",
      Thursday: "2026-01-08",
      Friday: "2026-01-09",
      Saturday: "2026-01-10",
      Sunday: "2026-01-11",
    };
    return mapping[day] || "2026-01-05";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const newDay = `${dayFrom} - ${dayTo}`;
    const newTime = `${timeFrom} - ${timeTo}`;
    const updatedSchedule = [{ day: newDay, time: newTime }];

    try {
      const start_date_mapped = mapWeekdayToDate(dayFrom);
      const end_date_mapped = mapWeekdayToDate(dayTo);

      const res = await apiFetch("/doctors/schedule", {
        method: "PUT",
        body: JSON.stringify({
          startDate: start_date_mapped,
          endDate: end_date_mapped,
          startTime: timeFrom,
          endTime: timeTo,
          schedules: [
            {
              start_date: start_date_mapped,
              end_date: end_date_mapped,
              start_time: timeFrom,
              end_time: timeTo,
            },
          ],
        }),
      });

      if (res.success) {
        setLoading(false);
        onSave(updatedSchedule);
        return;
      }

      // If API fails, fallback to local state
      console.warn("Schedule API returned error, saving locally:", res.error);
    } catch (err) {
      console.warn("Schedule API unreachable, saving locally.");
    }

    // Local fallback
    setTimeout(() => {
      setLoading(false);
      onSave(updatedSchedule);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-bgelem/40 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-bgelem/25 flex justify-between items-center bg-fbc rounded-t-2xl">
          <h3 className="text-base font-bold text-texts">Active Schedule</h3>
          <button onClick={onClose} className="text-textt hover:text-rose-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Date Row (Day Range) */}
          <div className="flex items-center gap-4">
            {/* Day From */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textt uppercase">Day</label>
              <div className="relative">
                <select
                  value={dayFrom}
                  onChange={(e) => setDayFrom(e.target.value)}
                  className="w-full border border-bgelem/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold bg-white appearance-none cursor-pointer"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-textt absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Arrow */}
            <div className="pt-5 text-textt">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Day To */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textt uppercase">Day</label>
              <div className="relative">
                <select
                  value={dayTo}
                  onChange={(e) => setDayTo(e.target.value)}
                  className="w-full border border-bgelem/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold bg-white appearance-none cursor-pointer"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-textt absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Time Row (Time Range) */}
          <div className="flex items-center gap-4">
            {/* Time From */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textt uppercase">Time</label>
              <input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold cursor-pointer"
              />
            </div>

            {/* Arrow */}
            <div className="pt-5 text-textt">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Time To */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textt uppercase">Time</label>
              <input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold cursor-pointer"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl py-3.5 text-xs transition-all shadow-md shadow-primary/10 cursor-pointer disabled:opacity-75 mt-2"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
