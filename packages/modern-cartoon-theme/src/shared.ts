export default {
  body: {
    shirt: {
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['casual' as const, 'basic' as const],
      color: '#9287FF',
    },
    sweater: {
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['warm' as const, 'cozy' as const],
      color: '#9287FF',
    },
    turtleneck: {
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['formal' as const, 'warm' as const],
      color: '#9287FF',
    },
  },
  ears: {
    standard: {
      position: { x: 0.22, y: 0.55 },
      layer: 100,
      tags: ['basic' as const],
      color: '#AC6651',
    },
  },
  eyebrows: {
    funny: {
      position: { x: 0.28, y: 0.4 },
      layer: 30,
      tags: ['expressive' as const, 'playful' as const],
    },
  },
  eyes: {
    dots: {
      position: { x: 0.35, y: 0.45 },
      layer: 20,
      tags: ['simple' as const, 'cute' as const],
    },
  },
  hair: {
    long: {
      position: { x: 0.06, y: 0.2 },
      layer: 50,
      tags: ['long' as const, 'flowing' as const],
      color: '#FC909F',
    },
    short: {
      position: { x: 0.13, y: 0.16 },
      layer: 50,
      tags: ['short' as const, 'neat' as const],
      color: '#000000',
    },
  },
  head: {
    oval: {
      position: { x: 0.21, y: 0.2 },
      layer: 1,
      tags: ['basic' as const, 'neutral' as const],
      color: '#AC6651',
    },
  },
  mouth: {
    laugh: {
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['happy' as const, 'expressive' as const],
    },
    nervous: {
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['anxious' as const, 'subtle' as const],
    },
    smile: {
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['happy' as const, 'friendly' as const],
    },
  },
  noses: {
    curve: {
      position: { x: 0.45, y: 0.53 },
      layer: 15,
      tags: ['simple' as const, 'curved' as const],
    },
  },
}
