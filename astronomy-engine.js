/**
 * ASTRONOMY ENGINE
 * High-accuracy astronomical calculations for solar positions, sunrise/sunset,
 * twilight phases, lunar age & phases, and NASA eclipse detection.
 * 
 * Based on NOAA Solar Calculations (Jean Meeus algorithm) & USNO astronomical models.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.AstronomyEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ----------------------------------------------------------------------
    // 1. Math Utilities
    // ----------------------------------------------------------------------
    const RAD = Math.PI / 180;
    const DEG = 180 / Math.PI;

    function sinD(d) { return Math.sin(d * RAD); }
    function cosD(d) { return Math.cos(d * RAD); }
    function tanD(d) { return Math.tan(d * RAD); }
    function asinD(x) { return Math.asin(x) * DEG; }
    function acosD(x) { return Math.acos(Math.max(-1, Math.min(1, x))) * DEG; }
    function atan2D(y, x) { return Math.atan2(y, x) * DEG; }

    function normalizeAngle(a) {
        let b = a % 360;
        if (b < 0) b += 360;
        return b;
    }

    // ----------------------------------------------------------------------
    // 2. Julian Date Calculations
    // ----------------------------------------------------------------------
    function toJulianDate(date) {
        return (date.getTime() / 86400000) + 2440587.5;
    }

    function julianCentury(jd) {
        return (jd - 2451545.0) / 36525.0;
    }

    // ----------------------------------------------------------------------
    // 3. NOAA Solar Calculations (Jean Meeus Astronomical Formulae)
    // ----------------------------------------------------------------------
    function calculateSolarCoordinates(date, lat, lng) {
        const jd = toJulianDate(date);
        const t = julianCentury(jd);

        // Geom Mean Longitude of Sun (deg)
        const l0 = normalizeAngle(280.46646 + t * (36000.76983 + t * 0.0003032));

        // Geom Mean Anomaly of Sun (deg)
        const m = 357.52911 + t * (35999.05029 - 0.0001537 * t);

        // Eccentricity of Earth's orbit
        const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

        // Sun Equation of Center (deg)
        const c = sinD(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
                  sinD(2 * m) * (0.019993 - 0.000101 * t) +
                  sinD(3 * m) * 0.000289;

        // Sun True Longitude (deg)
        const o = l0 + c;

        // Sun Apparent Longitude (deg)
        const lambda = o - 0.00569 - 0.00478 * sinD(125.04 - 1934.136 * t);

        // Mean Obliquity of the Ecliptic (deg)
        const eps0 = 23 + (26 + ((21.448 - t * (46.815 + t * (0.00059 - t * 0.001813)))) / 60) / 60;
        const eps = eps0 + 0.00256 * cosD(125.04 - 1934.136 * t);

        // Solar Declination (deg)
        const declination = asinD(sinD(eps) * sinD(lambda));

        // Equation of Time (minutes)
        const y = tanD(eps / 2) * tanD(eps / 2);
        const eqTime = 4 * DEG * (
            y * sinD(2 * l0) -
            2 * e * sinD(m) +
            4 * e * y * sinD(m) * cosD(2 * l0) -
            0.5 * y * y * sinD(4 * l0) -
            1.25 * e * e * sinD(2 * m)
        );

        // Solar Noon in UTC minutes from midnight
        const solarNoonUTC = 720 - 4 * lng - eqTime;

        // Current True Solar Time at location
        const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
        const trueSolarTime = normalizeAngle((utcMinutes + 4 * lng + eqTime) / 4) * 4; // minutes (0..1440)

        // Solar Hour Angle (deg)
        let hourAngle = trueSolarTime / 4 - 180;
        if (hourAngle < -180) hourAngle += 360;

        // Solar Zenith & Elevation Angle (deg)
        const cosZenith = sinD(lat) * sinD(declination) + cosD(lat) * cosD(declination) * cosD(hourAngle);
        const zenith = acosD(cosZenith);
        const elevation = 90 - zenith;

        // Solar Azimuth Angle (deg clockwise from North)
        const cosAzimuth = (sinD(declination) - sinD(lat) * cosZenith) / (cosD(lat) * sinD(zenith));
        let azimuth = acosD(cosAzimuth);
        if (hourAngle > 0) {
            azimuth = 360 - azimuth;
        }

        return {
            jd,
            declination,
            eqTime,
            solarNoonUTC,
            trueSolarTime,
            elevation,
            zenith,
            azimuth
        };
    }

    /**
     * Compute sunrise, sunset, dawn, dusk for given zenith threshold
     */
    function computeSunEvent(date, lat, lng, zenithAngle) {
        const jd = toJulianDate(date);
        const t = julianCentury(jd);
        const l0 = normalizeAngle(280.46646 + t * (36000.76983 + t * 0.0003032));
        const m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
        const c = sinD(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
                  sinD(2 * m) * (0.019993 - 0.000101 * t) +
                  sinD(3 * m) * 0.000289;
        const lambda = l0 + c - 0.00569 - 0.00478 * sinD(125.04 - 1934.136 * t);
        const eps0 = 23 + (26 + ((21.448 - t * (46.815 + t * (0.00059 - t * 0.001813)))) / 60) / 60;
        const eps = eps0 + 0.00256 * cosD(125.04 - 1934.136 * t);
        const declination = asinD(sinD(eps) * sinD(lambda));

        const y = tanD(eps / 2) * tanD(eps / 2);
        const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
        const eqTime = 4 * DEG * (
            y * sinD(2 * l0) -
            2 * e * sinD(m) +
            4 * e * y * sinD(m) * cosD(2 * l0) -
            0.5 * y * y * sinD(4 * l0) -
            1.25 * e * e * sinD(2 * m)
        );

        const solarNoonUTC = 720 - 4 * lng - eqTime;

        // Hour angle equation
        const cosHA = (cosD(zenithAngle) - sinD(lat) * sinD(declination)) / (cosD(lat) * cosD(declination));

        // Check polar conditions
        if (cosHA > 1) {
            return { polarNight: true, polarDay: false, riseUTC: null, setUTC: null };
        }
        if (cosHA < -1) {
            return { polarNight: false, polarDay: true, riseUTC: null, setUTC: null };
        }

        const ha = acosD(cosHA);
        const riseUTC = solarNoonUTC - ha * 4;
        const setUTC = solarNoonUTC + ha * 4;

        return {
            polarNight: false,
            polarDay: false,
            riseUTC,
            setUTC
        };
    }

    /**
     * Get complete daily solar schedule: Dawn, Sunrise, Solar Noon, Sunset, Dusk, Night
     */
    function getDailySolarSchedule(date, lat, lng) {
        // Standard geometric sunrise/sunset with atmospheric refraction (zenith 90.833 deg)
        const sun = computeSunEvent(date, lat, lng, 90.833);
        // Civil twilight: sun center 6 deg below horizon (zenith 96 deg)
        const civil = computeSunEvent(date, lat, lng, 96.0);
        // Nautical twilight: 12 deg below horizon (zenith 102 deg)
        const nautical = computeSunEvent(date, lat, lng, 102.0);
        // Astronomical twilight: 18 deg below horizon (zenith 108 deg)
        const astronomical = computeSunEvent(date, lat, lng, 108.0);

        const coords = calculateSolarCoordinates(date, lat, lng);

        function utcToDate(minutesUTC) {
            if (minutesUTC === null || isNaN(minutesUTC)) return null;
            const d = new Date(date);
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCMinutes(Math.round(minutesUTC));
            return d;
        }

        return {
            date,
            lat,
            lng,
            elevation: coords.elevation,
            azimuth: coords.azimuth,
            solarNoon: utcToDate(coords.solarNoonUTC),
            sunrise: utcToDate(sun.riseUTC),
            sunset: utcToDate(sun.setUTC),
            civilDawn: utcToDate(civil.riseUTC),
            civilDusk: utcToDate(civil.setUTC),
            nauticalDawn: utcToDate(nautical.riseUTC),
            nauticalDusk: utcToDate(nautical.setUTC),
            astronomicalDawn: utcToDate(astronomical.riseUTC),
            astronomicalDusk: utcToDate(astronomical.setUTC),
            isPolarDay: sun.polarDay,
            isPolarNight: sun.polarNight
        };
    }

    /**
     * Determine current Day/Night astronomical phase state machine
     */
    function getDayNightPhase(date, lat, lng) {
        const schedule = getDailySolarSchedule(date, lat, lng);
        const elev = schedule.elevation;

        if (schedule.isPolarDay) return { phase: 'DAY', label: 'Midnight Sun / Polar Day', isDaytime: true, schedule };
        if (schedule.isPolarNight) return { phase: 'NIGHT', label: 'Polar Night', isDaytime: false, schedule };

        let phase = 'NIGHT';
        let label = 'Night';
        let isDaytime = false;

        if (elev > 0) {
            if (elev < 5) {
                // Sun just above horizon
                const isMorning = (date < (schedule.solarNoon || date));
                phase = isMorning ? 'SUNRISE' : 'SUNSET';
                label = isMorning ? 'Golden Sunrise' : 'Golden Sunset';
                isDaytime = true;
            } else if (elev > 45 || Math.abs(date.getTime() - (schedule.solarNoon ? schedule.solarNoon.getTime() : 0)) < 3600000) {
                phase = 'SOLAR_NOON';
                label = 'Solar Midday';
                isDaytime = true;
            } else {
                phase = 'DAY';
                label = 'Daylight';
                isDaytime = true;
            }
        } else if (elev >= -6) {
            const isMorning = (date < (schedule.solarNoon || date));
            phase = isMorning ? 'CIVIL_DAWN' : 'CIVIL_DUSK';
            label = isMorning ? 'Civil Dawn' : 'Civil Dusk';
            isDaytime = isMorning; // Transitioning to day
        } else if (elev >= -12) {
            const isMorning = (date < (schedule.solarNoon || date));
            phase = isMorning ? 'NAUTICAL_DAWN' : 'NAUTICAL_DUSK';
            label = isMorning ? 'Nautical Dawn' : 'Nautical Dusk';
            isDaytime = false;
        } else if (elev >= -18) {
            phase = 'TWILIGHT';
            label = 'Astronomical Twilight';
            isDaytime = false;
        } else {
            phase = 'NIGHT';
            label = 'Night';
            isDaytime = false;
        }

        return {
            phase,
            label,
            isDaytime,
            elevation: elev,
            azimuth: schedule.azimuth,
            schedule
        };
    }

    // ----------------------------------------------------------------------
    // 4. Lunar Calculations (Meeus Synodic Month Engine)
    // ----------------------------------------------------------------------
    const SYNODIC_MONTH = 29.530588853; // days
    const KNOWN_NEW_MOON_JD = 2451549.5; // Jan 6, 2000 18:14 UTC

    function getLunarProfile(date) {
        const jd = toJulianDate(date);
        const daysSinceNew = (jd - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH;
        const age = daysSinceNew < 0 ? daysSinceNew + SYNODIC_MONTH : daysSinceNew;

        // Phase progress (0.0 to 1.0)
        const phaseProgress = age / SYNODIC_MONTH;

        // Phase angle in radians
        const phaseAngle = phaseProgress * 2 * Math.PI;

        // Illuminated fraction (0.0 to 1.0)
        const illumination = (1 - Math.cos(phaseAngle)) / 2;

        let phaseName = 'New Moon';
        let phaseCode = 'new_moon';

        if (age < 1.845) {
            phaseName = 'New Moon';
            phaseCode = 'new_moon';
        } else if (age < 5.536) {
            phaseName = 'Waxing Crescent';
            phaseCode = 'waxing_crescent';
        } else if (age < 9.228) {
            phaseName = 'First Quarter';
            phaseCode = 'first_quarter';
        } else if (age < 12.919) {
            phaseName = 'Waxing Gibbous';
            phaseCode = 'waxing_gibbous';
        } else if (age < 16.610) {
            phaseName = 'Full Moon';
            phaseCode = 'full_moon';
        } else if (age < 20.302) {
            phaseName = 'Waning Gibbous';
            phaseCode = 'waning_gibbous';
        } else if (age < 23.993) {
            phaseName = 'Third / Last Quarter';
            phaseCode = 'last_quarter';
        } else if (age < 27.684) {
            phaseName = 'Waning Crescent';
            phaseCode = 'waning_crescent';
        } else {
            phaseName = 'New Moon';
            phaseCode = 'new_moon';
        }

        return {
            ageDays: Math.round(age * 10) / 10,
            phaseProgress,
            phaseName,
            phaseCode,
            illuminationPercent: Math.round(illumination * 100)
        };
    }

    // ----------------------------------------------------------------------
    // 5. NASA Eclipse Catalog & Location Visibility Engine (2024 - 2028)
    // ----------------------------------------------------------------------
    const NASA_ECLIPSE_CATALOG = [
        {
            type: 'TOTAL_SOLAR',
            category: 'Solar',
            title: 'Great North American Total Solar Eclipse',
            startUTC: '2024-04-08T15:42:00Z',
            maxUTC: '2024-04-08T18:17:00Z',
            endUTC: '2024-04-08T20:52:00Z',
            bounds: { minLat: 15, maxLat: 65, minLng: -130, maxLng: -50 } // North America
        },
        {
            type: 'PARTIAL_LUNAR',
            category: 'Lunar',
            title: 'Harvest Supermoon Partial Lunar Eclipse',
            startUTC: '2024-09-18T01:41:00Z',
            maxUTC: '2024-09-18T02:44:00Z',
            endUTC: '2024-09-18T03:47:00Z',
            bounds: { minLat: -60, maxLat: 75, minLng: -120, maxLng: 60 } // Americas, Europe, Africa
        },
        {
            type: 'ANNULAR_SOLAR',
            category: 'Solar',
            title: 'Ring of Fire Annular Solar Eclipse',
            startUTC: '2024-10-02T16:54:00Z',
            maxUTC: '2024-10-02T18:45:00Z',
            endUTC: '2024-10-02T20:36:00Z',
            bounds: { minLat: -60, maxLat: 10, minLng: -150, maxLng: -60 } // South America, Pacific
        },
        {
            type: 'TOTAL_LUNAR',
            category: 'Lunar',
            title: 'Total Lunar Blood Moon Eclipse',
            startUTC: '2025-03-14T05:09:00Z',
            maxUTC: '2025-03-14T06:58:00Z',
            endUTC: '2025-03-14T08:48:00Z',
            bounds: { minLat: -55, maxLat: 75, minLng: -170, maxLng: 30 } // Americas, Pacific, Europe
        },
        {
            type: 'PARTIAL_SOLAR',
            category: 'Solar',
            title: 'High Latitude Partial Solar Eclipse',
            startUTC: '2025-03-29T08:50:00Z',
            maxUTC: '2025-03-29T10:48:00Z',
            endUTC: '2025-03-29T12:43:00Z',
            bounds: { minLat: 40, maxLat: 85, minLng: -80, maxLng: 50 } // North America, Europe, Arctic
        },
        {
            type: 'TOTAL_LUNAR',
            category: 'Lunar',
            title: 'Total Lunar Blood Moon Eclipse',
            startUTC: '2025-09-07T16:27:00Z',
            maxUTC: '2025-09-07T18:11:00Z',
            endUTC: '2025-09-07T19:56:00Z',
            bounds: { minLat: -50, maxLat: 75, minLng: 20, maxLng: 180 } // Asia, India, Australia, Europe
        },
        {
            type: 'ANNULAR_SOLAR',
            category: 'Solar',
            title: 'Antarctic Annular Solar Eclipse',
            startUTC: '2026-02-17T10:14:00Z',
            maxUTC: '2026-02-17T12:12:00Z',
            endUTC: '2026-02-17T14:11:00Z',
            bounds: { minLat: -80, maxLat: -20, minLng: -50, maxLng: 80 } // Southern Oceans, Antarctica
        },
        {
            type: 'TOTAL_LUNAR',
            category: 'Lunar',
            title: 'Total Lunar Eclipse',
            startUTC: '2026-03-03T09:50:00Z',
            maxUTC: '2026-03-03T11:34:00Z',
            endUTC: '2026-03-03T13:17:00Z',
            bounds: { minLat: -50, maxLat: 70, minLng: 60, maxLng: -110 } // Asia, India, Pacific, Americas
        },
        {
            type: 'TOTAL_SOLAR',
            category: 'Solar',
            title: 'Major European / Arctic Total Solar Eclipse',
            startUTC: '2026-08-12T15:40:00Z',
            maxUTC: '2026-08-12T17:46:00Z',
            endUTC: '2026-08-12T19:51:00Z',
            bounds: { minLat: 35, maxLat: 80, minLng: -75, maxLng: 30 } // Greenland, Iceland, Spain, Europe
        },
        {
            type: 'PARTIAL_LUNAR',
            category: 'Lunar',
            title: 'Late Summer Partial Lunar Eclipse',
            startUTC: '2026-08-28T02:52:00Z',
            maxUTC: '2026-08-28T04:13:00Z',
            endUTC: '2026-08-28T05:34:00Z',
            bounds: { minLat: -60, maxLat: 75, minLng: -140, maxLng: 40 } // Americas, Europe, Africa
        },
        {
            type: 'ANNULAR_SOLAR',
            category: 'Solar',
            title: 'Southern Annular Solar Eclipse',
            startUTC: '2027-02-06T14:01:00Z',
            maxUTC: '2027-02-06T16:00:00Z',
            endUTC: '2027-02-06T17:59:00Z',
            bounds: { minLat: -70, maxLat: 10, minLng: -90, maxLng: 30 } // South America, Atlantic, Africa
        },
        {
            type: 'TOTAL_SOLAR',
            category: 'Solar',
            title: 'Great Mediterranean & North African Total Solar Eclipse',
            startUTC: '2027-08-02T08:23:00Z',
            maxUTC: '2027-08-02T10:07:00Z',
            endUTC: '2027-08-02T11:51:00Z',
            bounds: { minLat: -10, maxLat: 50, minLng: -20, maxLng: 90 } // Spain, North Africa, Egypt, Arabia, India
        }
    ];

    /**
     * Check if a solar or lunar eclipse is active or upcoming for a given date & location
     */
    function checkEclipseStatus(date, lat, lng) {
        const timeMS = date.getTime();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        let activeEclipse = null;
        let upcomingEclipse = null;

        for (const ec of NASA_ECLIPSE_CATALOG) {
            const startMS = new Date(ec.startUTC).getTime();
            const maxMS = new Date(ec.maxUTC).getTime();
            const endMS = new Date(ec.endUTC).getTime();

            // Check geographic visibility bound
            let isLocallyVisible = true;
            if (lat !== undefined && lng !== undefined) {
                const b = ec.bounds;
                if (b) {
                    const latOk = (lat >= b.minLat && lat <= b.maxLat);
                    let lngOk = false;
                    if (b.minLng <= b.maxLng) {
                        lngOk = (lng >= b.minLng && lng <= b.maxLng);
                    } else {
                        // Wraps around date line
                        lngOk = (lng >= b.minLng || lng <= b.maxLng);
                    }
                    isLocallyVisible = latOk && lngOk;
                }
            }

            // 1. Is it currently happening?
            if (timeMS >= startMS && timeMS <= endMS) {
                activeEclipse = {
                    ...ec,
                    isLocallyVisible,
                    progress: Math.min(1, Math.max(0, (timeMS - startMS) / (endMS - startMS))),
                    isMaxNearby: Math.abs(timeMS - maxMS) < 15 * 60 * 1000
                };
                break;
            }

            // 2. Is it approaching in the next 36 hours?
            if (timeMS < startMS && (startMS - timeMS) < (1.5 * ONE_DAY_MS)) {
                if (!upcomingEclipse || startMS < new Date(upcomingEclipse.startUTC).getTime()) {
                    upcomingEclipse = {
                        ...ec,
                        isLocallyVisible,
                        hoursUntilStart: Math.round((startMS - timeMS) / (3600 * 1000))
                    };
                }
            }
        }

        return {
            activeEclipse,
            upcomingEclipse,
            hasActiveEclipse: !!activeEclipse,
            hasUpcomingEclipse: !!upcomingEclipse
        };
    }

    // ----------------------------------------------------------------------
    // 6. IANA Timezone to Global Metropolitan Geographic Coordinates
    // ----------------------------------------------------------------------
    const IANA_COORDINATE_DATABASE = {
        // India & South Asia
        'Asia/Kolkata': { lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India' },
        'Asia/Calcutta': { lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India' },
        'Asia/Colombo': { lat: 6.9271, lng: 79.8612, city: 'Colombo', country: 'Sri Lanka' },
        'Asia/Dhaka': { lat: 23.8103, lng: 90.4125, city: 'Dhaka', country: 'Bangladesh' },
        'Asia/Karachi': { lat: 24.8607, lng: 67.0011, city: 'Karachi', country: 'Pakistan' },
        'Asia/Kathmandu': { lat: 27.7172, lng: 85.3240, city: 'Kathmandu', country: 'Nepal' },

        // North America
        'America/New_York': { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
        'America/Chicago': { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA' },
        'America/Denver': { lat: 39.7392, lng: -104.9903, city: 'Denver', country: 'USA' },
        'America/Los_Angeles': { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
        'America/Phoenix': { lat: 33.4484, lng: -112.0740, city: 'Phoenix', country: 'USA' },
        'America/Anchorage': { lat: 61.2181, lng: -149.9003, city: 'Anchorage', country: 'USA' },
        'America/Honolulu': { lat: 21.3069, lng: -157.8583, city: 'Honolulu', country: 'USA' },
        'America/Toronto': { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' },
        'America/Vancouver': { lat: 49.2827, lng: -123.1207, city: 'Vancouver', country: 'Canada' },
        'America/Mexico_City': { lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico' },

        // Europe
        'Europe/London': { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
        'Europe/Paris': { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
        'Europe/Berlin': { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' },
        'Europe/Amsterdam': { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' },
        'Europe/Madrid': { lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Spain' },
        'Europe/Rome': { lat: 41.9028, lng: 12.4964, city: 'Rome', country: 'Italy' },
        'Europe/Zurich': { lat: 47.3769, lng: 8.5417, city: 'Zurich', country: 'Switzerland' },
        'Europe/Stockholm': { lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden' },
        'Europe/Oslo': { lat: 59.9139, lng: 10.7522, city: 'Oslo', country: 'Norway' },
        'Europe/Helsinki': { lat: 60.1699, lng: 24.9384, city: 'Helsinki', country: 'Finland' },
        'Atlantic/Reykjavik': { lat: 64.1466, lng: -21.9426, city: 'Reykjavik', country: 'Iceland' },

        // Middle East & Africa
        'Asia/Dubai': { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
        'Asia/Riyadh': { lat: 24.7136, lng: 46.6753, city: 'Riyadh', country: 'Saudi Arabia' },
        'Africa/Cairo': { lat: 30.0444, lng: 31.2357, city: 'Cairo', country: 'Egypt' },
        'Africa/Johannesburg': { lat: -26.2041, lng: 28.0473, city: 'Johannesburg', country: 'South Africa' },
        'Africa/Lagos': { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria' },
        'Africa/Nairobi': { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },

        // Asia Pacific
        'Asia/Singapore': { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
        'Asia/Tokyo': { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
        'Asia/Seoul': { lat: 37.5665, lng: 126.9780, city: 'Seoul', country: 'South Korea' },
        'Asia/Hong_Kong': { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'China' },
        'Asia/Shanghai': { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China' },
        'Asia/Bangkok': { lat: 13.7563, lng: 100.5018, city: 'Bangkok', country: 'Thailand' },
        'Asia/Jakarta': { lat: -6.2088, lng: 106.8456, city: 'Jakarta', country: 'Indonesia' },
        'Australia/Sydney': { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
        'Australia/Melbourne': { lat: -37.8136, lng: 144.9631, city: 'Melbourne', country: 'Australia' },
        'Pacific/Auckland': { lat: -36.8485, lng: 174.7633, city: 'Auckland', country: 'New Zealand' },

        // South America
        'America/Sao_Paulo': { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' },
        'America/Buenos_Aires': { lat: -34.6037, lng: -58.3816, city: 'Buenos Aires', country: 'Argentina' },
        'America/Santiago': { lat: -33.4489, lng: -70.6693, city: 'Santiago', country: 'Chile' },
        'America/Bogota': { lat: 4.7110, lng: -74.0721, city: 'Bogota', country: 'Colombia' }
    };

    /**
     * Resolve geographical position from Timezone or Fallback
     */
    function resolveLocationFromTimezone(timeZone) {
        if (timeZone && IANA_COORDINATE_DATABASE[timeZone]) {
            return {
                ...IANA_COORDINATE_DATABASE[timeZone],
                timeZone,
                source: 'IANA_DATABASE'
            };
        }

        // Generic fallback parsing: e.g. "Europe/Athens" -> city "Athens"
        if (timeZone && timeZone.includes('/')) {
            const parts = timeZone.split('/');
            const city = parts[1].replace(/_/g, ' ');
            return {
                lat: 25.0,
                lng: 50.0,
                city: city.charAt(0).toUpperCase() + city.slice(1),
                country: parts[0],
                timeZone,
                source: 'IANA_HEURISTIC'
            };
        }

        // Default to Mumbai / India
        return {
            lat: 19.0760,
            lng: 72.8777,
            city: 'Mumbai',
            country: 'India',
            timeZone: 'Asia/Kolkata',
            source: 'FALLBACK_DEFAULT'
        };
    }

    // ----------------------------------------------------------------------
    // 7. Complete Integrated Astronomical Context Resolver
    // ----------------------------------------------------------------------
    async function resolveAstronomicalEnvironment(customDate = null, customLocation = null) {
        let timeZone = 'UTC';
        try {
            timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        } catch (_) {}

        let location = customLocation || resolveLocationFromTimezone(timeZone);

        // Attempt browser Geolocation if allowed
        if (!customLocation && typeof navigator !== 'undefined' && navigator.geolocation) {
            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 1200,
                        maximumAge: 600000
                    });
                });
                if (pos && pos.coords) {
                    location = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        city: location.city || 'Local Location',
                        country: location.country || '',
                        timeZone,
                        source: 'BROWSER_GPS'
                    };
                }
            } catch (_) {
                // Denied or timeout: silently fall back to IANA location without blocking
            }
        }

        const date = customDate || new Date();
        const solar = getDayNightPhase(date, location.lat, location.lng);
        const lunar = getLunarProfile(date);
        const eclipse = checkEclipseStatus(date, location.lat, location.lng);

        return {
            timestamp: date,
            location,
            timeZone: location.timeZone,
            solar,
            lunar,
            eclipse,
            isDaytime: solar.isDaytime,
            recommendedTheme: solar.isDaytime ? 'light' : 'dark'
        };
    }

    // Public API
    return {
        calculateSolarCoordinates,
        getDailySolarSchedule,
        getDayNightPhase,
        getLunarProfile,
        checkEclipseStatus,
        resolveLocationFromTimezone,
        resolveAstronomicalEnvironment,
        IANA_COORDINATE_DATABASE,
        NASA_ECLIPSE_CATALOG
    };
}));
