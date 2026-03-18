export async function zipToCoords(zipCode) {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      lat: parseFloat(data.places[0].latitude),
      lon: parseFloat(data.places[0].longitude),
      city: data.places[0]["place name"],
      state: data.places[0]["state abbreviation"],
    };
  } catch { return null; }
}

export async function getAirQuality(lat, lon) {
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto`
    );
    const data = await res.json();
    const c = data.current;
    return {
      aqi: c.us_aqi || 0,
      category: getAqiCategory(c.us_aqi || 0),
      color: getAqiColor(c.us_aqi || 0),
      pollutants: { pm25: c.pm2_5 || 0, pm10: c.pm10 || 0, no2: c.nitrogen_dioxide || 0, o3: c.ozone || 0 },
    };
  } catch { return { aqi: 0, category: "Unavailable", color: "#999", pollutants: {} }; }
}

export async function getWeatherData(lat, lon) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,uv_index&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`
    );
    const data = await res.json();
    return {
      currentTemp: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      uvIndex: data.current.uv_index,
      heatRisk: calcHeatRisk(data.current.apparent_temperature),
      floodRisk: calcFloodRisk(data.daily),
      windRisk: calcWindRisk(data.daily),
      forecast: data.daily.time.map((date, i) => ({
        date, high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        rain: data.daily.precipitation_probability_max[i],
      })),
    };
  } catch { return null; }
}

export async function getHistoricalTemp(lat, lon) {
  try {
    const yr = new Date().getFullYear();
    const res = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${yr - 10}-01-01&end_date=${yr - 1}-12-31&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`
    );
    const data = await res.json();
    if (!data.daily) return null;
    const yearly = {};
    data.daily.time.forEach((d, i) => {
      const y = d.slice(0, 4);
      if (!yearly[y]) yearly[y] = { sum: 0, count: 0 };
      yearly[y].sum += ((data.daily.temperature_2m_max[i] || 0) + (data.daily.temperature_2m_min[i] || 0)) / 2;
      yearly[y].count++;
    });
    const results = Object.entries(yearly).map(([year, v]) => ({
      year: +year, avg: Math.round((v.sum / v.count) * 10) / 10,
    })).sort((a, b) => a.year - b.year);
    const trend = results.length >= 2
      ? Math.round((results[results.length - 1].avg - results[0].avg) * 10) / 10
      : 0;
    return { yearly: results, trend };
  } catch { return null; }
}

export async function getHistoricalAQ(lat, lon) {
  try {
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10);
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=us_aqi&timezone=auto`
    );
    const data = await res.json();
    if (!data.hourly) return null;
    const monthly = {};
    data.hourly.time.forEach((t, i) => {
      const m = t.slice(0, 7);
      if (!monthly[m]) monthly[m] = { sum: 0, count: 0 };
      if (data.hourly.us_aqi[i] != null) { monthly[m].sum += data.hourly.us_aqi[i]; monthly[m].count++; }
    });
    return Object.entries(monthly).map(([month, v]) => ({
      month, avg: Math.round(v.sum / v.count),
    })).sort((a, b) => a.month.localeCompare(b.month));
  } catch { return null; }
}

export function calcOverallScore(aqi, weather) {
  let score = 0;
  score += Math.min((aqi.aqi / 300) * 30, 30);
  score += ((weather?.heatRisk?.score || 1) / 5) * 25;
  score += ((weather?.floodRisk?.score || 1) / 5) * 20;
  score += 12.5; // baseline EJ estimate
  score = Math.round(Math.min(score, 100));
  const { grade, color, desc } = gradeFromScore(score);
  return { score, grade, color, desc };
}

function gradeFromScore(s) {
  if (s <= 25) return { grade: "A", color: "#00E400", desc: "Low climate vulnerability" };
  if (s <= 45) return { grade: "B", color: "#92D050", desc: "Below average vulnerability" };
  if (s <= 60) return { grade: "C", color: "#FFFF00", desc: "Moderate climate vulnerability" };
  if (s <= 80) return { grade: "D", color: "#FF7E00", desc: "High climate vulnerability" };
  return { grade: "F", color: "#FF0000", desc: "Severe climate vulnerability" };
}

function getAqiCategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getAqiColor(aqi) {
  if (aqi <= 50) return "#00E400";
  if (aqi <= 100) return "#FFFF00";
  if (aqi <= 150) return "#FF7E00";
  if (aqi <= 200) return "#FF0000";
  if (aqi <= 300) return "#8F3F97";
  return "#7E0023";
}

function calcHeatRisk(feelsLike) {
  if (feelsLike >= 105) return { level: "Extreme", score: 5, color: "#7E0023" };
  if (feelsLike >= 95) return { level: "High", score: 4, color: "#FF0000" };
  if (feelsLike >= 85) return { level: "Moderate", score: 3, color: "#FF7E00" };
  if (feelsLike >= 75) return { level: "Low", score: 2, color: "#FFFF00" };
  return { level: "Minimal", score: 1, color: "#00E400" };
}

function calcFloodRisk(daily) {
  const maxP = Math.max(...daily.precipitation_sum);
  const maxProb = Math.max(...daily.precipitation_probability_max);
  if (maxP > 50 || maxProb > 90) return { level: "High", score: 4, color: "#FF0000" };
  if (maxP > 25 || maxProb > 70) return { level: "Moderate", score: 3, color: "#FF7E00" };
  if (maxP > 10 || maxProb > 40) return { level: "Low", score: 2, color: "#FFFF00" };
  return { level: "Minimal", score: 1, color: "#00E400" };
}

function calcWindRisk(daily) {
  const maxW = Math.max(...daily.wind_speed_10m_max);
  if (maxW > 90) return { level: "Extreme", score: 5, color: "#7E0023" };
  if (maxW > 60) return { level: "High", score: 4, color: "#FF0000" };
  if (maxW > 40) return { level: "Moderate", score: 3, color: "#FF7E00" };
  return { level: "Low", score: 1, color: "#00E400" };
}
