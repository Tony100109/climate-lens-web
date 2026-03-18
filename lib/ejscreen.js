const EJ_INDICATORS = {
  pm25: { label: "PM2.5 Levels", unit: "μg/m³", desc: "Fine particulate matter concentration" },
  ozone: { label: "Ozone Levels", unit: "ppb", desc: "Ground-level ozone concentration" },
  diesel: { label: "Diesel Particulate", unit: "μg/m³", desc: "Diesel exhaust particulate matter" },
  cancer: { label: "Air Toxics Cancer Risk", unit: "per million", desc: "Lifetime cancer risk from air toxics" },
  resp: { label: "Respiratory Hazard", unit: "index", desc: "Air toxics respiratory hazard index" },
  traffic: { label: "Traffic Proximity", unit: "vehicles/day", desc: "Count of vehicles within 500m" },
  lead: { label: "Lead Paint Risk", unit: "% pre-1960 housing", desc: "Percent of housing built before 1960" },
  superfund: { label: "Superfund Proximity", unit: "sites/km", desc: "Proximity to hazardous waste sites" },
  rmp: { label: "RMP Facility Proximity", unit: "facilities/km", desc: "Proximity to Risk Management Plan facilities" },
  waste: { label: "Hazardous Waste", unit: "facilities/km", desc: "Proximity to treatment/storage/disposal facilities" },
  water: { label: "Wastewater Discharge", unit: "toxicity/m", desc: "Proximity to water discharge sites" },
};

export async function getEJScreenData(lat, lon) {
  try {
    const url = `https://ejscreen.epa.gov/ArcGIS/rest/services/ejscreen/ejscreen_v2020/MapServer/0/query`;
    const params = new URLSearchParams({
      geometry: JSON.stringify({ x: lon, y: lat, spatialReference: { wkid: 4326 } }),
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "*",
      returnGeometry: false,
      f: "json",
    });

    const res = await fetch(`${url}?${params}`);
    if (!res.ok) throw new Error("EJScreen API unavailable");
    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      return getFallbackEJData();
    }

    const attrs = data.features[0].attributes;
    return {
      available: true,
      demographics: {
        pctMinority: attrs.MINORPCT != null ? Math.round(attrs.MINORPCT * 100) : null,
        pctLowIncome: attrs.LOWINCPCT != null ? Math.round(attrs.LOWINCPCT * 100) : null,
        pctLinguistic: attrs.LINGISOPCT != null ? Math.round(attrs.LINGISOPCT * 100) : null,
        pctUnder5: attrs.UNDER5PCT != null ? Math.round(attrs.UNDER5PCT * 100) : null,
        pctOver64: attrs.OVER64PCT != null ? Math.round(attrs.OVER64PCT * 100) : null,
        population: attrs.ACSTOTPOP || null,
      },
      environmental: {
        pm25: attrs.PM25 != null ? Math.round(attrs.PM25 * 100) / 100 : null,
        ozone: attrs.OZONE != null ? Math.round(attrs.OZONE * 100) / 100 : null,
        diesel: attrs.DSLPM != null ? Math.round(attrs.DSLPM * 100) / 100 : null,
        cancer: attrs.CANCER != null ? Math.round(attrs.CANCER) : null,
        resp: attrs.RESP != null ? Math.round(attrs.RESP * 100) / 100 : null,
        traffic: attrs.PTRAF != null ? Math.round(attrs.PTRAF) : null,
        lead: attrs.PRE1960PCT != null ? Math.round(attrs.PRE1960PCT * 100) : null,
        superfund: attrs.PNPL != null ? Math.round(attrs.PNPL * 100) / 100 : null,
        rmp: attrs.PRMP != null ? Math.round(attrs.PRMP * 100) / 100 : null,
        waste: attrs.PTSDF != null ? Math.round(attrs.PTSDF * 100) / 100 : null,
        water: attrs.PWDIS != null ? Math.round(attrs.PWDIS * 100) / 100 : null,
      },
      ejIndices: {
        pm25: attrs.P_PM25_D2 != null ? Math.round(attrs.P_PM25_D2) : null,
        ozone: attrs.P_OZONE_D2 != null ? Math.round(attrs.P_OZONE_D2) : null,
        diesel: attrs.P_DSLPM_D2 != null ? Math.round(attrs.P_DSLPM_D2) : null,
        cancer: attrs.P_CANCER_D2 != null ? Math.round(attrs.P_CANCER_D2) : null,
        resp: attrs.P_RESP_D2 != null ? Math.round(attrs.P_RESP_D2) : null,
        traffic: attrs.P_PTRAF_D2 != null ? Math.round(attrs.P_PTRAF_D2) : null,
        lead: attrs.P_LDPNT_D2 != null ? Math.round(attrs.P_LDPNT_D2) : null,
        superfund: attrs.P_PNPL_D2 != null ? Math.round(attrs.P_PNPL_D2) : null,
      },
      indicators: EJ_INDICATORS,
    };
  } catch {
    return getFallbackEJData();
  }
}

function getFallbackEJData() {
  return {
    available: false,
    note: "EPA EJScreen data is currently unavailable. The EPA discontinued the public tool in February 2025. You can still access EJ data at screening-tools.com/epa-ejscreen",
    indicators: EJ_INDICATORS,
  };
}

export { EJ_INDICATORS };
