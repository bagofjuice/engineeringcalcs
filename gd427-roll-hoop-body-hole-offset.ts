// Hoop (A) on the nearside without hoop legs pulled when bolted down i.e spacers needed
const rollHoopsConfigA: HoopOffsets = {
    nearside: {
      outerLeg: {
        frontToBack: {
          angle: -89.67,
        },
        nsToOs: {
          angle: -89.95,
        },
      },
      innerLeg: {
        frontToBack: {
          angle: -89.91,
        },
        nsToOs: {
          angle: 89.38,
        },
      },
      rearLeg: {
        frontToBack: {
          angle: 89.50,
        },
        nsToOs: {
          angle: 89.72,
        },
      },
    },
    offside: {
      outerLeg: {
        frontToBack: {
          angle: 89.50,
        },
        nsToOs: {
          angle: 89.63,
        },
      },
      innerLeg: {
        frontToBack: {
          angle: 89.72,
        },
        nsToOs: {
          angle: -89.84,
        },
      },
      rearLeg: {
        frontToBack: {
          angle: -89.55,
        },
        nsToOs: {
          angle: 89.46,
        },
      },
    },
  };
  
  // Hoop (A) on the offside
  const rollHoopsConfigB: HoopOffsets = {
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
  
  const HEIGHT_TO_HOLE = {
    outerLeg: 240,
    innerLeg: 310,
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
  };
  
  const calculateAbsoluteOffsetAtBodyHolePosition = (
    rollHoops: HoopOffsets
  ): HoopOffsets => {
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
  
  const addLabel = (
    ctx,
    textXPos: number,
    textYPos: number,
    x: number,
    y: number
  ) => {
    x = Math.round(x);
    y = Math.round(y);
    const xLabel = x === 0 ? "↔ level" : x >= 0 ? `→ ${x}mm` : `← ${x}mm`;
    const yLabel = y === 0 ? "↕ level" : y >= 0 ? `↓ ${y}mm` : `↑ ${y}mm`;
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666666";
    ctx.fillText(xLabel, textXPos, textYPos);
    ctx.fillText(yLabel, textXPos, textYPos + 18);
  };
  
  const drawCirle = (
    ctx,
    radius: number,
    x: number,
    y: number,
    styleType: "leg" | "hole"
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  
    switch (styleType) {
      case "leg":
        ctx.fillStyle = "rgba(50, 200, 200, 0.3)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
        break;
      case "hole":
      default:
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#e0e0e0";
        ctx.stroke();
        break;
    }
  
    ctx.closePath();
  };
  
  const visualiseHolePositions = (
      type: 'nearside' | 'offside',
    rollHoop: HoopOffset,
    canvasElement: string
  ) => {
    const SPACE_BETWEEN_FRONT_TWO_LEGS = 305;
    const SPACE_BETWEEN_REAR_LEG_AND_FRONT_INTERSECTION = 178.798;
    const FRONT_LEG_DIA = 50;
    const REAR_LEG_DIA = 38;
  
    const canvas = document.getElementById(canvasElement);
    const ctx = canvas.getContext("2d");
    const CENTRE_X = canvas.width / 2;
    const CENTRE_Y = canvas.height / 2;
  
    const HOLE_FRONT_OUTER_X = (type === 'nearside') ? CENTRE_X - SPACE_BETWEEN_FRONT_TWO_LEGS / 2 : CENTRE_X + SPACE_BETWEEN_FRONT_TWO_LEGS / 2;
    const HOLE_FRONT_INNER_X = (type === 'nearside') ? CENTRE_X + SPACE_BETWEEN_FRONT_TWO_LEGS / 2 : CENTRE_X - SPACE_BETWEEN_FRONT_TWO_LEGS / 2;
    const HOLE_FRONT_Y =
      CENTRE_Y - SPACE_BETWEEN_REAR_LEG_AND_FRONT_INTERSECTION / 2;
    const HOLE_REAR_X = CENTRE_X;
    const HOLE_REAR_Y =
      CENTRE_Y + SPACE_BETWEEN_REAR_LEG_AND_FRONT_INTERSECTION / 2;
  
    // ------------------- OUTER --------------------
    // Outer plumb hole
    drawCirle(ctx, FRONT_LEG_DIA / 2, HOLE_FRONT_OUTER_X, HOLE_FRONT_Y, "hole");
  
    // Outer offset
    drawCirle(
      ctx,
      FRONT_LEG_DIA / 2,
      HOLE_FRONT_OUTER_X + rollHoop.outerLeg.nsToOs.absolute,
      HOLE_FRONT_Y + rollHoop.outerLeg.frontToBack.absolute,
      "leg"
    );
    addLabel(
      ctx,
      HOLE_FRONT_OUTER_X + FRONT_LEG_DIA / 1.5,
      HOLE_FRONT_Y,
      rollHoop.outerLeg.nsToOs.absolute,
      rollHoop.outerLeg.frontToBack.absolute
    );
  
    // ------------------- INNER --------------------
    // Inner plumb hole
    drawCirle(ctx, FRONT_LEG_DIA / 2, HOLE_FRONT_INNER_X, HOLE_FRONT_Y, "hole");
  
    // Outer offset
    drawCirle(
      ctx,
      FRONT_LEG_DIA / 2,
      HOLE_FRONT_INNER_X + rollHoop.innerLeg.nsToOs.absolute,
      HOLE_FRONT_Y + rollHoop.innerLeg.frontToBack.absolute,
      "leg"
    );
    addLabel(
      ctx,
      HOLE_FRONT_INNER_X + FRONT_LEG_DIA / 1.5,
      HOLE_FRONT_Y,
      rollHoop.innerLeg.nsToOs.absolute,
      rollHoop.innerLeg.frontToBack.absolute
    );
  
    // ------------------- REAR --------------------
    // Rear plumb hole
    drawCirle(ctx, REAR_LEG_DIA / 2, HOLE_REAR_X, HOLE_REAR_Y, "hole");
  
    // Rear offset
    drawCirle(
      ctx,
      REAR_LEG_DIA / 2,
      HOLE_REAR_X + rollHoop.rearLeg.nsToOs.absolute,
      HOLE_REAR_Y + rollHoop.rearLeg.frontToBack.absolute,
      "leg"
    );
    addLabel(
      ctx,
      HOLE_REAR_X + REAR_LEG_DIA / 1.5,
      HOLE_REAR_Y,
      rollHoop.rearLeg.nsToOs.absolute,
      rollHoop.rearLeg.frontToBack.absolute
    );
  
    // Object.keys(rollHoop).map((leg) => {
    //   Object.keys(rollHoop[leg]).map((plane) => {
    //     console.log(
    //       `${leg} => ${plane}: ${getOffsetLabel(rollHoop[leg][plane].absolute)}`
    //     );
    //   });
    // });
  };
  
  calculateAbsoluteOffsetAtBodyHolePosition(rollHoopsConfigA);
  visualiseHolePositions('nearside', rollHoopsConfigA.nearside, "hoop_nearside");
  visualiseHolePositions('offside', rollHoopsConfigA.offside, "hoop_offside");
  
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
  
