const getHeadPosition = (size: number) => ({
  x: size * 0.32,
  y: size * 0.3,
})

export default {
  metadata: {
    size: 200,
    backgroundColor: '#a7c957',
    borderRadius: 0,
  },
  body: {
    sweater: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x - size * 0.035,
          y: headPosition.y + size * 0.42,
        }
      },
      layer: 10,
      tags: ['warm' as const, 'cozy' as const],
      color: '#720026',
    },
  },
  ears: {
    standard: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x - size * 0.018,
          y: headPosition.y + size * 0.2,
        }
      },
      layer: 100,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#FFA882',
    },
  },
  eyebrows: {
    standard: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.07,
          y: headPosition.y + size * 0.17,
        }
      },
      layer: 30,
      tags: ['bold' as const, 'strong' as const, 'expressive' as const],
      color: '#7F3D2B',
    },
  },
  eyes: {
    boring: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.075,
          y: headPosition.y + size * 0.21,
        }
      },
      layer: 20,
      tags: ['arrows' as const, 'playful' as const, 'unique' as const],
      color: '#FCBE93',
    },
    dots: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.11,
          y: headPosition.y + size * 0.21,
        }
      },
      layer: 20,
      tags: ['cute' as const, 'friendly' as const, 'soft' as const],
      color: '#000000',
    },
  },
  hair: {
    short: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x - size * 0.01,
          y: headPosition.y - size * 0.01,
        }
      },
      layer: 5,
      tags: ['boom' as const, 'explosive' as const, 'dynamic' as const],
      color: '#7F3D2B',
    },
    long: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x - size * 0.17,
          y: headPosition.y - size * 0.03,
        }
      },
      layer: 5,
      tags: ['bundle' as const, 'tied' as const, 'neat' as const],
      color: '#FFD859',
    },
    medium: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x - size * 0.004,
          y: headPosition.y - size * 0.02,
        }
      },
      layer: 5,
      tags: ['cute' as const, 'adorable' as const, 'sweet' as const],
      color: '#1F1C41',
    },
  },
  head: {
    oval: {
      position: getHeadPosition,
      layer: 1,
      tags: ['oval' as const, 'classic' as const, 'balanced' as const],
      color: '#FCBE93',
    },
  },
  mouth: {
    laugh: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.098,
          y: headPosition.y + size * 0.33,
        }
      },
      layer: 25,
      tags: ['lips' as const, 'subtle' as const, 'closed' as const],
      color: '#000000',
    },
    smile: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.07,
          y: headPosition.y + size * 0.3,
        }
      },
      layer: 25,
      tags: ['smile' as const, 'happy' as const, 'cheerful' as const],
      color: '#000000',
    },
    nervous: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.085,
          y: headPosition.y + size * 0.32,
        }
      },
      layer: 25,
      tags: ['smirk' as const, 'playful' as const, 'mischievous' as const],
      color: '#000000',
    },
  },
  noses: {
    curve: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.15,
          y: headPosition.y + size * 0.28,
        }
      },
      layer: 15,
      tags: ['sharp' as const, 'angular' as const, 'defined' as const],
      color: '#FF9C8D',
    },
    dots: {
      position: (size: number) => {
        const headPosition = getHeadPosition(size)
        return {
          x: headPosition.x + size * 0.15,
          y: headPosition.y + size * 0.28,
        }
      },
      layer: 15,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#FF9C8D',
    },
  },
}
