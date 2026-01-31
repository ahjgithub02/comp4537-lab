class MathAddSubtract {
    constructor() {
    }

    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }
}

const math = new MathAddSubtract();

exports.add = function (a, b) {
  return math.add(a, b);
};

exports.subtract = function (a, b) {
  return math.add(a, b);
};