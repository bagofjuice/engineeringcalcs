interface IUniversalBeam {
    name: string,
    height: number      // mm
    width: number       // mm
    thickness: number   // mm
    sectionArea: number // cm2
    weight: number      // kg/m
    momentOfInertia: {
        lx: number       // (I) cm4
        ly: number       // cm4
    }
    elasticSectionModulus: {
        Wx: number       // cm3
        Wy: number       // cm3
    }
}

const universalBeams: {[key: string]: IUniversalBeam} = {
    UB127x76x13: {
        name: 'UB127x76x13',
        height: 127,
        width: 76,
        thickness: 4,
        sectionArea: 16.5,
        weight: 13,
        momentOfInertia: {
            lx: 473,
            ly: 55.7
        },
        elasticSectionModulus: {
            Wx: 74.5,
            Wy: 14.7
        }
    }, 
    UB152x89x16: {
        name: 'UB152x89x16',
        height: 152.4,
        width: 88.7,
        thickness: 4.5,
        sectionArea: 20.3,
        weight: 16,
        momentOfInertia: {
            lx: 834,
            ly: 89.6
        },
        elasticSectionModulus: {
            Wx: 109.5,
            Wy: 20.2
        }
    }, 
    UB305x127x42: {
        name: 'UB305x127x42',
        height: 307.2,
        width: 124.3,
        thickness: 8,
        sectionArea: 53.4,
        weight: 41.9,
        momentOfInertia: {
            lx: 8196,
            ly: 388.8
        },
        elasticSectionModulus: {
            Wx: 533.6,
            Wy: 62.6
        }
    }
}

const steelProperties = {
    modulusOfElasticity: 200000 // (E) N/mm2
}

const conversion = {
    cm4Tomm4: 10000,
    kgToN: 9.81
}

interface IBeamPointLoadParams {
    beamType: IUniversalBeam,
    pointLoad: number           // (F) N (Kg x 9.81)
    length: number              // (L) mm
}

function deflection(beamParams: IBeamPointLoadParams) {
    return beamParams.pointLoad * Math.pow(beamParams.length, 3) / (48 * steelProperties.modulusOfElasticity * (beamParams.beamType.momentOfInertia.lx * conversion.cm4Tomm4))
}

function neutralAxisDistance(beamParams: IBeamPointLoadParams) {
    return beamParams.beamType.height / 2
}

interface IPointLoadCalc {
    beamParams: IBeamPointLoadParams,
    neutralAxisDistance: number
    supportForce: number
    maxStress: number
    maxDeflection: number
    safeDeflectionLimit: number
    isDeflectionSafe: boolean
}

interface IPointLoadCalcPretty {
    beamName: string
    beamLength: string
    pointLoad: string
    maxDeflection: string
    safeDeflectionLimit: string
    deflectionSummary: string
}

function pointLoadCalc(beamParams: IBeamPointLoadParams): IPointLoadCalc {
    return {
        beamParams: beamParams,
        neutralAxisDistance: neutralAxisDistance(beamParams),
        supportForce: beamParams.pointLoad / 2,
        maxStress: neutralAxisDistance(beamParams) * beamParams.pointLoad * beamParams.length / (4 * beamParams.beamType.momentOfInertia.lx * conversion.cm4Tomm4),
        maxDeflection: deflection(beamParams),
        safeDeflectionLimit: beamParams.length / allowableDeflectionRatio,
        isDeflectionSafe: beamParams.length / allowableDeflectionRatio > deflection(beamParams)
    }
}

function prettyPrint (calcResults: IPointLoadCalc): IPointLoadCalcPretty {
    return {
        beamName: calcResults.beamParams.beamType.name,
        beamLength: `${calcResults.beamParams.length} mm`,
        pointLoad: `${calcResults.beamParams.pointLoad / conversion.kgToN} Kg`,
        maxDeflection: `${calcResults.maxDeflection.toFixed(1)} mm`,
        safeDeflectionLimit: `${calcResults.safeDeflectionLimit.toFixed(1)} mm`,
        deflectionSummary: calcResults.isDeflectionSafe ? "OK" : "***** WARNING ----- UNSAFE DEFLECTION ----- WARNING *****"
    }
}

const allowableDeflectionRatio = 350
const beam: IBeamPointLoadParams = {
    beamType: universalBeams.UB127x76x13,
    pointLoad: 1000 * conversion.kgToN,
    length: 2500
}

console.log(prettyPrint(pointLoadCalc(beam)))
console.log(pointLoadCalc(beam))
