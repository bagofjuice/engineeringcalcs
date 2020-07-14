interface IUniversalBeam {
    name: string,
    type: 'steel',
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

interface ITimberBeam {
    name: string,
    type: 'timber',
    height: number      // mm
    width: number       // mm
    momentOfInertia: {
        lx: number       // (I) cm4
        ly: number       // cm4
    }
}

const timberBeams: {[key: string]: ITimberBeam} = {
    C16150x50: {
        name: 'C16 softwood 150 x 50',
        type: 'timber',
        height: 150,
        width: 50,
        momentOfInertia: {
            lx: 1410,
            ly: 156
        },
    },
    C16175x50: {
        name: 'C16 softwood 175 x 50',
        type: 'timber',
        height: 175,
        width: 50,
        momentOfInertia: {
            lx: 2230,
            ly: 1582
        },
    }, 
}

const universalBeams: {[key: string]: IUniversalBeam} = {
    UB127x76x13: {
        name: 'UB127x76x13',
        type: 'steel',
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
        type: 'steel',
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
        type: 'steel',
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

interface LoadParams {
    beamType: IUniversalBeam | ITimberBeam,
    load: number        // (F) N (Kg x 9.81)
    length: number      // (L) mm
}

interface CalculatedLoad {
    beamParams: LoadParams,
    deflection: {
        safeDeflectionLimit: number
        point: {
            load: number,
            maxDeflection: number
            isDeflectionSafe: boolean
        },
        distributed: {
            load: number,
            maxDeflection: number
            isDeflectionSafe: boolean
        },
    }
}


const modulusOfElasticity = {
    steel: 200000,   // (E) N/mm2
    timber: 8800    // (E) N/mm2
}

const conversion = {
    cm4Tomm4: 10000,
    kgToN: 9.81
}

const calculatePointLoadDeflection = (beamParams: LoadParams, load: number) => {
    return load * Math.pow(beamParams.length, 3) / (48 * modulusOfElasticity[beamParams.beamType.type] * (beamParams.beamType.momentOfInertia.lx * conversion.cm4Tomm4))
}

const calculateDistributedLoadDeflection = (beamParams: LoadParams, load: number) => {
    return 5 * load * Math.pow(beamParams.length, 4) / (384 * modulusOfElasticity[beamParams.beamType.type] * (beamParams.beamType.momentOfInertia.lx * conversion.cm4Tomm4))
}

const calculateLoad = (beamParams: LoadParams): CalculatedLoad =>  {
    const pointLoad = beamParams.load * conversion.kgToN

    // uniform load per length unit of beam (N/m, N/mm, lb/in)
    const distributedLoad = beamParams.load / beamParams.length * conversion.kgToN 

    return {
        beamParams: beamParams,
        deflection: {
            safeDeflectionLimit: beamParams.length / (beamParams.beamType.type === 'steel'  ? allowableSteelDeflectionRatio : allowableTimberDeflectionRatio),
            point: {
                load: pointLoad,
                maxDeflection: calculatePointLoadDeflection(beamParams, pointLoad),
                isDeflectionSafe: beamParams.length / (beamParams.beamType.type === 'steel'  ? allowableSteelDeflectionRatio : allowableTimberDeflectionRatio) > calculatePointLoadDeflection(beamParams, pointLoad)
            },
            distributed: {
                load: distributedLoad,
                maxDeflection: calculateDistributedLoadDeflection(beamParams, distributedLoad),
                isDeflectionSafe: beamParams.length / (beamParams.beamType.type === 'steel'  ? allowableSteelDeflectionRatio : allowableTimberDeflectionRatio) > calculateDistributedLoadDeflection(beamParams, distributedLoad)
            },
        }
    }
}

const prettyPrint = (calcResults: CalculatedLoad) => {
    return JSON.stringify ({
        beamName: calcResults.beamParams.beamType.name,
        beamLength: `${calcResults.beamParams.length} mm`,
        deflection: {
            safeDeflectionLimit: `${calcResults.deflection.safeDeflectionLimit.toFixed(2)} mm`,
            point: {
                load: `${calcResults.deflection.point.load.toFixed(2)} N (${calcResults.beamParams.load} Kg point)`,
                maxDeflection: `${calcResults.deflection.point.maxDeflection.toFixed(2)} mm`,
                deflectionSummary: calcResults.deflection.point.isDeflectionSafe ? "OK" : "***** WARNING ----- UNSAFE POINT DEFLECTION ----- WARNING *****"
            },
            distributed: {
                load: `${calcResults.deflection.distributed.load.toFixed(2)} N/mm (${calcResults.beamParams.load} Kg distributed)`,
                maxDeflection: `${calcResults.deflection.distributed.maxDeflection.toFixed(2)} mm`,
                deflectionSummary: calcResults.deflection.distributed.isDeflectionSafe ? "OK" : "***** WARNING ----- UNSAFE DISTRIBUTED DEFLECTION ----- WARNING *****"
            },
        }
    }, null, 2)
}

const allowableSteelDeflectionRatio = 350
const allowableTimberDeflectionRatio = 360 // https://www.techsupport.weyerhaeuser.com/hc/en-us/articles/205175860-What-is-Allowable-Deflection-

/**
 * Enter specific use cases here
 */
const uBeam: LoadParams = {
    beamType: universalBeams.UB127x76x13,
    load: 1000,
    length: 2500
}

const timberBeam1: LoadParams = {
    beamType: timberBeams.C16150x50,
    load: 200,
    length: 3720
}

const timberBeam2: LoadParams = {
    beamType: timberBeams.C16175x50,
    load: 200,
    length: 3720
}

// IBeam
// console.log(pointLoadCalc(uBeam))
console.log(prettyPrint(calculateLoad(uBeam)))

// Timber
// console.log(pointLoadCalc(timberBeam))
console.log(prettyPrint(calculateLoad(timberBeam1)))
console.log(prettyPrint(calculateLoad(timberBeam2)))
