const conversionTable = {
  g: {
    g: 1,
    kg: 0.001,
    oz: 0.035274,
    lb: 0.00220462,
  },

  kg: {
    g: 1000,
    kg: 1,
    oz: 35.274,
    lb: 2.20462,
  },

  oz: {
    g: 28.3495,
    kg: 0.0283495,
    oz: 1,
    lb: 0.0625,
  },

  lb: {
    g: 453.592,
    kg: 0.453592,
    oz: 16,
    lb: 1,
  },

  ml: {
    ml: 1,
    l: 0.001,
  },

  l: {
    ml: 1000,
    l: 1,
  },

  item: {
    item: 1,
    dozen: 1 / 12,
  },

  dozen: {
    item: 12,
    dozen: 1,
  },
};

function convertUnits(
  quantity,
  fromUnit,
  toUnit
) {
  if (fromUnit === toUnit) {
    return quantity;
  }

  const conversion =
    conversionTable[fromUnit]?.[
      toUnit
    ];

  if (!conversion) {
    throw new Error(
      `Cannot convert ${fromUnit} to ${toUnit}`
    );
  }

  return quantity * conversion;
}

module.exports = {
  convertUnits,
};