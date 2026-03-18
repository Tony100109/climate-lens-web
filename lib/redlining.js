const HOLC_COLORS = {
  A: { color: "#4caf50", label: "Best (A)", desc: "Deemed 'best' for investment — typically wealthier, white neighborhoods" },
  B: { color: "#2196f3", label: "Still Desirable (B)", desc: "Considered 'still desirable' — stable middle-class areas" },
  C: { color: "#ffc107", label: "Declining (C)", desc: "Labeled 'declining' — often working-class or immigrant neighborhoods" },
  D: { color: "#f44336", label: "Hazardous (D)", desc: "Redlined as 'hazardous' — denied loans and investment, predominantly Black neighborhoods" },
};

// Mapping Inequality city name mappings
const CITY_FILES = {
  "New York": "NYNewYork1938",
  "Los Angeles": "CALosAngeles1939",
  "Chicago": "ILChicago1940",
  "Philadelphia": "PAPhiladelphia1937",
  "Detroit": "MIDetroit1939",
  "Baltimore": "MDBaltimore1937",
  "Cleveland": "OHCleveland1939",
  "St. Louis": "MOStLouis1937",
  "Pittsburgh": "PAPittsburgh1937",
  "San Francisco": "CASanFrancisco1937",
  "Milwaukee": "WIMilwaukee1938",
  "Atlanta": "GAAtlanta1938",
  "Birmingham": "ALBirmingham1937",
  "Memphis": "TNMemphis1937",
  "Minneapolis": "MNMinneapolis1937",
  "Oakland": "CAOakland1937",
  "Richmond": "VARichmond1937",
  "Denver": "CODenver1938",
  "Hartford": "CTHartford1937",
  "Indianapolis": "INIndianapolis1937",
  "Kansas City": "MOKansasCity1939",
  "Miami": "FLMiami1937",
  "Nashville": "TNNashville1937",
  "Portland": "ORPortland1938",
  "Seattle": "WASeattle1936",
  "Tampa": "FLTampa1937",
  "Omaha": "NEOmaha1937",
  "Syracuse": "NYSyracuse1937",
  "Toledo": "OHToledo1939",
  "Dayton": "OHDayton1937",
  "Sacramento": "CASacramento1937",
  "San Diego": "CASanDiego1936",
  "San Jose": "CASanJose1937",
  "Spokane": "WASpokane1938",
  "Tacoma": "WATacoma1937",
  "Rochester": "NYRochester1937",
  "Buffalo": "NYBuffalo1937",
  "Columbus": "OHColumbus1936",
  "Louisville": "KYLouisville1937",
  "New Orleans": "LANewOrleans1939",
  "Boston": "MABoston1938",
  "Dallas": "TXDallas1937",
  "Houston": "TXHouston1937",
  "San Antonio": "TXSanAntonio1937",
  "Washington": "DCWashington1937",
};

export async function getRedliningData(city) {
  // Try exact match first, then partial match
  let fileKey = CITY_FILES[city];
  if (!fileKey) {
    const match = Object.keys(CITY_FILES).find(
      (c) => city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(city.toLowerCase())
    );
    if (match) fileKey = CITY_FILES[match];
  }

  if (!fileKey) {
    return {
      available: false,
      city,
      note: `Redlining data is not available for ${city}. The HOLC mapped approximately 239 cities between 1935-1940. Your city may not have been included.`,
      allCities: Object.keys(CITY_FILES).sort(),
    };
  }

  try {
    const url = `https://dsl.richmond.edu/panorama/redlining/static/downloads/geojson/${fileKey}.geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const geojson = await res.json();

    const grades = { A: 0, B: 0, C: 0, D: 0 };
    geojson.features.forEach((f) => {
      const grade = f.properties.holc_grade || f.properties.grade;
      if (grade && grades[grade] !== undefined) grades[grade]++;
    });

    const total = Object.values(grades).reduce((a, b) => a + b, 0);

    return {
      available: true,
      city,
      fileKey,
      geojson,
      summary: {
        totalNeighborhoods: total,
        grades,
        percentRedlined: total > 0 ? Math.round(((grades.C + grades.D) / total) * 100) : 0,
      },
      holcColors: HOLC_COLORS,
      mapUrl: `https://dsl.richmond.edu/panorama/redlining/map#loc=12/${fileKey.includes("New York") ? "40.75/-73.95" : "0/0"}`,
      embedNote: "Historical HOLC maps from the Mapping Inequality project, University of Richmond.",
    };
  } catch {
    return {
      available: false,
      city,
      note: `Could not load redlining data for ${city}. Try viewing the data directly at the Mapping Inequality project.`,
      directUrl: `https://dsl.richmond.edu/panorama/redlining/`,
    };
  }
}

export { HOLC_COLORS, CITY_FILES };
