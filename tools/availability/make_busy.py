"""Calendar free/busy feed for the Book a Demo picker on clinekthealth.com (2026-10-01).

    Outlook "published calendar" link (.ics, availability only)        secret CALENDAR_ICS_URL
              |
              v   every 15 minutes (.github/workflows/availability.yml)
    make_busy.py   expand repeats -> keep busy / tentative / out-of-office -> clip to the bookable hours -> merge
              |
              v
    busy.json on the `availability` branch   {"generated": "...Z", "busy": [["2026-10-02T14:00Z", "2026-10-02T15:00Z"], ...]}
              |
              v   fetched by the picker (pick_js in make_home.py); a slot is offered only if nothing in `busy` overlaps it

Only weekday blocks between 9:00 and 17:00 Central are written, so the feed says nothing about evenings, weekends, or what
a meeting is. If the calendar cannot be read the script exits non-zero and the old feed stays; the picker ignores a feed
older than 36 hours and offers every slot, as it did before the feed existed.

Usage:  CALENDAR_ICS_URL=https://... python make_busy.py out/busy.json        (or: python make_busy.py out.json path/to/file.ics)
"""
import datetime as dt, json, os, sys, urllib.request
from zoneinfo import ZoneInfo
import icalendar, recurring_ical_events

TZ = ZoneInfo('America/Chicago')
UTC = dt.timezone.utc
DAYS = 25                      # the picker shows three weeks from the next business day
OPEN, CLOSE = 9, 17            # bookable hours, Central (the last slot starts 16:30 and runs 30 minutes)
FREE = {'FREE', 'WORKINGELSEWHERE'}

def load():
    if len(sys.argv) > 2: return open(sys.argv[2], 'rb').read()
    url = os.environ.get('CALENDAR_ICS_URL', '').strip()
    if not url: sys.exit('CALENDAR_ICS_URL is not set')
    url = url.replace('webcal://', 'https://')
    if url.endswith('.html'): url = url[:-5] + '.ics'          # Outlook shows an HTML link beside the ICS one; same address
    rq = urllib.request.Request(url, headers={'User-Agent': 'clinekt-availability/1.0'})
    with urllib.request.urlopen(rq, timeout=60) as r: return r.read()

def as_dt(v, end=False):
    """A calendar value as an aware datetime in Central. All-day dates cover the whole Central day."""
    if isinstance(v, dt.datetime):
        return (v if v.tzinfo else v.replace(tzinfo=TZ)).astimezone(TZ)
    return dt.datetime.combine(v, dt.time(0, 0), TZ)

def busy_blocks(raw, now):
    cal = icalendar.Calendar.from_ical(raw)
    start = now.astimezone(TZ).replace(hour=0, minute=0, second=0, microsecond=0)
    stop = start + dt.timedelta(days=DAYS)
    out = []
    for ev in recurring_ical_events.of(cal).between(start, stop):
        if str(ev.get('STATUS', '')).upper() == 'CANCELLED': continue
        if str(ev.get('TRANSP', '')).upper() == 'TRANSPARENT': continue
        state = str(ev.get('X-MICROSOFT-CDO-BUSYSTATUS', '')).upper()
        if state in FREE or (not state and str(ev.get('SUMMARY', '')).strip().upper() in ('FREE', 'WORKING ELSEWHERE')): continue
        a = as_dt(ev['DTSTART'].dt)
        b = as_dt(ev['DTEND'].dt) if ev.get('DTEND') else a + (ev['DURATION'].dt if ev.get('DURATION') else dt.timedelta(days=1 if not isinstance(ev['DTSTART'].dt, dt.datetime) else 0))
        if b <= a: continue
        # clip to each weekday's bookable hours
        day = a.replace(hour=0, minute=0, second=0, microsecond=0)
        while day < b and day < stop:
            if day.weekday() < 5 and day >= start:
                lo = max(a, day.replace(hour=OPEN)); hi = min(b, day.replace(hour=CLOSE))
                if hi > lo: out.append((lo.astimezone(UTC), hi.astimezone(UTC)))
            day = (day + dt.timedelta(days=1)).replace(hour=0)
    out.sort()
    merged = []
    for lo, hi in out:
        if merged and lo <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], hi)
        else: merged.append([lo, hi])
    return merged

if __name__ == '__main__':
    now = dt.datetime.now(UTC)
    blocks = busy_blocks(load(), now)
    fmt = lambda d: d.strftime('%Y-%m-%dT%H:%MZ')
    doc = {'generated': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'hours': 'weekdays 09:00-17:00 America/Chicago', 'busy': [[fmt(a), fmt(b)] for a, b in blocks]}
    os.makedirs(os.path.dirname(os.path.abspath(sys.argv[1])), exist_ok=True)
    json.dump(doc, open(sys.argv[1], 'w', encoding='utf-8'), separators=(',', ':'))
    print(len(blocks), 'busy blocks in the next', DAYS, 'days ->', sys.argv[1])
