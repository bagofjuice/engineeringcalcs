// Hoop (A) on the offside
const rollHoopsConfigA: HoopOffsets = {
  nearside: {
    outerLeg: {
      frontToBack: {
        angle: 89.82,
      },
      nsToOs: {
        angle: 89.68,
      },
    },
    innerLeg: {
      frontToBack: {
        angle: 89.93,
      },
      nsToOs: {
        angle: 89.26,
      },
    },
    rearLeg: {
      frontToBack: {
        angle: -89.03,
      },
      nsToOs: {
        angle: 89.09,
      },
    },
  },
  offside: {
    outerLeg: {
      frontToBack: {
        angle: 89.37,
      },
      nsToOs: {
        angle: 89.64,
      },
    },
    innerLeg: {
      frontToBack: {
        angle: 89.93,
      },
      nsToOs: {
        angle: -89.89,
      },
    },
    rearLeg: {
      frontToBack: {
        angle: 88.7,
      },
      nsToOs: {
        angle: 89.75,
      },
    },
  },
};

// Hoop (A) on the nearside
const rollHoopsConfigB: HoopOffsets = {
  nearside: {
    outerLeg: {
      frontToBack: {
        angle: 89.20,
      },
      nsToOs: {
        angle: -89.63,
      },
    },
    innerLeg: {
      frontToBack: {
        angle: 89.02,
      },
      nsToOs: {
        angle: 89.42,
      },
    },
    rearLeg: {
      frontToBack: {
        angle: 88.27,
      },
      nsToOs: {
        angle: 89.68,
      },
    },
  },
  offside: {
    outerLeg: {
      frontToBack: {
        angle: -89.79,
      },
      nsToOs: {
        angle: 89.36,
      },
    },
    innerLeg: {
      frontToBack: {
        angle: -89.43,
      },
      nsToOs: {
        angle: 89.88,
      },
    },
    rearLeg: {
      frontToBack: {
        angle: -88.86,
      },
      nsToOs: {
        angle: 89.44,
      },
    },
  },
};


// Hoop (A) on the nearside without hoop legs pulled when bolted down i.e spacers needed
const rollHoopsConfigC: HoopOffsets = {
  nearside: {
    outerLeg: {
      frontToBack: {
        angle: -89.91,
      },
      nsToOs: {
        angle: -89.97,
      },
    },
    innerLeg: {
      frontToBack: {
        angle: -89.95,
      },
      nsToOs: {
        angle: 89.39,
      },
    },
    rearLeg: {
      frontToBack: {
        angle: 89.36,
      },
      nsToOs: {
        angle: 89.85,
      },
    },
  },
  offside: {
    outerLeg: {
      frontToBack: {
        angle: 89.51,
      },
      nsToOs: {
        angle: 89.42,
      },
    },
    innerLeg: {
      frontToBack: {
        angle: 89.69,
      },
      nsToOs: {
        angle: -89.89,
      },
    },
    rearLeg: {
      frontToBack: {
        angle: -89.52,
      },
      nsToOs: {
        angle: 89.48,
      },
    },
  },
};

const HEIGHT_TO_HOLE = {
  outerLeg: 220,
  innerLeg: 290,
  rearLeg: 270,
};

const DegreesToRadians = (valDeg: number): number => {
  return ((2 * Math.PI) / 360) * valDeg;
};

const getAngleToAbsolute = (angle: number, length: number): number => {
  return length / Math.tan(DegreesToRadians(angle));
};

const getOffsetLabel = (offset: number): string => {
  return `${Math.round(offset)}mm`;
  // return `${offset}mm`;
}

const calculateAbsoluteOffsetAtBodyHolePosition = (rollHoops: HoopOffsets): HoopOffsets => {
  Object.keys(rollHoops).map((hoop) => {
    Object.keys(rollHoops[hoop]).map((leg) => {
      Object.keys(rollHoops[hoop][leg]).map((plane) => {
        // Convert the angle to absolute (mm) accounting for height position of body hole
        rollHoops[hoop][leg][plane].absolute = getAngleToAbsolute(
          rollHoops[hoop][leg][plane].angle,
          HEIGHT_TO_HOLE[leg]
        );
      });
    });
  });

  return rollHoops;
};

const visualiseHolePositions = (rollHoop: HoopOffset) => {

  // Outer leg
  // circle 50, translate -(305 / 2), 0
  // circle 50, translate -(305 / 2) + rollHoop.outerLeg.nsToOs.absolute, rollHoop.outerLeg.frontToBack.absolute
 
  // Inner leg
  // circle 50, diameter translate (305 / 2), 0
  // circle 50, translate (305 / 2) + rollHoop.innerLeg.nsToOs.absolute, rollHoop.innerLeg.frontToBack.absolute

  // Rear leg
  // circle 38, translate 0, -178.798 (equates to distance of 235 between each front hole and rear hole)
  // circle 38, translate rollHoop.rearLeg.nsToOs.absolute, -178.798 + rollHoop.rearLeg.frontToBack.absolute

    Object.keys(rollHoop).map((leg) => {
      Object.keys(rollHoop[leg]).map((plane) => {
        console.log(`${leg} => ${plane}: ${getOffsetLabel(rollHoop[leg][plane].absolute)}`);
      });
  });
}

calculateAbsoluteOffsetAtBodyHolePosition(rollHoopsConfigC);

console.log(`Nearside`)
visualiseHolePositions(rollHoopsConfigC.nearside)

console.log(`Offside`)
visualiseHolePositions(rollHoopsConfigC.offside)

interface HoopLegOffset {
  angle: number;
  absolute?: number;
}

interface HoopLegPlane {
  frontToBack: HoopLegOffset;
  nsToOs: HoopLegOffset;
}

interface HoopOffset {
  outerLeg: HoopLegPlane;
  innerLeg: HoopLegPlane;
  rearLeg: HoopLegPlane;
}

interface HoopOffsets {
  nearside: HoopOffset;
  offside: HoopOffset;
}
