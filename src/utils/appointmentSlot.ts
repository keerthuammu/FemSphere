// Appointment Slot Helper: validates whether current time is within the appointment window

export interface SlotValidationResult {
  isActive: boolean;
  reason?: string;
  isToday: boolean;
  minutesUntil?: number;
}

export function isAppointmentSlotActive(appointmentDate?: string, appointmentTime?: string): SlotValidationResult {
  if (!appointmentDate) {
    return { isActive: false, isToday: false, reason: 'Appointment date is missing.' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const aptDateClean = appointmentDate.includes('T') ? appointmentDate.split('T')[0] : appointmentDate;

  const isToday = todayStr === aptDateClean;

  if (!isToday) {
    return {
      isActive: false,
      isToday: false,
      reason: `Video call is strictly restricted to your scheduled appointment date (${aptDateClean}). Today is ${todayStr}.`
    };
  }

  if (!appointmentTime || appointmentTime.toLowerCase() === 'live') {
    return { isActive: true, isToday: true };
  }

  // Parse time e.g. "10:00 AM" or "02:30 PM"
  const match = appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) {
    return { isActive: true, isToday: true };
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = hours * 60 + minutes;

  // Window: 15 minutes before to 60 minutes after start
  const startWindow = slotMinutes - 15;
  const endWindow = slotMinutes + 60;

  if (currentMinutes < startWindow) {
    const diff = startWindow - currentMinutes;
    return {
      isActive: false,
      isToday: true,
      minutesUntil: diff,
      reason: `It is too early for this appointment slot (${appointmentTime}). The call room opens 15 minutes before the scheduled time (in ~${diff} mins).`
    };
  }

  if (currentMinutes > endWindow) {
    return {
      isActive: false,
      isToday: true,
      reason: `This appointment slot (${appointmentTime}) has ended.`
    };
  }

  return { isActive: true, isToday: true };
}
