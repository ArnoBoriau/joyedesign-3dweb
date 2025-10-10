import * as THREE from "three";

const createUniqueCurve = (startPos, endPos, curveParams) => {
  class UniqueCurve extends THREE.Curve {
    constructor(start, end, params) {
      super();
      this.start = start;
      this.end = end;
      this.params = params;
    }

    getPoint(t) {
      const x = THREE.MathUtils.lerp(this.start.x, this.end.x, t);
      const y = THREE.MathUtils.lerp(this.start.y, this.end.y, t);
      const z = THREE.MathUtils.lerp(this.start.z, this.end.z, t);

      let offsetX = 0;
      let offsetZ = 0;

      offsetX +=
        Math.sin(t * Math.PI * this.params.freq1 + this.params.phase1) *
        this.params.amp1;
      offsetZ +=
        Math.cos(t * Math.PI * this.params.freq2 + this.params.phase2) *
        this.params.amp2;

      offsetX += Math.sin(t * Math.PI * this.params.freq3) * this.params.amp3;
      offsetZ += Math.cos(t * Math.PI * this.params.freq4) * this.params.amp4;

      const heightOffset =
        Math.sin(t * Math.PI * this.params.heightFreq) * this.params.heightAmp;

      return new THREE.Vector3(x + offsetX, y + heightOffset, z + offsetZ);
    }
  }
  return new UniqueCurve(startPos, endPos, curveParams);
};

const generateCurveParameters = () => {
  return {
    freq1: 0.5 + Math.random() * 1.5,
    freq2: 0.5 + Math.random() * 1.5,
    phase1: Math.random() * Math.PI * 2,
    phase2: Math.random() * Math.PI * 2,
    amp1: (0.3 + Math.random() * 0.7) * (Math.random() > 0.5 ? 1 : -1),
    amp2: (0.3 + Math.random() * 0.7) * (Math.random() > 0.5 ? 1 : -1),
    freq3: 1 + Math.random() * 2,
    freq4: 1 + Math.random() * 2,
    amp3: (0.1 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
    amp4: (0.1 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
    heightFreq: 0.5 + Math.random() * 1,
    heightAmp: 0.2 + Math.random() * 0.3,
  };
};

export const createCurvedTube = (material, basePosition, index, totalCount) => {
  const angle = (index / totalCount) * Math.PI * 2 + Math.PI / 3;
  const radius = 18;

  const startPos = new THREE.Vector3(
    Math.cos(angle) * radius,
    -2,
    Math.sin(angle) * radius
  );
  const endPos = new THREE.Vector3(
    Math.cos(angle) * radius,
    2,
    Math.sin(angle) * radius
  );

  const curveParams = generateCurveParameters();
  const curve = createUniqueCurve(startPos, endPos, curveParams);
  const geometry = new THREE.TubeGeometry(curve, 32, 0.2, 8, false);
  const tube = new THREE.Mesh(geometry, material);

  tube.rotation.x = (Math.random() - 0.5) * Math.PI;
  tube.rotation.y = Math.random() * Math.PI * 2;
  tube.rotation.z = (Math.random() - 0.5) * Math.PI;

  const positionOffset = 2;
  tube.position.x += (Math.random() - 0.5) * positionOffset;
  tube.position.y += (Math.random() - 0.5) * positionOffset;
  tube.position.z += (Math.random() - 0.5) * positionOffset;

  return {
    mesh: tube,
    type: "tube",
    originalPosition: tube.position.clone(),
    originalRotation: tube.rotation.clone(),
    animationSpeed: 0.2 + Math.random() * 0.2,
  };
};

export const createCurvedTubes = (materials, count = 3) => {
  const tubes = [];

  for (let i = 0; i < count; i++) {
    const material = materials[i % materials.length];
    const tubeElement = createCurvedTube(material, null, i, count);
    tubes.push(tubeElement);
  }

  return tubes;
};
