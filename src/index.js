/*
 * LightningChartJS example for rendering a 'Mesh Circle'.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    IntensitySeriesTypes,
    PalettedFill,
    LUT,
    ColorRGBA,
    Themes
} = lcjs

const lc = lightningChart()

const chart = lc.ChartXY({
    // theme: Themes.dark
})
    .setTitle('Mesh Circle')

const axisX = chart.getDefaultAxisX()
    .setInterval(-90, 100, false, true) // interval of X axis 
const axisY = chart.getDefaultAxisY()
    .setInterval(-50, 50, false, true) // interval of Y axis 


// Create LUT and FillStyle
const lut = new LUT({
    steps: [
        { value: 0, color: ColorRGBA(0, 0, 0, 0) }, // transparent at value 0
        { value: 50, color: ColorRGBA(255, 255, 0) }, // yellow at value 50
        { value: 100, color: ColorRGBA(255, 0, 0) } // red at value 100
    ],
    interpolate: true
})
const paletteFill = new PalettedFill({ lut, lookUpProperty: 'x' })

// Specify the resolution used for the mesh.
const rows = 51
const columns = rows

const intensityOptions = {
    rows,
    columns,
    start: { x: 0, y: 0 },
    end: { x: 50, y: 50 },
    pixelate: false, 
    type: IntensitySeriesTypes.Mesh 
}

const meshCircle = chart.addHeatmapSeries(intensityOptions)
    .setFillStyle(paletteFill)  // Use created Paletted FillStyle for the Mesh circle.
    .setCursorEnabled(false) //disable cursor interaction
    .invalidateGeometryOnly((row, column, prev) => {
        const angle = row * 2 * Math.PI / (rows - 1.3)
        const radius = column
        return {
            x: Math.sin(angle) * radius,
            y: Math.cos(angle) * radius,
        }
    })

const data = (rows, columns) => {
    let result = Array.from(Array(columns)).map(() => Array(rows))
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {

            result[col][row] = (100 * Math.cos(col / (0.5 * Math.PI)) + (Math.floor(Math.random() * 10))) // set value for each cell
        }
    }
    return result
}

// update loop
setInterval(() => {
    meshCircle.invalidateValuesOnly(data(rows, columns))
}, 20);
