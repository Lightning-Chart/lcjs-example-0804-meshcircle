window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
/*
 * LightningChartJS example for rendering a 'Mesh Circle'.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, IntensitySeriesTypes, PalettedFill, LUT, ColorRGBA, Themes } = lcjs

const lc = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })

const chart = lc
    .ChartXY({
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
    })
    .setTitle('Mesh Circle')

const axisX = chart.getDefaultAxisX().setInterval({ start: -90, end: 100 }) // interval of X axis
const axisY = chart.getDefaultAxisY().setInterval({ start: -50, end: 50 }) // interval of Y axis

// Create LUT and FillStyle
const lut = new LUT({
    steps: [
        { value: 0, color: ColorRGBA(0, 0, 0, 0) }, // transparent at value 0
        { value: 50, color: ColorRGBA(255, 255, 0) }, // yellow at value 50
        { value: 100, color: ColorRGBA(255, 0, 0) }, // red at value 100
    ],
    interpolate: true,
})
const paletteFill = new PalettedFill({ lut, lookUpProperty: 'value' })

// Specify the resolution used for the mesh.
const rows = 51
const columns = rows

const intensityOptions = {
    rows,
    columns,
    pixelate: false,
    type: IntensitySeriesTypes.Mesh,
}

const meshCircle = chart
    .addHeatmapSeries(intensityOptions)
    .setFillStyle(paletteFill) // Use created Paletted FillStyle for the Mesh circle.
    .setCursorEnabled(false) //disable cursor interaction
    .invalidateGeometryOnly((row, column, prev) => {
        const angle = (row * 2 * Math.PI) / (rows - 1.3)
        const radius = column
        return {
            x: Math.sin(angle) * radius,
            y: Math.cos(angle) * radius,
        }
    })
    .setStart({ x: 0, y: 0 })
    .setEnd({ x: 50, y: 50 })

const data = (rows, columns) => {
    let result = Array.from(Array(columns)).map(() => Array(rows))
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            result[col][row] = 100 * Math.cos(col / (0.5 * Math.PI)) + Math.floor(Math.random() * 10) // set value for each cell
        }
    }
    return result
}

// update loop
setInterval(() => {
    meshCircle.invalidateValuesOnly(data(rows, columns))
}, 20)
