import React, { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw, Save, Info, Check, Image as ImageIcon, X } from 'lucide-react';
import logo from './assets/1.png';

// --- DATA MODELS ---

const PLANETS = [
  { id: 'Su', hindi: 'सूर्य', short: 'सू.', eng: 'Sun', color: '#dc2626', desc: 'Soul, Father, Power' },
  { id: 'Mo', hindi: 'चन्द्र', short: 'चं.', eng: 'Moon', color: '#2563eb', desc: 'Mind, Mother, Emotions' },
  { id: 'Ma', hindi: 'मंगल', short: 'मं.', eng: 'Mars', color: '#b91c1c', desc: 'Energy, Courage, Siblings' },
  { id: 'Me', hindi: 'बुध', short: 'बु.', eng: 'Mercury', color: '#16a34a', desc: 'Intelligence, Communication' },
  { id: 'Ju', hindi: 'गुरु', short: 'गु.', eng: 'Jupiter', color: '#ca8a04', desc: 'Wisdom, Wealth, Expansion' },
  { id: 'Ve', hindi: 'शुक्र', short: 'शु.', eng: 'Venus', color: '#db2777', desc: 'Love, Beauty, Luxuries' },
  { id: 'Sa', hindi: 'शनि', short: 'श.', eng: 'Saturn', color: '#4b5563', desc: 'Discipline, Karma, Delays' },
  { id: 'Ra', hindi: 'राहु', short: 'रा.', eng: 'Rahu', color: '#1f2937', desc: 'Illusion, Obsession, Materialism' },
  { id: 'Ke', hindi: 'केतु', short: 'के.', eng: 'Ketu', color: '#9ca3af', desc: 'Liberation, Spirituality, Detachment' },
];

const RASHIS = [
  { id: 1, name: 'मेष (Aries)' }, { id: 2, name: 'वृषभ (Taurus)' },
  { id: 3, name: 'मिथुन (Gemini)' }, { id: 4, name: 'कर्क (Cancer)' },
  { id: 5, name: 'सिंह (Leo)' }, { id: 6, name: 'कन्या (Virgo)' },
  { id: 7, name: 'तुला (Libra)' }, { id: 8, name: 'वृश्चिक (Scorpio)' },
  { id: 9, name: 'धनु (Sagittarius)' }, { id: 10, name: 'मकर (Capricorn)' },
  { id: 11, name: 'कुंभ (Aquarius)' }, { id: 12, name: 'मीन (Pisces)' },
];

const HOUSES = [
  { id: 1, points: "200,0 300,100 200,200 100,100", center: { x: 200, y: 105 }, rashiPos: { x: 200, y: 20 }, desc: "भाव 1: लग्न, शरीर, आत्मा (Self, Body)" },
  { id: 2, points: "0,0 200,0 100,100", center: { x: 100, y: 40 }, rashiPos: { x: 40, y: 20 }, desc: "भाव 2: धन, परिवार, वाणी (Wealth, Family)" },
  { id: 3, points: "0,0 100,100 0,200", center: { x: 40, y: 105 }, rashiPos: { x: 20, y: 45 }, desc: "भाव 3: साहस, भाई-बहन (Courage, Siblings)" },
  { id: 4, points: "0,200 100,100 200,200 100,300", center: { x: 100, y: 205 }, rashiPos: { x: 20, y: 205 }, desc: "भाव 4: माता, सुख, घर (Mother, Home, Happiness)" },
  { id: 5, points: "0,200 100,300 0,400", center: { x: 40, y: 300 }, rashiPos: { x: 20, y: 365 }, desc: "भाव 5: संतान, विद्या, बुद्धि (Children, Intellect)" },
  { id: 6, points: "0,400 100,300 200,400", center: { x: 100, y: 360 }, rashiPos: { x: 40, y: 385 }, desc: "भाव 6: रोग, ऋण, शत्रु (Enemies, Debts, Diseases)" },
  { id: 7, points: "200,400 100,300 200,200 300,300", center: { x: 200, y: 300 }, rashiPos: { x: 200, y: 385 }, desc: "भाव 7: विवाह, साझेदारी (Marriage, Partnerships)" },
  { id: 8, points: "200,400 300,300 400,400", center: { x: 300, y: 360 }, rashiPos: { x: 360, y: 385 }, desc: "भाव 8: आयु, रहस्य, बाधाएं (Longevity, Transformation)" },
  { id: 9, points: "400,400 300,300 400,200", center: { x: 360, y: 300 }, rashiPos: { x: 380, y: 365 }, desc: "भाव 9: धर्म, भाग्य, पिता (Dharma, Luck, Father)" },
  { id: 10, points: "400,200 300,300 200,200 300,100", center: { x: 300, y: 205 }, rashiPos: { x: 380, y: 205 }, desc: "भाव 10: कर्म, व्यवसाय, सम्मान (Career, Karma)" },
  { id: 11, points: "400,200 300,100 400,0", center: { x: 360, y: 105 }, rashiPos: { x: 380, y: 45 }, desc: "भाव 11: आय, लाभ, मित्र (Gains, Friends)" },
  { id: 12, points: "400,0 300,100 200,0", center: { x: 300, y: 40 }, rashiPos: { x: 360, y: 20 }, desc: "भाव 12: व्यय, मोक्ष, विदेश (Expenses, Loss, Liberation)" },
];

export default function App() {
  // --- STATE ---
  const [lagna, setLagna] = useState(1);
  const [placements, setPlacements] = useState({}); // { planetId: houseId }
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [hoverInfo, setHoverInfo] = useState("कुंडली बनाने के लिए ग्रहों को भावों में खींचें या क्लिक करें।");
  const [savedCharts, setSavedCharts] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const svgRef = useRef(null);

  // --- LOGIC ---

  const getRashiForHouse = (houseId) => {
    return ((lagna + houseId - 2) % 12) + 1;
  };

  const getPlanetsInHouse = (houseId) => {
    return Object.entries(placements)
      .filter(([_, hId]) => hId === houseId)
      .map(([pId]) => PLANETS.find(p => p.id === pId));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, planetId) => {
    e.dataTransfer.setData("planetId", planetId);
    setSelectedPlanet(planetId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, houseId) => {
    e.preventDefault();
    const planetId = e.dataTransfer.getData("planetId");
    if (planetId) {
      setPlacements(prev => ({ ...prev, [planetId]: houseId }));
      setSelectedPlanet(null);
    }
  };

  // Click to Place Handlers
  const handlePlanetClick = (planetId) => {
    if (selectedPlanet === planetId) {
      setSelectedPlanet(null); // Toggle off
    } else {
      setSelectedPlanet(planetId);
      setHoverInfo(`आपने ${PLANETS.find(p => p.id === planetId).hindi} का चयन किया है। अब इसे रखने के लिए किसी भाव पर क्लिक करें।`);
    }
  };

  const handleHouseClick = (houseId) => {
    if (selectedPlanet) {
      setPlacements(prev => ({ ...prev, [selectedPlanet]: houseId }));
      setSelectedPlanet(null);
      setHoverInfo(HOUSES.find(h => h.id === houseId).desc);
    }
  };

  const handleRemovePlanet = (planetId) => {
    setPlacements(prev => {
      const newPlacements = { ...prev };
      delete newPlacements[planetId];
      return newPlacements;
    });
  };

  const resetChart = () => {
    setPlacements({});
    setLagna(1);
    setSelectedPlanet(null);
    setHoverInfo("कुंडली रीसेट कर दी गई है।");
  };

  const saveChartToMemory = () => {
    const chart = { id: Date.now(), lagna, placements, name: `कुंडली ${savedCharts.length + 1}` };
    setSavedCharts([...savedCharts, chart]);
    setHoverInfo("कुंडली सहेज ली गई है (वर्तमान सत्र के लिए)।");
  };

  const loadChart = (chart) => {
    setLagna(chart.lagna);
    setPlacements(chart.placements);
    setHoverInfo(`${chart.name} लोड की गई।`);
  };

  // Export to SVG Logic
  const downloadSVG = () => {
    if (!svgRef.current) return;

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgRef.current);

    if(!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kundali_Lagna_${lagna}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to Image Logic
  const generateImage = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // Add xmlns if missing for standard strict parsing
    if(!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const canvas = document.createElement("canvas");
    canvas.width = 800; // High resolution export
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // White background
      ctx.fillStyle = "#fff7ed"; // tailwind orange-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setPreviewImage(canvas.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadImage = () => {
    if (!previewImage) return;
    const a = document.createElement("a");
    a.href = previewImage;
    a.download = `Kundali_Lagna_${lagna}.png`;
    a.click();
    setPreviewImage(null);
  };

  // --- RENDER HELPERS ---

  // Calculate offsets to neatly display multiple planets in one house
  const renderPlanetsInHouse = (houseId) => {
    const planets = getPlanetsInHouse(houseId);
    if (planets.length === 0) return null;

    return planets.map((p, index) => {
      const houseCenter = HOUSES.find(h => h.id === houseId).center;

      // Smart grid placement within the house center
      const offsetX = planets.length === 1 ? 0 : (index % 2 === 0 ? -16 : 16);
      const offsetY = planets.length === 1 ? 5 : Math.floor(index / 2) * 22 - (planets.length > 2 ? 10 : 0);

      return (
        <text
          key={p.id}
          x={houseCenter.x + offsetX}
          y={houseCenter.y + offsetY}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={p.color}
          className="pointer-events-none select-none drop-shadow-sm"
        >
          {p.short}
        </text>
      );
    });
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 font-sans selection:bg-orange-200 flex flex-col items-center py-6 px-4">

      {/* HEADER */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-orange-200">
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Upgrad Ojha - Kundali Making" className="h-16 mb-2" />
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button onClick={resetChart} className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
            <RefreshCw size={18} /> रीसेट (Reset)
          </button>
          <button onClick={saveChartToMemory} className="flex items-center gap-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition">
            <Save size={18} /> सहेजें (Save)
          </button>
          <button onClick={downloadSVG} className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition font-medium">
            <Download size={18} /> SVG डाउनलोड
          </button>
          <button onClick={generateImage} className="flex items-center gap-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md transition font-medium">
            <Download size={18} /> इमेज (PNG) डाउनलोड
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* SIDEBAR: Controls & Planets */}
        <aside className="lg:col-span-4 flex flex-col gap-4">

          {/* Lagna Selection */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">लग्न चुनें (Ascendant Rashi)</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              value={lagna}
              onChange={(e) => setLagna(Number(e.target.value))}
            >
              {RASHIS.map(r => (
                <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
              ))}
            </select>
          </div>

          {/* Planets Palette */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">ग्रह (Planets)</h3>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">खींचें या क्लिक करें</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {PLANETS.map(planet => {
                const isPlaced = !!placements[planet.id];
                const isSelected = selectedPlanet === planet.id;

                return (
                  <div
                    key={planet.id}
                    draggable={!isPlaced}
                    onDragStart={(e) => handleDragStart(e, planet.id)}
                    onClick={() => !isPlaced && handlePlanetClick(planet.id)}
                    onMouseEnter={() => setHoverInfo(`${planet.hindi} (${planet.eng}): ${planet.desc}`)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all select-none
                      ${isPlaced ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' : 'bg-white cursor-pointer hover:shadow-md'}
                      ${isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-100'}
                    `}
                  >
                    <span className="text-lg font-bold" style={{ color: isPlaced ? '#9ca3af' : planet.color }}>
                      {planet.hindi}
                    </span>
                    <span className="text-xs text-gray-500">{planet.id}</span>

                    {isPlaced && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemovePlanet(planet.id); }}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 z-10"
                        title="हटाएं (Remove)"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Charts (Session) */}
          {savedCharts.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100">
              <h3 className="font-semibold text-gray-700 mb-3">सहेजी गई कुंडलियां</h3>
              <div className="flex flex-col gap-2">
                {savedCharts.map((chart, idx) => (
                  <button
                    key={chart.id}
                    onClick={() => loadChart(chart)}
                    className="text-left w-full p-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
                  >
                    {idx + 1}. {chart.name} (लग्न: {chart.lagna})
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* KUNDALI CHART AREA */}
        <main className="lg:col-span-8 flex flex-col items-center">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 w-full flex justify-center relative">

            {/* The SVG Chart */}
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full max-w-[500px] h-auto bg-[#fffdf5] drop-shadow-sm"
              style={{ fontFamily: 'sans-serif' }}
            >
              {/* Outer Border */}
              <rect x="2" y="2" width="396" height="396" fill="none" stroke="#ea580c" strokeWidth="4" />

              {/* Diagonals */}
              <line x1="2" y1="2" x2="398" y2="398" stroke="#ea580c" strokeWidth="2" />
              <line x1="398" y1="2" x2="2" y2="398" stroke="#ea580c" strokeWidth="2" />

              {/* Inner Diamond */}
              <polygon points="200,2 398,200 200,398 2,200" fill="none" stroke="#ea580c" strokeWidth="2" />

              {/* Interactive House Polygons (Invisible, just for events) */}
              {HOUSES.map(house => (
                <polygon
                  key={`zone-${house.id}`}
                  points={house.points}
                  fill="transparent"
                  stroke="transparent"
                  className="cursor-pointer hover:fill-orange-500/10 transition-colors duration-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, house.id)}
                  onClick={() => handleHouseClick(house.id)}
                  onMouseEnter={() => setHoverInfo(house.desc)}
                />
              ))}

              {/* Rashi Numbers (Fixed positions) */}
              {HOUSES.map(house => (
                <text
                  key={`rashi-${house.id}`}
                  x={house.rashiPos.x}
                  y={house.rashiPos.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="14"
                  fill="#9ca3af" // Gray color for numbers
                  className="pointer-events-none select-none font-medium"
                >
                  {getRashiForHouse(house.id)}
                </text>
              ))}

              {/* Placed Planets */}
              {HOUSES.map(house => (
                <React.Fragment key={`planets-${house.id}`}>
                  {renderPlanetsInHouse(house.id)}
                </React.Fragment>
              ))}
            </svg>

          </div>

          {/* Info/Status Bar */}
          <div className="w-full mt-4 bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-start gap-3 text-blue-800">
            <Info className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm leading-relaxed font-medium">{hoverInfo}</p>
          </div>

        </main>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon size={20} className="text-orange-500"/>
                इमेज प्रीव्यू (Preview)
              </h3>
              <button onClick={() => setPreviewImage(null)} className="text-gray-500 hover:text-gray-800 transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex justify-center bg-gray-50">
              <img src={previewImage} alt="Kundali Preview" className="max-w-full h-auto border-2 border-gray-200 rounded shadow-sm" />
            </div>

            <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={downloadImage}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow transition flex items-center gap-2"
              >
                <Check size={18} />
                कंफर्म और डाउनलोड करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
